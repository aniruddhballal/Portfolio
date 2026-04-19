import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="bg-ink border-t border-paper/5 py-5 md:py-6">
      <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
        <span className="font-mono text-xs text-paper/25">
          © 2026 Aniruddh Ballal
        </span>
        <motion.span
          className="font-mono text-xs text-paper/25 text-center"
          animate={{ opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Built with Vite + React + TypeScript
        </motion.span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-mono text-xs text-paper/25 hover:text-accent transition-colors"
          data-hover
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  )
}
