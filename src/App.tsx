import { useState } from 'react'
import './index.css'
import { HomeScreen } from '@/screens/HomeScreen'
import { GameScreen } from '@/screens/GameScreen'
import { DashboardScreen } from '@/screens/DashboardScreen'
import { loadSavedGame } from '@/hooks/useGame'
import type { GameState } from '@/hooks/useGame'

type Screen = 'home' | 'game' | 'dashboard'

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [gameState, setGameState] = useState<GameState | null>(null)

  const savedGame = loadSavedGame()

  function startGame(state: GameState) {
    setGameState(state)
    setScreen('game')
  }

  function resumeGame() {
    if (savedGame) {
      setGameState(savedGame)
      setScreen('game')
    }
  }

  return (
    <>
      {screen === 'home' && (
        <HomeScreen
          onPlay={startGame}
          onDashboard={() => setScreen('dashboard')}
          savedGame={savedGame}
          onResume={resumeGame}
        />
      )}
      {screen === 'game' && gameState && (
        <GameScreen
          key={`${gameState.xPlayer}-${gameState.oPlayer}-${gameState.moveCount}`}
          initialState={gameState}
          onNewGame={() => setScreen('home')}
        />
      )}
      {screen === 'dashboard' && (
        <DashboardScreen onBack={() => setScreen('home')} />
      )}
    </>
  )
}

export default App
