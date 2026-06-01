import { useState, useEffect } from 'react'
import { SportShoe, Bike } from 'lucide-react'
import stravaData from '../../../data/strava.json'
import type { StravaData, WeeklyEntry, MonthlyEntry, AnnualEntry } from '../../../data/strava-types'
import type { BarEntry, ProgressionMode } from './types/progression-types'
import ProgressionChart from './ProgressionChart'
import { fmtDist, weekLabelAxis, weekRangeLabel, weekStartLabel, weekEndLabel, monthLabelAxis } from '../utils/strava-utils'

const data = stravaData as StravaData

interface ProgressionPanelProps {
  mode: ProgressionMode
}

export default function ProgressionPanel({ mode }: ProgressionPanelProps) {
  const [sport, setSport] = useState<'run' | 'ride'>('run')

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
      : (data.annual as AnnualEntry[]).map(a => ({
        label: String(a.year),
        tooltipLabel: String(a.year),
        run: a.run, ride: a.ride,
      }))

  const entries = allEntries
  const defaultWindow = { start: Math.max(0, allEntries.length - 12), end: allEntries.length - 1 }
  const [visibleWindow, setVisibleWindow] = useState<{ start: number; end: number }>(defaultWindow)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(allEntries.length - 1)
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null)

  useEffect(() => {
    setVisibleWindow({ start: Math.max(0, allEntries.length - 12), end: allEntries.length - 1 })
    setSelectedIdx(allEntries.length - 1)
    setSelectedRange(null)
  }, [mode, allEntries.length])

  const visibleEntries = mode === 'annual'
    ? entries
    : entries.slice(visibleWindow.start, visibleWindow.end + 1)

  const totRun = visibleEntries.reduce((a, e) => ({
    distanceKm: a.distanceKm + e.run.distanceKm,
    activities: a.activities + e.run.activities,
  }), { distanceKm: 0, activities: 0 })

  const totRide = visibleEntries.reduce((a, e) => ({
    distanceKm: a.distanceKm + e.ride.distanceKm,
    activities: a.activities + e.ride.activities,
  }), { distanceKm: 0, activities: 0 })

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
      {/* Sport toggle */}
      <div className="px-5 py-3 border-b border-ink/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setSport('run')}
            className={`font-mono text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 border transition-colors flex items-center gap-1 ${sport === 'run' ? 'border-ink/40 text-ink' : 'border-ink/10 text-muted hover:border-ink/30'}`}
          >
            <SportShoe size={10} /> Run
          </button>
          <button
            onClick={() => setSport('ride')}
            className={`font-mono text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 border transition-colors flex items-center gap-1 ${sport === 'ride' ? 'border-ink/40 text-ink' : 'border-ink/10 text-muted hover:border-ink/30'}`}
          >
            <Bike size={10} /> Ride
          </button>
        </div>
      </div>

      {/* Summary row */}
      <div className="flex items-stretch border-b border-ink/10">
        {/* Active sport totals */}
        <div className="flex-1 px-4 md:px-6 py-3 md:py-5">
          <span className="font-mono text-[10px] md:text-xs text-muted/50 uppercase tracking-widest flex items-center gap-1.5 mb-2">
            {sport === 'run' ? <><SportShoe size={12} /> Run</> : <><Bike size={12} /> Ride</>}
          </span>
          <span className="font-display text-2xl md:text-4xl text-ink block leading-none">
            {fmtDist(sport === 'run' ? totRun.distanceKm : totRide.distanceKm)} km
          </span>
          <span className="font-mono text-xs md:text-sm text-muted mt-1.5 block">
            {sport === 'run' ? `${totRun.activities} runs` : `${totRide.activities} rides`}
          </span>
          {rangeLabel() && (
            <span className="font-mono text-[10px] md:text-xs text-muted/40 mt-2 block">{rangeLabel()}</span>
          )}
        </div>

        {/* Selected period / range detail */}
        <div className="border-l border-ink/10 px-4 md:px-6 py-3 md:py-5 text-right min-w-[140px] md:min-w-[180px] flex flex-col justify-center">
          {(() => {
            const selEntries = selectedRange
              ? entries.slice(selectedRange.start, selectedRange.end + 1)
              : selectedIdx !== null && entries[selectedIdx]
                ? [entries[selectedIdx]]
                : null
            if (!selEntries) return <span className="font-mono text-xs text-muted/30">—</span>
            const tot = selEntries.reduce((a, e) => ({
              distanceKm: a.distanceKm + (sport === 'run' ? e.run.distanceKm : e.ride.distanceKm),
              activities: a.activities + (sport === 'run' ? e.run.activities : e.ride.activities),
            }), { distanceKm: 0, activities: 0 })
            const first = selEntries[0]
            const last = selEntries[selEntries.length - 1]
            const label = selEntries.length > 1
              ? mode === 'weekly' && first?.isoStart && last?.isoStart
                ? `${weekStartLabel(first.isoStart)} – ${weekEndLabel(last.isoStart)}`
                : `${first?.tooltipLabel} – ${last?.tooltipLabel}`
              : first?.tooltipLabel
            return (
              <>
                <span className="font-mono text-[10px] md:text-xs text-muted/40 uppercase tracking-widest block mb-1.5">Selected</span>
                <span className="font-mono text-xs md:text-sm text-ink/70 block leading-snug">{label}</span>
                <span className="font-display text-xl md:text-2xl text-ink mt-1 block leading-none">{fmtDist(tot.distanceKm)} km</span>
                <span className="font-mono text-xs text-muted mt-0.5 block">{tot.activities} {sport === 'run' ? 'runs' : 'rides'}</span>
              </>
            )
          })()}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <ProgressionChart
          entries={entries}
          metric="distanceKm"
          mode={mode}
          sport={sport}
          selectedIdx={selectedIdx}
          onSelectedChange={i => { setSelectedIdx(i); setSelectedRange(null) }}
          onRangeChange={r => { setSelectedRange(r); if (r) setSelectedIdx(null) }}
          onVisibleWindowChange={w => {
            if (w.end >= w.start) setVisibleWindow(w)
          }}
        />
      </div>
    </div>
  )
}