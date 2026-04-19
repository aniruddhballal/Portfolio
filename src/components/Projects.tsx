import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ProjectCard from './ProjectCard'
import { projects } from '../data/projects'

const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))]

export default function Projects() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState('All')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const headingX = useTransform(scrollYProgress, [0, 1], ['-3%', '3%'])

  const filtered = active === 'All' ? projects : projects.filter(p => p.category === active)

  return (
    <section ref={ref} id="work" className="bg-paper py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-8">

        {/* Section heading with parallax */}
        <div className="mb-16 overflow-hidden">
          <div className="flex items-end gap-6 mb-2">
            <motion.span
              className="font-mono text-xs text-muted tracking-widest uppercase"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Selected work
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
            className="font-display text-[10vw] leading-none tracking-wide text-ink"
          >
            PROJECTS<span className="text-accent">.</span>
          </motion.h2>
        </div>

        {/* Filter pills */}
        <motion.div
          className="flex gap-2 flex-wrap mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`font-mono text-xs px-3 py-1.5 border transition-all duration-200 ${
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
          className="font-mono text-xs text-muted/50 mb-4"
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filtered.length} project{filtered.length !== 1 ? 's' : ''}
        </motion.p>

        {/* Project list */}
        <div className="border-t border-ink/10">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
