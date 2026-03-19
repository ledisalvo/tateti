import { useState } from 'react'
import { motion } from 'framer-motion'
import type { GameState } from '@/hooks/useGame'
import { makeInitialState } from '@/hooks/useGame'
import { cn } from '@/lib/utils'
import { TatetiIcon } from '@/components/TatetiIcon'

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
          <div className="mb-4">
            <TatetiIcon />
          </div>
          <h1
            className="text-5xl font-black tracking-tight text-white mb-2"
            style={{ textShadow: '0 4px 16px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)' }}
          >
            Ta-Te-Ti
          </h1>
          <p className="text-sm font-medium" style={{ color: 'rgba(255,210,150,0.7)' }}>
            Multijugador local
          </p>
        </div>

        {/* Saved game banner */}
        {savedGame && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-2xl text-center"
            style={{
              background: 'rgba(212,137,74,0.25)',
              border: '1px solid rgba(232,160,64,0.5)',
            }}
          >
            <p className="text-sm font-medium mb-2" style={{ color: '#fde68a' }}>
              Partida en curso: <strong>{savedGame.xPlayer}</strong> vs <strong>{savedGame.oPlayer}</strong>
            </p>
            <button
              onClick={onResume}
              className="text-sm font-bold underline underline-offset-2"
              style={{ color: '#fbbf24' }}
            >
              Continuar partida →
            </button>
          </motion.div>
        )}

        {/* Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'rgba(255,210,150,0.8)' }}
            >
              Jugador 1 <span style={{ color: '#22c55e' }}>(X)</span>
            </label>
            <input
              type="text"
              value={p1}
              onChange={e => { setP1(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handlePlay()}
              placeholder="Nombre del jugador 1"
              maxLength={20}
              className={cn(
                'w-full px-4 py-3 rounded-xl text-white placeholder-white/30',
                'focus:outline-none transition-all',
              )}
              style={{
                background: 'rgba(139,74,26,0.6)',
                border: '2px solid rgba(232,160,64,0.5)',
                boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.3)',
              }}
              onFocus={e => {
                e.currentTarget.style.border = '2px solid rgba(34,197,94,0.7)'
                e.currentTarget.style.boxShadow = 'inset 0 1px 4px rgba(0,0,0,0.3), 0 0 0 3px rgba(34,197,94,0.15)'
              }}
              onBlur={e => {
                e.currentTarget.style.border = '2px solid rgba(232,160,64,0.5)'
                e.currentTarget.style.boxShadow = 'inset 0 1px 4px rgba(0,0,0,0.3)'
              }}
            />
          </div>
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'rgba(255,210,150,0.8)' }}
            >
              Jugador 2 <span style={{ color: '#ef4444' }}>(O)</span>
            </label>
            <input
              type="text"
              value={p2}
              onChange={e => { setP2(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handlePlay()}
              placeholder="Nombre del jugador 2"
              maxLength={20}
              className={cn(
                'w-full px-4 py-3 rounded-xl text-white placeholder-white/30',
                'focus:outline-none transition-all',
              )}
              style={{
                background: 'rgba(139,74,26,0.6)',
                border: '2px solid rgba(232,160,64,0.5)',
                boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.3)',
              }}
              onFocus={e => {
                e.currentTarget.style.border = '2px solid rgba(239,68,68,0.7)'
                e.currentTarget.style.boxShadow = 'inset 0 1px 4px rgba(0,0,0,0.3), 0 0 0 3px rgba(239,68,68,0.15)'
              }}
              onBlur={e => {
                e.currentTarget.style.border = '2px solid rgba(232,160,64,0.5)'
                e.currentTarget.style.boxShadow = 'inset 0 1px 4px rgba(0,0,0,0.3)'
              }}
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-center font-semibold"
              style={{ color: '#fca5a5' }}
            >
              {error}
            </motion.p>
          )}
        </div>

        <motion.button
          onClick={handlePlay}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl text-white font-black text-lg"
          style={{
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            boxShadow: '0 6px 20px rgba(22,163,74,0.4), 0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          ¡Jugar!
        </motion.button>

        <button
          onClick={onDashboard}
          className="w-full mt-4 py-3 text-sm font-medium transition-colors"
          style={{ color: 'rgba(255,210,150,0.5)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,210,150,0.8)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,210,150,0.5)' }}
        >
          Ver ranking global →
        </button>
      </motion.div>
    </div>
  )
}
