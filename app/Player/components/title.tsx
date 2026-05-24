import { store } from '@/app/store';
import { useSnapshot } from 'valtio/react';

export function Title() {
  const snap = useSnapshot(store);
    const title = snap.title;
  return (
    <span className=" hidden lg:inline-block flex-1 overflow-hidden text-ellipsis whitespace-nowrap px-2 text-sm font-medium text-white/70">
      <span className="mr-1">|</span>
            <span>{title}</span>
    </span>
  );
}
