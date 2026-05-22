import { Spinner } from '@vidstack/react';

export function BufferingIndicator() {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center ">
      <Spinner.Root
        className=" w-16 h-16 animate-spin hidden media-buffering:block "
        size={64}
      >
        <Spinner.Track className="opacity-25" />
        <Spinner.TrackFill className="opacity-75" />
      </Spinner.Root>
    </div>
  );
}