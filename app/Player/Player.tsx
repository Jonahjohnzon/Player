"use client";
import '@vidstack/react/player/styles/base.css';
import { useSnapshot } from "valtio";
import { store } from '@/app/store';
import { useRef } from 'react';
import {BufferingIndicator} from './components/layouts/buffer';
import type { MediaSrc } from '@vidstack/react';
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
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="w-20 h-20 rounded-full cursor-pointer bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-transform duration-200 scale-100">
        <svg
          className="w-10 h-10 text-white translate-x-1"
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
  const sources = snap.sources;
  const subtitles = snap.subtitles;
  const poster = snap.poster;
  const backdrop = snap.backdrop;
  const player = useRef<MediaPlayerInstance>(null);



  function onProviderChange(provider: MediaProviderAdapter | null) {
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

 const playerSources: MediaSrc[] = sources.map((source) => ({
  src: source.url,
  type: source.type === 'hls'
    ? 'application/x-mpegurl' as const
    : 'video/mp4' as const,
}));

  return (
    <div className="bg-black h-screen overflow-hidden flex justify-center items-center">
      <MediaPlayer
        className="max-w-full max-h-full aspect-video bg-black  text-white font-sans overflow-hidden rounded-md"
        src={playerSources}
        crossOrigin
        playsInline
        onProviderChange={onProviderChange}
        ref={player}
      >
        <MediaProvider>
                 <Poster
          className="absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-visible:opacity-100 object-cover"
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
      </MediaPlayer>
    </div>
  );
};

export default Player;