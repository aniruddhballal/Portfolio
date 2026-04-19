import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import GitHubStatsBlock from './GitHubStatsBlock'

const skills = [
  { label: 'Systems Thinking', value: 88 },
  { label: 'Real-World Systems Modeling', value: 75 },
  { label: 'Full-Stack Engineering', value: 90 },
  { label: 'Debugging & Problem Solving', value: 92 },
  { label: 'Architecture & Design', value: 80 },
]

const timeline = [
  { year: '2026', event: 'Moving toward simulation and real-world system modeling' },
  { year: '2025', event: 'Rapidly built and deployed multiple real-world systems' },
  { year: '2024', event: 'Started building — quickly went deep into full-stack engineering' },
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
                <span className="text-accent">MODELS,</span><br />
                NOT JUST<br />
                RUNS<span className="text-accent">.</span>
              </h2>

              <div className="space-y-4 font-body text-sm text-muted leading-relaxed font-light">
                <p>
                  Modeling & systems engineer based in Bengaluru. I build systems grounded in real-world behavior — from physical simulations to scalable software.
                </p>
                <p>
                  I focus on understanding how things actually work, then translating that into reliable, usable products — not just technically correct implementations.
                </p>
                <p>
                  When I'm not building, I'm studying physics, exploring system design, or breaking down complex ideas to their fundamentals.
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

            {/* GitHub stats */}
            <motion.div
              style={{ y: imgY }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <GitHubStatsBlock />

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-0 border border-t-0 border-ink/10">
                {[
                  { n: '15+', l: 'Systems built' },
                  { n: '2+',  l: 'Years of rapid iteration' },
                  { n: '∞',   l: 'Curiosity' },
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
