import { useState, useCallback } from 'react'

export type CellValue = 'X' | 'O' | null
export type Board = CellValue[]

export type WinResult = {
  winner: 'X' | 'O'
  line: [number, number, number]
} | null

export type GameStatus = 'playing' | 'won' | 'draw'

export type GameState = {
  board: Board
  currentTurn: 'X' | 'O'
  status: GameStatus
  winResult: WinResult
  player1: string  // always plays X on first game
  player2: string  // always plays O on first game
  xPlayer: string  // who plays X this round
  oPlayer: string  // who plays O this round
  moveCount: number
}

const WINNING_LINES: [number, number, number][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
]

const STORAGE_KEY = 'tateti_game_state'

function checkWinner(board: Board): WinResult {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as 'X' | 'O', line: [a, b, c] }
    }
  }
  return null
}

function makeInitialState(player1: string, player2: string, xPlayer: string, oPlayer: string): GameState {
  return {
    board: Array(9).fill(null),
    currentTurn: 'X',
    status: 'playing',
    winResult: null,
    player1,
    player2,
    xPlayer,
    oPlayer,
    moveCount: 0,
  }
}

function saveToStorage(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function clearStorage() {
  localStorage.removeItem(STORAGE_KEY)
}

export function loadSavedGame(): GameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    const state = JSON.parse(saved) as GameState
    if (state.status !== 'playing') return null
    return state
  } catch {
    return null
  }
}

export function useGame(initialState: GameState) {
  const [state, setState] = useState<GameState>(initialState)

  const makeMove = useCallback((index: number) => {
    setState(prev => {
      if (prev.status !== 'playing') return prev
      if (prev.board[index] !== null) return prev

      const newBoard = [...prev.board]
      newBoard[index] = prev.currentTurn

      const winResult = checkWinner(newBoard)
      const allFilled = newBoard.every(cell => cell !== null)

      let status: GameStatus = 'playing'
      if (winResult) status = 'won'
      else if (allFilled) status = 'draw'

      const nextTurn: 'X' | 'O' = prev.currentTurn === 'X' ? 'O' : 'X'

      const newState: GameState = {
        ...prev,
        board: newBoard,
        currentTurn: nextTurn,
        status,
        winResult,
        moveCount: prev.moveCount + 1,
      }

      if (status === 'playing') {
        saveToStorage(newState)
      } else {
        clearStorage()
      }

      return newState
    })
  }, [])

  const rematch = useCallback((loserName: string) => {
    setState(prev => {
      // The loser starts as X (gets first move)
      const newXPlayer = loserName
      const newOPlayer = loserName === prev.player1 ? prev.player2 : prev.player1
      const newState = makeInitialState(prev.player1, prev.player2, newXPlayer, newOPlayer)
      saveToStorage(newState)
      return newState
    })
  }, [])

  const getWinnerName = useCallback((): string | null => {
    if (!state.winResult) return null
    return state.winResult.winner === 'X' ? state.xPlayer : state.oPlayer
  }, [state])

  const getLoserName = useCallback((): string | null => {
    if (!state.winResult) return null
    return state.winResult.winner === 'X' ? state.oPlayer : state.xPlayer
  }, [state])

  return { state, makeMove, rematch, getWinnerName, getLoserName }
}

export { makeInitialState, clearStorage }
