import { motion } from 'framer-motion'

export function TatetiIcon() {
  return (
    <motion.div
      style={{ width: 96, height: 96, margin: '0 auto' }}
      animate={{
        rotate: [0, -8, 12, -6, 0],
        scale:  [1, 1.12, 0.92, 1.08, 1],
        y:      [0, -6, 4, -3, 0],
      }}
      transition={{
        duration: 2.4,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      }}
    >
      <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Board lines — gruesas, redondeadas */}
        {/* vertical */}
        <line x1="33" y1="8"  x2="33" y2="88" stroke="#e8a040" strokeWidth="5" strokeLinecap="round"/>
        <line x1="63" y1="8"  x2="63" y2="88" stroke="#e8a040" strokeWidth="5" strokeLinecap="round"/>
        {/* horizontal */}
        <line x1="8"  y1="33" x2="88" y2="33" stroke="#e8a040" strokeWidth="5" strokeLinecap="round"/>
        <line x1="8"  y1="63" x2="88" y2="63" stroke="#e8a040" strokeWidth="5" strokeLinecap="round"/>

        {/* O — top-left, rojo */}
        <motion.circle
          cx="18" cy="18" r="9"
          stroke="#ef4444" strokeWidth="4.5" fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.1, repeat: Infinity, repeatDelay: 2 }}
        />

        {/* X — center, verde */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.5, repeat: Infinity, repeatDelay: 2 }}
          style={{ originX: '48px', originY: '48px' }}
        >
          <line x1="41" y1="41" x2="55" y2="55" stroke="#22c55e" strokeWidth="5" strokeLinecap="round"/>
          <line x1="55" y1="41" x2="41" y2="55" stroke="#22c55e" strokeWidth="5" strokeLinecap="round"/>
        </motion.g>

        {/* O — bottom-right, rojo */}
        <motion.circle
          cx="78" cy="78" r="9"
          stroke="#ef4444" strokeWidth="4.5" fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.9, repeat: Infinity, repeatDelay: 2 }}
        />

        {/* X — top-right, verde */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 1.3, repeat: Infinity, repeatDelay: 2 }}
        >
          <line x1="71" y1="11" x2="85" y2="25" stroke="#22c55e" strokeWidth="5" strokeLinecap="round"/>
          <line x1="85" y1="11" x2="71" y2="25" stroke="#22c55e" strokeWidth="5" strokeLinecap="round"/>
        </motion.g>

        {/* Línea ganadora diagonal — verde, se dibuja al final */}
        <motion.line
          x1="10" y1="10" x2="86" y2="86"
          stroke="#22c55e" strokeWidth="4" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.5, delay: 1.7, repeat: Infinity, repeatDelay: 2 }}
        />
      </svg>
    </motion.div>
  )
}
