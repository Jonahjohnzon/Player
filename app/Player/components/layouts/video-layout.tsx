import captionStyles from './captions.module.css';
import styles from './video-layout.module.css';

import { Captions, Controls, Gesture } from '@vidstack/react';

import * as Buttons from '../buttons';
import * as Menus from '../menus';
import * as Sliders from '../sliders';
import { TimeGroup } from '../time-group';
import { Title } from '../title';
import { useState } from 'react';

export interface VideoLayoutProps {
  thumbnails?: string;
}

export function VideoLayout({ thumbnails }: VideoLayoutProps) {
    const [adClicked, setAdClicked] = useState(false);

  const handleAdClick = () => {
    if (!adClicked) {
      window.open("https://otieu.com/4/10438662", "_blank"); // Open ad in new tab
      setAdClicked(true); // Prevent future clicks from triggering the ad
    }
  };
  return (
    <div onClick = {handleAdClick}>
      <Gestures />
      <Captions
        className={`${captionStyles.captions} media-preview:opacity-0 media-controls:bottom-21.25 media-captions:opacity-100 absolute inset-0 bottom-2 z-10 select-none wrap-break-word opacity-100 transition-[opacity,bottom] duration-300`}
      />
       {/* Top left server menu — outside controls */}
  <div className="absolute top-5 left-5 z-20 opacity-0 pointer-events-none transition-opacity duration-300 media-controls:opacity-100 media-controls:pointer-events-auto media-paused:opacity-100 media-paused:pointer-events-auto">
    <Menus.Server placement="bottom start" tooltipPlacement="bottom" />
  </div>
      <Controls.Root
        className={`${styles.controls} absolute inset-0 z-10 flex h-full w-full flex-col bg-linear-to-t from-black/20 to-transparent 
    opacity-0 pointer-events-none transition-opacity duration-300
    media-controls:opacity-100 media-controls:pointer-events-auto`}
      >
        <div className="flex-1" />

        {/* Progress bar */}
        <Controls.Group className="flex w-full items-center px-2 sm:px-3">
          <Sliders.Time thumbnails={thumbnails} />
        </Controls.Group>

        {/* Controls row */}
        <Controls.Group className="-mt-0.5 flex w-full items-center gap-0.5 sm:gap-1 px-1 sm:px-2 pb-1 sm:pb-2">

          {/* Left side */}
          <Buttons.Play tooltipPlacement="top start" />
          <Buttons.Mute tooltipPlacement="top" />
          <div className="hidden sm:block">
            <Sliders.Volume />
          </div>
          <TimeGroup />
          <Title />
          <div className="flex-1" />
          {/* Right side */}
          <div className="hidden sm:block">
          </div>
          <Buttons.Caption tooltipPlacement="top" />
          <Menus.Settings placement="top end" tooltipPlacement="top" />
          <Menus.VideoQualitySubmenu placement="top end" tooltipPlacement="top" />
          <div className="hidden sm:block">
            <Buttons.PIP tooltipPlacement="top" />
          </div>
          <Buttons.Fullscreen tooltipPlacement="top end" />

        </Controls.Group>
      </Controls.Root>
    </div>
  );
}

function Gestures() {
  return (
    <>
      <Gesture
        className="absolute inset-0 z-0 block h-full w-full"
        event="pointerup"
        action="toggle:paused"
      />
      <Gesture
        className="absolute inset-0 z-0 block h-full w-full"
        event="dblpointerup"
        action="toggle:fullscreen"
      />
      <Gesture
        className="absolute left-0 top-0 z-10 block h-full w-1/5"
        event="dblpointerup"
        action="seek:-10"
      />
      <Gesture
        className="absolute right-0 top-0 z-10 block h-full w-1/5"
        event="dblpointerup"
        action="seek:10"
      />
    </>
  );
}
