import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const skills = [
  { label: 'Frontend', value: 90 },
  { label: 'Backend / APIs', value: 85 },
  { label: 'Databases', value: 78 },
  { label: 'DevOps / Cloud', value: 65 },
  { label: 'System Design', value: 72 },
]

const timeline = [
  { year: '2026', event: 'Currently building & shipping' },
  { year: '2024', event: 'Launched 4 production apps' },
  { year: '2023', event: 'Went deep on backend & infra' },
  { year: '2022', event: 'Started full-stack journey' },
]

export default function About() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <section ref={ref} id="about" className="bg-paper-dark py-16 md:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-8">

        {/* Mobile: single column. Desktop: 2-col grid */}
        <div className="flex flex-col md:grid md:grid-cols-12 md:gap-16">

          {/* Left col */}
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-accent" />
                <span className="font-mono text-xs text-muted tracking-widest uppercase">About</span>
              </div>

              <h2 className="font-display text-5xl md:text-6xl text-ink tracking-wide leading-none mb-7 md:mb-8">
                CODE THAT<br />
                <span className="text-accent">WORKS,</span><br />
                NOT JUST<br />
                RUNS<span className="text-accent">.</span>
              </h2>

              <div className="space-y-4 font-body text-sm text-muted leading-relaxed font-light">
                <p>
                  Full-stack developer based in Bengaluru. I focus on building
                  products that are fast, reliable, and actually used — not just
                  technically correct.
                </p>
                <p>
                  I care about the whole stack, from database query performance
                  to button hover states. The best software is invisible — it
                  just works, and people trust it.
                </p>
                <p>
                  When I'm not shipping, I'm reading about distributed systems,
                  contributing to open source, or experimenting with new tools
                  before they're mainstream.
                </p>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              className="mt-10 md:mt-12 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {timeline.map((t, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="font-mono text-xs text-accent w-10 flex-shrink-0">{t.year}</span>
                  <div className="flex-1 h-px bg-ink/10" />
                  <span className="font-body text-xs text-muted text-right">{t.event}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right col */}
          <div className="md:col-span-7 mt-12 md:mt-0">
            {/* Skills */}
            <motion.div
              className="mb-10 md:mb-12"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-mono text-xs text-muted tracking-widest uppercase mb-5 md:mb-6">
                Proficiency
              </p>
              <div className="space-y-5">
                {skills.map((s, i) => (
                  <div key={s.label}>
                    <div className="flex justify-between mb-2">
                      <span className="font-body text-sm text-ink">{s.label}</span>
                      <span className="font-mono text-xs text-muted">{s.value}%</span>
                    </div>
                    <div className="h-px bg-ink/10 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-accent"
                        style={{ height: '1.5px', top: '-0.25px' }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Location / stats block */}
            <motion.div
              className="relative"
              style={{ y: imgY }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="w-full h-40 md:h-56 bg-paper border border-ink/10 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-3xl md:text-5xl text-ink/10 tracking-widest">
                    BENGALURU
                  </span>
                </div>
                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-accent" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent" />
                <div className="absolute bottom-3 left-6 md:bottom-4 md:left-8">
                  <span className="font-mono text-xs text-muted/50">12.9716° N, 77.5946° E</span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-0 border border-t-0 border-ink/10">
                {[
                  { n: '10+', l: 'Projects shipped' },
                  { n: '4+', l: 'Years building' },
                  { n: '∞', l: 'Coffees consumed' },
                ].map((s, i) => (
                  <div key={i} className={`p-4 md:p-5 ${i < 2 ? 'border-r border-ink/10' : ''}`}>
                    <p className="font-display text-2xl md:text-3xl text-ink tracking-wide">{s.n}</p>
                    <p className="font-mono text-xs text-muted mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
