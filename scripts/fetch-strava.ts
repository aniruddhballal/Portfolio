/**
 * scripts/fetch-strava.ts
 *
 * Fetches your Strava data and writes src/data/strava.json
 *
 * Usage:
 *   npx tsx scripts/fetch-strava.ts
 *
 * Requires in .env.local (or .env):
 *   STRAVA_CLIENT_ID
 *   STRAVA_CLIENT_SECRET
 *   STRAVA_REFRESH_TOKEN
 *
 * Install deps if not already present:
 *   npm install --save-dev tsx
 */

/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// ── Load .env.local ──────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '../.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...rest] = trimmed.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
}

const CLIENT_ID = process.env.STRAVA_CLIENT_ID!
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET!
const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN!

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error('Missing STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, or STRAVA_REFRESH_TOKEN in .env.local')
  process.exit(1)
}

// ── Types ────────────────────────────────────────────────────────────────────
interface PeriodStats {
  distanceKm: number
  timeHours: number
  elevGainM: number
  activities: number
}

interface PB { label: string; time: string; date: string }

interface BestEffort {
  name: string
  elapsed_time: number
  start_date: string
}

interface StravaActivity {
  id: number
  type: string
  sport_type: string
  start_date: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  best_efforts?: BestEffort[]
}

// ── Strava API helpers ────────────────────────────────────────────────────────
async function getAccessToken(): Promise<string> {
  console.log('🔑 Exchanging refresh token...')
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json() as { access_token: string; error?: string }
  if (data.error) throw new Error(`Token exchange failed: ${data.error}`)
  console.log('✅ Access token obtained')
  return data.access_token
}

async function stravaGet<T>(token: string, endpoint: string): Promise<T> {
  while (true) {
    const res = await fetch(`https://www.strava.com/api/v3${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.status === 429) {
      console.log('\n⏳ Rate limited — waiting 15 minutes...')
      await new Promise(r => setTimeout(r, 15 * 60 * 1000))
      continue
    }
    if (!res.ok) throw new Error(`Strava API ${endpoint} → ${res.status} ${res.statusText}`)
    return res.json() as Promise<T>
  }
}

async function getAllActivities(token: string): Promise<StravaActivity[]> {
  console.log('📦 Fetching all activities (paginated)...')
  const all: StravaActivity[] = []
  let page = 1
  while (true) {
    const batch = await stravaGet<StravaActivity[]>(
      token,
      `/athlete/activities?per_page=200&page=${page}`
    )
    if (!batch.length) break
    all.push(...batch)
    console.log(`   page ${page} → ${batch.length} activities (total so far: ${all.length})`)
    page++
    await new Promise(r => setTimeout(r, 300))
  }
  console.log(`✅ Total activities fetched: ${all.length}`)
  return all
}

// ── Cache ─────────────────────────────────────────────────────────────────────
const CACHE_PATH = path.resolve(__dirname, '../.strava-cache.json')

function loadCache(): Record<number, StravaActivity> {
  if (!fs.existsSync(CACHE_PATH)) return {}
  return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'))
}

function saveCache(cache: Record<number, StravaActivity>) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache))
}

// ── Formatting helpers ────────────────────────────────────────────────────────
function fmtTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function fmtDate(iso: string): string {
  const d = new Date(iso)
  const day = d.getDate()
  const suffix = ['th', 'st', 'nd', 'rd'][((day % 100) - 20 >= 0 ? day % 10 : day % 100) <= 3
    ? ((day % 100) - 20 >= 0 ? day % 10 : day % 100) : 0] ?? 'th'
  const month = d.toLocaleString('en-GB', { month: 'long' })
  return `${day}${suffix} ${month} ${d.getFullYear()}`
}

function r2(n: number) { return Math.round(n * 100) / 100 }

// ── Aggregation ───────────────────────────────────────────────────────────────
function emptyPeriod(): PeriodStats {
  return { distanceKm: 0, timeHours: 0, elevGainM: 0, activities: 0 }
}

function addActivity(acc: PeriodStats, a: StravaActivity): PeriodStats {
  return {
    distanceKm: r2(acc.distanceKm + a.distance / 1000),
    timeHours: r2(acc.timeHours + a.moving_time / 3600),
    elevGainM: Math.round(acc.elevGainM + a.total_elevation_gain),
    activities: acc.activities + 1,
  }
}

function weekStart(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1 - day)
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

// ── PB extraction ─────────────────────────────────────────────────────────────
const RUN_PB_NAMES: Record<string, string> = {
  '400m': '400m',
  '1/2 mile': '800m',
  '1k': '1K',
  '1 mile': '1 Mile',
  '2 mile': '2 Mile',
  '5k': '5K',
  '10k': '10K',
  '15k': '15K',           // ← missing
  '10 mile': '10 Mile',   // ← missing
  '20k': '20K',           // ← missing
  'half-marathon': 'Half-Marathon', // ← missing the hyphen
  '30k': '30K',           // ← missing
  'marathon': 'Marathon',
  '50k': '50K',           // ← missing
}

const RIDE_DIST_BUCKETS = [5, 10, 20, 30, 40, 50, 75, 100]

function extractRunPBs(activities: StravaActivity[]): PB[] {
  const best: Record<string, { time: number; date: string }> = {}
  for (const act of activities) {
    if (act.type !== 'Run') continue
    for (const effort of act.best_efforts ?? []) {
      const key = effort.name.toLowerCase()
      if (!RUN_PB_NAMES[key]) continue
      if (!best[key] || effort.elapsed_time < best[key].time)
        best[key] = { time: effort.elapsed_time, date: effort.start_date }
    }
  }
  return Object.entries(RUN_PB_NAMES)
    .filter(([key]) => best[key])
    .map(([key, label]) => ({
      label: `${label} (${fmtDate(best[key].date)})`,
      time: fmtTime(best[key].time),
      date: best[key].date,
    }))
}

function extractRidePBs(activities: StravaActivity[]): PB[] {
  const best: Record<number, { time: number; dist: number; date: string }> = {}
  for (const act of activities) {
    if (act.type !== 'Ride' && act.type !== 'VirtualRide') continue
    const distKm = act.distance / 1000
    for (const bucket of RIDE_DIST_BUCKETS) {
      if (distKm >= bucket * 0.8 && distKm <= bucket * 1.3) {
        const pace = act.moving_time / distKm
        const normTime = Math.round(pace * bucket)
        if (!best[bucket] || normTime < best[bucket].time)
          best[bucket] = { time: normTime, dist: r2(distKm), date: act.start_date }
      }
    }
  }
  return RIDE_DIST_BUCKETS
    .filter(b => best[b])
    .map(b => ({
      label: `${b}K (${fmtDate(best[b].date)})`,
      time: fmtTime(best[b].time),
      date: best[b].date,
    }))
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const token = await getAccessToken()
  const activities = await getAllActivities(token)

  console.log('📊 Computing aggregates...')

  const allTimeRun = activities.filter(a => a.type === 'Run')
    .reduce(addActivity, emptyPeriod())
  const allTimeRide = activities.filter(a => a.type === 'Ride' || a.type === 'VirtualRide')
    .reduce(addActivity, emptyPeriod())

  // ── Weekly (all weeks) ───────────────────────────────────────────────────
  const weekMap = new Map<string, { run: PeriodStats; ride: PeriodStats }>()
  for (const act of activities) {
    const key = weekStart(new Date(act.start_date))
    if (!weekMap.has(key)) weekMap.set(key, { run: emptyPeriod(), ride: emptyPeriod() })
    const entry = weekMap.get(key)!
    if (act.type === 'Run')
      entry.run = addActivity(entry.run, act)
    else if (act.type === 'Ride' || act.type === 'VirtualRide')
      entry.ride = addActivity(entry.ride, act)
  }
  const weekly = [...weekMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([weekStart, v]) => ({ weekStart, ...v }))

  // ── Monthly (all months) ─────────────────────────────────────────────────
  const monthMap = new Map<string, { run: PeriodStats; ride: PeriodStats }>()
  for (const act of activities) {
    const key = monthKey(new Date(act.start_date))
    if (!monthMap.has(key)) monthMap.set(key, { run: emptyPeriod(), ride: emptyPeriod() })
    const entry = monthMap.get(key)!
    if (act.type === 'Run')
      entry.run = addActivity(entry.run, act)
    else if (act.type === 'Ride' || act.type === 'VirtualRide')
      entry.ride = addActivity(entry.ride, act)
  }
  const monthly = [...monthMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({ month, label: monthLabel(month), ...v }))

  // ── Annual (all years) ────────────────────────────────────────────────────
  const yearMap = new Map<number, { run: PeriodStats; ride: PeriodStats }>()
  for (const act of activities) {
    const year = new Date(act.start_date).getFullYear()
    if (!yearMap.has(year)) yearMap.set(year, { run: emptyPeriod(), ride: emptyPeriod() })
    const entry = yearMap.get(year)!
    if (act.type === 'Run')
      entry.run = addActivity(entry.run, act)
    else if (act.type === 'Ride' || act.type === 'VirtualRide')
      entry.ride = addActivity(entry.ride, act)
  }
  const annual = [...yearMap.entries()]
    .sort(([a], [b]) => a - b)
    .map(([year, v]) => ({ year, ...v }))

  // ── PBs (with cache) ──────────────────────────────────────────────────────
  console.log('🏅 Fetching run best efforts (detail pass)...')
  const cache = loadCache()
  const runActivities = activities.filter(a => a.type === 'Run')
  const runsWithEfforts: StravaActivity[] = []
  for (let i = 0; i < runActivities.length; i++) {
    const act = runActivities[i]
    if (cache[act.id]) {
      runsWithEfforts.push(cache[act.id])
      process.stdout.write(`\r   ${i + 1}/${runActivities.length} (${i + 1} from cache)   `)
      continue
    }
    process.stdout.write(`\r   ${i + 1}/${runActivities.length} fetching...              `)
    const detail = await stravaGet<StravaActivity>(token, `/activities/${act.id}`)
    cache[act.id] = detail
    saveCache(cache)
    runsWithEfforts.push(detail)
    await new Promise(r => setTimeout(r, 1000))
  }
  console.log()
  const runPBs = extractRunPBs(runsWithEfforts)
  const ridePBs = extractRidePBs(activities)

  // ── Assemble & write ──────────────────────────────────────────────────────
  const output = {
    fetchedAt: new Date().toISOString(),
    run: {
      allTime: { ...allTimeRun, fetchedAt: new Date().toISOString() },
      pbs: runPBs,
    },
    ride: {
      allTime: { ...allTimeRide, fetchedAt: new Date().toISOString() },
      pbs: ridePBs,
    },
    weekly,
    monthly,
    annual,
  }

  const outPath = path.resolve(__dirname, '../src/data/strava.json')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2))
  console.log(`\n✅ Written to ${outPath}`)
  console.log(`   Run activities  : ${allTimeRun.activities}  (${allTimeRun.distanceKm} km)`)
  console.log(`   Ride activities : ${allTimeRide.activities} (${allTimeRide.distanceKm} km)`)
  console.log(`   Run PBs found   : ${runPBs.length}`)
  console.log(`   Ride PBs found  : ${ridePBs.length}`)
  console.log(`   Weekly entries  : ${weekly.length}`)
  console.log(`   Monthly entries : ${monthly.length}`)
  console.log(`   Annual entries  : ${annual.length}`)
}

main().catch(e => { console.error(e); process.exit(1) })