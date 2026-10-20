import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, ArrowUpRight, GitFork, LockKeyhole } from 'lucide-react'
import type { Project } from '../data/projects'

interface Props {
  project: Project
  index: number
  featured?: boolean
}

export default function ProjectCard({ project, index, featured = false }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`${featured ? 'border border-ink/10 bg-paper' : 'border-b border-ink/10 last:border-b-0'}`}
    >
      <div
        className={`group flex items-start gap-3 md:gap-6 cursor-pointer ${featured ? 'p-5 md:p-7 min-h-64' : 'py-6 md:py-8'}`}
        onClick={() => setExpanded(e => !e)}
        data-hover
      >
        {/* Number — hidden on smallest screens */}
        <span className="hidden sm:block font-mono text-xs text-muted/50 pt-1 w-8 flex-shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Color dot */}
        <div
          className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full mt-1.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-150"
          style={{ backgroundColor: project.color }}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
          <h3 className={`font-display ${featured ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'} text-ink tracking-wide group-hover:text-accent transition-colors duration-200 leading-tight`}>
                {project.name}
              </h3>
          <p className="font-body text-xs md:text-sm text-muted mt-2 max-w-md leading-relaxed">{project.tagline}</p>
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 pt-1">
              <span className="hidden sm:block font-mono text-xs text-muted/50">{project.year}</span>
              <motion.div
                animate={{ rotate: expanded ? 45 : 0 }}
                transition={{ duration: 0.25 }}
                className="w-7 h-7 md:w-8 md:h-8 border border-ink/15 flex items-center justify-center text-muted group-hover:border-accent group-hover:text-accent transition-colors"
              >
                <ArrowUpRight size={13} />
              </motion.div>
            </div>
          </div>

          {/* Tags */}
        <div className="flex gap-1.5 md:gap-2 flex-wrap mt-4 md:mt-5">
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
            <div className="pl-5 sm:pl-[3.25rem] pb-6 md:pb-8 flex items-start gap-4 md:gap-8">
              <div
                className="w-0.5 self-stretch flex-shrink-0"
                style={{ backgroundColor: project.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-ink/70 leading-relaxed max-w-2xl">
                  {project.description}
                </p>

                {/* Action buttons */}
                <div className="flex items-center gap-3 mt-5 flex-wrap">
                  {/* Live site */}
                  {project.url ? (
                    <motion.a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 bg-ink text-paper hover:bg-accent transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={e => e.stopPropagation()}
                    >
                      <ExternalLink size={11} />
                      Live site
                    </motion.a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 border border-ink/10 text-muted/40 cursor-default select-none">
                      <ExternalLink size={11} />
                      Not deployed
                    </span>
                  )}

                  {/* Repo */}
                  {project.repo ? (
                    <motion.a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 border border-ink/15 text-ink hover:border-ink hover:text-ink transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={e => e.stopPropagation()}
                    >
                      <GitFork size={11} />
                      Source
                    </motion.a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 border border-ink/10 text-muted/40 cursor-default select-none">
                      <LockKeyhole size={11} />
                      Private repo
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
