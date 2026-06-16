/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useServerFallback.ts
import { useState } from 'react'
import { store } from '@/app/store'
import { GetMovieFetch } from './Get/GetMovie'
import {ListServer} from './Player/ListServers'


interface MediaParams {
    paramId: string
    Type: 'movie' | 'tv'
    Season?: string
    Episode?: string
}

export function useServerFallback() {
    const [tryingServer, setTryingServer] = useState<string | null>(null)
    const [triedServers, setTriedServers] = useState<string[]>([])
    const [allFailed, setAllFailed] = useState(false)

    const reset = () => {
        setAllFailed(false)
        setTriedServers([])
        setTryingServer(null)
    }

    

    const tryServer = async (server: string, params: MediaParams): Promise<boolean> => {
        try {
            setTryingServer(server)

            const response = params.Type === 'movie'
                ? await GetMovieFetch({ Tmdb_Id: params.paramId, Type: 'movie', Server: server })
                : await GetMovieFetch({ Tmdb_Id: params.paramId, Type: 'tv', Season: params.Season, Episode: params.Episode, Server: server })
            if (response.error || !response.sources?.length) return false
            if (response.subtitles.length != 0) {
           const textTracks = response.subtitles
           .filter((sub:any) => sub.url && sub.lang && typeof sub.lang === 'string' && sub.lang.trim() !== '')
           .map((sub:any) => ({
               url: sub.url,
               label: sub.lang.trim(),           // ensure no whitespace-only strings
               kind: 'subtitles' as const,
               language: sub.lang.toLowerCase().split(' ')[0],
            }));
            store.subtitles = textTracks;
          }
          else{
            store.subtitles = [];
          }
            store.ParamId = params.paramId
            store.Type = params.Type
            store.ServerinUse = server
            store.mainType = response.sources[0]
            store.sources = response.sources
            store.M3u8Url = response.sources[0]?.url || ''
            store.loading = false
            store.title = response.title
            store.poster = response.poster
            store.backdrop = response.backdrop
            store.overview = response.overview
            return true
        } catch {
            return false
        }
    }

        const load = async (params: MediaParams) => {
        reset()
        store.loading = true
        store.ParamId = params.paramId
        store.Type = params.Type

        const tried: string[] = []

        for (const server of ListServer) {
            tried.push(server.name)
            setTriedServers([...tried])

            const success = await tryServer(server.name, params)
            if (success) {
                setTryingServer(null)
                return
            }
        }

        setAllFailed(true)
        setTryingServer(null)
        store.loading = false
    }

    return { load, tryingServer, triedServers, allFailed, reset }
}



export const loadNextServer = async () => {
  store.loadingServer = true;
  store.serverFailed = null;

  const currentIndex = ListServer.findIndex(
    (s) => s.name === store.ServerinUse
  );

  // All servers except the current one, starting from the next
  const remainingServers = [
    ...ListServer.slice(currentIndex + 1),
    ...ListServer.slice(0, currentIndex),
  ];

  const params: MediaParams = {
    paramId: store.ParamId,
    Type: store.Type as MediaParams['Type'],
    Season: store.Season,
    Episode: store.Episode,
  };

  for (const server of remainingServers) {
    try {
      store.tryingServer = server.name;

      const response =
        params.Type === "movie"
          ? await GetMovieFetch({
              Tmdb_Id: params.paramId,
              Type: "movie",
              Server: server.name,
            })
          : await GetMovieFetch({
              Tmdb_Id: params.paramId,
              Type: "tv",
              Season: params.Season,
              Episode: params.Episode,
              Server: server.name,
            });

      if (response.error || !response.sources?.length) continue;

      store.PreviousServer = store.ServerinUse;
      store.ServerinUse = server.name;
      store.mainType = response.sources[0];
      store.sources = response.sources;
      store.subtitles = response.subtitles;
      store.M3u8Url = response.sources[0]?.url || "";
      store.title = response.title;
      store.poster = response.poster;
      store.backdrop = response.backdrop;
      store.overview = response.overview;
      store.tryingServer = null;
      store.loadingServer = false;

      return true;
    } catch (err) {
      console.error(server.name, err);
    }
  }

  // Every server failed — fall back to VidFast iframe
  store.tryingServer = null;
  store.loadingServer = false;
  store.vidfastFallback = true;
  return false;
};