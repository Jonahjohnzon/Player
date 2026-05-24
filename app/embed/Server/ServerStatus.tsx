// components/ServerStatus.tsx
import Loading from '@/app/Player/Loading'
import { ListServer } from '../../Player/ListServers'

interface Props {
    tryingServer: string | null
    triedServers: string[]
    allFailed: boolean
    onRetry: () => void
}

export function ServerStatus({ tryingServer, triedServers, allFailed, onRetry }: Props) {
    if (allFailed) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4 text-white">
                <p className="text-xl font-semibold">No servers available</p>
                <p className="text-white/50 text-sm">All servers failed to load this title</p>
                <button
                    onClick={onRetry}
                    className="px-6 py-2 border border-white/20 rounded text-sm hover:bg-white/10 transition-colors"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-6">
            <Loading />

            {tryingServer && (
                <div className="flex flex-col items-center gap-2">
                    <p className="text-white/50 text-sm tracking-widest uppercase">Trying</p>
                    <p className="text-white text-lg font-semibold">{tryingServer}</p>
                </div>
            )}

            <div className="flex flex-col gap-2 min-w-50">
                {ListServer.map((server) => {
                    const tried = triedServers.includes(server.name)
                    const isCurrent = server.name === tryingServer
                    const failed = tried && !isCurrent && tryingServer !== null

                    return (
                        <div
                            key={server.name}
                            className={`flex items-center justify-between px-4 py-2 rounded border text-sm transition-all ${
                                isCurrent
                                    ? 'border-white/50 bg-white/10 text-white'
                                    : failed
                                    ? 'border-red-500/30 bg-red-500/10 text-red-400'
                                    : 'border-white/10 text-white/30'
                            }`}
                        >
                            <span>{server.name}</span>
                            <span>
                                {isCurrent ? (
                                    <span className="animate-pulse">●</span>
                                ) : failed ? '✕' : '○'}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}