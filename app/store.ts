import { proxy } from "valtio";
import { ListServer } from "./Player/ListServers";
export const store = proxy({
    Server:  ListServer[0],
    Active:  ListServer[0].name,
    ServerinUse:"Vidrock",
    Check:false,
    loading:true,
    M3u8Url:"",
    title:"",
    ParamId:"",
    sources: [] as {
    url: string;
    type: string;
    quality: string;
    label: string;
    audioTracks: {
      label: string;
      language: string;
      url: string | null;
    }[]
  }[],
  subtitles: [] as {
    url: string;
    format: string;
    label: string;
  }[],
    error:false,
    type:"movie",
    url:""
});