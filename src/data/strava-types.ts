export interface PB {
  label: string
  time: string // formatted mm:ss or h:mm:ss
  date: string // ISO date string
}

export interface PeriodStats {
  distanceKm: number
  timeHours: number
  elevGainM: number
  activities: number
}

export interface WeeklyEntry {
  weekStart: string // ISO date (Monday)
  run: PeriodStats
  ride: PeriodStats
}

export interface MonthlyEntry {
  month: string // e.g. "2026-04"
  label: string // e.g. "Apr 2026"
  run: PeriodStats
  ride: PeriodStats
}

export interface AnnualEntry {
  year: number
  run: PeriodStats
  ride: PeriodStats
}

export interface SportSummary {
  allTime: PeriodStats & { fetchedAt: string }
  pbs: PB[]
}

export interface StravaData {
  fetchedAt: string  // ISO timestamp of last fetch
  run: SportSummary
  ride: SportSummary
  weekly: WeeklyEntry[]   // last 12 weeks
  monthly: MonthlyEntry[] // last 12 months
  annual: AnnualEntry[]   // all years with data
}