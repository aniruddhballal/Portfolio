import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const navBg = useTransform(scrollY, [0, 80], ['rgba(245,242,236,0)', 'rgba(245,242,236,0.92)'])

  useEffect(() => {
    return scrollY.onChange(v => setScrolled(v > 50))
  }, [scrollY])

  const links = ['Work', 'About', 'Contact']

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <motion.nav
        style={{ backgroundColor: navBg }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8 h-14 md:h-16 flex items-center justify-between">
          <motion.a
            href="#"
            className="font-display text-2xl text-ink tracking-wider"
            whileHover={{ scale: 1.03 }}
            onClick={closeMenu}
          >
            AB<span className="text-accent">.</span>
          </motion.a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
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
              href="mailto:aniruddhballaldeeksha@gmail.com"
              className="font-mono text-xs px-4 py-2 border border-ink text-ink hover:bg-ink hover:text-paper transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Hire me
            </motion.a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-ink p-1"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-paper flex flex-col justify-center px-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="space-y-8">
              {links.map((l, i) => (
                <motion.a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  className="block font-display text-6xl text-ink tracking-wide hover:text-accent transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={closeMenu}
                >
                  {l.toUpperCase()}
                </motion.a>
              ))}
              <motion.a
                href="mailto:aniruddhballaldeeksha@gmail.com"
                className="inline-block font-mono text-sm px-6 py-3 border border-ink text-ink mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={closeMenu}
              >
                Hire me
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
