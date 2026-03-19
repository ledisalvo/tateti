import { Cell } from './Cell'
import { WinLine } from './WinLine'
import type { Board as BoardType, WinResult } from '@/hooks/useGame'

type Props = {
  board: BoardType
  winResult: WinResult
  onCellClick: (index: number) => void
  disabled: boolean
}

export function Board({ board, winResult, onCellClick, disabled }: Props) {
  const winningCells = new Set(winResult?.line ?? [])

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div
        className="grid grid-cols-3 rounded-2xl"
        style={{
          background: '#8a4a1a',
          border: '3px solid #c8842a',
          borderRadius: '16px',
          padding: '12px',
          gap: '8px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {board.map((cell, i) => (
          <Cell
            key={i}
            index={i}
            value={cell}
            isWinning={winningCells.has(i)}
            onClick={() => onCellClick(i)}
            disabled={disabled}
          />
        ))}
      </div>
      {winResult && <WinLine line={winResult.line} />}
    </div>
  )
}
