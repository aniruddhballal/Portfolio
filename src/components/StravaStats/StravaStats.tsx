import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, ArrowUpRight, Bike, Clock3, Footprints, Mountain } from 'lucide-react'
import stravaData from '../../data/strava.json'
import type { StravaData } from '../../data/strava-types'
import AllTimeCards from './AllTimeCards/AllTimeCards'
import ProgressionPanel from './ProgressionPanel/ProgressionPanel'
import { fmtDist, fmtHours } from './utils/strava-utils'

const data = stravaData as StravaData
const STRAVA_URL = 'https://www.strava.com/athletes/111442086'

type Tab = 'overall' | 'weekly' | 'monthly' | 'annual'

const TABS: { key: Tab; label: string }[] = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'annual', label: 'Annual' },
  { key: 'overall', label: 'Overall' },
]

function fmtNumber(value: number, fractionDigits = 0) {
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}

export default function StravaStats() {
  const [tab, setTab] = useState<Tab>('weekly')
  const totalDistance = data.run.allTime.distanceKm + data.ride.allTime.distanceKm
  const totalActivities = data.run.allTime.activities + data.ride.allTime.activities
  const totalTime = data.run.allTime.timeHours + data.ride.allTime.timeHours
  const totalElevation = data.run.allTime.elevGainM + data.ride.allTime.elevGainM
  const runShare = (data.run.allTime.distanceKm / totalDistance) * 100

  return (
    <div className="relative">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-8">
        <span className="font-mono text-xs text-muted tracking-widest uppercase">Endurance / 01</span>
        <div className="flex-1 h-px bg-ink/10" />
        <motion.a
          href={STRAVA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-mono text-xs text-muted border border-ink/15 px-3 py-1.5 hover:border-accent hover:text-accent transition-colors flex-shrink-0"
          whileHover={{ scale: 1.02 }}
          data-hover
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0 0 13.828h4.172" />
          </svg>
          View profile <ArrowUpRight size={12} />
        </motion.a>
      </div>

      {/* All-time visual summary */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] border border-ink/10 mb-8 overflow-hidden"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative min-h-[300px] md:min-h-[360px] bg-ink text-paper p-6 md:p-10 overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 flex items-center justify-between gap-4">
            <span className="font-mono text-[10px] md:text-xs text-paper/50 tracking-[0.2em] uppercase">All-time field log</span>
            <span className="font-display text-5xl md:text-7xl text-accent leading-none">01</span>
          </div>
          <div className="relative z-10 mt-12">
            <span className="font-mono text-[10px] md:text-xs text-paper/50 uppercase tracking-widest">Combined distance</span>
            <div className="flex items-end gap-3 mt-3">
              <span className="font-display text-[clamp(5rem,12vw,9rem)] leading-[0.78] tracking-wide text-paper">
                {fmtDist(totalDistance)}
              </span>
              <span className="font-mono text-sm md:text-base text-accent pb-1 md:pb-2">km</span>
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-2 mt-12 font-mono text-xs text-paper/60">
            <Activity size={13} className="text-accent" />
            {fmtNumber(totalActivities)} activities across running and cycling
          </div>
          <div className="absolute -right-16 -bottom-28 h-72 w-72 rounded-full border-[1px] border-accent/30" />
          <div className="absolute -right-4 -bottom-16 h-52 w-52 rounded-full border-[1px] border-accent/20" />
        </div>

        <div className="grid grid-cols-2 bg-paper">
          <div className="px-5 py-6 md:px-7 md:py-8 border-b border-r border-ink/10 flex flex-col justify-between">
            <Footprints size={17} className="text-accent" />
            <div className="mt-10">
              <span className="font-display text-4xl md:text-5xl leading-none tracking-wide">{fmtNumber(data.run.allTime.activities)}</span>
              <span className="font-mono text-[10px] text-muted uppercase tracking-widest block mt-2">runs logged</span>
            </div>
          </div>
          <div className="px-5 py-6 md:px-7 md:py-8 border-b border-ink/10 flex flex-col justify-between">
            <Bike size={17} className="text-accent" />
            <div className="mt-10">
              <span className="font-display text-4xl md:text-5xl leading-none tracking-wide">{fmtNumber(data.ride.allTime.activities)}</span>
              <span className="font-mono text-[10px] text-muted uppercase tracking-widest block mt-2">rides logged</span>
            </div>
          </div>
          <div className="px-5 py-6 md:px-7 md:py-8 border-r border-ink/10 flex flex-col justify-between">
            <Clock3 size={17} className="text-accent" />
            <div className="mt-10">
              <span className="font-display text-3xl md:text-4xl leading-none tracking-wide">{fmtHours(totalTime)}</span>
              <span className="font-mono text-[10px] text-muted uppercase tracking-widest block mt-2">moving time</span>
            </div>
          </div>
          <div className="px-5 py-6 md:px-7 md:py-8 flex flex-col justify-between">
            <Mountain size={17} className="text-accent" />
            <div className="mt-10">
              <span className="font-display text-3xl md:text-4xl leading-none tracking-wide">{fmtNumber(totalElevation)} m</span>
              <span className="font-mono text-[10px] text-muted uppercase tracking-widest block mt-2">elevation gained</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Run / ride split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-10">
        <motion.div
          className="group border border-ink/10 bg-paper px-5 py-5 md:px-7 md:py-6 hover:border-accent/50 transition-colors"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-xs tracking-widest uppercase flex items-center gap-2"><Footprints size={13} className="text-accent" /> Running</span>
            <span className="font-mono text-[10px] text-muted">{fmtNumber(data.run.allTime.activities)} sessions</span>
          </div>
          <div className="flex items-end gap-2 mt-6">
            <span className="font-display text-5xl md:text-6xl leading-none">{fmtDist(data.run.allTime.distanceKm)}</span>
            <span className="font-mono text-xs text-muted pb-1">km</span>
          </div>
          <div className="h-1 bg-ink/10 mt-5 overflow-hidden">
            <motion.div className="h-full bg-accent" initial={{ width: 0 }} whileInView={{ width: `${runShare}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.25 }} />
          </div>
        </motion.div>
        <motion.div
          className="group border border-ink/10 bg-paper px-5 py-5 md:px-7 md:py-6 hover:border-accent/50 transition-colors"
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-xs tracking-widest uppercase flex items-center gap-2"><Bike size={13} className="text-accent" /> Cycling</span>
            <span className="font-mono text-[10px] text-muted">{fmtNumber(data.ride.allTime.activities)} sessions</span>
          </div>
          <div className="flex items-end gap-2 mt-6">
            <span className="font-display text-5xl md:text-6xl leading-none">{fmtDist(data.ride.allTime.distanceKm)}</span>
            <span className="font-mono text-xs text-muted pb-1">km</span>
          </div>
          <div className="h-1 bg-ink/10 mt-5 overflow-hidden">
            <motion.div className="h-full bg-accent" initial={{ width: 0 }} whileInView={{ width: `${100 - runShare}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <span className="font-mono text-xs text-muted tracking-widest uppercase">Explore the log</span>
        <div className="flex-1 h-px bg-ink/10" />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-0 border border-ink/10 mb-6 w-fit max-w-full overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative font-mono text-xs px-4 py-2.5 transition-colors ${tab === t.key ? 'text-accent bg-ink/[0.03]' : 'text-muted hover:text-ink'
              }`}
          >
            {tab === t.key && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 border-b-2 border-accent"
              />
            )}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'overall' && <AllTimeCards />}
          {tab === 'weekly' && <ProgressionPanel mode="weekly" />}
          {tab === 'monthly' && <ProgressionPanel mode="monthly" />}
          {tab === 'annual' && <ProgressionPanel mode="annual" />}
        </motion.div>
      </AnimatePresence>

      <p className="font-mono text-[10px] text-muted/30 mt-4 text-right">
        Last synced: {new Date(data.fetchedAt).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short', year: 'numeric',
        })}
      </p>
    </div>
  )
}
