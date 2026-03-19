import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getPlayers, getMatches } from '@/lib/store'
import type { PlayerStats, MatchRecord } from '@/lib/store'
import { cn } from '@/lib/utils'

type Props = {
  onBack: () => void
}

const MEDALS = ['🥇', '🥈', '🥉']

function winRate(p: PlayerStats): number {
  if (p.games_played === 0) return 0
  return (p.games_won / p.games_played) * 100
}

function sortPlayers(players: PlayerStats[]): PlayerStats[] {
  return [...players].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    return winRate(b) - winRate(a)
  })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function MatchResult({ match }: { match: MatchRecord }) {
  const isDraw = match.winner_name === null
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2 text-sm min-w-0">
        <span className={cn(
          'font-bold truncate',
          match.winner_name === match.player1_name ? 'text-green-400' : 'text-white/60',
        )}>
          {match.player1_name}
        </span>
        <span className="text-white/20 shrink-0">vs</span>
        <span className={cn(
          'font-bold truncate',
          match.winner_name === match.player2_name ? 'text-green-400' : 'text-white/60',
        )}>
          {match.player2_name}
        </span>
      </div>
      <div className="text-right shrink-0 ml-4">
        {isDraw
          ? <span className="text-yellow-400 text-xs font-bold">EMPATE</span>
          : <span className="text-green-400 text-xs font-bold">Ganó {match.winner_name}</span>
        }
        <p className="text-white/25 text-xs">{formatDate(match.played_at)}</p>
      </div>
    </div>
  )
}

export function DashboardScreen({ onBack }: Props) {
  const [players, setPlayers] = useState<PlayerStats[]>([])
  const [matches, setMatches] = useState<MatchRecord[]>([])

  useEffect(() => {
    setPlayers(sortPlayers(getPlayers()))
    setMatches([...getMatches()].reverse()) // newest first
  }, [])

  const isEmpty = players.length === 0

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="text-white/30 hover:text-white/60 text-sm transition-colors"
        >
          ← Inicio
        </button>
        <h1 className="text-xl font-black text-white">Ranking Global</h1>
        <div className="w-16" />
      </div>

      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-5xl mb-4">🎮</div>
          <p className="text-white/40">Todavía no se jugó ninguna partida.</p>
          <button onClick={onBack} className="mt-6 text-blue-400 text-sm font-bold">
            ¡Ir a jugar! →
          </button>
        </motion.div>
      ) : (
        <>
          {/* Ranking table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">Tabla de posiciones</h2>
            <div className="rounded-2xl overflow-hidden border border-white/10">
              {/* Table header */}
              <div className="grid grid-cols-[2rem_1fr_4rem_4rem_4rem_4rem_4rem] gap-x-2 px-4 py-2 bg-white/5 text-white/30 text-xs font-semibold uppercase tracking-wider">
                <span>#</span>
                <span>Jugador</span>
                <span className="text-right">Pts</span>
                <span className="text-right">PJ</span>
                <span className="text-right">PG</span>
                <span className="text-right">Win%</span>
                <span className="text-right">Racha</span>
              </div>

              {/* Rows */}
              {players.map((p, i) => {
                const isTop3 = i < 3
                return (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      'grid grid-cols-[2rem_1fr_4rem_4rem_4rem_4rem_4rem] gap-x-2 px-4 py-3 border-t border-white/5 text-sm',
                      isTop3 && 'bg-white/[0.02]',
                    )}
                  >
                    <span className="text-lg leading-none">
                      {isTop3 ? MEDALS[i] : <span className="text-white/25 text-xs">{i + 1}</span>}
                    </span>
                    <span className={cn('font-bold truncate', isTop3 ? 'text-white' : 'text-white/70')}>
                      {p.name}
                    </span>
                    <span className="text-right font-black text-blue-400">{p.points % 1 === 0 ? p.points : p.points.toFixed(1)}</span>
                    <span className="text-right text-white/50">{p.games_played}</span>
                    <span className="text-right text-white/50">{p.games_won}</span>
                    <span className="text-right text-white/50">{winRate(p).toFixed(0)}%</span>
                    <span className={cn(
                      'text-right font-bold',
                      p.current_streak >= 3 ? 'text-orange-400' : p.current_streak > 0 ? 'text-green-400' : 'text-white/25',
                    )}>
                      {p.current_streak > 0 ? `🔥${p.current_streak}` : '—'}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Match history */}
          {matches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
                Últimas partidas
              </h2>
              <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
                {matches.map(m => <MatchResult key={m.id} match={m} />)}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
