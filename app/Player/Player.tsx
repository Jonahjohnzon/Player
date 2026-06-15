"use client";
import '@vidstack/react/player/styles/base.css';
import { useSnapshot } from "valtio";
import { store } from '@/app/store';
import { useRef, useState } from 'react';
import {BufferingIndicator} from './components/layouts/buffer';
import {loadNextServer} from '../UseServerFallback'
import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Track,
  Poster,
  useMediaState,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
} from '@vidstack/react';

import { VideoLayout } from './components/layouts/video-layout';

  const CenterPlayButton = () => {
  const paused = useMediaState('paused');

  if (!paused) return null;

  return (
    <div className="absolute overflow-hidden inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="sm:w-20 sm:h-20 h-10 w-10 rounded-full cursor-pointer bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-transform duration-200 scale-100">
        <svg
          className="sm:w-10 sm:h-10 w-5 h-5 text-white translate-x-1"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <polygon points="5,3 19,12 5,21" />
        </svg>
      </div>
    </div>
  );
};




const Player = () => {
 const snap = useSnapshot(store);
 const [backup, setBackup] = useState(true) 
  const source =  snap.mainType
  const subtitles = snap.subtitles;
  const poster = snap.poster;
  const backdrop = snap.backdrop;
  const loading = snap.loadingServer;
  const tryingServer = snap.tryingServer;
  const serverFailed = snap.serverFailed;
  const player = useRef<MediaPlayerInstance>(null);
  const vidfastUrl = snap.Type === 'movie'
  ? `https://vidfast.pro/movie/${snap.ParamId}`
  : `https://vidfast.pro/tv/${snap.ParamId}/${snap.Season}/${snap.Episode}`;



  function onProviderChange(provider: MediaProviderAdapter | null) {
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  const switchToNextServer = async () => {
  if (store.loadingServer) return;

  store.loadingServer = true;
  store.tryingServer = "Next Server";

  try {
    await loadNextServer();
  } catch {
    store.serverFailed = store.ServerinUse;
  }
};

 const playerSources={
 src: source.url,
  type:
    source.type === 'hls'
      ? 'application/x-mpegurl' as const
      : 'video/mp4' as const,
  quality: source.quality,
  label: source.label,
  audioTracks: source.audioTracks,
};

const storedata = useSnapshot(store);

  return (
    <div className="bg-black h-screen w-screen flex flex-col justify-center items-center overflow-hidden ">

      {/* Loading overlay — outside MediaPlayer */}
      {loading ? <> (
        <div className="absolute overflow-hidden inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm gap-4">
          {tryingServer && (
            <>
              <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              <div className="flex flex-col items-center gap-1">
                <p className="text-white/50 text-xs tracking-widest uppercase">Switching to</p>
                <p className="text-white text-lg font-semibold">{tryingServer}</p>
              </div>
              <button
                onClick={() => {
                  store.loadingServer = false;
                  store.tryingServer = null;
                }}
                className="px-5 py-2 border border-white/20 rounded text-sm text-white/60 hover:text-white hover:border-white/40 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </>
          )}

          {serverFailed && !tryingServer && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-red-400 text-sm">{serverFailed} failed to load</p>
              <button
                onClick={() => { store.serverFailed = null; store.error = false; store.loadingServer = false;  store.ServerinUse = storedata.PreviousServer; }}
                className="px-5 py-2 border border-white/20 rounded text-sm text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )</>
:<>{snap.vidfastFallback ? (
  <div className="relative w-full h-full">
    {/* Optional: header showing fallback is active */}
    {backup && <div className="absolute top-2 left-2 z-10 flex items-center gap-2 px-3 py-1 rounded bg-black/60 text-white/60 text-xs">
      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
      Using backup server
      <button
        onClick={() => { setBackup(false) }}
        className="ml-2 text-white/40 hover:text-white transition-colors"
      >
        ✕
      </button>
    </div>}
    <iframe
      src={vidfastUrl}
      className="w-full h-full border-0 rounded-md"
      allowFullScreen
      allow="autoplay; fullscreen; picture-in-picture"
    />
  </div>
) :
      (<MediaPlayer
        className="max-w-full max-h-full    relative bg-black text-white font-sans  rounded-md"
        src={playerSources}
        key={store.M3u8Url}
        crossOrigin
        playsInline
        onProviderChange={onProviderChange}
        ref={player}
         onError={() => {
      store.vidfastFallback = true;
  }}
      >
        <MediaProvider>
          <Poster
            className="absolute inset-0 block h-full w-full overflow-hidden rounded-md opacity-0 transition-opacity data-visible:opacity-100 object-cover"
            src={backdrop || poster}
            alt="poster"
          />
          {subtitles.map((track) => (
            <Track
              key={track.url}
              src={track.url}
              kind="subtitles"
              label={track.label}
            />
          ))}
        </MediaProvider>
        <CenterPlayButton />
        <BufferingIndicator />
        <VideoLayout />
      </MediaPlayer>)}</>}
    </div>
  );
};

export default Player;