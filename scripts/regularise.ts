/**
 * scripts/regularise.ts
 *
 * Weekly totals regularisation tool.
 * Shows weekly totals for run/ride and asks if any values need correction.
 * Updates cascade to monthly and annual totals.
 *
 * Usage:
 *   npx tsx scripts/regularise.ts
 *
 * Asks for starting date (DD-MM-YYYY), then walks through each week.
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

interface WeeklyEntry {
  weekStart: string
  run: PeriodStats
  ride: PeriodStats
}

interface MonthlyEntry {
  month: string
  label: string
  run: PeriodStats
  ride: PeriodStats
}

interface AnnualEntry {
  year: number
  run: PeriodStats
  ride: PeriodStats
}

interface StravaData {
  fetchedAt: string
  run: {
    allTime: PeriodStats & { fetchedAt: string }
    pbs: any[]
  }
  ride: {
    allTime: PeriodStats & { fetchedAt: string }
    pbs: any[]
  }
  weekly: WeeklyEntry[]
  monthly: MonthlyEntry[]
  annual: AnnualEntry[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function r2(n: number): number {
  return Math.round(n * 100) / 100
}

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

function dateToString(date: Date): string {
  return date.toISOString().split('T')[0]
}

function parseDate(dateStr: string): Date | null {
  // Parse DD-MM-YYYY format
  const match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (!match) return null

  const [, day, month, year] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))

  if (isNaN(date.getTime())) return null
  return date
}

function formatDateForDisplay(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${d}-${m}-${y}`
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

// ── Regularisation Logic ─────────────────────────────────────────────────────
async function regulariseWeek(
  data: StravaData,
  weekEntry: WeeklyEntry
): Promise<{ updated: boolean; runDist: number; rideDist: number; runElev: number; rideElev: number }> {
  const weekStart = weekEntry.weekStart
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  console.log(`\n📅 Week: ${formatDateForDisplay(weekStart)} → ${formatDateForDisplay(dateToString(weekEnd))}`)
  console.log(`\n📊 Current Totals:`)
  console.log(`   Run:  ${weekEntry.run.distanceKm}km | ${weekEntry.run.elevGainM}m elevation | ${weekEntry.run.activities} activities`)
  console.log(`   Ride: ${weekEntry.ride.distanceKm}km | ${weekEntry.ride.elevGainM}m elevation | ${weekEntry.ride.activities} activities`)

  let modified = false
  let newRunDist = weekEntry.run.distanceKm
  let newRideDist = weekEntry.ride.distanceKm
  let newRunElev = weekEntry.run.elevGainM
  let newRideElev = weekEntry.ride.elevGainM

  // Ask for run distance
  const modRunDist = await question(`\n✏️  Modify Run Distance? (current: ${weekEntry.run.distanceKm}km, press Enter to keep): `)
  if (modRunDist.trim()) {
    try {
      newRunDist = r2(validateNumber(modRunDist, 'distance', 0))
      console.log(`   ✅ Run distance updated: ${newRunDist}km`)
      modified = true
    } catch (e) {
      console.log(`   ❌ ${(e as Error).message}`)
    }
  }

  // Ask for run elevation
  const modRunElev = await question(`\n✏️  Modify Run Elevation? (current: ${weekEntry.run.elevGainM}m, press Enter to keep): `)
  if (modRunElev.trim()) {
    try {
      newRunElev = Math.round(validateNumber(modRunElev, 'elevation', 0))
      console.log(`   ✅ Run elevation updated: ${newRunElev}m`)
      modified = true
    } catch (e) {
      console.log(`   ❌ ${(e as Error).message}`)
    }
  }

  // Ask for ride distance
  const modRideDist = await question(`\n✏️  Modify Ride Distance? (current: ${weekEntry.ride.distanceKm}km, press Enter to keep): `)
  if (modRideDist.trim()) {
    try {
      newRideDist = r2(validateNumber(modRideDist, 'distance', 0))
      console.log(`   ✅ Ride distance updated: ${newRideDist}km`)
      modified = true
    } catch (e) {
      console.log(`   ❌ ${(e as Error).message}`)
    }
  }

  // Ask for ride elevation
  const modRideElev = await question(`\n✏️  Modify Ride Elevation? (current: ${weekEntry.ride.elevGainM}m, press Enter to keep): `)
  if (modRideElev.trim()) {
    try {
      newRideElev = Math.round(validateNumber(modRideElev, 'elevation', 0))
      console.log(`   ✅ Ride elevation updated: ${newRideElev}m`)
      modified = true
    } catch (e) {
      console.log(`   ❌ ${(e as Error).message}`)
    }
  }

  return {
    updated: modified,
    runDist: newRunDist,
    rideDist: newRideDist,
    runElev: newRunElev,
    rideElev: newRideElev,
  }
}

async function applyUpdates(
  data: StravaData,
  weekEntry: WeeklyEntry,
  newRunDist: number,
  newRideDist: number,
  newRunElev: number,
  newRideElev: number
) {
  const runDistDiff = r2(newRunDist - weekEntry.run.distanceKm)
  const ridDistDiff = r2(newRideDist - weekEntry.ride.distanceKm)
  const runElevDiff = Math.round(newRunElev - weekEntry.run.elevGainM)
  const rideElevDiff = Math.round(newRideElev - weekEntry.ride.elevGainM)

  // Update weekly
  weekEntry.run.distanceKm = newRunDist
  weekEntry.run.elevGainM = newRunElev
  weekEntry.ride.distanceKm = newRideDist
  weekEntry.ride.elevGainM = newRideElev

  // Extract month and year from weekStart
  const weekDate = new Date(weekEntry.weekStart)
  const monthStr = monthKey(weekDate)
  const year = weekDate.getFullYear()

  // Update monthly
  const monthEntry = data.monthly.find(m => m.month === monthStr)
  if (monthEntry) {
    monthEntry.run.distanceKm = r2(monthEntry.run.distanceKm + runDistDiff)
    monthEntry.run.elevGainM = Math.round(monthEntry.run.elevGainM + runElevDiff)
    monthEntry.ride.distanceKm = r2(monthEntry.ride.distanceKm + ridDistDiff)
    monthEntry.ride.elevGainM = Math.round(monthEntry.ride.elevGainM + rideElevDiff)
  }

  // Update annual
  const yearEntry = data.annual.find(y => y.year === year)
  if (yearEntry) {
    yearEntry.run.distanceKm = r2(yearEntry.run.distanceKm + runDistDiff)
    yearEntry.run.elevGainM = Math.round(yearEntry.run.elevGainM + runElevDiff)
    yearEntry.ride.distanceKm = r2(yearEntry.ride.distanceKm + ridDistDiff)
    yearEntry.ride.elevGainM = Math.round(yearEntry.ride.elevGainM + rideElevDiff)
  }

  // Update allTime
  data.run.allTime.distanceKm = r2(data.run.allTime.distanceKm + runDistDiff)
  data.run.allTime.elevGainM = Math.round(data.run.allTime.elevGainM + runElevDiff)
  data.ride.allTime.distanceKm = r2(data.ride.allTime.distanceKm + ridDistDiff)
  data.ride.allTime.elevGainM = Math.round(data.ride.allTime.elevGainM + rideElevDiff)
  data.run.allTime.fetchedAt = new Date().toISOString()
  data.ride.allTime.fetchedAt = new Date().toISOString()

  // Update main timestamp
  data.fetchedAt = new Date().toISOString()

  console.log(`\n✅ Updated:`)
  if (runDistDiff !== 0) console.log(`   Run distance: ${runDistDiff > 0 ? '+' : ''}${runDistDiff}km`)
  if (runElevDiff !== 0) console.log(`   Run elevation: ${runElevDiff > 0 ? '+' : ''}${runElevDiff}m`)
  if (ridDistDiff !== 0) console.log(`   Ride distance: ${ridDistDiff > 0 ? '+' : ''}${ridDistDiff}km`)
  if (rideElevDiff !== 0) console.log(`   Ride elevation: ${rideElevDiff > 0 ? '+' : ''}${rideElevDiff}m`)
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  try {
    console.log(`\n🔧 Strava Weekly Totals Regulariser\n`)

    const data = loadStravaData()
    console.log(`✅ Loaded strava.json`)
    console.log(`   Total weeks: ${data.weekly.length}`)
    console.log(`   First week: ${data.weekly[0].weekStart}`)
    console.log(`   Last week: ${data.weekly[data.weekly.length - 1].weekStart}\n`)

    // Get starting date
    let startDate: Date | null = null
    while (!startDate) {
      const input = await question(`\nEnter starting date (DD-MM-YYYY): `)
      startDate = parseDate(input)
      if (!startDate) {
        console.log(`  ❌ Invalid format. Use DD-MM-YYYY`)
      }
    }

    const startWeek = weekStart(startDate)
    const startIndex = data.weekly.findIndex(w => w.weekStart >= startWeek)

    if (startIndex === -1) {
      console.log(`\n❌ No weeks found from ${formatDateForDisplay(dateToString(startDate))} onwards`)
      rl.close()
      return
    }

    console.log(`\n📅 Starting from week: ${formatDateForDisplay(startWeek)}`)
    console.log(`   Total weeks to review: ${data.weekly.length - startIndex}\n`)

    let continueRegularising = true
    let weekIndex = startIndex

    while (continueRegularising && weekIndex < data.weekly.length) {
      const weekEntry = data.weekly[weekIndex]

      const result = await regulariseWeek(data, weekEntry)

      if (result.updated) {
        await applyUpdates(data, weekEntry, result.runDist, result.rideDist, result.runElev, result.rideElev)
        saveStravaData(data)
      } else {
        console.log(`\n⏭️ No changes for this week`)
      }

      // Ask to continue
      const nextChoice = await question(`\nContinue to next week? (y/n): `).then(a => a.toLowerCase().trim()[0] || '')
      if (nextChoice === 'n') {
        continueRegularising = false
      }

      weekIndex++
    }

    console.log(`\n✨ Done!\n`)
    rl.close()
  } catch (error) {
    console.error(`\n❌ Error: ${(error as Error).message}\n`)
    rl.close()
    process.exit(1)
  }
}

main()