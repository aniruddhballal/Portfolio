import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, BookOpen, Palette, Timer } from 'lucide-react'
import { creativeItems } from '../data/creative'
import type { CreativeItem } from '../data/creative'
import CreativeModal from './CreativeModal'
import StravaStats from './StravaStats/StravaStats'

export default function BeyondCode() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState<CreativeItem | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'start 20%'] })
  const headingX = useTransform(scrollYProgress, [0, 1], ['-2%', '2%'])
  const poems = creativeItems.filter(item => item.type === 'poem')
  const articles = creativeItems.filter(item => item.type === 'article')
  const sketches = creativeItems.filter(item => item.type === 'sketch')

  const writingCard = (item: CreativeItem) => (
    <motion.button
      key={item.id}
      onClick={() => setActive(item)}
      className="w-full text-left p-5 md:p-6 border-t border-ink/10 group hover:bg-paper transition-colors"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      data-hover
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-2xl text-ink tracking-wide group-hover:text-accent transition-colors leading-tight">{item.title}</h3>
        <ArrowUpRight size={16} className="text-muted group-hover:text-accent shrink-0 mt-1" />
      </div>
      <p className="font-mono text-[10px] text-muted mt-2">{item.date}</p>
      <p className="font-body text-xs text-muted leading-relaxed mt-3 line-clamp-2">{item.excerpt}</p>
    </motion.button>
  )

  return (
    <>
      <section ref={ref} id="beyond" className="bg-paper py-16 md:py-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="flex items-end gap-4 mb-3">
            <span className="font-mono text-xs text-muted tracking-widest uppercase">Personal practice</span>
            <div className="flex-1 h-px bg-ink/10" />
          </div>
          <motion.h2 style={{ x: headingX }} className="font-display text-[13vw] md:text-[9vw] leading-none tracking-wide text-ink">
            BEYOND CODE<span className="text-accent">.</span>
          </motion.h2>
          <p className="font-body text-sm text-muted font-light mt-5 max-w-xl leading-relaxed">
            The same curiosity shows up in different forms: questions I write down, images I make, and distance I keep returning to.
          </p>

          <div className="grid md:grid-cols-2 gap-5 mt-12 md:mt-16">
            <div className="border border-ink/10 bg-paper-dark">
              <div className="flex items-center gap-3 p-5 md:p-6 border-b border-ink/10">
                <BookOpen size={18} className="text-accent" />
                <div>
                  <p className="font-mono text-xs text-muted uppercase tracking-widest">Writing</p>
                  <p className="font-body text-sm text-ink mt-1">Poems and questions without clean edges.</p>
                </div>
              </div>
              {poems.map(writingCard)}
            </div>
            <div className="border border-ink/10 bg-paper-dark">
              <div className="flex items-center gap-3 p-5 md:p-6 border-b border-ink/10">
                <BookOpen size={18} className="text-accent" />
                <div>
                  <p className="font-mono text-xs text-muted uppercase tracking-widest">Research notes</p>
                  <p className="font-body text-sm text-ink mt-1">Consciousness, ecology, and strange worlds.</p>
                </div>
              </div>
              {articles.map(writingCard)}
            </div>
          </div>

          <div className="mt-16 md:mt-24">
            <div className="flex items-center gap-3 mb-6">
              <Palette size={18} className="text-accent" />
              <span className="font-mono text-xs text-muted tracking-widest uppercase">Visual archive</span>
              <div className="flex-1 h-px bg-ink/10" />
              <span className="font-mono text-xs text-muted">{sketches.length} works</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {sketches.map((item, i) => (
                <motion.div key={item.id} className="group relative aspect-square bg-paper-dark border border-ink/10 overflow-hidden" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <img src={item.imagePath} alt={item.imageAlt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-ink/75 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="font-display text-lg text-paper tracking-wide">{item.title}</p>
                    <p className="font-mono text-[10px] text-paper/70 mt-1">{item.medium} · {item.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-16 md:mt-24">
            <div className="flex items-center gap-3 mb-6">
              <Timer size={18} className="text-accent" />
              <span className="font-mono text-xs text-muted tracking-widest uppercase">Endurance</span>
              <div className="flex-1 h-px bg-ink/10" />
              <span className="font-mono text-xs text-muted">run · ride · repeat</span>
            </div>
            <StravaStats />
          </div>
        </div>
      </section>
      <CreativeModal item={active} onClose={() => setActive(null)} />
    </>
  )
}
