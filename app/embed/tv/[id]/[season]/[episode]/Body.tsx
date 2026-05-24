"use client"
import Player from '@/app/Player/Player'
import React, { useEffect } from 'react'
import { store } from '@/app/store'
import { useSnapshot } from "valtio"
import { useServerFallback } from '../../../../../UseServerFallback'
import { ServerStatus } from '../../../../Server/ServerStatus'

const Body = ({ paramId, season, episode }: { paramId: string; season: string; episode: string }) => {
    const loading = useSnapshot(store).loading
    const { load, tryingServer, triedServers, allFailed, reset } = useServerFallback()

    useEffect(() => {
        store.Season = season
        store.Episode = episode
        load({ paramId, Type: 'tv', Season: season, Episode: episode })
    }, [])

    if (loading || tryingServer) {
        return (
            <ServerStatus
                tryingServer={tryingServer}
                triedServers={triedServers}
                allFailed={false}
                onRetry={() => load({ paramId, Type: 'tv', Season: season, Episode: episode })}
            />
        )
    }

    if (allFailed) {
        return (
            <ServerStatus
                tryingServer={null}
                triedServers={triedServers}
                allFailed={true}
                onRetry={() => { reset(); load({ paramId, Type: 'tv', Season: season, Episode: episode }) }}
            />
        )
    }

    return <Player />
}

export default Body