import type { PeriodStats } from '../../../data/strava-types'

export type ProgressionMode = 'weekly' | 'monthly' | 'annual'

export interface BarEntry {
  label: string
  tooltipLabel: string
  isoStart?: string
  run: PeriodStats
  ride: PeriodStats
}