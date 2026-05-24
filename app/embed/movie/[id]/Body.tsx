// Body.tsx
"use client"
import Player from '@/app/Player/Player'
import React, { useEffect } from 'react'
import { store } from '@/app/store'
import { useSnapshot } from "valtio"
import { useServerFallback } from '../../../UseServerFallback'
import { ServerStatus } from '../../Server/ServerStatus'

const Body = ({ paramId }: { paramId: string }) => {
    const loading = useSnapshot(store).loading
    const { load, tryingServer, triedServers, allFailed, reset } = useServerFallback()

    useEffect(() => {
        load({ paramId, Type: 'movie' })
    }, [])

    if (loading || tryingServer) {
        return <ServerStatus tryingServer={tryingServer} triedServers={triedServers} allFailed={false} onRetry={() => load({ paramId, Type: 'movie' })} />
    }

    if (allFailed) {
        return <ServerStatus tryingServer={null} triedServers={triedServers} allFailed={true} onRetry={() => { reset(); load({ paramId, Type: 'movie' }) }} />
    }

    return <Player />
}

export default Body