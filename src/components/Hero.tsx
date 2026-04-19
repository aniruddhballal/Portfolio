import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

const words = ['SCIENTIST', 'SYSTEMS THINKER', 'PROBLEM SOLVER', 'EXPLORER']

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  }
  const item = {
    hidden: { y: 60, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any } },
  }

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-paper">
      {/* Parallax background text */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="font-display text-[22vw] text-ink/[0.04] whitespace-nowrap leading-none tracking-widest">
          FULLSTACK
        </span>
      </motion.div>

      {/* Accent line — hidden on mobile */}
      <motion.div
        className="hidden md:block absolute top-0 right-1/4 w-px h-full bg-ink/10 origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-20 md:pt-24 pb-16 w-full">

        {/* Mobile: stacked layout */}
        <div className="flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center">

          {/* Photo — shown above name on mobile */}
          <motion.div
            className="md:hidden flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              <div className="w-36 h-44 bg-paper-dark border border-ink/10 relative overflow-hidden">
                <img
                  src="/aniruddh.jpg"
                  alt="Aniruddh Ballal"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 w-8 h-8 bg-accent" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-accent" />
              </div>
              <motion.div
                className="absolute -bottom-3 -left-4 bg-ink text-paper px-3 py-1.5 flex items-center gap-1.5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-xs">Open to work</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Text col */}
          <motion.div
            className="md:col-span-7"
            style={{ y: textY, opacity }}
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="flex items-center gap-3 mb-5">
              <span className="w-6 md:w-8 h-px bg-accent" />
              <span className="font-mono text-xs text-muted tracking-widest uppercase">
                Full-Stack Developer — Bengaluru
              </span>
            </motion.div>

            {/* Name — bigger on mobile since it's the hero statement */}
            <div className="overflow-hidden mb-1">
              <motion.h1 variants={item} className="font-display text-[18vw] md:text-[8.5vw] leading-[0.9] tracking-wide text-ink">
                ANIRUDDH
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-1">
              <motion.h1 variants={item} className="font-display text-[18vw] md:text-[8.5vw] leading-[0.9] tracking-wide text-accent">
                BALLAL
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-7">
              <motion.h1 variants={item} className="font-display text-[18vw] md:text-[8.5vw] leading-[0.9] tracking-wide text-ink">
                HERE<span className="text-accent">.</span>
              </motion.h1>
            </div>

            <motion.p
              variants={item}
              className="font-body text-sm md:text-base text-muted leading-relaxed max-w-md mb-7 font-light"
            >
              I build systems grounded in real-world models — from simulating physical dynamics to designing financial and product systems. I focus on understanding how things actually work, then turning that into usable, scalable tools.
            </motion.p>

            <motion.div variants={item} className="flex items-center gap-4 flex-wrap">
              <motion.a
                href="#work"
                className="flex items-center gap-2 bg-ink text-paper px-5 py-2.5 md:px-6 md:py-3 font-body text-sm font-medium hover:bg-accent transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                See my work
                <ArrowDown size={14} />
              </motion.a>
              <motion.a
                href="#contact"
                className="font-body text-sm text-muted hover:text-ink transition-colors underline underline-offset-4"
              >
                Get in touch
              </motion.a>
            </motion.div>

            {/* Stack pills */}
            <motion.div variants={item} className="flex gap-2 md:gap-3 flex-wrap mt-8 md:mt-10">
              {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'].map(s => (
                <span key={s} className="font-mono text-xs text-muted border border-ink/10 px-2.5 py-1">
                  {s}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Photo — desktop only (right column) */}
          <motion.div
            className="hidden md:flex md:col-span-5 flex-col items-end"
            style={{ y: photoY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              {/* Photo frame */}
              <div className="w-64 h-80 bg-paper-dark border border-ink/10 relative overflow-hidden">
                <img
                  src="/aniruddh.jpg"
                  alt="Aniruddh Ballal"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-accent" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-accent" />
              </div>

              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-4 -left-8 bg-ink text-paper px-4 py-2 flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-xs">Open to work</span>
              </motion.div>

              {/* Year badge */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-accent flex items-center justify-center"
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <span className="font-display text-paper text-lg leading-none">2026</span>
              </motion.div>
            </div>

            {/* Marquee words */}
            <div className="mt-16 overflow-hidden w-full">
              <motion.div
                className="flex gap-6 whitespace-nowrap"
                animate={{ x: [0, -400] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              >
                {[...words, ...words, ...words].map((w, i) => (
                  <span key={i} className="font-display text-2xl text-ink/15 tracking-widest flex-shrink-0">
                    {w} <span className="text-accent">✦</span>
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
