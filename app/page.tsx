"use client";
import { useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";

const BASE = "https://api.screenopps.com/embed";

export default function DocsPage() {
  const [type, setType] = useState<"movie" | "tv">("movie");
  const [tmdb, setTmdb] = useState("533535");
  const [stmdb, setStmdb] = useState("1399")
  const [season, setSeason] = useState("1");
  const [episode, setEpisode] = useState("1");
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"html" | "react" | "next">("html");
  const [copied, setCopied] = useState<string | null>(null);

  const embedUrl =
    type === "movie"
      ? `${BASE}/movie/${tmdb || "TMDB_ID"}`
      : `${BASE}/tv/${stmdb || "TMDB_ID"}/${season}/${episode}`;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  const htmlCode = `<!-- Movie -->
<iframe
  src="https://api.screenopps.com/embed/movie/533535"
  width="100%"
  style="aspect-ratio:16/9"
  allowfullscreen
  allow="autoplay; fullscreen"
  frameborder="0"
></iframe>

<!-- TV Show -->
<iframe
  src="https://api.screenopps.com/embed/tv/1396/1/1"
  width="100%"
  style="aspect-ratio:16/9"
  allowfullscreen
  allow="autoplay; fullscreen"
  frameborder="0"
></iframe>`;

  const reactCode = `export function Player({ tmdbId, type, season, episode }) {
  const src = type === 'tv'
    ? \`https://api.screenopps.com/embed/tv/\${tmdbId}/\${season}/\${episode}\`
    : \`https://api.screenopps.com/embed/movie/\${tmdbId}\`;

  return (
    <iframe
      src={src}
      style={{ width: '100%', aspectRatio: '16/9' }}
      allowFullScreen
      allow="autoplay; fullscreen"
    />
  );
}`;

  const nextCode = `// app/watch/[id]/page.tsx
export default function WatchPage({ params, searchParams }) {
  const { id } = params;
  const { season, episode } = searchParams;

  const src = season
    ? \`https://api.screenopps.com/embed/tv/\${id}/\${season}/\${episode}\`
    : \`https://api.screenopps.com/embed/movie/\${id}\`;

  return (
    <iframe
      src={src}
      className="w-full aspect-video"
      allowFullScreen
      allow="autoplay; fullscreen"
    />
  );
}`;

  const codeMap = { html: htmlCode, react: reactCode, next: nextCode };

  return (
    <main className="min-h-screen bg-[#050508] text-[#e8e6ff] font-mono">

      {/* font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');`}</style>

      <div className="max-w-3xl  mx-auto  pb-24">

        {/* Hero */}
        <div className="pt-20 pb-14">
          <div className="flex items-center justify-between ">
          <div className="inline-flex items-center gap-2 text-[#7b6fff] border border-[#7b6fff44] px-3 py-1 rounded-sm text-lg tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7b6fff] animate-pulse" />
            live api
          </div>
          <FaTelegramPlane size={36} className="text-[#7b6fff] mb-4 cursor-pointer" onClick={()=>{
            window.open("https://t.me/+LUkKjQPU1DQ5OTI0", "_blank");
          }} />
          </div>
          <h1 className="text-5xl sm:text-6xl font-black leading-none tracking-tight text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            ScreenOpps<br />
            <span className="text-[#7b6fff]">Embed API</span>
          </h1>
          <p className="mt-4 text-lg text-[#6b6880] leading-relaxed max-w-md font-light">
            Drop any movie or TV episode into your site with a single iframe. No auth, no SDK, just a URL.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-[#7b6fff22] via-[#7b6fff08] to-transparent mb-12" />

        {/* Endpoints */}
        <div className="mb-12">
          <p className="text-base text-[#7b6fff] tracking-[0.15em] uppercase mb-5">Endpoints</p>

          {/* Movie endpoint */}
          <div className="border border-[#1e1c2e] rounded bg-[#0c0a14] overflow-hidden mb-3">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e1c2e]">
              <span className="text-base font-medium px-2 py-0.5 bg-[#0d2e1a] text-[#3ddb7a] rounded-sm tracking-wider">GET</span>
              <span className="font-mono text-lg text-[#9d9ab5] break-all">
                https://api.screenopps.com/embed/movie/<em className="text-[#7b6fff] not-italic">{"{TMDB_ID}"}</em>
              </span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-3 px-4 py-3 text-lg">
              <span className="font-mono text-[#c8c4e8] flex items-center gap-2 flex-wrap">
                TMDB_ID
                <span className="text-[18px] px-1.5 py-0.5 bg-[#2a0f0f] text-[#e05a5a] rounded-sm">required</span>
              </span>
              <span className="text-[#6b6880] font-light leading-relaxed">The movie ID from themoviedb.org — found in the URL of any movie page</span>
            </div>
          </div>

          {/* TV endpoint */}
          <div className="border border-[#1e1c2e] rounded bg-[#0c0a14] overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e1c2e]">
              <span className="text-lg font-medium px-2 py-0.5 bg-[#0d2e1a] text-[#3ddb7a] rounded-sm tracking-wider">GET</span>
              <span className="font-mono text-lg text-[#9d9ab5] break-all">
                https://api.screenopps.com/embed/tv/
                <em className="text-[#7b6fff] not-italic">{"{TMDB_ID}"}</em>/
                <span className="text-[#f0a04a]">{"{SEASON}"}</span>/
                <span className="text-[#e05a5a]">{"{EPISODE}"}</span>
              </span>
            </div>
            <div>
              {[
                { name: "TMDB_ID", desc: "The series ID from themoviedb.org" },
                { name: "SEASON", desc: "Season number — integer starting at 1" },
                { name: "EPISODE", desc: "Episode number — integer starting at 1" },
              ].map((p, i, arr) => (
                <div key={p.name} className={`grid grid-cols-[140px_1fr] gap-3 px-4 py-3 text-lg ${i < arr.length - 1 ? "border-b border-[#0f0d1a]" : ""}`}>
                  <span className="font-mono text-[#c8c4e8] flex items-center gap-2 flex-wrap">
                    {p.name}
                    <span className="text-[18px] px-1.5 py-0.5 bg-[#2a0f0f] text-[#e05a5a] rounded-sm">required</span>
                  </span>
                  <span className="text-[#6b6880] font-light leading-relaxed">{p.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-[#7b6fff22] via-[#7b6fff08] to-transparent mb-12" />

        {/* Live Tester */}
        <div className="mb-12">
          <p className="text-lg text-[#7b6fff] tracking-[0.15em] uppercase mb-5">Live tester</p>
          <div className="bg-[#0c0a14] border border-[#1e1c2e] rounded p-6">

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-lg text-[#4a4760] tracking-widest uppercase">Type</label>
                <select
                  value={type}
                  onChange={e => { setType(e.target.value as "movie" | "tv"); setLoaded(false); }}
                  className="bg-[#07060f] border border-[#1e1c2e] text-[#c8c4e8] px-3 py-2 rounded-sm text-lg font-mono outline-none focus:border-[#7b6fff66] transition-colors"
                >
                  <option value="movie">Movie</option>
                  <option value="tv">TV Show</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-lg text-[#4a4760] tracking-widest uppercase">TMDB ID</label>
                <input
                  value={type == "movie" ? tmdb : stmdb}
                  onChange={e => { 
                    if(type == "movie")
                    {
                    setTmdb(e.target.value)
                  }
                  else{
                    setStmdb(e.target.value)
                  }; 
                  setLoaded(false); }}
                  placeholder="e.g. 533535"
                  className="bg-[#07060f] border border-[#1e1c2e] text-[#c8c4e8] px-3 py-2 rounded-sm text-lg font-mono outline-none focus:border-[#7b6fff66] transition-colors placeholder:text-[#2e2c45]"
                />
              </div>
            </div>

            {type === "tv" && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-lg text-[#4a4760] tracking-widest uppercase">Season</label>
                  <input
                    type="number" value={season} min={1}
                    onChange={e => { setSeason(e.target.value); setLoaded(false); }}
                    className="bg-[#07060f] border border-[#1e1c2e] text-[#c8c4e8] px-3 py-2 rounded-sm text-lg font-mono outline-none focus:border-[#7b6fff66] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-lg text-[#4a4760] tracking-widest uppercase">Episode</label>
                  <input
                    type="number" value={episode} min={1}
                    onChange={e => { setEpisode(e.target.value); setLoaded(false); }}
                    className="bg-[#07060f] border border-[#1e1c2e] text-[#c8c4e8] px-3 py-2 rounded-sm text-lg font-mono outline-none focus:border-[#7b6fff66] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* URL preview */}
            <div className="bg-[#07060f] border border-[#1e1c2e] rounded-sm px-4 py-2.5 mb-4 text-lg font-mono text-[#7b6fff] break-all">
              {embedUrl}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setLoaded(true)}
                className="bg-[#7b6fff] hover:bg-[#6a5eee] text-white px-5 py-2 rounded-sm text-lg font-mono tracking-wide transition-colors cursor-pointer"
              >
                ▶ Load player
              </button>
              <button
                onClick={() => copy(embedUrl, "url")}
                className={`px-5 py-2 rounded-sm text-lg font-mono tracking-wide border transition-colors cursor-pointer ${
                  copied === "url"
                    ? "border-[#3ddb7a44] text-[#3ddb7a] bg-transparent"
                    : "border-[#1e1c2e] text-[#6b6880] bg-transparent hover:text-[#c8c4e8] hover:border-[#7b6fff44]"
                }`}
              >
                {copied === "url" ? "✓ copied" : "copy url"}
              </button>
            </div>

            {/* Player */}
            <div className="w-full aspect-video rounded-sm overflow-hidden border border-[#1e1c2e] bg-black">
              {loaded ? (
                <iframe src={embedUrl} className="w-full h-full border-none block" allowFullScreen allow="autoplay; fullscreen" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#2a2840]">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="opacity-30">
                    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" />
                    <polygon points="19,16 35,24 19,32" fill="currentColor" />
                  </svg>
                  <p className="text-sm tracking-widest uppercase">Enter a TMDB ID and load</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-[#7b6fff22] via-[#7b6fff08] to-transparent mb-12" />

        {/* Code tabs */}
        <div>
          <p className="text-lg text-[#7b6fff] tracking-[0.15em] uppercase mb-5">Embed code</p>

          <div className="flex border-b border-[#1e1c2e] mb-0">
            {(["html", "react", "next"] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2.5 text-lg font-mono tracking-widest uppercase border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${
                  activeTab === t
                    ? "text-[#7b6fff] border-[#7b6fff]"
                    : "text-[#4a4760] border-transparent hover:text-[#9d9ab5]"
                }`}
              >
                {t === "next" ? "Next.js" : t}
              </button>
            ))}
          </div>

          <div className="relative bg-[#07060f] border border-[#1e1c2e] border-t-0 rounded-b">
            <button
              onClick={() => copy(codeMap[activeTab], "code")}
              className={`absolute top-3 right-3 text-lg font-mono px-2.5 py-1 bg-[#1e1c2e] rounded-sm border-none cursor-pointer transition-colors ${
                copied === "code" ? "text-[#3ddb7a]" : "text-[#6b6880] hover:text-[#c8c4e8]"
              }`}
            >
              {copied === "code" ? "✓ copied" : "copy"}
            </button>

            {activeTab === "html" && (
              <pre className="p-5 text-lg leading-8 overflow-x-auto text-[#6b6880] font-light">
                <span className="text-[#2e2c45]">{`<!-- Movie -->`}</span>{"\n"}
                <span className="text-[#e05a5a]">&lt;iframe</span>{"\n"}
                {"  "}<span className="text-[#f0a04a]">src</span>=<span className="text-[#3ddb7a]">{"https://api.screenopps.com/embed/movie/533535"}</span>{"\n"}
                {"  "}<span className="text-[#f0a04a]">width</span>=<span className="text-[#3ddb7a]">{"100%"}</span>{"\n"}
                {"  "}<span className="text-[#f0a04a]">style</span>=<span className="text-[#3ddb7a]">{"aspect-ratio:16/9"}</span>{"\n"}
                {"  "}<span className="text-[#f0a04a]">allowfullscreen</span>{"\n"}
                {"  "}<span className="text-[#f0a04a]">allow</span>=<span className="text-[#3ddb7a]">{"autoplay; fullscreen"}</span>{"\n"}
                {"  "}<span className="text-[#f0a04a]">frameborder</span>=<span className="text-[#3ddb7a]">{"0"}</span>{"\n"}
                <span className="text-[#e05a5a]">&gt;&lt;/iframe&gt;</span>{"\n\n"}
                <span className="text-[#2e2c45]">{`<!-- TV Show -->`}</span>{"\n"}
                <span className="text-[#e05a5a]">&lt;iframe</span>{"\n"}
                {"  "}<span className="text-[#f0a04a]">src</span>=<span className="text-[#3ddb7a]">{"https://api.screenopps.com/embed/tv/1396/1/1"}</span>{"\n"}
                {"  "}<span className="text-[#f0a04a]">width</span>=<span className="text-[#3ddb7a]">{"100%"}</span>{"\n"}
                {"  "}<span className="text-[#f0a04a]">style</span>=<span className="text-[#3ddb7a]">{"aspect-ratio:16/9"}</span>{"\n"}
                {"  "}<span className="text-[#f0a04a]">allowfullscreen</span>{"\n"}
                {"  "}<span className="text-[#f0a04a]">allow</span>=<span className="str text-[#3ddb7a]">{"autoplay; fullscreen"}</span>{"\n"}
                {"  "}<span className="text-[#f0a04a]">frameborder</span>=<span className="text-[#3ddb7a]">{"0"}</span>{"\n"}
                <span className="text-[#e05a5a]">&gt;&lt;/iframe&gt;</span>
              </pre>
            )}

            {activeTab === "react" && (
              <pre className="p-5 text-sm leading-8 overflow-x-auto text-[#6b6880] font-light">
                <span className="text-[#7b6fff]">export function</span> <span className="text-[#3ddb7a]">Player</span>{"({ tmdbId, type, season, episode }) {"}{"\n"}
                {"  "}<span className="text-[#7b6fff]">const</span> src = type === <span className="text-[#3ddb7a]">{'tv'}</span>{"\n"}
                {"    ? "}<span className="text-[#3ddb7a]">{"`https://api.screenopps.com/embed/tv/${tmdbId}/${season}/${episode}`"}</span>{"\n"}
                {"    : "}<span className="text-[#3ddb7a]">{"`https://api.screenopps.com/embed/movie/${tmdbId}`"}</span>;{"\n\n"}
                {"  "}<span className="text-[#7b6fff]">return</span> ({"\n"}
                {"    "}<span className="text-[#e05a5a]">&lt;iframe</span>{"\n"}
                {"      "}<span className="text-[#f0a04a]">src</span>={"{src}"}{"\n"}
                {"      "}<span className="text-[#f0a04a]">style</span>{"={{ width: '100%', aspectRatio: '16/9' }}"}{"\n"}
                {"      "}<span className="text-[#f0a04a]">allowFullScreen</span>{"\n"}
                {"      "}<span className="text-[#f0a04a]">allow</span>=<span className="text-[#3ddb7a]">{"autoplay; fullscreen"}</span>{"\n"}
                {"    "}<span className="text-[#e05a5a]">/&gt;</span>{"\n"}
                {"  );"}
                {"\n}"}
              </pre>
            )}

            {activeTab === "next" && (
              <pre className="p-5 text-sm leading-8 overflow-x-auto text-[#6b6880] font-light">
                <span className="text-[#2e2c45]">{"// app/watch/[id]/page.tsx"}</span>{"\n"}
                <span className="text-[#7b6fff]">export default function</span> <span className="text-[#3ddb7a]">WatchPage</span>{"({ params, searchParams }) {"}{"\n"}
                {"  "}<span className="text-[#7b6fff]">const</span> {"{ id }"} = params;{"\n"}
                {"  "}<span className="text-[#7b6fff]">const</span> {"{ season, episode }"} = searchParams;{"\n\n"}
                {"  "}<span className="text-[#7b6fff]">const</span> src = season{"\n"}
                {"    ? "}<span className="text-[#3ddb7a]">{"`https://api.screenopps.com/embed/tv/${id}/${season}/${episode}`"}</span>{"\n"}
                {"    : "}<span className="text-[#3ddb7a]">{"`https://api.screenopps.com/embed/movie/${id}`"}</span>;{"\n\n"}
                {"  "}<span className="text-[#7b6fff]">return</span> ({"\n"}
                {"    "}<span className="text-[#e05a5a]">&lt;iframe</span>{"\n"}
                {"      "}<span className="text-[#f0a04a]">src</span>={"{src}"}{"\n"}
                {"      "}<span className="text-[#f0a04a]">className</span>=<span className="text-[#3ddb7a]">{"w-full aspect-video"}</span>{"\n"}
                {"      "}<span className="text-[#f0a04a]">allowFullScreen</span>{"\n"}
                {"      "}<span className="text-[#f0a04a]">allow</span>=<span className="text-[#3ddb7a]">{"autoplay; fullscreen"}</span>{"\n"}
                {"    "}<span className="text-[#e05a5a]">/&gt;</span>{"\n"}
                {"  );"}
                {"\n}"}
              </pre>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}