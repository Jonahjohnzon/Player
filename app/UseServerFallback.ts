// hooks/useServerFallback.ts
import { useState } from 'react'
import { store } from '@/app/store'
import { GetMovieFetch } from './Get/GetMovie'
import {ListServer} from './Player/ListServers'


interface MediaParams {
    paramId: string
    Type: 'movie' | 'tv'
    Season?: string
    Episode?: string
}

export function useServerFallback() {
    const [tryingServer, setTryingServer] = useState<string | null>(null)
    const [triedServers, setTriedServers] = useState<string[]>([])
    const [allFailed, setAllFailed] = useState(false)

    const reset = () => {
        setAllFailed(false)
        setTriedServers([])
        setTryingServer(null)
    }

    const tryServer = async (server: string, params: MediaParams): Promise<boolean> => {
        try {
            setTryingServer(server)

            const response = params.Type === 'movie'
                ? await GetMovieFetch({ Tmdb_Id: params.paramId, Type: 'movie', Server: server })
                : await GetMovieFetch({ Tmdb_Id: params.paramId, Type: 'tv', Season: params.Season, Episode: params.Episode, Server: server })

            if (response.error || !response.sources?.length) return false

            store.ParamId = params.paramId
            store.Type = params.Type
            store.ServerinUse = server
            store.sources = response.sources
            store.subtitles = response.subtitles
            store.M3u8Url = response.sources[0]?.url || ''
            store.loading = false
            store.title = response.title
            store.poster = response.poster
            store.backdrop = response.backdrop
            store.overview = response.overview
            return true
        } catch {
            return false
        }
    }

    const load = async (params: MediaParams) => {
        reset()
        store.loading = true
        store.ParamId = params.paramId
        store.Type = params.Type

        const tried: string[] = []

        for (const server of ListServer) {
            tried.push(server.name)
            setTriedServers([...tried])

            const success = await tryServer(server.name, params)
            if (success) {
                setTryingServer(null)
                return
            }
        }

        setAllFailed(true)
        setTryingServer(null)
        store.loading = false
    }

    return { load, tryingServer, triedServers, allFailed, reset }
}