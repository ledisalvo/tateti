import { useState } from 'react'
import { motion } from 'framer-motion'
import type { GameState } from '@/hooks/useGame'
import { makeInitialState } from '@/hooks/useGame'
import { cn } from '@/lib/utils'

type Props = {
  onPlay: (state: GameState) => void
  onDashboard: () => void
  savedGame: GameState | null
  onResume: () => void
}

export function HomeScreen({ onPlay, onDashboard, savedGame, onResume }: Props) {
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [error, setError] = useState('')

  const normalize = (s: string) => s.trim().toLowerCase()

  function handlePlay() {
    const name1 = p1.trim()
    const name2 = p2.trim()

    if (!name1 || !name2) {
      setError('Completá ambos nombres para jugar.')
      return
    }
    if (normalize(name1) === normalize(name2)) {
      setError('Los jugadores deben tener nombres distintos.')
      return
    }
    setError('')
    onPlay(makeInitialState(name1, name2, name1, name2))
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Title */}
        <div className="text-center mb-10">
          <motion.div
            className="text-7xl mb-4"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            🎮
          </motion.div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-2">Ta-Te-Ti</h1>
          <p className="text-white/50 text-sm">Multijugador local</p>
        </div>

        {/* Saved game banner */}
        {savedGame && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 text-center"
          >
            <p className="text-yellow-300 text-sm font-medium mb-2">
              Partida en curso: <strong>{savedGame.xPlayer}</strong> vs <strong>{savedGame.oPlayer}</strong>
            </p>
            <button
              onClick={onResume}
              className="text-yellow-400 text-sm font-bold underline underline-offset-2"
            >
              Continuar partida →
            </button>
          </motion.div>
        )}

        {/* Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
              Jugador 1 <span className="text-blue-400">(X)</span>
            </label>
            <input
              type="text"
              value={p1}
              onChange={e => { setP1(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handlePlay()}
              placeholder="Nombre del jugador 1"
              maxLength={20}
              className={cn(
                'w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/20',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all',
                'border-white/10 focus:border-blue-500/50',
              )}
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
              Jugador 2 <span className="text-orange-400">(O)</span>
            </label>
            <input
              type="text"
              value={p2}
              onChange={e => { setP2(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handlePlay()}
              placeholder="Nombre del jugador 2"
              maxLength={20}
              className={cn(
                'w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/20',
                'focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all',
                'border-white/10 focus:border-orange-500/50',
              )}
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm text-center"
            >
              {error}
            </motion.p>
          )}
        </div>

        <motion.button
          onClick={handlePlay}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-black text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
        >
          ¡Jugar!
        </motion.button>

        <button
          onClick={onDashboard}
          className="w-full mt-4 py-3 text-white/40 hover:text-white/70 text-sm font-medium transition-colors"
        >
          Ver ranking global →
        </button>
      </motion.div>
    </div>
  )
}
