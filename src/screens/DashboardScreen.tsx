import { motion } from 'framer-motion'

type Props = {
  onBack: () => void
}

export function DashboardScreen({ onBack }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg text-center"
      >
        <div className="text-5xl mb-4">🏅</div>
        <h1 className="text-3xl font-black text-white mb-2">Ranking Global</h1>
        <p className="text-white/40 text-sm mb-8">Próximamente — disponible en M4</p>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 mb-6">
          <p className="text-white/30 text-sm">
            El dashboard se conectará a Supabase en el siguiente milestone.<br />
            Por ahora, ¡andá a jugar! 🎮
          </p>
        </div>

        <button
          onClick={onBack}
          className="text-white/40 hover:text-white/70 text-sm transition-colors"
        >
          ← Volver al inicio
        </button>
      </motion.div>
    </div>
  )
}
