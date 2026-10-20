import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ProjectCard from './ProjectCard'
import { projects } from '../data/projects'

const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))]

export default function Projects() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState('All')
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'start 20%']
  })
  const headingX = useTransform(scrollYProgress, [0, 1], ['-3%', '3%'])

  const filtered = active === 'All' ? projects : projects.filter(p => p.category === active)

  return (
    <section ref={ref} id="work" className="bg-paper py-16 md:py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-8">

        {/* Section heading */}
        <div className="mb-10 md:mb-16 overflow-hidden">
          <div className="flex items-end gap-4 md:gap-6 mb-2">
            <motion.span
              className="font-mono text-xs text-muted tracking-widest uppercase whitespace-nowrap"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Selected systems
            </motion.span>
            <motion.div
              className="flex-1 h-px bg-ink/10 mb-1"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>

          <motion.h2
            style={{ x: headingX }}
            className="font-display text-[16vw] md:text-[10vw] leading-none tracking-wide text-ink"
          >
            SYSTEMS<span className="text-accent">.</span>
          </motion.h2>
        </div>

        {/* Filter pills — horizontal scroll on mobile */}
        <motion.div
          className="flex gap-2 flex-nowrap overflow-x-auto pb-2 md:flex-wrap md:overflow-visible mb-8 md:mb-10 scrollbar-none"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`font-mono text-xs px-3 py-1.5 border transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                active === c
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-transparent text-muted border-ink/15 hover:border-ink/40 hover:text-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </motion.div>

        {/* Count */}
        <motion.p
          className="font-body text-sm md:text-base text-muted max-w-xl mb-8 leading-relaxed"
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          A working archive of simulations, financial workflows, developer infrastructure, and tools built to make complexity legible.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {projects.filter(project => project.category === 'Simulation').map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} featured />
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-ink/10 pt-4 mb-2">
          <span className="font-mono text-xs text-muted tracking-widest uppercase">The full archive</span>
          <span className="font-mono text-xs text-muted">{filtered.length} systems</span>
        </div>

        {/* Project list */}
        <div className="border-t border-ink/10">
            {filtered.filter(project => project.category !== 'Simulation').map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
