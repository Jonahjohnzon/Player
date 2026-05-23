"use client"
import Player from '@/app/Player/Player'
import React, { useEffect } from 'react'
import { store } from '@/app/store'
import {useSnapshot} from "valtio"
import {GetMovieFetch} from '../../../Get/GetMovie'
import Loading from '@/app/Player/Loading'

const Body = ({ paramId }: { paramId: string }) => {
    const loading = useSnapshot(store).loading;
    const ServerinUse = useSnapshot(store).ServerinUse;
  const GetMovie = async () => {
    try {
       store.ParamId = paramId;
       store.loading = true;
       store.Type = "movie";
      const response = await GetMovieFetch({ Tmdb_Id: paramId, Type: "movie", Server: ServerinUse });
      if(response.error){
        store.error = true;
        store.loading = false;
        return;
      }
      store.M3u8Url = response?.sources[0]?.url || "";
      store.title = response.title;
      store.sources = response.sources;
      store.subtitles = response.subtitles;
      store.loading = false;
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

 useEffect(() => {
    GetMovie();
  }, []);

  if
  (loading)
    return  <div className="flex items-center justify-center h-screen"><Loading/></div>
    

  return (
    <div>
      <Player/>
    </div>
  )
}

export default Body