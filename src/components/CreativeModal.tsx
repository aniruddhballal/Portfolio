import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { CreativeItem } from '../data/creative'

interface Props {
  item: CreativeItem | null
  onClose: () => void
}

export default function CreativeModal({ item, onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    if (!item) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    // Lock body scroll
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [item, onClose])

  const paragraphs = item?.body?.split(/\n\n+/) ?? []

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200] bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-y-0 right-0 z-[201] w-full max-w-xl bg-paper shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-8 pt-10 pb-6 border-b border-ink/10 flex-shrink-0">
              <div>
                <span className="font-mono text-xs text-muted tracking-widest uppercase">
                  {item.type === 'poem' ? 'Poem' : 'Article'} — {item.date}
                </span>
                <h2 className="font-display text-3xl md:text-4xl text-ink tracking-wide leading-tight mt-2">
                  {item.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="mt-1 flex-shrink-0 w-8 h-8 flex items-center justify-center border border-ink/15 text-muted hover:border-accent hover:text-accent transition-colors ml-4"
                data-hover
              >
                <X size={14} />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
              <div className="max-w-prose">
                {item.type === 'poem' ? (
                  // Poems: preserve line breaks
                  <pre className="font-body text-sm text-ink/80 leading-[1.95] whitespace-pre-wrap font-light">
                    {item.body}
                  </pre>
                ) : (
                  // Articles: paragraph blocks
                  <div className="space-y-5">
                    {paragraphs.map((p, i) => (
                      <p key={i} className="font-body text-sm text-ink/80 leading-relaxed font-light">
                        {p}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-ink/10 flex-shrink-0">
              <span className="font-mono text-xs text-muted/40">
                Aniruddh Ballal
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}