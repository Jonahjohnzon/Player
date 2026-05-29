/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import {
  Menu,
  Tooltip,
  useCaptionOptions,
  useVideoQualityOptions,
  useAudioOptions,
  type MenuPlacement,
  type TooltipPlacement,
} from '@vidstack/react';
import { LuSettings, LuCaptions, LuCloud,LuServer,LuText } from "react-icons/lu";
import { useSnapshot } from 'valtio';
import { store } from '@/app/store';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  RadioButtonIcon,
  RadioButtonSelectedIcon, 
} from '@vidstack/react/icons';
import { FaRegClosedCaptioning } from "react-icons/fa6";
import { buttonClass } from './buttons';
import { ListServer } from '../ListServers';
import {GetMovieFetch} from '@/app/Get/GetMovie';


export interface SettingsProps {
  placement: MenuPlacement;
  tooltipPlacement: TooltipPlacement;
}

export interface ResProps {
  placement: MenuPlacement;
  tooltipPlacement: TooltipPlacement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  player: any;
}
export const menuClass =
  'animate-out fade-out slide-out-to-bottom-2 scrollbar-none data-[open]:animate-in data-[open]:fade-in data-[open]:slide-in-from-bottom-4 flex h-[var(--menu-height)] max-h-[400px] min-w-[260px] flex-col overflow-y-auto overscroll-y-contain rounded-md border border-white/10 bg-black p-2.5 font-sans text-[12px] sm:text-[15px] font-medium outline-none backdrop-blur-sm transition-[height] duration-300 will-change-[height] data-[resizing]:overflow-hidden ';

  export const resClass =
  'animate-out media-controls:block hidden fade-out slide-out-to-bottom-2 scrollbar-none data-[open]:animate-in data-[open]:fade-in data-[open]:slide-in-from-bottom-4 flex h-[var(--menu-height)] max-h-60  min-w-[120px] lg:min-w-[140px] flex-col overflow-y-auto overscroll-y-contain rounded-md border border-white/10 bg-black/95 p-2.5 font-sans text-[12px] lg:text-[14px] font-medium outline-none backdrop-blur-sm transition-[height] z-30 duration-300 will-change-[height] data-[resizing]:overflow-hidden';

export const submenuClass =
  'hidden w-full flex-col items-start justify-center outline-none data-[keyboard]:mt-[3px] data-[open]:inline-block';

export function Settings({ placement}: SettingsProps) {
  return (
    <Menu.Root className="parent">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Menu.Button className={buttonClass}>
            <LuCaptions className="h-7 sm:h-8 w-7 sm:w-8 transform transition-transform duration-200 ease-out group-data-open:opacity-50" />
          </Menu.Button>
        </Tooltip.Trigger>
      </Tooltip.Root>
      <Menu.Content className={menuClass} placement={placement}>
        <CaptionSubmenu />
        <AudioSubmenu />
      </Menu.Content>
    </Menu.Root>
  );
}


function AudioSubmenu() {
  const options = useAudioOptions();
  const hint = options.selectedTrack?.label ?? 'Default';

 if (options.disabled) return null;

  return (
    <Menu.Root>
      <SubmenuButton
        label="Audio"
        hint={hint}
        disabled={options.disabled}
        icon={LuSettings}
      />
      <Menu.Content className={submenuClass} >
        <Menu.RadioGroup  className="w-full flex flex-col" value={options.selectedValue}>
          {options.map(({ label, value, select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

const ChangeServer = async ({ ParamId, ServerinUse, Type, Season, Episode }: {
    ParamId: string;
    ServerinUse: string;
    Type: string;
    Season: string;
    Episode: string;
}) => {
    try {
        store.loadingServer = true;
        store.ServerinUse = ServerinUse;
        store.tryingServer = ServerinUse; // show which server is being tried

        const response = await GetMovieFetch({
            Tmdb_Id: ParamId,
            Type,
            Server: ServerinUse,
            Season,
            Episode
        });

        if (response.error || !response.sources?.length) {
            store.error = true;
            store.tryingServer = null;
            store.serverFailed = ServerinUse; // track which one failed
            return;
        }

        store.sources = response.sources;
        store.subtitles = response.subtitles;
        store.title = response.title;
        store.poster = response.poster;
        store.backdrop = response.backdrop;
        store.overview = response.overview;
        store.loadingServer = false;
        store.tryingServer = null;
        store.serverFailed = null;
    } catch {
        store.tryingServer = null;
        store.serverFailed = ServerinUse;
    }
};

export function Server({ placement }: SettingsProps) {
  return (
    <Menu.Root className="parent">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Menu.Button className={buttonClass}>
            <LuCloud className="h-7 sm:h-8 w-7 sm:w-8 transform transition-transform duration-200 ease-out group-data-open:opacity-50" />
          </Menu.Button>
        </Tooltip.Trigger>
      </Tooltip.Root>
      <Menu.Content className={menuClass} placement={placement}>
        <Servermenu/>
      </Menu.Content>
    </Menu.Root>
  );
}

export function VideoQualitySubmenu({ placement }: SettingsProps) {
  const options = useVideoQualityOptions({ auto: true, sort: 'descending' }),
    currentQualityHeight = options.selectedQuality?.height,
    hint =
      options.selectedValue !== 'auto' && currentQualityHeight
        ? `${currentQualityHeight}p`
        : `Auto${currentQualityHeight ? ` (${currentQualityHeight}p)` : ''}`;
  return (
    <Menu.Root className="parent relative ">
      <Menu.Button disabled={options.disabled} className={buttonClass}>
        <LuSettings className="h-7 sm:h-8 w-7 sm:w-8 transform transition-transform duration-200 ease-out group-data-open:opacity-50" />
      </Menu.Button>
      <Menu.Content className={menuClass} placement={placement}>
        <Menu.RadioGroup value={options.selectedValue}>
          {options.map(({ label, value,  select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

function CaptionSubmenu() {
  const options = useCaptionOptions(),
    hint = options.selectedTrack?.label ?? 'Off';
  return (
    <Menu.Root>
      <SubmenuButton
        label="Captions"
        hint={hint}
        disabled={options.disabled}
        icon={FaRegClosedCaptioning}
      />
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup className="w-full flex flex-col" value={options.selectedValue}>
          {options.map(({ label, value, select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}



const ChangeServerType = async ({
  src,
  type,
  quality,
  label,
  audioTracks,
}: {
  src: string;
  type: string;
  quality: string;
  label: string;
  audioTracks: never[];
}) => {
  try {
    store.mainType = {
      url :src,
      type: type === 'hls'
        ? 'application/x-mpegurl'
        : 'video/mp4',
      quality,
      label,
      audioTracks ,
    } 
  } catch (error) {
    console.log(error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypeofServer = ({ playerSources, mainType }:any) => {
  const MainType = mainType.label || "Unknown";
  return(
       <Menu.Root>
      <SubmenuButton
        label="Sub - Servers"
        hint={MainType}
        disabled={false}
        icon={LuText}
      />
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup className="w-full max-h-48 flex flex-col" value={MainType}>
          {playerSources.map(({ label, src, type, quality, audioTracks }: { label: string; src: string; type: string; quality: string; audioTracks: never[] }) => (
            <Radio value={label} onSelect={() => {
              ChangeServerType( {src, type, quality, label, audioTracks} );
            }} key={src}>
              {label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  )
}

export function MenusType({ placement }: SettingsProps) {
  const snap = useSnapshot(store);
  const sources = snap.sources;
  const mainType = snap.mainType;
   const playerSources = sources.map((source) => ({
    src: source.url,
    type: source.type === 'hls'
      ? 'application/x-mpegurl' as const
      : 'video/mp4' as const,
    quality: source.quality,
    label: source.label,
    audioTracks: source.audioTracks,
  }));
  return (
   <Menu.Root className="parent">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Menu.Button className={buttonClass}>
            <LuText className="h-7 sm:h-8 w-7 sm:w-8 transform transition-transform duration-200 ease-out group-data-open:opacity-50" />
          </Menu.Button>
        </Tooltip.Trigger>
      </Tooltip.Root>
      <Menu.Content className={menuClass} placement={placement}>
        <TypeofServer playerSources={playerSources} mainType={mainType} />
      </Menu.Content>
    </Menu.Root>
  )

  }

function Servermenu (){
  const options = ListServer
  const ServerinUse = useSnapshot(store).ServerinUse;
  const ParamId = useSnapshot(store).ParamId;
  const Type = useSnapshot(store).Type;
  const Season = useSnapshot(store).Season;
  const Episode = useSnapshot(store).Episode;

  return (
    <Menu.Root>
      <SubmenuButton
        label="Servers"
        hint={ServerinUse}
        disabled={false}
        icon={LuServer}
      />
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup className="w-full max-h-48 flex flex-col" value={ServerinUse}>
          {options.map(({ name, id }) => (
            <Radio value={name} onSelect={() => {
              ChangeServer({ParamId, ServerinUse:name, Type, Season, Episode});
            }} key={id}>
              {name}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

export interface RadioProps extends Menu.RadioProps {}

function Radio({ children, ...props }: RadioProps) {
  return (
    <Menu.Radio
      className="ring-media-focus group relative flex w-full cursor-pointer select-none items-center justify-start rounded-sm lg:p-2.5 p-2  outline-none data-hocus:bg-slate-900 data-focus:ring-[3px]"
      {...props}
    >
      <RadioButtonIcon className="lg:h-5 h-4 w-4 lg:w-5 text-white group-data-checked:hidden" />
      <RadioButtonSelectedIcon className="text-media-brand hidden text-red-400  lg:h-5 lg:w-5 h-4 w-4 group-data-checked:block" />
      <span className="ml-2">{children}</span>
    </Menu.Radio>
  );
}

export interface SubmenuButtonProps {
  label: string;
  hint: string;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}

function SubmenuButton({ label, hint, icon: Icon, disabled }: SubmenuButtonProps) {
  return (
    <Menu.Button
      className="ring-media-focus   parent left-0 z-40 flex w-full cursor-pointer select-none items-center justify-start rounded-sm bg-black p-2.5 outline-none ring-inset data-open:sticky data-open:-top-2.5 data-hocus:bg-slate-900 data-focus:ring-[3px] aria-disabled:hidden"
      disabled={disabled}
    >
      <ChevronLeftIcon className="parent-data-checked:block -ml-0.5 mr-1.5 hidden h-4.5 w-4.5" />
      <div className="contents parent-data-checked:hidden">
        <Icon className="md:w-5 h-4 w-4 m:h-5" />
      </div>
      <span className=" ml-1 md:ml-1.5  font-normal parent-data-checked:ml-0">{label}</span>
      <span className="ml-auto text-xs md:text-sm text-white/50">{hint}</span>
      <ChevronRightIcon className="parent-data-checked:hidden ml-0.5 h-4.5 w-4.5 text-sm text-white/50" />
    </Menu.Button>
  );
}