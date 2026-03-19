import { motion, AnimatePresence } from 'framer-motion'
import { Board } from '@/components/Board'
import { useGame } from '@/hooks/useGame'
import type { GameState } from '@/hooks/useGame'
import { cn } from '@/lib/utils'

type Props = {
  initialState: GameState
  onNewGame: () => void
}

export function GameScreen({ initialState, onNewGame }: Props) {
  const { state, makeMove, rematch, getWinnerName, getLoserName } = useGame(initialState)

  const winnerName = getWinnerName()
  const loserName = getLoserName()
  const currentPlayerName = state.currentTurn === 'X' ? state.xPlayer : state.oPlayer
  const finished = state.status !== 'playing'

  function handleRematch() {
    if (state.status === 'won' && loserName) {
      rematch(loserName)
    } else {
      // draw: player1 starts
      rematch(state.player1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onNewGame}
            className="text-white/30 hover:text-white/60 text-sm transition-colors"
          >
            ← Inicio
          </button>
          <div className="flex gap-3 text-sm font-bold">
            <span className="text-blue-400">{state.xPlayer} (X)</span>
            <span className="text-white/20">vs</span>
            <span className="text-orange-400">{state.oPlayer} (O)</span>
          </div>
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
              className="text-center mb-6"
            >
              <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-1">Turno de</p>
              <p className={cn(
                'text-2xl font-black',
                state.currentTurn === 'X' ? 'text-blue-400' : 'text-orange-400',
              )}>
                {currentPlayerName}
                <span className="text-white/20 ml-2 text-lg">({state.currentTurn})</span>
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

        {/* Result overlay */}
        <AnimatePresence>
          {finished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.4 }}
              className="mt-8 p-6 rounded-3xl bg-white/5 border border-white/10 text-center"
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
                  <p className="text-white/50 text-sm mb-1">¡Ganó!</p>
                  <p className={cn(
                    'text-3xl font-black mb-1',
                    state.winResult?.winner === 'X' ? 'text-blue-400' : 'text-orange-400',
                  )}>
                    {winnerName}
                  </p>
                  <p className="text-white/30 text-xs">
                    {loserName} empieza la revancha
                  </p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-3">🤝</div>
                  <p className="text-white/50 text-sm mb-1">¡Empate!</p>
                  <p className="text-2xl font-black text-white/70">Sin ganador</p>
                </>
              )}

              <div className="flex gap-3 mt-6">
                <motion.button
                  onClick={handleRematch}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20"
                >
                  Revancha ⚡
                </motion.button>
                <motion.button
                  onClick={onNewGame}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-xl bg-white/10 border border-white/10 text-white/70 font-bold text-sm"
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
