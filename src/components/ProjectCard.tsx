import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/projects'

interface Props {
  project: Project
  index: number
}

export default function ProjectCard({ project, index }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-ink/10 last:border-b-0"
    >
      <div
        className="group flex items-start gap-6 py-8 px-0 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
        data-hover
      >
        {/* Number */}
        <span className="font-mono text-xs text-muted/50 pt-1 w-8 flex-shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Color dot */}
        <div
          className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-150"
          style={{ backgroundColor: project.color }}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-3xl text-ink tracking-wide group-hover:text-accent transition-colors duration-200">
                {project.name}
              </h3>
              <p className="font-body text-sm text-muted mt-1">{project.tagline}</p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 pt-1">
              <span className="font-mono text-xs text-muted/50">{project.year}</span>
              <motion.div
                animate={{ rotate: expanded ? 45 : 0 }}
                transition={{ duration: 0.25 }}
                className="w-8 h-8 border border-ink/15 flex items-center justify-center text-muted group-hover:border-accent group-hover:text-accent transition-colors"
              >
                <ArrowUpRight size={14} />
              </motion.div>
            </div>
          </div>

          {/* Tags always visible */}
          <div className="flex gap-2 flex-wrap mt-3">
            {project.tech.map(t => (
              <span key={t} className="font-mono text-xs px-2 py-0.5 bg-ink/5 text-ink/50">
                {t}
              </span>
            ))}
            <span className="font-mono text-xs px-2 py-0.5 border border-ink/10 text-muted">
              {project.category}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded description */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pl-[3.25rem] pb-8 flex items-start justify-between gap-8">
              <div
                className="w-1 self-stretch flex-shrink-0"
                style={{ backgroundColor: project.color }}
              />
              <div className="flex-1">
                <p className="font-body text-sm text-muted leading-relaxed max-w-2xl">
                  {project.description}
                </p>
                <motion.a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 font-mono text-xs text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors"
                  whileHover={{ x: 3 }}
                  onClick={e => e.stopPropagation()}
                >
                  <ExternalLink size={11} />
                  Visit live site
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
