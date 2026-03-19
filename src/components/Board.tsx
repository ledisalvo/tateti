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
      <div className="grid grid-cols-3 gap-3 p-3 bg-white/5 rounded-3xl border border-white/10">
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
