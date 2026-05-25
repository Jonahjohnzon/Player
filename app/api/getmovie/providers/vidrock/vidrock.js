import { encryptItemId } from './encrypt';


const BASE_URL = 'https://vidrock.ru/';
const SUB_BASE_URL = 'https://sub.vdrk.site';
const WORKER_URL = "https://steam-proxy.hadezanubiz.workers.dev";

function proxyUrl(url) {
  return `${WORKER_URL}/proxy?path=${encodeURIComponent(url)}`;
}
const HEADERS = {
    'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150 Safari/537.36',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'en-US,en;q=0.9',
    Referer: BASE_URL,
    Origin: BASE_URL
};

export const vidRockProvider = (media) =>{

    return getSources(media);

}



async function getSources(media) {
    try {
        const pageUrl = await buildUrl(media);
        const data = await fetchPage(pageUrl);

        if (!data) {
            return emptyResult('Failed to fetch page');
        }

        const sources = [];

        for (const [name, stream] of Object.entries(data)) {
            if (!stream?.url) continue;

            if (stream.url.includes('hls2.vdrk.site')) {
                const secondData = await fetchPage(stream.url);
                if (!secondData) continue;

                secondData.forEach((obj) => {
                    sources.push({
                        url: proxyUrl(obj.url),
                        type: obj.url.includes('.mp4') ? 'mp4' : 'hls',
                        quality: obj.resolution + 'p',
                        label: name,
                        audioTracks: [{
                            language: stream.language === 'English' ? 'eng' : 'unknown',
                            label: stream.language ?? 'Unknown'
                        }],
                        provider: { id: vidRockProvider.id, name: vidRockProvider.name }
                    });
                });

                continue;
            }

            sources.push({
                url: stream.url,
                type: stream.type,
                quality: 'auto',
                label: name,
                audioTracks: [{
                    language: stream.language === 'English' ? 'eng' : 'unknown',
                    label: stream.language ?? 'Unknown'
                }],
                provider: { id: vidRockProvider.id, name: vidRockProvider.name }
            });
        }

        const subtitles = await fetchSubtitles(media);

        return { sources, subtitles, diagnostics: [] };
    } catch (error) {
        return emptyResult(
            error instanceof Error ? error.message : 'Unknown provider error'
        );
    }
}

async function fetchSubtitles(media) {
    try {
        let subUrl;
        if (media.type === 'tv') {
            subUrl = `${SUB_BASE_URL}/v2/tv/${media.Tmdb_Id}/${media.Season}/${media.Episode}`;
        } else {
            subUrl = `${SUB_BASE_URL}/v2/movie/${media.Tmdb_Id}`;
        }

        const response = await fetch(subUrl, {
            headers: {
                ...HEADERS,
                Referer: BASE_URL
            }
        });

        if (response.status !== 200) return [];

        const subsData = await response.json();

        return subsData.map((sub) => ({
            url: proxyUrl(sub.file),
            format: 'vtt',
            label: sub.label
        }));
    } catch {
        return [];
    }
}
async function buildUrl(media) {
    let itemId;
    if (media.Type === 'tv') {
        itemId = `${media.Tmdb_Id}_${media.Season}_${media.Episode}`;
    } else {
        itemId = `${media.Tmdb_Id}`;
    }

    const encrypted = await encryptItemId(itemId);
    return `${BASE_URL}api/${media.Type}/${encrypted}`;
}

async function fetchPage(url) {
    try {
        const response = await fetch(url, {
            headers: { ...HEADERS, Referer: BASE_URL },
            referrer: BASE_URL
        });

        if (response.status !== 200) return null;

        const contentType = response.headers.get('content-type') ?? '';

        if (contentType.includes('application/json')) {
            return await response.json();
        }

        return await response.text();
    } catch {
        return null;
    }
}


function emptyResult(message) {
    return {
        sources: [],
        subtitles: [],
        diagnostics: [
            {
                code: 'PROVIDER_ERROR',
                message: `VidRock: ${message}`,
                field: '',
                severity: 'error'
            }
        ]
    };
}

export async function healthCheck() {
    try {
        const response = await fetch(BASE_URL, {
            method: 'HEAD',
            headers: HEADERS
        });
        return response.status === 200;
    } catch {
        return false;
    }
}
