import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SportShoe, Bike } from 'lucide-react'
import stravaData from '../data/strava.json'
import type { StravaData, PeriodStats, WeeklyEntry, MonthlyEntry, AnnualEntry } from '../data/strava-types'

const data = stravaData as StravaData
const STRAVA_URL = 'https://www.strava.com/athletes/111442086'

// ── Formatting helpers ────────────────────────────────────────────────────────
function fmtDist(km: number) {
  return km.toFixed(1)
}

function fmtHours(h: number) {
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  if (hrs === 0) return `${mins}m`
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`
}

function fmtElev(m: number) {
  return `${Math.round(m)} m`
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
    distanceKm: 'km per period',
    timeHours: 'time per period',
    elevGainM: 'elevation per period (m)',
    activities: 'activities per period',
  }

  // SVG coordinate space
  const W = 600
  const H = 200
  const PAD = { top: 16, bottom: 32, left: 42, right: 12 }
  const cW = W - PAD.left - PAD.right
  const cH = H - PAD.top - PAD.bottom

  const maxVal = Math.max(...entries.map(e => e.run[metric] + e.ride[metric]), 1)

  // Y axis: 3 nice ticks
  const niceMax = Math.ceil(maxVal / 10) * 10
  const yTicks = [0, Math.round(niceMax / 2), niceMax]

  const xOf = (i: number) => PAD.left + (i / (entries.length - 1)) * cW
  const yOf = (val: number) => PAD.top + cH - (val / niceMax) * cH

  const runPoints  = entries.map((e, i) => ({ x: xOf(i), y: yOf(e.run[metric]) }))
  const ridePoints = entries.map((e, i) => ({ x: xOf(i), y: yOf(e.ride[metric]) }))

  const toPolyline = (pts: { x: number; y: number }[]) =>
    pts.map(p => `${p.x},${p.y}`).join(' ')

  const toArea = (pts: { x: number; y: number }[]) => {
    const base = yOf(0)
    return `M ${pts[0].x},${base} ` +
      pts.map(p => `L ${p.x},${p.y}`).join(' ') +
      ` L ${pts[pts.length - 1].x},${base} Z`
  }

  // Show every label, or every 2nd/3rd if crowded
  const step = entries.length > 18 ? 3 : entries.length > 10 ? 2 : 1

  // Format a single metric value for the info bar
  function fmtVal(val: number) {
    if (metric === 'timeHours') return fmtHours(val)
    if (metric === 'elevGainM') return `${Math.round(val)} m`
    if (metric === 'activities') return val.toFixed(0)
    return `${val.toFixed(1)} km`
  }

  return (
    <div className="px-4 md:px-5 py-3 md:py-4">
      {/* Info bar */}
      <div className="mb-2">
        <span className="font-mono text-[10px] md:text-xs text-muted/50 tracking-widest uppercase">
          {metricLabel[metric]}
        </span>
        <div className="mt-0.5 h-10 flex flex-col justify-center overflow-hidden">
          {hovered !== null && entries[hovered].run[metric] + entries[hovered].ride[metric] > 0 ? (
            <>
              <p className="font-mono text-sm md:text-base text-ink leading-none">{entries[hovered].tooltipLabel}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 font-mono text-xs md:text-sm text-muted">
                  <SportShoe size={11} /> {fmtVal(entries[hovered].run[metric])}
                </span>
                <span className="text-muted/30 font-mono text-xs">·</span>
                <span className="flex items-center gap-1 font-mono text-xs md:text-sm text-muted">
                  <Bike size={11} /> {fmtVal(entries[hovered].ride[metric])}
                </span>
              </div>
            </>
          ) : (
            <>
              <p className="font-mono text-sm md:text-base text-ink/0 leading-none select-none">—</p>
              <p className="font-mono text-xs md:text-sm text-muted/30 mt-1">— hover to inspect</p>
            </>
          )}
        </div>
      </div>

      {/* SVG chart — everything lives inside here */}
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full"
          style={{ height: 'clamp(160px, 30vw, 280px)' }}
        >
          <defs>
            <linearGradient id="runGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="rideGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Y-axis grid lines + labels */}
          {yTicks.map(tick => {
            const y = yOf(tick)
            const tickLabel = metric === 'timeHours'
              ? fmtHours(tick)
              : metric === 'elevGainM'
              ? `${tick}m`
              : metric === 'distanceKm'
              ? `${tick}km`
              : String(tick)
            return (
              <g key={tick}>
                <line
                  x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                  stroke="#1a1a1a" strokeOpacity="0.06" strokeWidth="1"
                />
                <text
                  x={PAD.left - 6} y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#1a1a1a"
                  fillOpacity="0.35"
                  fontFamily="monospace"
                >
                  {tickLabel}
                </text>
              </g>
            )
          })}

          {/* Ride area + line */}
          <path d={toArea(ridePoints)} fill="url(#rideGrad)" />
          <polyline
            points={toPolyline(ridePoints)}
            fill="none" stroke="#1a1a1a" strokeOpacity="0.22" strokeWidth="1.5"
          />

          {/* Run area + line */}
          <path d={toArea(runPoints)} fill="url(#runGrad)" />
          <polyline
            points={toPolyline(runPoints)}
            fill="none" stroke="#1a1a1a" strokeOpacity="0.55" strokeWidth="1.5"
          />

          {/* Hover vertical line */}
          {hovered !== null && (
            <line
              x1={xOf(hovered)} y1={PAD.top}
              x2={xOf(hovered)} y2={PAD.top + cH}
              stroke="#1a1a1a" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3"
            />
          )}

          {/* Ride dots — open circles Strava-style */}
          {ridePoints.map((p, i) => (
            <circle
              key={`ride-${i}`}
              cx={p.x} cy={p.y}
              r={hovered === i ? 4 : 3}
              fill={hovered === i ? '#1a1a1a' : 'transparent'}
              fillOpacity={hovered === i ? 0.15 : 0}
              stroke="#1a1a1a" strokeOpacity={hovered === i ? 0.5 : 0.25}
              strokeWidth="1.5"
            />
          ))}

          {/* Run dots — open circles */}
          {runPoints.map((p, i) => (
            <circle
              key={`run-${i}`}
              cx={p.x} cy={p.y}
              r={hovered === i ? 4 : 3}
              fill={hovered === i ? '#1a1a1a' : 'transparent'}
              fillOpacity={hovered === i ? 0.3 : 0}
              stroke="#1a1a1a" strokeOpacity={hovered === i ? 0.9 : 0.5}
              strokeWidth="1.5"
            />
          ))}

          {/* X-axis labels inside SVG — perfectly aligned to each point */}
          {entries.map((entry, i) => {
            if (i % step !== 0) return null
            return (
              <text
                key={`xlabel-${i}`}
                x={xOf(i)} y={H - 3}
                textAnchor="middle"
                fontSize="10"
                fill="#1a1a1a"
                fillOpacity="0.35"
                fontFamily="monospace"
              >
                {entry.label}
              </text>
            )
          })}

          {/* Invisible hover targets */}
          {entries.map((_, i) => {
            const colW = cW / (entries.length - 1)
            return (
              <rect
                key={`hit-${i}`}
                x={xOf(i) - colW / 2} y={0}
                width={colW} height={H}
                fill="transparent"
                style={{ cursor: 'default' }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-px bg-ink/50" />
          <SportShoe size={11} className="text-muted/60" />
          <span className="font-mono text-[10px] md:text-xs text-muted/60">Run</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-px bg-ink/20" />
          <Bike size={11} className="text-muted/60" />
          <span className="font-mono text-[10px] md:text-xs text-muted/60">Ride</span>
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

  const periodLabel = mode === 'weekly' ? 'All weeks' : mode === 'monthly' ? 'All months' : 'All years'

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
        <div className="px-4 md:px-5 py-2.5 border-r border-ink/10">
          <span className="font-mono text-[10px] text-muted/50 uppercase tracking-widest flex items-center gap-1.5 mb-1.5"><SportShoe size={12} /> Run</span>
          <span className="font-display text-xl md:text-2xl text-ink block">{fmtDist(totRun.distanceKm)} km</span>
          <div className="flex gap-2 flex-wrap mt-1">
            <span className="font-mono text-xs text-muted">{fmtHours(totRun.timeHours)}</span>
            <span className="font-mono text-xs text-muted">{fmtElev(totRun.elevGainM)}</span>
            <span className="font-mono text-xs text-muted">{totRun.activities} runs</span>
          </div>
        </div>
        <div className="px-4 md:px-5 py-2.5">
          <span className="font-mono text-[10px] text-muted/50 uppercase tracking-widest flex items-center gap-1.5 mb-1.5"><Bike size={12} /> Ride</span>
          <span className="font-display text-xl md:text-2xl text-ink block">{fmtDist(totRide.distanceKm)} km</span>
          <div className="flex gap-2 flex-wrap mt-1">
            <span className="font-mono text-xs text-muted">{fmtHours(totRide.timeHours)}</span>
            <span className="font-mono text-xs text-muted">{fmtElev(totRide.elevGainM)}</span>
            <span className="font-mono text-xs text-muted">{totRide.activities} rides</span>
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