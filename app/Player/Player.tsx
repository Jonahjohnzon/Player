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
  type MediaPlayerInstance,
  type MediaProviderAdapter,
} from '@vidstack/react';

import { VideoLayout } from './components/layouts/video-layout';




const Player = () => {
  const snap = useSnapshot(store);
  const sources = snap.sources;
  const subtitles = snap.subtitles;
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
          {subtitles.map((track) => (
            <Track
              key={track.url}
              src={track.url}
              kind="subtitles"
              label={track.label}
            />
          ))}
        </MediaProvider>
        <BufferingIndicator />
        <VideoLayout />
      </MediaPlayer>
    </div>
  );
};

export default Player;