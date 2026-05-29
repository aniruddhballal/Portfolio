import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PersonStanding, Bike } from 'lucide-react'
import stravaData from '../data/strava.json'
import type { StravaData, PeriodStats, WeeklyEntry, MonthlyEntry, AnnualEntry } from '../data/strava-types'

const data = stravaData as StravaData
const STRAVA_URL = 'https://www.strava.com/athletes/111442086'

// ── Formatting helpers ────────────────────────────────────────────────────────
function fmtDist(km: number) {
  return km >= 1000
    ? `${(km / 1000).toFixed(1)}k`
    : `${km.toFixed(1)}`
}

function fmtHours(h: number) {
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  if (hrs === 0) return `${mins}m`
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`
}

function fmtElev(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)}k m` : `${Math.round(m)} m`
}

function weekLabel(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function weekRangeLabel(iso: string) {
  const start = new Date(iso)
  const end = new Date(iso)
  end.setDate(end.getDate() + 6)
  const s = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const e = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return `${s} – ${e}`
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCell({ value, label, border = true }: { value: string; label: string; border?: boolean }) {
  return (
    <div className={`px-4 py-4 ${border ? 'border-r border-ink/10' : ''}`}>
      <p className="font-display text-xl md:text-2xl text-ink tracking-wide leading-none">{value}</p>
      <p className="font-mono text-xs text-muted mt-1">{label}</p>
    </div>
  )
}

function PBList({ pbs, direction = -1 }: { pbs: StravaData['run']['pbs']; direction?: number }) {
  return (
    <>
      <div className="px-5 py-3 border-b border-ink/10">
        <span className="font-mono text-xs text-muted/50 tracking-widest uppercase">Personal bests</span>
      </div>
      <div className="divide-y divide-ink/[0.06]">
        {pbs.map((pb, i) => (
          <motion.div
            key={pb.label}
            className="flex items-center justify-between px-5 py-2.5"
            initial={{ opacity: 0, x: direction * 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <span className="font-body text-sm text-muted">{pb.label}</span>
            <span className="font-mono text-sm text-ink font-medium">{pb.time}</span>
          </motion.div>
        ))}
      </div>
    </>
  )
}

// ── Progression area chart ────────────────────────────────────────────────────
type ProgressionMode = 'weekly' | 'monthly' | 'annual'

interface BarEntry {
  label: string
  tooltipLabel: string
  run: PeriodStats
  ride: PeriodStats
}

function ProgressionChart({ entries, metric }: {
  entries: BarEntry[]
  metric: 'distanceKm' | 'timeHours' | 'elevGainM' | 'activities'
}) {
  const [hovered, setHovered] = useState<number | null>(null)

  const metricLabel: Record<typeof metric, string> = {
    distanceKm: 'km',
    timeHours: 'hrs',
    elevGainM: 'm elev',
    activities: 'activities',
  }

  const W = 800
  const H = 120
  const PAD = { top: 12, bottom: 4, left: 0, right: 0 }
  const chartH = H - PAD.top - PAD.bottom

  const maxVal = Math.max(...entries.map(e => e.run[metric] + e.ride[metric]), 1)

  const xOf = (i: number) => (i / (entries.length - 1)) * W
  const yOf = (val: number) => PAD.top + chartH - (val / maxVal) * chartH

  const runPoints  = entries.map((e, i) => ({ x: xOf(i), y: yOf(e.run[metric]) }))
  const ridePoints = entries.map((e, i) => ({ x: xOf(i), y: yOf(e.ride[metric]) }))

  const toPolyline = (pts: { x: number; y: number }[]) =>
    pts.map(p => `${p.x},${p.y}`).join(' ')

  const toArea = (pts: { x: number; y: number }[]) =>
    `M ${pts[0].x},${H} ` +
    pts.map(p => `L ${p.x},${p.y}`).join(' ') +
    ` L ${pts[pts.length - 1].x},${H} Z`

  const step = entries.length > 24 ? 4 : entries.length > 12 ? 2 : 1

  return (
    <div className="px-5 py-5">
      <span className="font-mono text-xs text-muted/50 tracking-widest uppercase mb-4 block">
        {metricLabel[metric]} per period
      </span>

      {/* SVG chart */}
      <div className="relative w-full" style={{ height: H }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full overflow-visible"
          style={{ height: H }}
        >
          <defs>
            <linearGradient id="runGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" className="text-ink" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.01" className="text-ink" />
            </linearGradient>
            <linearGradient id="rideGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" className="text-ink" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.01" className="text-ink" />
            </linearGradient>
          </defs>

          {/* Ride area + line */}
          <path d={toArea(ridePoints)} fill="url(#rideGrad)" />
          <polyline
            points={toPolyline(ridePoints)}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="1.5"
            className="text-ink"
          />

          {/* Run area + line */}
          <path d={toArea(runPoints)} fill="url(#runGrad)" />
          <polyline
            points={toPolyline(runPoints)}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.55"
            strokeWidth="1.5"
            className="text-ink"
          />

          {/* Hover vertical line */}
          {hovered !== null && (
            <line
              x1={xOf(hovered)} y1={PAD.top}
              x2={xOf(hovered)} y2={H}
              stroke="currentColor"
              strokeOpacity="0.15"
              strokeWidth="1"
              strokeDasharray="3 3"
              className="text-ink"
            />
          )}

          {/* Ride dots */}
          {ridePoints.map((p, i) => (
            <circle
              key={`ride-dot-${i}`}
              cx={p.x} cy={p.y} r={hovered === i ? 3.5 : 2}
              fill="currentColor"
              fillOpacity={hovered === i ? 0.5 : 0.2}
              className="text-ink transition-all duration-150 cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}

          {/* Run dots */}
          {runPoints.map((p, i) => (
            <circle
              key={`run-dot-${i}`}
              cx={p.x} cy={p.y} r={hovered === i ? 3.5 : 2}
              fill="currentColor"
              fillOpacity={hovered === i ? 0.9 : 0.45}
              className="text-ink transition-all duration-150 cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}

          {/* Invisible hover targets spanning full column width */}
          {entries.map((_, i) => {
            const colW = W / entries.length
            return (
              <rect
                key={`hit-${i}`}
                x={xOf(i) - colW / 2} y={0}
                width={colW} height={H}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            )
          })}
        </svg>

        {/* Tooltip */}
        {hovered !== null && (() => {
          const entry = entries[hovered]
          const total = entry.run[metric] + entry.ride[metric]
          if (total === 0) return null
          const pct = xOf(hovered) / W * 100
          const alignRight = pct > 70
          return (
            <div
              className="absolute bottom-full mb-2 pointer-events-none z-10"
              style={{ left: `${pct}%`, transform: alignRight ? 'translateX(-100%)' : 'translateX(-50%)' }}
            >
              <div className="bg-ink text-paper font-mono text-[10px] px-2 py-1.5 whitespace-nowrap">
                <div className="text-paper/50 mb-0.5">{entry.tooltipLabel}</div>
                <div className="flex items-center gap-1">
                  <PersonStanding size={9} />
                  {entry.run[metric].toFixed(metric === 'activities' ? 0 : 1)}
                  <span className="text-paper/30 mx-0.5">·</span>
                  <Bike size={9} />
                  {entry.ride[metric].toFixed(metric === 'activities' ? 0 : 1)}
                </div>
              </div>
            </div>
          )
        })()}
      </div>

      {/* X-axis labels */}
      <div className="flex items-start mt-1" style={{ gap: 0 }}>
        {entries.map((entry, i) => (
          <div key={i} className="flex-1 overflow-hidden">
            {i % step === 0 && (
              <span className="font-mono text-[9px] text-muted/40 block truncate">{entry.label}</span>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-px bg-ink/50" />
          <PersonStanding size={11} className="text-muted/60" />
          <span className="font-mono text-[10px] text-muted/60">Run</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-px bg-ink/20" />
          <Bike size={11} className="text-muted/60" />
          <span className="font-mono text-[10px] text-muted/60">Ride</span>
        </div>
      </div>
    </div>
  )
}

// ── Progression panel ─────────────────────────────────────────────────────────
function ProgressionPanel({ mode }: { mode: ProgressionMode }) {
  const [metric, setMetric] = useState<'distanceKm' | 'timeHours' | 'elevGainM' | 'activities'>('distanceKm')

  const entries: BarEntry[] = mode === 'weekly'
    ? (data.weekly as WeeklyEntry[]).map(w => ({ label: weekLabel(w.weekStart), tooltipLabel: weekRangeLabel(w.weekStart), run: w.run, ride: w.ride }))
    : mode === 'monthly'
      ? (data.monthly as MonthlyEntry[]).map(m => ({ label: m.label, tooltipLabel: m.label, run: m.run, ride: m.ride }))
      : (data.annual as AnnualEntry[]).map(a => ({ label: String(a.year), tooltipLabel: String(a.year), run: a.run, ride: a.ride }))

  const metrics: { key: typeof metric; label: string }[] = [
    { key: 'distanceKm', label: 'Distance' },
    { key: 'timeHours', label: 'Time' },
    { key: 'elevGainM', label: 'Elevation' },
    { key: 'activities', label: 'Activities' },
  ]

  const totRun = entries.reduce((a, e) => ({
    distanceKm: a.distanceKm + e.run.distanceKm,
    timeHours: a.timeHours + e.run.timeHours,
    elevGainM: a.elevGainM + e.run.elevGainM,
    activities: a.activities + e.run.activities,
  }), { distanceKm: 0, timeHours: 0, elevGainM: 0, activities: 0 })

  const totRide = entries.reduce((a, e) => ({
    distanceKm: a.distanceKm + e.ride.distanceKm,
    timeHours: a.timeHours + e.ride.timeHours,
    elevGainM: a.elevGainM + e.ride.elevGainM,
    activities: a.activities + e.ride.activities,
  }), { distanceKm: 0, timeHours: 0, elevGainM: 0, activities: 0 })

  const periodLabel = mode === 'weekly' ? 'Last 12 weeks' : mode === 'monthly' ? 'Last 12 months' : 'All years'

  return (
    <div className="border border-ink/10 overflow-hidden">
      <div className="px-5 py-4 border-b border-ink/10 flex items-center justify-between flex-wrap gap-2">
        <span className="font-mono text-xs text-muted tracking-widest uppercase">{periodLabel}</span>
        <div className="flex items-center gap-1">
          {metrics.map(m => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`font-mono text-[10px] px-2 py-1 border transition-colors ${metric === m.key
                  ? 'border-accent text-accent'
                  : 'border-ink/10 text-muted hover:border-ink/30'
                }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 border-b border-ink/10">
        <div className="px-5 py-3 border-r border-ink/10">
          <span className="font-mono text-xs text-muted/50 uppercase tracking-widest flex items-center gap-1.5 mb-2"><PersonStanding size={13} /> Run</span>
          <div className="flex gap-4 flex-wrap">
            <span className="font-display text-sm text-ink">{fmtDist(totRun.distanceKm)} km</span>
            <span className="font-mono text-xs text-muted self-end">{fmtHours(totRun.timeHours)}</span>
            <span className="font-mono text-xs text-muted self-end">{fmtElev(totRun.elevGainM)}</span>
            <span className="font-mono text-xs text-muted self-end">{totRun.activities} runs</span>
          </div>
        </div>
        <div className="px-5 py-3">
          <span className="font-mono text-xs text-muted/50 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Bike size={13} /> Ride</span>
          <div className="flex gap-4 flex-wrap">
            <span className="font-display text-sm text-ink">{fmtDist(totRide.distanceKm)} km</span>
            <span className="font-mono text-xs text-muted self-end">{fmtHours(totRide.timeHours)}</span>
            <span className="font-mono text-xs text-muted self-end">{fmtElev(totRide.elevGainM)}</span>
            <span className="font-mono text-xs text-muted self-end">{totRide.activities} rides</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <ProgressionChart entries={entries} metric={metric} />
      </div>
    </div>
  )
}

// ── All-time cards ────────────────────────────────────────────────────────────
function AllTimeCards() {
  const { run, ride } = data
  const fetchedDate = new Date(data.fetchedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <motion.div
        className="border border-ink/10 overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="px-5 py-4 border-b border-ink/10 flex items-center justify-between flex-wrap gap-1">
          <span className="font-mono text-xs text-muted tracking-widest uppercase">Running</span>
          <span className="font-mono text-xs text-muted/40">
            {run.allTime.activities} activities · {fmtDist(run.allTime.distanceKm)} km
          </span>
        </div>
        <div className="grid grid-cols-3 gap-0 border-b border-ink/10">
          <StatCell value={`${fmtDist(run.allTime.distanceKm)} km`} label="Total distance" />
          <StatCell value={fmtHours(run.allTime.timeHours)} label="Total time" />
          <StatCell value={fmtElev(run.allTime.elevGainM)} label="Elevation" border={false} />
        </div>
        <PBList pbs={run.pbs} direction={-1} />
        <div className="px-5 py-3 bg-ink/[0.02]">
          <span className="font-mono text-xs text-muted/50">As of {fetchedDate}</span>
        </div>
      </motion.div>

      <motion.div
        className="border border-ink/10 overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="px-5 py-4 border-b border-ink/10 flex items-center justify-between flex-wrap gap-1">
          <span className="font-mono text-xs text-muted tracking-widest uppercase">Cycling</span>
          <span className="font-mono text-xs text-muted/40">
            {ride.allTime.activities} activities · {fmtDist(ride.allTime.distanceKm)} km
          </span>
        </div>
        <div className="grid grid-cols-3 gap-0 border-b border-ink/10">
          <StatCell value={`${fmtDist(ride.allTime.distanceKm)} km`} label="Total distance" />
          <StatCell value={fmtHours(ride.allTime.timeHours)} label="Total time" />
          <StatCell value={fmtElev(ride.allTime.elevGainM)} label="Elevation" border={false} />
        </div>
        <PBList pbs={ride.pbs} direction={1} />
        <div className="px-5 py-3 bg-ink/[0.02]">
          <span className="font-mono text-xs text-muted/50">Ultramarathon · Triathlon · Self-supported</span>
        </div>
      </motion.div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
type Tab = 'all-time' | 'weekly' | 'monthly' | 'annual'

const TABS: { key: Tab; label: string }[] = [
  { key: 'all-time', label: 'All-time' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'annual', label: 'Annual' },
]

export default function StravaStats() {
  const [tab, setTab] = useState<Tab>('all-time')

  return (
    <div>
      {/* Section header */}
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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0 0 13.828h4.172" />
          </svg>
          View on Strava
        </motion.a>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-0 border border-ink/10 mb-6 w-fit">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative font-mono text-xs px-4 py-2.5 transition-colors ${tab === t.key
                ? 'text-accent bg-ink/[0.03]'
                : 'text-muted hover:text-ink'
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
          {tab === 'all-time' && <AllTimeCards />}
          {tab === 'weekly' && <ProgressionPanel mode="weekly" />}
          {tab === 'monthly' && <ProgressionPanel mode="monthly" />}
          {tab === 'annual' && <ProgressionPanel mode="annual" />}
        </motion.div>
      </AnimatePresence>

      <p className="font-mono text-[10px] text-muted/30 mt-4 text-right">
        Last synced: {new Date(data.fetchedAt).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short', year: 'numeric'
        })}
      </p>
    </div>
  )
}