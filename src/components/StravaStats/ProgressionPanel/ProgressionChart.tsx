import { useState, useRef, useEffect } from 'react'
import { useSpring } from 'framer-motion'
import type { BarEntry, ProgressionMode } from './types/progression-types'

interface ProgressionChartProps {
  entries: BarEntry[]
  metric: 'distanceKm'
  mode: ProgressionMode
  sport: 'run' | 'ride'
  onVisibleWindowChange?: (w: { start: number; end: number }) => void
  selectedIdx?: number | null
  onSelectedChange?: (i: number | null) => void
  onRangeChange?: (r: { start: number; end: number } | null) => void
}

export default function ProgressionChart({
  entries, metric, mode, sport,
  onVisibleWindowChange, selectedIdx, onSelectedChange, onRangeChange,
}: ProgressionChartProps) {
  const [selected, setSelected] = useState<number | null>(selectedIdx ?? entries.length - 1)
  const setSelectedBoth = (fn: (prev: number | null) => number | null) => {
    setSelected(prev => {
      const next = fn(prev)
      onSelectedChange?.(next)
      return next
    })
  }

  // Drag-to-select (desktop only)
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [dragEnd, setDragEnd] = useState<number | null>(null)
  const [committedRange, setCommittedRange] = useState<{ lo: number; hi: number } | null>(null)
  const isDragging = dragStart !== null
  const didDragRef = useRef(false)
  const dragStartRef = useRef<number | null>(null)
  const dragEndRef = useRef<number | null>(null)
  const rangeActiveRef = useRef(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const layoutRef = useRef({ padLeft: 60, colW: 48, entriesLen: 0 })
  const onRangeChangeRef = useRef(onRangeChange)
  const setSelectedBothRef = useRef(setSelectedBoth)
  useEffect(() => { onRangeChangeRef.current = onRangeChange }, [onRangeChange])
  useEffect(() => { setSelectedBothRef.current = setSelectedBoth })

  const [previewed, setPreviewed] = useState<number | null>(null)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isMobile = containerWidth > 0 && containerWidth < 640

  useEffect(() => {
    if (isMobile) return
    const svg = svgRef.current
    if (!svg) return

    const getCol = (clientX: number) => {
      const { padLeft, colW, entriesLen } = layoutRef.current
      const rect = svg.getBoundingClientRect()
      const svgX = clientX - rect.left
      const i = Math.floor((svgX - padLeft) / colW)
      return Math.max(0, Math.min(entriesLen - 1, i))
    }

    const commitDrag = () => {
      if (dragStartRef.current === null) return
      const endIdx = dragEndRef.current ?? dragStartRef.current
      const lo = Math.min(dragStartRef.current, endIdx)
      const hi = Math.max(dragStartRef.current, endIdx)
      if (didDragRef.current && lo !== hi) {
        rangeActiveRef.current = true
        onRangeChangeRef.current?.({ start: lo, end: hi })
        setSelected(null)
        setCommittedRange({ lo, hi })
      } else {
        rangeActiveRef.current = false
        setCommittedRange(null)
        setSelectedBothRef.current(() => lo)
        onRangeChangeRef.current?.(null)
      }
      dragStartRef.current = null
      dragEndRef.current = null
      didDragRef.current = false
      setDragStart(null)
      setDragEnd(null)
    }

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      const idx = getCol(e.clientX)
      didDragRef.current = false
      rangeActiveRef.current = false
      setCommittedRange(null)
      dragStartRef.current = idx
      dragEndRef.current = idx
      setDragStart(idx)
      setDragEnd(idx)
      e.preventDefault()
    }

    const onMove = (e: MouseEvent) => {
      const idx = getCol(e.clientX)
      setPreviewed(idx)
      if (dragStartRef.current !== null) {
        if (idx !== dragStartRef.current) didDragRef.current = true
        dragEndRef.current = idx
        setDragEnd(idx)
      }
    }

    const onLeave = () => setPreviewed(null)
    const onWindowUp = () => commitDrag()

    svg.addEventListener('mousedown', onDown)
    svg.addEventListener('mousemove', onMove)
    svg.addEventListener('mouseleave', onLeave)
    window.addEventListener('mouseup', onWindowUp)
    return () => {
      svg.removeEventListener('mousedown', onDown)
      svg.removeEventListener('mousemove', onMove)
      svg.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mouseup', onWindowUp)
    }
  }, [isMobile])

  const isAnnual = mode === 'annual'

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => setContainerWidth(el.clientWidth)
    requestAnimationFrame(update)
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    rangeActiveRef.current = false
    setCommittedRange(null)
    setSelectedBoth(() => entries.length - 1)
    setPreviewed(null)
  }, [entries.length, mode])

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

  const H = containerWidth > 0 ? (isMobile ? 240 : 280) : 240
  const PAD = { top: 20, bottom: 36, left: isMobile ? 52 : 60, right: 16 }
  const cH = H - PAD.top - PAD.bottom

  const VISIBLE_COLS = isAnnual ? entries.length : (isMobile ? 12 : 16)
  const COL_W = containerWidth > 0
    ? (containerWidth - PAD.left - PAD.right) / VISIBLE_COLS
    : 48

  const totalW = PAD.left + entries.length * COL_W + PAD.right
  layoutRef.current = { padLeft: PAD.left, colW: COL_W, entriesLen: entries.length }

  const xOf = (i: number) => PAD.left + i * COL_W + COL_W / 2

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

  function xLabel(entry: BarEntry): string {
    if (mode === 'weekly' && entry.isoStart) {
      const d = new Date(entry.isoStart)
      return d.toLocaleDateString('en-GB', { month: 'short' })
    }
    return entry.label
  }

  const visibleStart = Math.max(0, Math.ceil(scrollLeft / COL_W))
  const visibleEnd = Math.min(entries.length - 1, Math.floor((scrollLeft + containerWidth - PAD.left) / COL_W - 0.5))
  const visibleEntries = entries.slice(visibleStart, visibleEnd + 1)

  useEffect(() => {
    if (containerWidth === 0) return
    if (visibleEnd < visibleStart) return
    onVisibleWindowChange?.({ start: visibleStart, end: visibleEnd })
  }, [visibleStart, visibleEnd, containerWidth])

  useEffect(() => {
    if (containerWidth === 0) return
    if (rangeActiveRef.current) return
    if (selected === null || selected < visibleStart || selected > visibleEnd) {
      setSelectedBoth(() => visibleEnd)
    }
  }, [visibleStart, visibleEnd, containerWidth])

  const maxVal = Math.max(...(isAnnual ? entries : visibleEntries).map(e => sport === 'run' ? e.run[metric] : e.ride[metric]), 1)
  const niceMax = Math.ceil(maxVal / 10) * 10

  const animatedMax = useSpring(niceMax, { stiffness: 60, damping: 18, mass: 1 })
  useEffect(() => { animatedMax.set(niceMax) }, [niceMax])

  const [renderMax, setRenderMax] = useState(niceMax)
  useEffect(() => animatedMax.on('change', v => setRenderMax(v)), [animatedMax])

  const yTicks = [0, Math.round(renderMax / 2), renderMax]
  const yOf = (val: number) => PAD.top + cH - (val / renderMax) * cH

  const runPoints = entries.map((e, i) => ({ x: xOf(i), y: yOf(e.run[metric]) }))
  const ridePoints = entries.map((e, i) => ({ x: xOf(i), y: yOf(e.ride[metric]) }))
  const activePoints = sport === 'run' ? runPoints : ridePoints

  const toPolyline = (pts: { x: number; y: number }[]) =>
    pts.map(p => `${p.x},${p.y}`).join(' ')

  const toArea = (pts: { x: number; y: number }[]) => {
    const base = yOf(0)
    return `M ${pts[0].x},${base} ` +
      pts.map(p => `L ${p.x},${p.y}`).join(' ') +
      ` L ${pts[pts.length - 1].x},${base} Z`
  }

  return (
    <div className="py-3 md:py-4">
      <div className="relative" onMouseLeave={() => setPreviewed(null)}>
        {/* Left fade when scrolled */}
        {!isAnnual && scrollLeft > 8 && (
          <div
            className="absolute top-0 bottom-0 w-6 pointer-events-none z-10"
            style={{ left: PAD.left, background: 'linear-gradient(to right, #EDE9E1cc, transparent)' }}
          />
        )}

        {/* Sticky Y-axis overlay */}
        <svg
          width={PAD.left}
          height={H}
          viewBox={`0 0 ${PAD.left} ${H}`}
          style={{ position: 'absolute', left: 0, top: 0, zIndex: 1, pointerEvents: 'none' }}
        >
          <rect x={0} y={0} width={PAD.left} height={H} fill="#EDE9E1" />
          {yTicks.map((tick, ti) => (
            <text
              key={ti}
              x={PAD.left - 6} y={yOf(tick) + 4}
              textAnchor="end"
              fontSize={isMobile ? 10 : 11}
              fill="#1a1a1a"
              fontFamily="monospace"
            >
              {`${Math.round(tick)}km`}
            </text>
          ))}
        </svg>

        {/* Scrollable SVG */}
        <div
          ref={scrollRef}
          className="overflow-x-auto overflow-y-hidden"
          style={{
            WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
            scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'],
            msOverflowStyle: 'none',
          }}
          onScroll={e => setScrollLeft((e.target as HTMLDivElement).scrollLeft)}
        >
          <svg
            ref={svgRef}
            width={totalW}
            height={H}
            viewBox={`0 0 ${totalW} ${H}`}
            style={{ display: 'block', minWidth: totalW, cursor: isMobile ? 'pointer' : isDragging ? 'col-resize' : 'crosshair' }}
          >
            <defs>
              <linearGradient id="sportGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Y-axis grid lines */}
            {yTicks.map((tick, ti) => (
              <line
                key={ti}
                x1={PAD.left} y1={yOf(tick)} x2={totalW - PAD.right} y2={yOf(tick)}
                stroke="#1a1a1a" strokeOpacity="0.06" strokeWidth="1"
              />
            ))}

            {/* Area + line */}
            <path d={toArea(activePoints)} fill="url(#sportGrad)" />
            <polyline
              points={toPolyline(activePoints)}
              fill="none" stroke="#1a1a1a" strokeOpacity="0.55" strokeWidth="1.5"
            />

            {/* Drag range highlight */}
            {(() => {
              const lo = dragStart !== null && dragEnd !== null ? Math.min(dragStart, dragEnd) : committedRange?.lo ?? null
              const hi = dragStart !== null && dragEnd !== null ? Math.max(dragStart, dragEnd) : committedRange?.hi ?? null
              if (lo === null || hi === null) return null
              return (
                <rect
                  x={xOf(lo) - COL_W / 2} y={PAD.top}
                  width={xOf(hi) - xOf(lo) + COL_W} height={cH}
                  fill="#1a1a1a" fillOpacity="0.06" rx="2"
                  style={{ pointerEvents: 'none' }}
                />
              )
            })()}

            {/* Selected column background (single-bar mode) */}
            {dragStart === null && committedRange === null && selected !== null && (
              <rect
                x={xOf(selected) - COL_W / 2} y={PAD.top}
                width={COL_W} height={cH}
                fill="#1a1a1a" fillOpacity="0.04" rx="2"
              />
            )}

            {/* Dashed vertical line (single-bar mode) */}
            {dragStart === null && committedRange === null && selected !== null && (
              <line
                x1={xOf(selected)} y1={PAD.top}
                x2={xOf(selected)} y2={PAD.top + cH}
                stroke="#1a1a1a" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3"
              />
            )}

            {/* Dots */}
            {activePoints.map((p, i) => {
              const activeLo = dragStart !== null && dragEnd !== null ? Math.min(dragStart, dragEnd) : committedRange?.lo ?? null
              const activeHi = dragStart !== null && dragEnd !== null ? Math.max(dragStart, dragEnd) : committedRange?.hi ?? null
              const inRange = activeLo !== null && activeHi !== null && i >= activeLo && i <= activeHi
              const isSelected = dragStart === null && committedRange === null && i === selected
              if (isSelected) return null
              return (
                <circle
                  key={`dot-${i}`}
                  cx={p.x} cy={p.y}
                  r={inRange ? 3.5 : previewed === i ? 3.5 : 3}
                  fill="transparent"
                  stroke="#1a1a1a" strokeOpacity={inRange ? 0.7 : previewed === i ? 0.7 : 0.5}
                  strokeWidth="1.5"
                />
              )
            })}

            {/* Selected dot */}
            {dragStart === null && committedRange === null && selected !== null && activePoints[selected] && (
              <circle
                cx={xOf(selected)} cy={activePoints[selected].y}
                r={4}
                fill="#c0392b" fillOpacity={0.9}
                stroke="#fff" strokeWidth="1.5"
              />
            )}

            {/* Range endpoint dots */}
            {(() => {
              const lo = dragStart !== null && dragEnd !== null ? Math.min(dragStart, dragEnd) : committedRange?.lo ?? null
              const hi = dragStart !== null && dragEnd !== null ? Math.max(dragStart, dragEnd) : committedRange?.hi ?? null
              if (lo === null || hi === null) return null
              return [lo, hi].map((idx, k) => (
                <circle
                  key={`drag-dot-${k}`}
                  cx={xOf(idx)} cy={activePoints[idx]?.y ?? yOf(0)}
                  r={4}
                  fill="#c0392b" fillOpacity={0.9}
                  stroke="#fff" strokeWidth="1.5"
                  style={{ pointerEvents: 'none' }}
                />
              ))
            })()}

            {/* X-axis labels */}
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
                  fill="#1a1a1a" fillOpacity="0.35"
                  fontFamily="monospace"
                >
                  {xLabel(entry)}
                </text>
              )
            })}

            {/* Mobile tap targets */}
            {isMobile && entries.map((_, i) => (
              <rect
                key={`hit-${i}`}
                x={xOf(i) - COL_W / 2} y={0}
                width={COL_W} height={H}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setPreviewed(i)}
                onMouseLeave={() => setPreviewed(null)}
                onClick={() => {
                  rangeActiveRef.current = false
                  setCommittedRange(null)
                  setSelectedBoth(prev => prev === i ? null : i)
                  onRangeChange?.(null)
                }}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  )
}