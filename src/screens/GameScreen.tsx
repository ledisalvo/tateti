import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Board } from '@/components/Board'
import { useGame } from '@/hooks/useGame'
import type { GameState } from '@/hooks/useGame'
import { cn } from '@/lib/utils'
import { recordGame } from '@/lib/store'

type Props = {
  initialState: GameState
  onNewGame: () => void
}

type SessionScores = { x: number; o: number }

export function GameScreen({ initialState, onNewGame }: Props) {
  const { state, makeMove, rematch, getWinnerName, getLoserName } = useGame(initialState)
  const [scores, setScores] = useState<SessionScores>({ x: 0, o: 0 })

  const winnerName = getWinnerName()
  const loserName = getLoserName()
  const currentPlayerName = state.currentTurn === 'X' ? state.xPlayer : state.oPlayer
  const finished = state.status !== 'playing'

  // Record game once when it finishes and update session scores
  const recorded = useRef(false)
  useEffect(() => {
    if (finished && !recorded.current) {
      recorded.current = true
      recordGame(state.player1, state.player2, winnerName)
      if (state.status === 'won' && state.winResult) {
        setScores(prev => ({
          ...prev,
          [state.winResult!.winner.toLowerCase()]: prev[state.winResult!.winner === 'X' ? 'x' : 'o'] + 1,
        }))
      }
    }
  }, [finished, state.player1, state.player2, winnerName, state.status, state.winResult])

  function handleRematch() {
    recorded.current = false
    if (state.status === 'won' && loserName) {
      rematch(loserName)
    } else {
      rematch(state.player1)
    }
  }

  const xIsActive = state.currentTurn === 'X' && !finished
  const oIsActive = state.currentTurn === 'O' && !finished

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* Header — botón inicio */}
        <div className="flex items-center justify-between">
          <button
            onClick={onNewGame}
            className="text-sm font-semibold transition-colors"
            style={{ color: 'rgba(255,220,160,0.6)' }}
          >
            ← Inicio
          </button>
          <div className="w-12" />
        </div>

        {/* Turn indicator */}
        <AnimatePresence mode="wait">
          {!finished && (
            <motion.div
              key={state.currentTurn}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="text-center"
            >
              <p
                className="text-xs uppercase tracking-widest font-semibold mb-1"
                style={{ color: 'rgba(255,200,120,0.6)' }}
              >
                Turno de
              </p>
              <p
                className="text-2xl font-black"
                style={{
                  color: state.currentTurn === 'X' ? '#22c55e' : '#ef4444',
                  textShadow: state.currentTurn === 'X'
                    ? '0 2px 10px rgba(34,197,94,0.5)'
                    : '0 2px 10px rgba(239,68,68,0.5)',
                }}
              >
                {currentPlayerName}
                <span
                  className="ml-2 text-lg"
                  style={{ color: 'rgba(255,200,120,0.4)' }}
                >
                  ({state.currentTurn})
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Board */}
        <Board
          board={state.board}
          winResult={state.winResult}
          onCellClick={makeMove}
          disabled={finished}
        />

        {/* Score panel */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #d4894a, #c07030)',
            border: '2px solid #e8a040',
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
          }}
        >
          <div className="flex">
            {/* Player X */}
            <div
              className={cn('flex-1 flex flex-col items-center py-4 px-3 transition-all duration-300')}
              style={{
                background: xIsActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                borderRight: '1px solid rgba(232,160,64,0.5)',
              }}
            >
              <span className="text-3xl mb-1" style={{ color: '#22c55e', filter: 'drop-shadow(0 2px 4px rgba(34,197,94,0.6))' }}>
                ♟
              </span>
              <p className="text-white font-black text-sm truncate max-w-full px-1 text-center leading-tight mb-1">
                {state.xPlayer}
              </p>
              <p className="text-4xl font-black text-white" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
                {scores.x}
              </p>
            </div>

            {/* Player O */}
            <div
              className={cn('flex-1 flex flex-col items-center py-4 px-3 transition-all duration-300')}
              style={{
                background: oIsActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              }}
            >
              <span className="text-3xl mb-1" style={{ color: '#ef4444', filter: 'drop-shadow(0 2px 4px rgba(239,68,68,0.6))' }}>
                ♟
              </span>
              <p className="text-white font-black text-sm truncate max-w-full px-1 text-center leading-tight mb-1">
                {state.oPlayer}
              </p>
              <p className="text-4xl font-black text-white" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
                {scores.o}
              </p>
            </div>
          </div>
        </div>

        {/* Result overlay */}
        <AnimatePresence>
          {finished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.4 }}
              className="p-6 rounded-3xl text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(212,137,74,0.95), rgba(192,112,48,0.95))',
                border: '2px solid #e8a040',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              {state.status === 'won' ? (
                <>
                  <motion.div
                    className="text-5xl mb-3"
                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    🏆
                  </motion.div>
                  <p className="text-sm mb-1 font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>¡Ganó!</p>
                  <p
                    className="text-3xl font-black mb-1"
                    style={{
                      color: state.winResult?.winner === 'X' ? '#22c55e' : '#ef4444',
                      textShadow: state.winResult?.winner === 'X'
                        ? '0 2px 10px rgba(34,197,94,0.6)'
                        : '0 2px 10px rgba(239,68,68,0.6)',
                    }}
                  >
                    {winnerName}
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {loserName} empieza la revancha
                  </p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-3">🤝</div>
                  <p className="text-sm mb-1 font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>¡Empate!</p>
                  <p className="text-2xl font-black" style={{ color: 'rgba(255,255,255,0.85)' }}>Sin ganador</p>
                </>
              )}

              <div className="flex gap-3 mt-6">
                <motion.button
                  onClick={handleRematch}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-xl text-white font-bold text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #16a34a, #15803d)',
                    boxShadow: '0 4px 12px rgba(22,163,74,0.4)',
                  }}
                >
                  Revancha ⚡
                </motion.button>
                <motion.button
                  onClick={onNewGame}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-xl font-bold text-sm"
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(232,160,64,0.4)',
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  Nueva partida
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
