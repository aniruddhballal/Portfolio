import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME as string
const GITHUB_TOKEN    = import.meta.env.VITE_GITHUB_TOKEN    as string

// ─── Types ───────────────────────────────────────────────────────────────────

interface GitHubStats {
  totalRepos:     number
  totalCommits:   number
  commitsByYear:  Record<string, number>
  commitsByMonth: Record<string, number>
  commitsByDay:   Record<string, number>
  stars:          number
  longestStreak:  number
  topLanguages:   { name: string; pct: number }[]
}

type View = 'year' | 'month' | 'day'

// ─── GitHub fetcher ──────────────────────────────────────────────────────────

async function fetchGitHubStats(): Promise<GitHubStats> {
  const headers: HeadersInit = {
    'Authorization':      `Bearer ${GITHUB_TOKEN}`,
    'Accept':             'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  let repos: any[] = []
  let page = 1
  while (true) {
    const res = await fetch(
      `https://api.github.com/user/repos?per_page=100&page=${page}&sort=pushed&affiliation=owner`,
      { headers }
    )
    if (!res.ok) throw new Error(`Repos fetch failed: ${res.status}`)
    const batch: any[] = await res.json()
    if (!batch.length) break
    repos = repos.concat(batch)
    if (batch.length < 100) break
    page++
  }

  const totalRepos = repos.length
  const stars      = repos.reduce((s: number, r: any) => s + (r.stargazers_count ?? 0), 0)

  const langCount: Record<string, number> = {}
  for (const repo of repos) {
    if (repo.language) langCount[repo.language] = (langCount[repo.language] ?? 0) + 1
  }

  const commitsByYear:  Record<string, number> = {}
  const commitsByMonth: Record<string, number> = {}
  const commitsByDay:   Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 }
  let totalCommits = 0
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  await Promise.all(
    repos.map(async (repo: any) => {
      try {
        let commitPage = 1
        let repoCommits: any[] = []
        while (true) {
          const res = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=100&page=${commitPage}&author=${GITHUB_USERNAME}`,
            { headers }
          )
          if (res.status === 409 || res.status === 404) break
          if (!res.ok) break
          const batch: any[] = await res.json()
          if (!Array.isArray(batch) || batch.length === 0) break
          repoCommits = repoCommits.concat(batch)
          if (batch.length < 100) break
          if (repoCommits.length >= 500) break
          commitPage++
        }
        if (repoCommits.length === 0) return
        for (const commit of repoCommits) {
          const dateStr: string | undefined =
            commit.commit?.author?.date ?? commit.commit?.committer?.date
          if (!dateStr) continue
          const date  = new Date(dateStr)
          const year  = date.getFullYear().toString()
          const month = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`
          const day   = DAY_NAMES[date.getDay()]
          commitsByYear[year]   = (commitsByYear[year]   ?? 0) + 1
          commitsByMonth[month] = (commitsByMonth[month] ?? 0) + 1
          commitsByDay[day]     = (commitsByDay[day]     ?? 0) + 1
        }
        totalCommits += repoCommits.length
      } catch { /* skip */ }
    })
  )

  const langTotal    = Object.values(langCount).reduce((s, v) => s + v, 0) || 1
  const topLanguages = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, cnt]) => ({ name, pct: Math.round((cnt / langTotal) * 100) }))

  const sortedMonths = Object.keys(commitsByMonth).sort()
  let maxStreak = 0, cur = 0
  for (const m of sortedMonths) {
    if ((commitsByMonth[m] ?? 0) > 0) { cur++; if (cur > maxStreak) maxStreak = cur }
    else cur = 0
  }

  return { totalRepos, totalCommits, commitsByYear, commitsByMonth, commitsByDay, stars, longestStreak: maxStreak, topLanguages }
}

// ─── Inline SVG line chart (matches Strava's ProgressionChart aesthetic) ─────

interface ChartPoint { label: string; value: number }

function CommitLineChart({ points }: { points: ChartPoint[] }) {
  const svgRef         = useRef<SVGSVGElement>(null)
  const [hovered, setHovered] = useState<number | null>(points.length - 1)
  const [w, setW]      = useState(0)

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setW(el.clientWidth))
    ro.observe(el)
    setW(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  const H    = 160
  const PAD  = { top: 16, bottom: 32, left: 44, right: 12 }
  const cH   = H - PAD.top - PAD.bottom
  const cW   = Math.max(w - PAD.left - PAD.right, 1)

  const peak    = Math.max(...points.map(p => p.value), 1)
  const niceMax = Math.ceil(peak / 10) * 10
  const yTicks  = [0, Math.round(niceMax / 2), niceMax]

  const xOf  = (i: number) => PAD.left + (i / Math.max(points.length - 1, 1)) * cW
  const yOf  = (v: number) => PAD.top  + cH - (v / niceMax) * cH

  const pts = points.map((p, i) => ({ x: xOf(i), y: yOf(p.value) }))

  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ')
  const area = pts.length > 0
    ? `M ${pts[0].x},${yOf(0)} ` +
      pts.map(p => `L ${p.x},${p.y}`).join(' ') +
      ` L ${pts[pts.length - 1].x},${yOf(0)} Z`
    : ''

  // Thin out x-axis labels so they don't collide
  const labelStep = points.length <= 6 ? 1 : points.length <= 12 ? 2 : Math.ceil(points.length / 6)

  return (
    <div className="relative w-full" style={{ height: H }}>
      <svg
        ref={svgRef}
        width="100%"
        height={H}
        viewBox={`0 0 ${w || 400} ${H}`}
        style={{ display: 'block', cursor: 'crosshair' }}
        onMouseLeave={() => setHovered(null)}
        onMouseMove={e => {
          if (!svgRef.current || w === 0) return
          const rect = svgRef.current.getBoundingClientRect()
          const mx   = e.clientX - rect.left
          // find closest point
          let best = 0, bestDist = Infinity
          pts.forEach((p, i) => {
            const d = Math.abs(p.x - mx)
            if (d < bestDist) { bestDist = d; best = i }
          })
          setHovered(best)
        }}
      >
        <defs>
          <linearGradient id="ghGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1a1a1a" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Y-axis background panel */}
        <rect x={0} y={0} width={PAD.left} height={H} fill="#EDE9E1" />

        {/* Gridlines + Y labels */}
        {yTicks.map((tick, ti) => (
          <g key={ti}>
            <line
              x1={PAD.left} y1={yOf(tick)}
              x2={(w || 400) - PAD.right} y2={yOf(tick)}
              stroke="#1a1a1a" strokeOpacity="0.06" strokeWidth="1"
            />
            <text
              x={PAD.left - 5} y={yOf(tick) + 4}
              textAnchor="end"
              fontSize={10} fill="#1a1a1a" fillOpacity="0.5"
              fontFamily="monospace"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* Area fill */}
        {w > 0 && <path d={area} fill="url(#ghGrad)" />}

        {/* Line */}
        {w > 0 && (
          <polyline
            points={polyline}
            fill="none" stroke="#1a1a1a" strokeOpacity="0.55" strokeWidth="1.5"
          />
        )}

        {/* Hovered column highlight */}
        {hovered !== null && (
          <>
            <line
              x1={pts[hovered]?.x} y1={PAD.top}
              x2={pts[hovered]?.x} y2={PAD.top + cH}
              stroke="#1a1a1a" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3"
            />
            <rect
              x={(pts[hovered]?.x ?? 0) - (cW / points.length) / 2}
              y={PAD.top}
              width={cW / points.length}
              height={cH}
              fill="#1a1a1a" fillOpacity="0.03" rx="2"
            />
          </>
        )}

        {/* Dots */}
        {w > 0 && pts.map((p, i) => {
          if (i === hovered) return null
          return (
            <circle
              key={i}
              cx={p.x} cy={p.y} r={2.5}
              fill="transparent"
              stroke="#1a1a1a" strokeOpacity="0.4" strokeWidth="1.5"
            />
          )
        })}

        {/* Hovered dot */}
        {hovered !== null && pts[hovered] && (
          <circle
            cx={pts[hovered].x} cy={pts[hovered].y} r={4}
            fill="#c0392b" fillOpacity={0.9}
            stroke="#EDE9E1" strokeWidth="1.5"
          />
        )}

        {/* X-axis labels */}
        {points.map((p, i) => {
          if (i % labelStep !== 0 && i !== points.length - 1) return null
          const x = xOf(i)
          if (x < PAD.left + 2) return null
          return (
            <text
              key={i}
              x={x} y={H - 4}
              textAnchor="middle"
              fontSize={10} fill="#1a1a1a" fillOpacity="0.35"
              fontFamily="monospace"
            >
              {p.label}
            </text>
          )
        })}

        {/* Hover tooltip value */}
        {hovered !== null && pts[hovered] && (
          <text
            x={Math.min(Math.max(pts[hovered].x, PAD.left + 20), (w || 400) - PAD.right - 20)}
            y={Math.max(pts[hovered].y - 8, PAD.top + 10)}
            textAnchor="middle"
            fontSize={10} fill="#1a1a1a" fillOpacity="0.7"
            fontFamily="monospace"
          >
            {points[hovered].value.toLocaleString()}
          </text>
        )}
      </svg>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function GitHubStatsBlock() {
  const [stats,   setStats]   = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [view,    setView]    = useState<View>('year')

  useEffect(() => {
    if (!GITHUB_USERNAME || !GITHUB_TOKEN) {
      setError('Set VITE_GITHUB_USERNAME and VITE_GITHUB_TOKEN in .env.local')
      setLoading(false)
      return
    }
    fetchGitHubStats()
      .then(s => { setStats(s); setLoading(false) })
      .catch(e => { setError(e.message ?? 'Failed to load'); setLoading(false) })
  }, [])

  const VIEWS: { key: View; label: string }[] = [
    { key: 'year',  label: 'Year'  },
    { key: 'month', label: 'Month' },
    { key: 'day',   label: 'Day'   },
  ]

  // Build chart point arrays
  const yearPoints: ChartPoint[] = stats
    ? Object.entries(stats.commitsByYear)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => ({ label: k, value: v }))
    : []

  const monthPoints: ChartPoint[] = stats
    ? Object.entries(stats.commitsByMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12)
        .map(([k, v]) => ({ label: k.slice(5), value: v }))   // "03" not "2025-03"
    : []

  const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dayPoints: ChartPoint[] = stats
    ? DAY_ORDER.map(d => ({ label: d, value: stats.commitsByDay[d] ?? 0 }))
    : []

  const chartPoints = view === 'year' ? yearPoints : view === 'month' ? monthPoints : dayPoints

  return (
    <div className="w-full border border-ink/10 bg-paper overflow-hidden">

      {/* Header — identical structure to StravaStats section header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-muted" aria-hidden="true">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577
              0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7
              3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236
              1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93
              0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322
              3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405
              2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84
              1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81
              2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592
              24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          <span className="font-mono text-xs text-muted tracking-widest uppercase">GitHub</span>
        </div>
        <div className="w-5 h-5 border-t-2 border-r-2 border-accent" />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-44 gap-3">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-accent"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <span className="font-mono text-[10px] text-muted/50 tracking-widest">
            FETCHING PRIVATE REPOS…
          </span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center h-44 gap-2 px-6 text-center">
          <span className="font-mono text-xs text-muted/60">{error}</span>
        </div>
      )}

      {/* Content */}
      {!loading && !error && stats && (
        <>
          {/* KPI row — styled like ProgressionPanel's summary row */}
          <div className="grid grid-cols-4 border-b border-ink/10">
            {[
              { n: stats.totalCommits.toLocaleString(), l: 'Commits' },
              { n: stats.totalRepos.toString(),         l: 'Repos'   },
              { n: stats.stars.toString(),              l: 'Stars'   },
              { n: `${stats.longestStreak}mo`,          l: 'Streak'  },
            ].map((s, i) => (
              <div
                key={i}
                className={`px-4 py-4 ${i < 3 ? 'border-r border-ink/10' : ''}`}
              >
                <p className="font-display text-2xl text-ink leading-none">{s.n}</p>
                <p className="font-mono text-[10px] text-muted/50 mt-1 uppercase tracking-widest">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Tab bar — matches StravaStats tab style exactly */}
          <div className="flex items-center gap-0 border-b border-ink/10">
            {VIEWS.map(v => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={`relative font-mono text-xs px-5 py-2.5 transition-colors ${
                  view === v.key ? 'text-accent' : 'text-muted hover:text-ink'
                }`}
              >
                {view === v.key && (
                  <motion.div
                    layoutId="gh-tab-indicator"
                    className="absolute inset-0 border-b-2 border-accent"
                  />
                )}
                {v.label}
              </button>
            ))}
          </div>

          {/* Chart area */}
          <div className="px-0 pt-2 pb-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {chartPoints.length > 0
                  ? <CommitLineChart points={chartPoints} />
                  : (
                    <div className="flex items-center justify-center h-40">
                      <span className="font-mono text-[10px] text-muted/40">No data</span>
                    </div>
                  )
                }
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Top languages */}
          {stats.topLanguages.length > 0 && (
            <div className="px-4 pt-3 pb-4 border-t border-ink/10">
              <p className="font-mono text-[10px] text-muted/50 tracking-widest uppercase mb-2.5">
                Top Languages
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {stats.topLanguages.map(l => (
                  <div key={l.name} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-accent flex-shrink-0" />
                    <span className="font-mono text-[10px] text-ink">{l.name}</span>
                    <span className="font-mono text-[10px] text-muted/60">{l.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-ink/10">
            <span className="font-mono text-[9px] text-muted/40">
              github.com/{GITHUB_USERNAME}
            </span>
            <div className="flex items-center gap-1.5">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-accent"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="font-mono text-[9px] text-muted/40">Live · private</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}