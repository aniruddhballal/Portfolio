import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const navBg = useTransform(scrollY, [0, 80], ['rgba(245,242,236,0)', 'rgba(245,242,236,0.92)'])

  useEffect(() => {
    return scrollY.onChange(v => setScrolled(v > 50))
  }, [scrollY])

  const links = ['Work', 'About', 'Contact']

  return (
    <motion.nav
      style={{ backgroundColor: navBg }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
        <motion.a
          href="#"
          className="font-display text-2xl text-ink tracking-wider"
          whileHover={{ scale: 1.03 }}
        >
          AB<span className="text-accent">.</span>
        </motion.a>

        <div className="flex items-center gap-8">
          {links.map(l => (
            <motion.a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="font-body text-sm text-muted hover:text-ink transition-colors relative group"
              whileHover={{ y: -1 }}
            >
              {l}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
          <motion.a
            href="mailto:you@email.com"
            className="font-mono text-xs px-4 py-2 border border-ink text-ink hover:bg-ink hover:text-paper transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Hire me
          </motion.a>
        </div>
      </div>

      {scrolled && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-ink/10"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </motion.nav>
  )
}
