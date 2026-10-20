import { motion } from 'framer-motion'
import { ArrowUpRight, FileText, GitFork, Link, Mail } from 'lucide-react'
import { profile } from '../data/profile'

const links = [
  { icon: Mail, label: 'Email', value: 'aniruddhballaldeeksha@gmail.com', href: 'mailto:aniruddhballaldeeksha@gmail.com' },
  { icon: GitFork, label: 'GitHub', value: 'aniruddhballal', href: 'https://github.com/aniruddhballal' },
  { icon: Link, label: 'LinkedIn', value: 'aniruddh-ballal', href: 'https://www.linkedin.com/in/aniruddh-ballal-979797276/' },
  { icon: FileText, label: 'Resume', value: 'Download PDF', href: '/resume.pdf' },
]

export default function Contact() {
  return (
    <section id="contact" className="bg-ink text-paper py-16 md:py-28 overflow-hidden relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-display text-[20vw] text-paper/[0.03] whitespace-nowrap">CONNECT</span>
      </div>
      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid md:grid-cols-12 gap-12 md:gap-16">
          <motion.div className="md:col-span-6" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-accent" />
              <span className="font-mono text-xs text-paper/60 tracking-widest uppercase">Next system</span>
            </div>
            <h2 className="font-display text-6xl md:text-8xl text-paper tracking-wide leading-[0.85]">
              BUILD<br /><span className="text-accent">WHAT'S</span><br />NEXT<span className="text-accent">.</span>
            </h2>
            <p className="font-body text-sm text-paper/65 leading-relaxed max-w-md mt-7 font-light">
              {profile.availability} I’m especially interested in scientific computing, full-stack systems, and products that need their complexity made understandable.
            </p>
            <a href="mailto:aniruddhballaldeeksha@gmail.com" className="inline-flex items-center gap-2 mt-8 bg-accent text-paper px-6 py-3 font-body text-sm font-medium hover:bg-accent-light transition-colors">
              Send me an email <ArrowUpRight size={15} />
            </a>
          </motion.div>

          <div className="md:col-span-6 md:pt-16">
            <p className="font-mono text-xs text-paper/45 tracking-widest uppercase mb-4">Find the work</p>
            <div className="border-t border-paper/15">
              {links.map((link, i) => {
                const Icon = link.icon
                return (
                  <motion.a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex items-center gap-4 py-5 border-b border-paper/15 group" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <Icon size={16} className="text-accent" />
                    <span className="font-mono text-xs text-paper/50 w-20">{link.label}</span>
                    <span className="font-body text-sm text-paper group-hover:text-accent transition-colors">{link.value}</span>
                    <ArrowUpRight size={14} className="ml-auto text-paper/40 group-hover:text-accent transition-colors" />
                  </motion.a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
