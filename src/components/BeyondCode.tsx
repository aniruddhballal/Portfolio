import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { creativeItems } from '../data/creative'
import type { CreativeItem } from '../data/creative'
import CreativeModal from './CreativeModal'

// ── Strava data (hardcoded — update manually or swap for API later) ──────
const runningStats = {
  allTime: { activities: 260, distanceKm: 1305.3, timeHours: 117.5, elevGainM: 7030 },
  last4Weeks: { activitiesPerWeek: 8, avgDistKm: 48.6, avgTimeHm: '4h 5m', elevGainM: 119 },
  pbs: [
    { label: '5K (1st December 2025)',           time: '20:44' },
    { label: '10K (7th April 2026)',          time: '46:02' },
    { label: '15K (9th April 2026)',          time: '1:15:48' },
    { label: 'Half-Marathon (26th January 2026)',time: '1:57:42' },
    { label: '30K (15th November 2025)',          time: '3:13:44' },
    { label: 'Marathon (15th November 2025)',     time: '4:32:14' },
    { label: '50K (15th November 2025)',          time: '5:24:45' },
  ],
}

const cyclingStats = {
  allTime: { activities: 135, distanceKm: 2059.7, timeHours: 216.9, elevGainM: 15297 },
  pbs: [
    { label: '5K (9th July 2025)',  time: '7:51' },
    { label: '10K (9th July 2025)',  time: '16:49' },
    { label: '20K (9th July 2025)',  time: '38:14' },
    { label: '30K (9th July 2025)',  time: '57:30' },
    { label: '40K (9th July 2025)',  time: '1:20:04' },
    { label: '50K (9th July 2025)',  time: '1:44:05' },
    { label: '77.8K (1st May 2024)', time: '3:22:52' },
  ],
}

const STRAVA_URL = 'https://www.strava.com/athletes/111442086'

export default function BeyondCode() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState<CreativeItem | null>(null)
    const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'start 20%']
  })
  const headingX = useTransform(scrollYProgress, [0, 1], ['-3%', '3%'])

  const poems    = creativeItems.filter(i => i.type === 'poem')
  const articles = creativeItems.filter(i => i.type === 'article')
  const sketches = creativeItems.filter(i => i.type === 'sketch')

  return (
    <>
      <section ref={ref} id="beyond" className="bg-paper-dark py-16 md:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-8">

          {/* ── Section heading ── */}
          <div className="mb-12 md:mb-16 overflow-hidden">
            <div className="flex items-end gap-4 md:gap-6 mb-2">
              <motion.span
                className="font-mono text-xs text-muted tracking-widest uppercase whitespace-nowrap"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Writing, art & sport
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
              className="font-display text-[13vw] md:text-[9vw] leading-none tracking-wide text-ink"
            >
              BEYOND CODE<span className="text-accent">.</span>
            </motion.h2>
            <motion.p
              className="font-body text-sm text-muted font-light mt-4 max-w-lg"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Systems thinking bleeds into everything. Some of it ends up as code. The rest ends up here.
            </motion.p>
          </div>

          {/* Writing — poems + articles side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-ink/10 mb-12 md:mb-16">

            {/* Poems */}
            <div className="border-b md:border-b-0 md:border-r border-ink/10">
              <div className="px-6 py-4 border-b border-ink/10">
                <span className="font-mono text-xs text-muted tracking-widest uppercase">Poems</span>
              </div>
              {poems.map((item, i) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActive(item)}
                  className={`w-full text-left px-6 py-5 group hover:bg-paper transition-colors duration-150 ${i < poems.length - 1 ? 'border-b border-ink/10' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  data-hover
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3
                      className="font-display text-xl text-ink tracking-wide group-hover:text-accent transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <span className="font-mono text-xs text-muted/50 flex-shrink-0 mt-1">{item.date}</span>
                  </div>
                  <p className="font-body text-xs text-muted leading-relaxed font-light line-clamp-2">
                    {item.excerpt}
                  </p>
                  <span
                    className="font-mono text-xs text-accent mt-3 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                    Read →
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Articles */}
            <div>
              <div className="px-6 py-4 border-b border-ink/10">
                <span className="font-mono text-xs text-muted tracking-widest uppercase">Articles</span>
              </div>
              {articles.map((item, i) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActive(item)}
                  className={`w-full text-left px-6 py-5 group hover:bg-paper transition-colors duration-150 ${i < articles.length - 1 ? 'border-b border-ink/10' : ''}`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  data-hover
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3
                      className="font-display text-xl text-ink tracking-wide group-hover:text-accent transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <span className="font-mono text-xs text-muted/50 flex-shrink-0 mt-1">{item.date}</span>
                  </div>
                  <p className="font-body text-xs text-muted leading-relaxed font-light line-clamp-2">
                    {item.excerpt}
                  </p>
                  <span
                    className="font-mono text-xs text-accent mt-3 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                    Read →
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* ── Sketches ── */}
          <div className="mb-12 md:mb-16">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs text-muted tracking-widest uppercase">Sketches & paintings</span>
              <div className="flex-1 h-px bg-ink/10" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {sketches.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="group relative aspect-square bg-paper border border-ink/10 overflow-hidden cursor-pointer"
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  whileHover={{ scale: 1.02 }}
                  data-hover
                >
                  {/* Image */}
                  <img
                    src={item.imagePath}
                    alt={item.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      // Graceful fallback if image not found
                      const t = e.currentTarget
                      t.style.display = 'none'
                      ;(t.nextElementSibling as HTMLElement)?.classList.remove('hidden')
                    }}
                  />
                  {/* Placeholder shown if image missing */}
                  <div className="hidden absolute inset-0 flex flex-col items-center justify-center p-3">
                    <span className="font-mono text-xs text-muted/30 text-center leading-relaxed">
                      {item.imagePath}
                    </span>
                  </div>
                  <div
                    className="absolute inset-0 bg-ink/0 group-hover:bg-ink/50 transition-colors duration-300 flex flex-col justify-end p-3">
                    <div
                      className="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="font-display text-sm text-paper tracking-wide leading-tight">
                        {item.title}
                      </p>
                      {item.medium && (
                        <p className="font-mono text-xs text-paper/60 mt-0.5">{item.medium}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Endurance ── */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs text-muted tracking-widest uppercase">Endurance</span>
              <div className="flex-1 h-px bg-ink/10" />
              <motion.a
                href={STRAVA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-xs text-muted border border-ink/15 px-3 py-1.5 hover:border-accent hover:text-accent transition-colors flex-shrink-0"
                whileHover={{ scale: 1.02 }}
                data-hover
              >
                {/* Strava-ish icon using SVG */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0 0 13.828h4.172"/>
                </svg>
                View on Strava
              </motion.a>
            </div>

            {/* Running + Cycling side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

              {/* Running */}
              <motion.div
                className="border border-ink/10 overflow-hidden"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="px-5 py-4 border-b border-ink/10 flex items-center justify-between">
                  <span className="font-mono text-xs text-muted tracking-widest uppercase">Running (as of 21st April 2026)</span>
                  <span className="font-mono text-xs text-muted/40">
                    {runningStats.allTime.activities} activities · {runningStats.allTime.distanceKm.toLocaleString()} km
                  </span>
                </div>

                {/* Weekly snapshot */}
                <div className="grid grid-cols-3 gap-0 border-b border-ink/10">
                  {[
                    { n: `${runningStats.last4Weeks.avgDistKm} km`, l: 'Avg / week' },
                    { n: runningStats.last4Weeks.avgTimeHm, l: 'Time / week' },
                    { n: `${runningStats.last4Weeks.activitiesPerWeek}`, l: 'Runs / week' },
                  ].map((s, i) => (
                    <div key={i} className={`px-4 py-4 ${i < 2 ? 'border-r border-ink/10' : ''}`}>
                      <p className="font-display text-2xl text-ink tracking-wide leading-none">{s.n}</p>
                      <p className="font-mono text-xs text-muted mt-1">{s.l}</p>
                    </div>
                  ))}
                </div>

                {/* PBs */}
                <div className="px-5 py-3 border-b border-ink/10">
                  <span className="font-mono text-xs text-muted/50 tracking-widest uppercase">Personal bests</span>
                </div>
                <div className="divide-y divide-ink/[0.06]">
                  {runningStats.pbs.map((pb, i) => (
                    <motion.div
                      key={pb.label}
                      className="flex items-center justify-between px-5 py-2.5"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                    >
                      <span className="font-body text-sm text-muted">{pb.label}</span>
                      <span className="font-mono text-sm text-ink font-medium">{pb.time}</span>
                    </motion.div>
                  ))}
                </div>

                {/* All-time footer */}
                <div className="px-5 py-3 bg-ink/[0.02]">
                  <span className="font-mono text-xs text-muted/50">{runningStats.allTime.timeHours}h total · {runningStats.allTime.elevGainM.toLocaleString()}m elevation</span>
                </div>
              </motion.div>

              {/* Cycling */}
              <motion.div
                className="border border-ink/10 overflow-hidden"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="px-5 py-4 border-b border-ink/10 flex items-center justify-between">
                  <span className="font-mono text-xs text-muted tracking-widest uppercase">Cycling (As of 9th July 2025)</span>
                  <span className="font-mono text-xs text-muted/40">
                    {cyclingStats.allTime.activities} activities
                  </span>
                </div>

                {/* All-time stats */}
                <div className="grid grid-cols-3 gap-0 border-b border-ink/10">
                  {[
                    { n: `${cyclingStats.allTime.distanceKm.toLocaleString()} km`, l: 'Total distance' },
                    { n: `${cyclingStats.allTime.timeHours}h`, l: 'Total time' },
                    { n: `${(cyclingStats.allTime.elevGainM / 1000).toFixed(1)}k m`, l: 'Elevation' },
                  ].map((s, i) => (
                    <div key={i} className={`px-4 py-4 ${i < 2 ? 'border-r border-ink/10' : ''}`}>
                      <p className="font-display text-xl md:text-2xl text-ink tracking-wide leading-none">{s.n}</p>
                      <p className="font-mono text-xs text-muted mt-1">{s.l}</p>
                    </div>
                  ))}
                </div>

                {/* PBs */}
                <div className="px-5 py-3 border-b border-ink/10">
                  <span className="font-mono text-xs text-muted/50 tracking-widest uppercase">Personal bests</span>
                </div>
                <div className="divide-y divide-ink/[0.06]">
                  {cyclingStats.pbs.map((pb, i) => (
                    <motion.div
                      key={pb.label}
                      className="flex items-center justify-between px-5 py-2.5"
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                    >
                      <span className="font-body text-sm text-muted">{pb.label}</span>
                      <span className="font-mono text-sm text-ink font-medium">{pb.time}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Note */}
                <div className="px-5 py-3 bg-ink/[0.02]">
                  <span className="font-mono text-xs text-muted/50">Ultramarathon · Triathlon · Self-supported</span>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </section>

      <CreativeModal item={active} onClose={() => setActive(null)} />
    </>
  )
}