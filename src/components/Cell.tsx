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
  const isEmpty = value === null
  const isClickable = isEmpty && !disabled

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || !isEmpty}
      className={cn(
        'relative flex items-center justify-center rounded-xl text-5xl font-black cursor-pointer select-none',
        'w-full aspect-square',
        'border-2 transition-all duration-200',
      )}
      style={{
        background: isWinning
          ? 'linear-gradient(135deg, #e8a040 0%, #d4894a 50%, #c07030 100%)'
          : 'linear-gradient(135deg, #d4894a 0%, #c07030 60%, #b06020 100%)',
        border: isWinning
          ? '2px solid #fbbf24'
          : '2px solid #e8a040',
        boxShadow: isWinning
          ? 'inset 0 1px 0 rgba(255,255,255,0.25), 0 3px 8px rgba(0,0,0,0.4), 0 0 12px rgba(251,191,36,0.5)'
          : 'inset 0 1px 0 rgba(255,255,255,0.2), 0 3px 8px rgba(0,0,0,0.35)',
      }}
      whileHover={isClickable ? { scale: 1.06, filter: 'brightness(1.15)' } : {}}
      whileTap={isClickable ? { scale: 0.96 } : {}}
    >
      {value && (
        <motion.span
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className={cn(
            'leading-none drop-shadow-lg',
            value === 'X' ? 'text-green-400' : 'text-red-500',
          )}
          style={{
            textShadow: value === 'X'
              ? '0 2px 8px rgba(34,197,94,0.7)'
              : '0 2px 8px rgba(239,68,68,0.7)',
            fontSize: '2.8rem',
            fontWeight: 900,
          }}
        >
          {value}
        </motion.span>
      )}
    </motion.button>
  )
}
