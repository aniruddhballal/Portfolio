/**
 * scripts/manual-activity-logger.ts
 *
 * Interactive CLI for daily manual activity logging.
 * Asks each day for run/ride activities and updates strava.json in real-time.
 * Auto-creates new weekly/monthly entries when periods change.
 *
 * Usage:
 *   npx tsx scripts/manual-activity-logger.ts
 */

/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── Types ────────────────────────────────────────────────────────────────────
interface PeriodStats {
  distanceKm: number
  timeHours: number
  elevGainM: number
  activities: number
}

interface PB { label: string; time: string; date: string }

interface Activity {
  type: 'Run' | 'Ride'
  distanceKm: number
  timeHours: number
  elevGainM: number
  date: string // ISO format
}

interface StravaData {
  fetchedAt: string
  run: {
    allTime: PeriodStats & { fetchedAt: string }
    pbs: PB[]
  }
  ride: {
    allTime: PeriodStats & { fetchedAt: string }
    pbs: PB[]
  }
  weekly: Array<{
    weekStart: string
    run: PeriodStats
    ride: PeriodStats
  }>
  monthly: Array<{
    month: string
    label: string
    run: PeriodStats
    ride: PeriodStats
  }>
  annual: Array<{
    year: number
    run: PeriodStats
    ride: PeriodStats
  }>
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function weekStart(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(key: string): string {
  const [y, m] = key.split('-')
  const d = new Date(Number(y), Number(m) - 1, 1)
  return d.toLocaleString('en-GB', { month: 'short', year: 'numeric' })
}

function displayDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

function displayMonth(month: string): string {
  return displayDate(`${month}-01`).replace(/^01 /, '')
}

function r2(n: number): number {
  return Math.round(n * 100) / 100
}

function emptyPeriod(): PeriodStats {
  return { distanceKm: 0, timeHours: 0, elevGainM: 0, activities: 0 }
}

function addActivityToPeriod(period: PeriodStats, activity: Activity): PeriodStats {
  return {
    distanceKm: r2(period.distanceKm + activity.distanceKm),
    timeHours: r2(period.timeHours + activity.timeHours),
    elevGainM: Math.round(period.elevGainM + activity.elevGainM),
    activities: period.activities + 1,
  }
}

// ── File I/O ─────────────────────────────────────────────────────────────────
function loadStravaData(): StravaData {
  const dataPath = path.resolve(__dirname, '../src/data/strava.json')
  if (!fs.existsSync(dataPath)) {
    throw new Error(`strava.json not found at ${dataPath}`)
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
}

function saveStravaData(data: StravaData) {
  const dataPath = path.resolve(__dirname, '../src/data/strava.json')
  fs.mkdirSync(path.dirname(dataPath), { recursive: true })
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
}

// ── Input Validation ─────────────────────────────────────────────────────────
function validateNumber(input: string, name: string, min = 0): number {
  const num = parseFloat(input.trim())
  if (isNaN(num) || num < min) {
    throw new Error(`Invalid ${name}. Must be a number >= ${min}`)
  }
  return num
}

function validateTime(input: string): number {
  const trimmed = input.trim()
  const parts = trimmed.split(':').map(p => parseFloat(p))

  if (parts.length === 2) {
    // MM:SS format
    const [m, s] = parts
    if (isNaN(m) || isNaN(s) || m < 0 || s < 0 || s >= 60) {
      throw new Error('Invalid time format. Use MM:SS or H:MM:SS')
    }
    return (m * 60 + s) / 3600
  } else if (parts.length === 3) {
    // H:MM:SS format
    const [h, m, s] = parts
    if (isNaN(h) || isNaN(m) || isNaN(s) || h < 0 || m < 0 || s < 0 || m >= 60 || s >= 60) {
      throw new Error('Invalid time format. Use MM:SS or H:MM:SS')
    }
    return (h * 3600 + m * 60 + s) / 3600
  } else {
    throw new Error('Invalid time format. Use MM:SS or H:MM:SS')
  }
}

// ── Interactive Input ────────────────────────────────────────────────────────
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(prompt: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(prompt, resolve)
  })
}

async function getActivityInput(type: 'Run' | 'Ride', dateStr: string): Promise<Activity> {
  console.log(`\n📝 Logging ${type}:`)
  
  let distance: number
  while (true) {
    try {
      const input = await question(`  Distance (km): `)
      distance = validateNumber(input, 'distance', 0.1)
      break
    } catch (e) {
      console.error(`  ❌ ${(e as Error).message}`)
    }
  }

  let timeHours: number
  while (true) {
    try {
      const input = await question(`  Time (MM:SS or H:MM:SS): `)
      timeHours = validateTime(input)
      break
    } catch (e) {
      console.error(`  ❌ ${(e as Error).message}`)
    }
  }

  let elevGain: number
  while (true) {
    try {
      const input = await question(`  Elevation gain (m): `)
      elevGain = validateNumber(input, 'elevation', 0)
      break
    } catch (e) {
      console.error(`  ❌ ${(e as Error).message}`)
    }
  }

  return {
    type,
    distanceKm: r2(distance),
    timeHours: r2(timeHours),
    elevGainM: Math.round(elevGain),
    date: dateStr,
  }
}

async function getDayActivities(dateStr: string): Promise<Activity[]> {
  console.log(`\n📅 Logging activities for ${displayDate(dateStr)}`)
  const activities: Activity[] = []

  while (true) {
    const choice = await question(`\nLogged ${activities.length} activity/ies. Add another? (Run/Ride/No): `).then(a => a.toLowerCase().trim())

    if (choice.startsWith('n')) break
    if (choice.startsWith('r') && choice.includes('u')) {
      activities.push(await getActivityInput('Run', dateStr))
    } else if (choice.startsWith('r') && !choice.includes('u')) {
      activities.push(await getActivityInput('Ride', dateStr))
    } else {
      console.log(`  ❌ Please enter 'Run', 'Ride', or 'No'`)
    }
  }

  return activities
}

// ── Main Logic ───────────────────────────────────────────────────────────────
function getLastLoggedDate(data: StravaData): Date {
  // Find the last week entry with actual activity
  let lastWeekWithActivity = null
  for (let i = data.weekly.length - 1; i >= 0; i--) {
    const week = data.weekly[i]
    if (week.run.activities > 0 || week.ride.activities > 0) {
      lastWeekWithActivity = week
      break
    }
  }
  
  if (!lastWeekWithActivity) {
    // No activity found, return first day - 1
    return new Date(data.weekly[0].weekStart)
  }
  
  // Week starts on Monday, so Sunday (last day) is 6 days later
  const weekStartDate = new Date(lastWeekWithActivity.weekStart)
  const sunday = new Date(weekStartDate)
  sunday.setDate(sunday.getDate() + 6)
  return sunday
}

function dateToString(date: Date): string {
  return date.toISOString().split('T')[0]
}

function getDaysDifference(startDate: Date, endDate: Date): number {
  const ms = endDate.getTime() - startDate.getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

async function main() {
  try {
    console.log(`\n🏃 Strava Manual Activity Logger\n`)

    const data = loadStravaData()
    console.log(`✅ Loaded strava.json`)
    console.log(`   Last weekly entry: ${displayDate(data.weekly[data.weekly.length - 1].weekStart)}`)
    console.log(`   Last monthly entry: ${displayMonth(data.monthly[data.monthly.length - 1].month)}`)
    console.log(`   Last annual entry: ${data.annual[data.annual.length - 1].year}\n`)

    // Smart date detection
    const lastLoggedDate = getLastLoggedDate(data)
    const nextLogDate = new Date(lastLoggedDate)
    nextLogDate.setDate(nextLogDate.getDate() + 1) // Start from day after last logged
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const lastLogStr = dateToString(lastLoggedDate)
    const nextLogStr = dateToString(nextLogDate)
    const todayStr = dateToString(today)
    
    const daysToLog = getDaysDifference(nextLogDate, new Date(today.getTime() + 24 * 60 * 60 * 1000))
    
    console.log(`📊 Last logged date: ${displayDate(lastLogStr)}`)
    console.log(`📝 Missing data from: ${displayDate(nextLogStr)} to ${displayDate(todayStr)}`)
    console.log(`📅 Days to log: ${Math.max(0, daysToLog)}\n`)

    let continueLogging = true
    const currentDate = new Date(nextLogDate)
    
    while (continueLogging && currentDate <= today) {
      const dateStr = dateToString(currentDate)
      
      const readableDate = displayDate(dateStr)
      const skipChoice = await question(`\nLog activities for ${readableDate}? (Yes/Skip/Quit): `).then(a => a.toLowerCase().trim())
      
      if (skipChoice.startsWith('q')) {
        continueLogging = false
        break
      }
      
      if (skipChoice.startsWith('s')) {
        console.log(`  ⏭️ Skipped ${readableDate}`)
        currentDate.setDate(currentDate.getDate() + 1)
        continue
      }
      
      if (!skipChoice.startsWith('y')) {
        console.log(`  ❌ Please enter 'Yes', 'Skip', or 'Quit'`)
        continue
      }
      // Get activities for this day
      const dayActivities = await getDayActivities(dateStr)

      if (dayActivities.length === 0) {
        console.log(`  ℹ️ No activities logged for ${readableDate}`)
        continue
      }

      // Process each activity
      const logDate = new Date(dateStr)
      const currentWeek = weekStart(logDate)
      const currentMonth = monthKey(logDate)
      const currentYear = logDate.getFullYear()

      for (const activity of dayActivities) {
        // Update allTime
        if (activity.type === 'Run') {
          const updated = addActivityToPeriod(data.run.allTime, activity)
          data.run.allTime = { ...updated, fetchedAt: new Date().toISOString() }
        } else {
          const updated = addActivityToPeriod(data.ride.allTime, activity)
          data.ride.allTime = { ...updated, fetchedAt: new Date().toISOString() }
        }

        // Ensure week exists, then update
        let weekEntry = data.weekly.find(w => w.weekStart === currentWeek)
        if (!weekEntry) {
          weekEntry = {
            weekStart: currentWeek,
            run: emptyPeriod(),
            ride: emptyPeriod(),
          }
          data.weekly.push(weekEntry)
          data.weekly.sort((a, b) => a.weekStart.localeCompare(b.weekStart))
        }
        if (activity.type === 'Run') {
          weekEntry.run = addActivityToPeriod(weekEntry.run, activity)
        } else {
          weekEntry.ride = addActivityToPeriod(weekEntry.ride, activity)
        }

        // Ensure month exists, then update
        let monthEntry = data.monthly.find(m => m.month === currentMonth)
        if (!monthEntry) {
          monthEntry = {
            month: currentMonth,
            label: monthLabel(currentMonth),
            run: emptyPeriod(),
            ride: emptyPeriod(),
          }
          data.monthly.push(monthEntry)
          data.monthly.sort((a, b) => a.month.localeCompare(b.month))
        }
        if (activity.type === 'Run') {
          monthEntry.run = addActivityToPeriod(monthEntry.run, activity)
        } else {
          monthEntry.ride = addActivityToPeriod(monthEntry.ride, activity)
        }

        // Ensure year exists, then update
        let yearEntry = data.annual.find(y => y.year === currentYear)
        if (!yearEntry) {
          yearEntry = {
            year: currentYear,
            run: emptyPeriod(),
            ride: emptyPeriod(),
          }
          data.annual.push(yearEntry)
          data.annual.sort((a, b) => a.year - b.year)
        }
        if (activity.type === 'Run') {
          yearEntry.run = addActivityToPeriod(yearEntry.run, activity)
        } else {
          yearEntry.ride = addActivityToPeriod(yearEntry.ride, activity)
        }
      }

      // Update main fetchedAt timestamp
      data.fetchedAt = new Date().toISOString()

      // Save
      saveStravaData(data)
      console.log(`\n✅ Saved! Updated:`)
      for (const act of dayActivities) {
        console.log(`   ${act.type}: ${act.distanceKm}km in ${act.timeHours.toFixed(2)}h`)
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1)
    }

    if (currentDate > today) {
      console.log(`\n✨ All caught up to today!\n`)
    }
    console.log(`\n👋 Done!\n`)
    rl.close()
  } catch (error) {
    console.error(`\n❌ Error: ${(error as Error).message}\n`)
    rl.close()
    process.exit(1)
  }
}

main()
