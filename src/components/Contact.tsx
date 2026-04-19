import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { GitFork, Link, Mail, FileText, ArrowUpRight } from 'lucide-react'

const links = [
  { icon: Mail, label: 'Email', value: 'aniruddhballaldeeksha@gmail.com', href: 'mailto:aniruddhballaldeeksha@gmail.com' },
  { icon: GitFork, label: 'GitHub', value: 'aniruddhballal', href: 'https://github.com/aniruddhballal' },
  { icon: Link, label: 'LinkedIn', value: 'aniruddh-ballal', href: 'https://www.linkedin.com/in/aniruddh-ballal-979797276/' },
  { icon: FileText, label: 'Resume', value: 'Download PDF', href: '/resume.pdf' },
]

export default function Contact() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bgX = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  return (
    <section ref={ref} id="contact" className="bg-ink text-paper py-16 md:py-28 overflow-hidden relative">
      {/* Parallax background word */}
      <motion.div
        style={{ x: bgX }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="font-display text-[18vw] text-paper/[0.03] whitespace-nowrap">
          CONTACT
        </span>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">

        {/* Mobile: stacked. Desktop: 2-col */}
        <div className="flex flex-col md:grid md:grid-cols-12 md:gap-12 md:items-start">

          {/* Heading */}
          <div className="md:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <span className="w-8 h-px bg-accent" />
                <span className="font-mono text-xs text-paper/40 tracking-widest uppercase">
                  Get in touch
                </span>
              </div>

              <h2 className="font-display text-5xl md:text-7xl text-paper tracking-wide leading-none mb-5 md:mb-6">
                LET'S<br />
                BUILD<br />
                SOMETHING<br />
                <span className="text-accent">TOGETHER<span className="text-paper">.</span></span>
              </h2>

              <p className="font-body text-sm text-paper/50 leading-relaxed max-w-sm font-light">
                Open to full-time roles, freelance projects, and interesting side
                collaborations. If you're building something ambitious, I'd love
                to hear about it.
              </p>

              <motion.a
                href="mailto:aniruddhballaldeeksha@gmail.com"
                className="inline-flex items-center gap-2 mt-7 md:mt-8 bg-accent text-paper px-6 md:px-8 py-3 md:py-4 font-body text-sm font-medium hover:bg-accent-light transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send me an email
                <ArrowUpRight size={14} />
              </motion.a>
            </motion.div>
          </div>

          {/* Links */}
          <div className="md:col-span-6 md:pt-24 mt-12 md:mt-0">
            <div className="space-y-0 border-t border-paper/10">
              {links.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-5 md:py-6 border-b border-paper/10 group hover:px-2 transition-all duration-200"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  data-hover
                >
                  <div className="flex items-center gap-4">
                    <link.icon size={14} className="text-paper/30 group-hover:text-accent transition-colors flex-shrink-0" />
                    <div>
                      <p className="font-mono text-xs text-paper/40 mb-0.5">{link.label}</p>
                      <p className="font-body text-sm text-paper group-hover:text-accent transition-colors break-all">
                        {link.value}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-paper/20 group-hover:text-accent transition-colors flex-shrink-0 ml-3"
                  />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
