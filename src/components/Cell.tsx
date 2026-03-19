import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { CellValue } from '@/hooks/useGame'

type Props = {
  value: CellValue
  index: number
  isWinning: boolean
  onClick: () => void
  disabled: boolean
}

export function Cell({ value, isWinning, onClick, disabled }: Props) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || value !== null}
      className={cn(
        'relative flex items-center justify-center rounded-2xl text-5xl font-black cursor-pointer select-none',
        'w-full aspect-square',
        'border-2 transition-colors duration-200',
        value === null && !disabled
          ? 'border-white/10 hover:border-white/30 hover:bg-white/5 bg-white/[0.03]'
          : 'border-white/10 bg-white/[0.03]',
        isWinning && 'border-green-400/60 bg-green-400/10',
      )}
      whileHover={value === null && !disabled ? { scale: 1.04 } : {}}
      whileTap={value === null && !disabled ? { scale: 0.96 } : {}}
    >
      {value && (
        <motion.span
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className={cn(
            'leading-none',
            value === 'X' ? 'text-blue-400' : 'text-orange-400',
            isWinning && value === 'X' && 'text-blue-300',
            isWinning && value === 'O' && 'text-orange-300',
          )}
        >
          {value}
        </motion.span>
      )}
    </motion.button>
  )
}
