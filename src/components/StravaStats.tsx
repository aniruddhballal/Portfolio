import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useSpring } from 'framer-motion'
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

// X-axis label: "Jan 25" at year boundary, else "9 Mar"
function weekLabelAxis(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// Hover tooltip: full range with year e.g. "7 Jul 2025 – 13 Jul 2025"
function weekRangeLabel(iso: string) {
  const start = new Date(iso)
  const end = new Date(iso)
  end.setDate(end.getDate() + 6)
  const s = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const e = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  return `${s} – ${e}`
}

// Header range label: "9 Mar 2025"
function weekStartLabel(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Header range label end: "31 May 2026"
function weekEndLabel(iso: string) {
  const end = new Date(iso)
  end.setDate(end.getDate() + 6)
  return end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Monthly x-axis: always just "Jan", "Feb" etc.
function monthLabelAxis(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { month: 'short' })
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
  isoStart?: string
  run: PeriodStats
  ride: PeriodStats
}

function ProgressionChart({ entries, metric, mode, onVisibleWindowChange }: {
  entries: BarEntry[]
  metric: 'distanceKm' | 'timeHours' | 'elevGainM' | 'activities'
  mode: ProgressionMode
  onVisibleWindowChange?: (w: { start: number; end: number }) => void
}) {
  const [selected, setSelected] = useState<number | null>(entries.length - 1)
  const [previewed, setPreviewed] = useState<number | null>(null)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const isAnnual = mode === 'annual'

  // Track container width (on mount and on resize)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => setContainerWidth(el.clientWidth)
    // rAF ensures the element is fully painted before measuring
    requestAnimationFrame(update)
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Reset selection to most recent when entries change (mode switch)
  useEffect(() => {
    setSelected(entries.length - 1)
    setPreviewed(null)
  }, [entries.length, mode])

  // Scroll to the right (most recent) whenever mode, entries, or containerWidth changes
  useEffect(() => {
    if (isAnnual || containerWidth === 0) return
    const el = scrollRef.current
    if (!el) return
    const scroll = () => {
      el.scrollLeft = el.scrollWidth
      setScrollLeft(el.scrollLeft)
    }
    scroll()
    const t = setTimeout(scroll, 50)
    return () => clearTimeout(t)
  }, [entries.length, isAnnual, mode, containerWidth])

  // Use containerWidth to infer mobile vs desktop
  const isMobile = containerWidth > 0 && containerWidth < 640
  const H = containerWidth > 0 ? (isMobile ? 240 : 280) : 240
  const PAD = { top: 20, bottom: 36, left: isMobile ? 42 : 52, right: 16 }
  const cH = H - PAD.top - PAD.bottom

  // Annual: fit all entries. Weekly/monthly: 12 on mobile, 16 on desktop
  const VISIBLE_COLS = isAnnual ? entries.length : (isMobile ? 12 : 16)
  const COL_W = containerWidth > 0
    ? (containerWidth - PAD.left - PAD.right) / VISIBLE_COLS
    : 48

  const totalW = PAD.left + entries.length * COL_W + PAD.right

  // Declared early — needed by xLabelIndices IIFE below
  const xOf = (i: number) => PAD.left + i * COL_W + COL_W / 2

  // Pre-compute which indices should show an x-axis label.
  // Weekly: month boundaries only, skipping any closer than MIN_LABEL_GAP px to the previous label.
  // Monthly/Annual: every entry (every 2nd if columns are very narrow).
  const MIN_LABEL_GAP = 40
  const xLabelIndices = (() => {
    const step = COL_W < 30 ? 2 : 1
    const indices = new Set<number>()
    if (isAnnual || mode === 'monthly') {
      for (let i = 0; i < entries.length; i++) {
        if (i % step === 0) indices.add(i)
      }
      return indices
    }
    // Weekly: month boundaries with gap enforcement
    let lastX = -Infinity
    for (let i = 0; i < entries.length; i++) {
      if (!entries[i].isoStart) continue
      const cur = new Date(entries[i].isoStart!)
      const isMonthBoundary = i === 0 || new Date(entries[i - 1].isoStart!).getMonth() !== cur.getMonth()
      if (!isMonthBoundary) continue
      const x = xOf(i)
      if (x - lastX >= MIN_LABEL_GAP) {
        indices.add(i)
        lastX = x
      }
    }
    return indices
  })()

  // For weekly mode, show just "Mar", "Apr" etc at month boundaries
  function xLabel(entry: BarEntry): string {
    if (mode === 'weekly' && entry.isoStart) {
      const d = new Date(entry.isoStart)
      return d.toLocaleDateString('en-GB', { month: 'short' })
    }
    return entry.label
  }

  // Derive which entries are visible in the current scroll window
  const visibleStart = Math.max(0, Math.floor((scrollLeft - PAD.left) / COL_W))
  const visibleEnd   = Math.min(entries.length - 1, Math.floor((scrollLeft + containerWidth - PAD.left) / COL_W))
  const visibleEntries = entries.slice(visibleStart, visibleEnd + 1)

  useEffect(() => {
    if (containerWidth === 0) return
    if (visibleEnd < visibleStart) return
    onVisibleWindowChange?.({ start: visibleStart, end: visibleEnd })
  }, [visibleStart, visibleEnd, containerWidth])

  // When selected scrolls out of the visible window, snap to the rightmost visible entry.
  // This also handles the initial load: once containerWidth is measured and visibleEnd is known,
  // if the default selected (entries.length - 1) is out of range it snaps to visibleEnd.
  useEffect(() => {
    if (containerWidth === 0) return
    if (selected === null || selected < visibleStart || selected > visibleEnd) {
      setSelected(visibleEnd)
    }
  }, [visibleStart, visibleEnd, containerWidth])

  const maxVal = Math.max(...(isAnnual ? entries : visibleEntries).map(e => e.run[metric] + e.ride[metric]), 1)
  const niceMax = Math.ceil(maxVal / 10) * 10

  // Spring-animate the scale so the chart eases when the window changes
  const animatedMax = useSpring(niceMax, { stiffness: 60, damping: 18, mass: 1 })
  useEffect(() => { animatedMax.set(niceMax) }, [niceMax])

  const [renderMax, setRenderMax] = useState(niceMax)
  useEffect(() => animatedMax.on('change', v => setRenderMax(v)), [animatedMax])

  const yTicks = [0, Math.round(renderMax / 2), renderMax]

  const metricLabel: Record<typeof metric, string> = {
    distanceKm: 'km per period',
    timeHours: 'time per period',
    elevGainM: 'elevation per period (m)',
    activities: 'activities per period',
  }

  const yOf = (val: number) => PAD.top + cH - (val / renderMax) * cH

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

  // displayIdx: what the info bar shows — always selected, never changes on hover
  const displayIdx = selected

  function fmtVal(val: number) {
    if (metric === 'timeHours') return fmtHours(val)
    if (metric === 'elevGainM') return `${Math.round(val)} m`
    if (metric === 'activities') return val.toFixed(0)
    return `${val.toFixed(1)} km`
  }

  return (
    <div className="py-3 md:py-4">
      {/* Info bar — fixed height, always shows data for activeIdx */}
      <div className="mb-1 px-4 md:px-5 h-12 md:h-14 flex flex-col justify-center overflow-hidden">
        <span className="font-mono text-[10px] md:text-xs text-muted/50 tracking-widest uppercase">
          {metricLabel[metric]}
        </span>
        {displayIdx !== null && entries[displayIdx] ? (
          <div className="mt-0.5">
            <span className="font-mono text-xs md:text-sm text-ink leading-none block truncate">
              {entries[displayIdx].tooltipLabel}
            </span>
            <div className="flex items-center gap-2 mt-0.5 flex-nowrap">
              <span className="flex items-center gap-1 font-mono text-xs text-muted whitespace-nowrap">
                <SportShoe size={11} /> {fmtVal(entries[displayIdx].run[metric])}
              </span>
              <span className="text-muted/30 font-mono text-xs">·</span>
              <span className="flex items-center gap-1 font-mono text-xs text-muted whitespace-nowrap">
                <Bike size={11} /> {fmtVal(entries[displayIdx].ride[metric])}
              </span>
            </div>
          </div>
        ) : (
          <p className="font-mono text-[10px] text-muted/30 mt-0.5">—</p>
        )}
      </div>

      {/* Scrollable chart container */}
      <div className="relative" onMouseLeave={() => setPreviewed(null)}>
        {/* Scroll affordance — left fade when not scrolled to start */}
        {!isAnnual && scrollLeft > 8 && (
          <div
            className="absolute left-[42px] top-0 bottom-0 w-6 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to right, #EDE9E1cc, transparent)' }}
          />
        )}
        {/* Sticky Y-axis overlay — always visible regardless of scroll position */}
        <svg
          width={PAD.left}
          height={H}
          viewBox={`0 0 ${PAD.left} ${H}`}
          style={{ position: 'absolute', left: 0, top: 0, zIndex: 1, pointerEvents: 'none' }}
        >
          {/* Background to mask scrolling chart content behind the labels */}
          <rect x={0} y={0} width={PAD.left} height={H} fill="#EDE9E1" />
          {yTicks.map((tick, ti) => {
            const y = yOf(tick)
            const roundedTick = Math.round(tick)
            const tickLabel = metric === 'timeHours'
              ? fmtHours(roundedTick)
              : metric === 'elevGainM'
              ? `${roundedTick}m`
              : metric === 'distanceKm'
              ? `${roundedTick}km`
              : String(roundedTick)
            return (
              <text
                key={ti}
                x={PAD.left - 6} y={y + 4}
                textAnchor="end"
                fontSize={isMobile ? 10 : 11}
                fill="#1a1a1a"
                fillOpacity="0.35"
                fontFamily="monospace"
              >
                {tickLabel}
              </text>
            )
          })}
        </svg>
        <div
          ref={scrollRef}
          className="overflow-x-auto overflow-y-hidden"
          style={{ WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'], scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'], msOverflowStyle: 'none' }}
          onScroll={e => setScrollLeft((e.target as HTMLDivElement).scrollLeft)}
        >
        <svg
          width={totalW}
          height={H}
          viewBox={`0 0 ${totalW} ${H}`}
          style={{ display: 'block', minWidth: totalW }}
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

          {/* Y-axis grid lines only — labels are in the sticky overlay above */}
          {yTicks.map((tick, ti) => {
            const y = yOf(tick)
            return (
              <line
                key={ti}
                x1={PAD.left} y1={y} x2={totalW - PAD.right} y2={y}
                stroke="#1a1a1a" strokeOpacity="0.06" strokeWidth="1"
              />
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

          {/* Selected column background highlight */}
          {selected !== null && (
            <rect
              x={xOf(selected) - COL_W / 2} y={PAD.top}
              width={COL_W} height={cH}
              fill="#1a1a1a" fillOpacity="0.04"
              rx="2"
            />
          )}

          {/* Dashed vertical line — always on selected column */}
          {selected !== null && (
            <line
              x1={xOf(selected)} y1={PAD.top}
              x2={xOf(selected)} y2={PAD.top + cH}
              stroke="#1a1a1a" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3"
            />
          )}

          {/* Ride dots — slightly enlarge on hover as clickable affordance */}
          {ridePoints.map((p, i) => (
            <circle
              key={`ride-${i}`}
              cx={p.x} cy={p.y}
              r={selected === i ? 4 : previewed === i ? 3.5 : 3}
              fill={selected === i ? '#1a1a1a' : 'transparent'}
              fillOpacity={selected === i ? 0.15 : 0}
              stroke="#1a1a1a" strokeOpacity={selected === i ? 0.5 : 0.25}
              strokeWidth="1.5"
            />
          ))}

          {/* Run dots (non-selected) — enlarge slightly on hover */}
          {runPoints.map((p, i) => (
            i === selected ? null :
            <circle
              key={`run-${i}`}
              cx={p.x} cy={p.y}
              r={previewed === i ? 3.5 : 3}
              fill="transparent"
              stroke="#1a1a1a" strokeOpacity={previewed === i ? 0.7 : 0.5}
              strokeWidth="1.5"
            />
          ))}

          {/* Selected run dot — always on selected column, rendered last */}
          {selected !== null && runPoints[selected] && (
            <circle
              cx={xOf(selected)} cy={runPoints[selected].y}
              r={4}
              fill="#c0392b"
              fillOpacity={0.9}
              stroke="#fff"
              strokeWidth="1.5"
            />
          )}

          {/* X-axis labels — month boundaries only for weekly, every entry for monthly/annual */}
          {entries.map((entry, i) => {
            if (!xLabelIndices.has(i)) return null
            const x = xOf(i)
            if (x < PAD.left + 4) return null
            if (x > totalW - PAD.right - 2) return null
            return (
              <text
                key={`xlabel-${i}`}
                x={x} y={H - 3}
                textAnchor="middle"
                fontSize={isMobile ? 10 : 11}
                fill="#1a1a1a"
                fillOpacity="0.35"
                fontFamily="monospace"
              >
                {xLabel(entry)}
              </text>
            )
          })}

          {/* Invisible hit targets — full column height for easy tap */}
          {entries.map((_, i) => (
            <rect
              key={`hit-${i}`}
              x={xOf(i) - COL_W / 2} y={0}
              width={COL_W} height={H}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setPreviewed(i)}
              onMouseLeave={() => setPreviewed(null)}
              onClick={() => setSelected(prev => prev === i ? null : i)}
              onTouchStart={(e) => { e.preventDefault(); setSelected(i) }}
            />
          ))}
        </svg>
        </div>{/* end scrollRef */}
      </div>{/* end relative wrapper */}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 px-4 md:px-5">
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

  const allEntries: BarEntry[] = mode === 'weekly'
    ? (data.weekly as WeeklyEntry[]).map(w => ({
        label: weekLabelAxis(w.weekStart),
        tooltipLabel: weekRangeLabel(w.weekStart),
        isoStart: w.weekStart,
        run: w.run, ride: w.ride,
      }))
    : mode === 'monthly'
      ? (data.monthly as MonthlyEntry[]).map(m => ({
          label: monthLabelAxis(m.month + '-01'),
          tooltipLabel: m.label,
          isoStart: m.month + '-01',
          run: m.run, ride: m.ride,
        }))
      : (data.annual as AnnualEntry[]).map(a => ({ label: String(a.year), tooltipLabel: String(a.year), run: a.run, ride: a.ride }))

  const entries = allEntries

  // Track which entries are currently visible in the chart scroll window.
  // Default to last 12 (or all if fewer) — chart will update this once measured.
  const defaultWindow = { start: Math.max(0, allEntries.length - 12), end: allEntries.length - 1 }
  const [visibleWindow, setVisibleWindow] = useState<{ start: number; end: number }>(defaultWindow)

  // Reset to most recent window when mode changes (before chart has a chance to report)
  useEffect(() => {
    setVisibleWindow({ start: Math.max(0, allEntries.length - 12), end: allEntries.length - 1 })
  }, [mode, allEntries.length])

  const visibleEntries = mode === 'annual'
    ? entries
    : entries.slice(visibleWindow.start, visibleWindow.end + 1)

  const metrics: { key: typeof metric; label: string }[] = [
    { key: 'distanceKm', label: 'Distance' },
    { key: 'timeHours', label: 'Time' },
    { key: 'elevGainM', label: 'Elevation' },
    { key: 'activities', label: 'Activities' },
  ]

  const totRun = visibleEntries.reduce((a, e) => ({
    distanceKm: a.distanceKm + e.run.distanceKm,
    timeHours: a.timeHours + e.run.timeHours,
    elevGainM: a.elevGainM + e.run.elevGainM,
    activities: a.activities + e.run.activities,
  }), { distanceKm: 0, timeHours: 0, elevGainM: 0, activities: 0 })

  const totRide = visibleEntries.reduce((a, e) => ({
    distanceKm: a.distanceKm + e.ride.distanceKm,
    timeHours: a.timeHours + e.ride.timeHours,
    elevGainM: a.elevGainM + e.ride.elevGainM,
    activities: a.activities + e.ride.activities,
  }), { distanceKm: 0, timeHours: 0, elevGainM: 0, activities: 0 })

  const periodLabel = mode === 'annual'
    ? 'All years'
    : mode === 'weekly'
    ? `${visibleEntries.length} week${visibleEntries.length !== 1 ? 's' : ''}`
    : `${visibleEntries.length} month${visibleEntries.length !== 1 ? 's' : ''}`

  function rangeLabel() {
    const first = visibleEntries[0]
    const last = visibleEntries[visibleEntries.length - 1]
    if (!first || !last) return ''
    if (mode === 'weekly' && first.isoStart && last.isoStart) {
      return `${weekStartLabel(first.isoStart)} – ${weekEndLabel(last.isoStart)}`
    }
    return `${first.tooltipLabel} – ${last.tooltipLabel}`
  }

  return (
    <div className="border border-ink/10 overflow-hidden">
      <div className="px-5 py-3 border-b border-ink/10 flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-mono text-xs md:text-sm text-muted tracking-widest uppercase shrink-0">{periodLabel}</span>
          <span className="font-mono text-[10px] md:text-xs text-muted/40 text-right">{rangeLabel()}</span>
        </div>
        <div className="flex items-center gap-1">
          {metrics.map(m => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`font-mono text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 border transition-colors ${metric === m.key
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
        <div className="px-4 md:px-6 py-2.5 md:py-4 border-r border-ink/10">
          <span className="font-mono text-[10px] md:text-xs text-muted/50 uppercase tracking-widest flex items-center gap-1.5 mb-1.5"><SportShoe size={12} /> Run</span>
          <span className="font-display text-xl md:text-3xl text-ink block">{fmtDist(totRun.distanceKm)} km</span>
          <div className="flex gap-2 flex-wrap mt-1">
            <span className="font-mono text-xs md:text-sm text-muted">{fmtHours(totRun.timeHours)}</span>
            <span className="font-mono text-xs md:text-sm text-muted">{fmtElev(totRun.elevGainM)}</span>
            <span className="font-mono text-xs md:text-sm text-muted">{totRun.activities} runs</span>
          </div>
        </div>
        <div className="px-4 md:px-6 py-2.5 md:py-4">
          <span className="font-mono text-[10px] md:text-xs text-muted/50 uppercase tracking-widest flex items-center gap-1.5 mb-1.5"><Bike size={12} /> Ride</span>
          <span className="font-display text-xl md:text-3xl text-ink block">{fmtDist(totRide.distanceKm)} km</span>
          <div className="flex gap-2 flex-wrap mt-1">
            <span className="font-mono text-xs md:text-sm text-muted">{fmtHours(totRide.timeHours)}</span>
            <span className="font-mono text-xs md:text-sm text-muted">{fmtElev(totRide.elevGainM)}</span>
            <span className="font-mono text-xs md:text-sm text-muted">{totRide.activities} rides</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <ProgressionChart
          entries={entries}
          metric={metric}
          mode={mode}
          onVisibleWindowChange={w => {
            if (w.end >= w.start) setVisibleWindow(w)
          }}
        />
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
type Tab = 'overall' | 'weekly' | 'monthly' | 'annual'

const TABS: { key: Tab; label: string }[] = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'annual', label: 'Annual' },
  { key: 'overall', label: 'Overall' },
]

export default function StravaStats() {
  const [tab, setTab] = useState<Tab>('weekly')

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
          {tab === 'overall' && <AllTimeCards />}
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