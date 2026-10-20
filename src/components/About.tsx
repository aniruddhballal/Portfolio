import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import GitHubStatsBlock from './GitHubStatsBlock'
import { profile } from '../data/profile'

export default function About() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const headingX = useTransform(scrollYProgress, [0, 1], ['-2%', '2%'])

  return (
    <section ref={ref} id="about" className="bg-paper-dark py-16 md:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="flex items-end gap-4 mb-3">
          <span className="font-mono text-xs text-muted tracking-widest uppercase">Method & experience</span>
          <div className="flex-1 h-px bg-ink/10" />
        </div>
        <motion.h2 style={{ x: headingX }} className="font-display text-[15vw] md:text-[10vw] leading-none tracking-wide text-ink mb-12 md:mb-16">
          HOW I WORK<span className="text-accent">.</span>
        </motion.h2>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <motion.div className="md:col-span-5" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <h3 className="font-display text-5xl md:text-6xl leading-[0.9] tracking-wide mb-7">
              PHYSICS<br /><span className="text-accent">FIRST,</span><br />SYSTEMS<br />ALWAYS<span className="text-accent">.</span>
            </h3>
            <div className="space-y-4 font-body text-sm text-muted leading-relaxed font-light">
              <p>I start by understanding the system underneath the interface — its state, constraints, failure modes, and what makes it useful to a real person.</p>
              <p>That has meant modelling coronal magnetic fields at IISc, building real-time orbital simulations, and shipping production platforms for finance and operations.</p>
              <p>The common thread is end-to-end ownership: computation, data, interface, performance, and the explanation that lets someone else understand the result.</p>
            </div>
            <a href="/resume.pdf" className="inline-flex items-center gap-2 mt-8 font-mono text-xs text-ink border-b border-ink pb-2 hover:text-accent hover:border-accent transition-colors">
              Read the full resume <ArrowUpRight size={13} />
            </a>
          </motion.div>

          <div className="md:col-span-7 space-y-10">
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
              <div className="flex items-center justify-between border-b border-ink/10 pb-3 mb-1">
                <span className="font-mono text-xs text-muted tracking-widest uppercase">Experience</span>
                <span className="font-mono text-xs text-muted">the systems behind the work</span>
              </div>
              {profile.experience.map(item => (
                <div key={`${item.role}-${item.place}`} className="grid grid-cols-[82px_1fr] gap-4 py-4 border-b border-ink/10">
                  <span className="font-mono text-xs text-accent pt-1">{item.period}</span>
                  <div>
                    <h3 className="font-body text-sm font-medium text-ink">{item.role}</h3>
                    <p className="font-mono text-xs text-muted mt-1">{item.place}</p>
                    <p className="font-body text-xs text-muted mt-2 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
              <div className="flex items-center justify-between border-b border-ink/10 pb-3 mb-1">
                <span className="font-mono text-xs text-muted tracking-widest uppercase">Capabilities</span>
                <span className="font-mono text-xs text-muted">what I bring to a problem</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-px bg-ink/10 border border-ink/10">
                {profile.capabilities.map(capability => (
                  <div key={capability.title} className="bg-paper-dark p-4 md:p-5">
                    <h3 className="font-body text-sm text-ink font-medium">{capability.title}</h3>
                    <p className="font-body text-xs text-muted leading-relaxed mt-2">{capability.detail}</p>
                    <p className="font-mono text-[10px] text-accent mt-4 leading-relaxed">{capability.tools}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16 mt-16 md:mt-24">
          <div className="md:col-span-5">
            <p className="font-mono text-xs text-muted tracking-widest uppercase mb-4">Technical vocabulary</p>
            <div className="space-y-3">
              {profile.skillGroups.map(group => (
                <div key={group.label} className="border-t border-ink/10 pt-3">
                  <p className="font-mono text-xs text-accent">{group.label}</p>
                  <p className="font-body text-sm text-ink/75 mt-1 leading-relaxed">{group.values}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-mono text-xs text-muted tracking-widest uppercase">Engineering activity</p>
                <p className="font-body text-sm text-muted mt-2">A live pulse of the work behind the archive.</p>
              </div>
              <span className="font-display text-5xl text-accent">01</span>
            </div>
            <GitHubStatsBlock />
          </div>
        </div>
      </div>
    </section>
  )
}
