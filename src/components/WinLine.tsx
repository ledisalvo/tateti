import { motion } from 'framer-motion'

type Props = {
  line: [number, number, number]
}

// Maps a winning line to SVG coordinates (in a 3x3 grid from 0,0 to 300,300)
const CELL_SIZE = 100
const PADDING = 50

function cellCenter(index: number): [number, number] {
  const col = index % 3
  const row = Math.floor(index / 3)
  return [PADDING + col * CELL_SIZE, PADDING + row * CELL_SIZE]
}

export function WinLine({ line }: Props) {
  const [x1, y1] = cellCenter(line[0])
  const [x2, y2] = cellCenter(line[2])

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 300 300"
      preserveAspectRatio="none"
    >
      <motion.line
        x1={x1} y1={y1}
        x2={x2} y2={y2}
        stroke="#22c55e"
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
      {/* Glow layer */}
      <motion.line
        x1={x1} y1={y1}
        x2={x2} y2={y2}
        stroke="#4ade80"
        strokeWidth="12"
        strokeLinecap="round"
        strokeOpacity="0.3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </svg>
  )
}
