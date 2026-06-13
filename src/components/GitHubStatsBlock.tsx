import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME as string
const GITHUB_TOKEN    = import.meta.env.VITE_GITHUB_TOKEN    as string

// ─── Types ───────────────────────────────────────────────────────────────────

interface GitHubStats {
  totalRepos:     number
  totalCommits:   number
  commitsByDate:  Record<string, number>   // "YYYY-MM-DD" → count
  commitsByYear:  Record<string, number>
  stars:          number
  longestStreak:  number
  topLanguages:   { name: string; pct: number }[]
  years:          number[]
}

// ─── GitHub fetcher ──────────────────────────────────────────────────────────

async function fetchGitHubStats(): Promise<GitHubStats> {
  const headers: HeadersInit = {
    'Authorization':        `Bearer ${GITHUB_TOKEN}`,
    'Accept':               'application/vnd.github+json',
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

  const commitsByDate: Record<string, number> = {}
  const commitsByYear: Record<string, number> = {}
  let totalCommits = 0

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
          const ymd   = dateStr.slice(0, 10)   // "YYYY-MM-DD"
          commitsByDate[ymd]  = (commitsByDate[ymd]  ?? 0) + 1
          commitsByYear[year] = (commitsByYear[year] ?? 0) + 1
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

  // Longest active-month streak
  const allMonths = new Set(Object.keys(commitsByDate).map(d => d.slice(0, 7)))
  const sortedMonths = [...allMonths].sort()
  let maxStreak = 0, cur = 0
  for (const m of sortedMonths) {
    cur = [...Object.keys(commitsByDate)].some(d => d.startsWith(m)) ? cur + 1 : 0
    if (cur > maxStreak) maxStreak = cur
  }

  const years = [...new Set(Object.keys(commitsByDate).map(d => parseInt(d.slice(0, 4))))]
    .sort((a, b) => a - b)

  return { totalRepos, totalCommits, commitsByDate, commitsByYear, stars, longestStreak: maxStreak, topLanguages, years }
}

// ─── Contribution heatmap ─────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

/** Build the week-column grid for a given year, Sunday-anchored like GitHub */
function buildYearGrid(year: number, commitsByDate: Record<string, number>) {
  // Jan 1 of the year
  const jan1    = new Date(year, 0, 1)
  // Dec 31 of the year
  const dec31   = new Date(year, 11, 31)

  // We want Mon-anchored rows (GitHub uses Sun; we'll use Mon to match EU convention)
  // dayOfWeek: Mon=0 … Sun=6
  const dowMon = (d: Date) => (d.getDay() + 6) % 7

  // Pad back to the Monday on or before Jan 1
  const start = new Date(jan1)
  start.setDate(start.getDate() - dowMon(jan1))

  // Pad forward to the Sunday on or after Dec 31
  const end = new Date(dec31)
  const remaining = 6 - dowMon(dec31)
  end.setDate(end.getDate() + remaining)

  // Build week columns
  type Cell = { date: string; count: number; inYear: boolean }
  const weeks: Cell[][] = []
  const cur = new Date(start)

  while (cur <= end) {
    const week: Cell[] = []
    for (let d = 0; d < 7; d++) {
      const iso    = cur.toISOString().slice(0, 10)
      const inYear = cur.getFullYear() === year
      week.push({ date: iso, count: inYear ? (commitsByDate[iso] ?? 0) : -1, inYear })
      cur.setDate(cur.getDate() + 1)
    }
    weeks.push(week)
  }

  // Month label positions: place only at weeks containing the 1st of that month,
  // skipping padding weeks — prevents Dec/Jan collision at year boundaries.
  const monthLabels: { month: number; weekIdx: number }[] = []
  const seen = new Set<number>()
  weeks.forEach((week, wi) => {
    const monthStart = week.find(c => c.inYear && new Date(c.date).getDate() === 1)
    if (!monthStart) return
    const m = new Date(monthStart.date).getMonth()
    if (!seen.has(m)) { seen.add(m); monthLabels.push({ month: m, weekIdx: wi }) }
  })

  return { weeks, monthLabels }
}

/** Map commit count to an opacity level (0–4 scale, ink-based) */
function countToLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count <= 3)  return 2
  if (count <= 6)  return 3
  return 4
}

const LEVEL_OPACITY = ['0.06', '0.20', '0.40', '0.62', '0.85'] as const

function ContributionGrid({
  year, commitsByDate,
}: {
  year: number
  commitsByDate: Record<string, number>
}) {
  const { weeks, monthLabels } = buildYearGrid(year, commitsByDate)
  const [tooltip, setTooltip]  = useState<{ date: string; count: number; x: number; y: number } | null>(null)
  const containerRef           = useRef<HTMLDivElement>(null)

  // Responsive cell size
  const [cellSize, setCellSize] = useState(11)
  const gap = 2

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const avail = el.clientWidth
      const size  = Math.max(8, Math.min(12, Math.floor((avail - (weeks.length - 1) * gap) / weeks.length)))
      setCellSize(size)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [weeks.length])

  return (
    <div ref={containerRef} className="w-full select-none">
      {/* Month labels row */}
      <div className="relative mb-1" style={{ height: 14 }}>
        {monthLabels.map(({ month, weekIdx }) => {
          // Hide labels for months that are entirely in the future
          const today = new Date()
          const labelYear = year
          const labelMonth = month
          if (labelYear > today.getFullYear()) return null
          if (labelYear === today.getFullYear() && labelMonth > today.getMonth()) return null
          return (
            <span
              key={month}
              className="absolute font-mono text-[9px] text-muted/50 leading-none"
              style={{ left: weekIdx * (cellSize + gap), top: 0 }}
            >
              {MONTHS[month]}
            </span>
          )
        })}
      </div>

      {/* Grid: week columns only */}
      <div className="flex" style={{ gap }}>
          {weeks.map((week, wi) => {
            const todayIso = new Date().toISOString().slice(0, 10)
            const allFuture = week.every(c => !c.inYear || c.date > todayIso)
            if (allFuture) return null
            return (
            <div key={wi} className="flex flex-col" style={{ gap }}>
              {week.map((cell, di) => {
                const today    = todayIso
                const isFuture = cell.inYear && cell.date > today
                const isToday  = cell.date === today
                const level    = cell.inYear && !isFuture && cell.count >= 0 ? countToLevel(cell.count) : -1
                const isEmpty  = level === -1

                return (
                  <div
                    key={di}
                    style={{
                      width:        cellSize,
                      height:       cellSize,
                      borderRadius: 2,
                      backgroundColor: isFuture
                        ? 'transparent'
                        : isEmpty
                          ? 'rgba(26,26,26,0.05)'
                          : `rgba(26,26,26,${LEVEL_OPACITY[level as 0|1|2|3|4]})`,
                      outline: isToday ? '1.5px solid rgba(192,57,43,0.5)' : 'none',
                      outlineOffset: '-1px',
                      cursor:    cell.inYear && !isFuture ? 'crosshair' : 'default',
                      flexShrink: 0,
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={e => {
                      if (!cell.inYear || isFuture) return
                      const rect = (e.target as HTMLElement).getBoundingClientRect()
                      const parentRect = containerRef.current!.getBoundingClientRect()
                      setTooltip({
                        date:  cell.date,
                        count: cell.count,
                        x: rect.left - parentRect.left + cellSize / 2,
                        y: rect.top  - parentRect.top,
                      })
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              })}
            </div>
          )})}
        </div>

      {/* Tooltip — flips below the cell if near the top to avoid clipping */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            key={tooltip.date}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute z-20 pointer-events-none bg-ink text-paper font-mono text-[9px] px-2 py-1 whitespace-nowrap"
            style={{
              left:      tooltip.x,
              top:       tooltip.y < 32 ? tooltip.y + cellSize + 6 : tooltip.y - 28,
              transform: 'translateX(-50%)',
            }}
          >
            {tooltip.count === 0
              ? `No commits · ${tooltip.date}`
              : `${tooltip.count} commit${tooltip.count !== 1 ? 's' : ''} · ${tooltip.date}`
            }
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function GitHubStatsBlock() {
  const [stats,      setStats]      = useState<GitHubStats | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [activeYear, setActiveYear] = useState<number | null>(null)

  useEffect(() => {
    if (!GITHUB_USERNAME || !GITHUB_TOKEN) {
      setError('Set VITE_GITHUB_USERNAME and VITE_GITHUB_TOKEN in .env.local')
      setLoading(false)
      return
    }
    fetchGitHubStats()
      .then(s => {
        setStats(s)
        setActiveYear(s.years[s.years.length - 1] ?? null)
        setLoading(false)
      })
      .catch(e => { setError(e.message ?? 'Failed to load'); setLoading(false) })
  }, [])

  return (
    <div className="w-full border border-ink/10 bg-paper overflow-hidden">

      {/* Header */}
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
      {!loading && !error && stats && activeYear && (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-4 border-b border-ink/10">
            {[
              { n: stats.totalCommits.toLocaleString(), l: 'Commits' },
              { n: stats.totalRepos.toString(),         l: 'Repos'   },
              { n: stats.stars.toString(),              l: 'Stars'   },
              { n: `${stats.longestStreak}mo`,          l: 'Streak'  },
            ].map((s, i) => (
              <div key={i} className={`px-4 py-3 ${i < 3 ? 'border-r border-ink/10' : ''}`}>
                <p className="font-display text-xl md:text-2xl text-ink leading-none">{s.n}</p>
                <p className="font-mono text-[10px] text-muted/50 mt-1 uppercase tracking-widest">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Year switcher + commit count for selected year */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-ink/10">
            <div className="flex items-center gap-0">
              {stats.years.map(y => (
                <button
                  key={y}
                  onClick={() => setActiveYear(y)}
                  className={`relative font-mono text-xs px-3 py-1.5 transition-colors ${
                    activeYear === y ? 'text-accent' : 'text-muted hover:text-ink'
                  }`}
                >
                  {activeYear === y && (
                    <motion.div
                      layoutId="gh-year-indicator"
                      className="absolute inset-0 border-b-2 border-accent"
                    />
                  )}
                  {y}
                </button>
              ))}
            </div>
            <span className="font-mono text-[10px] text-muted/50">
              {(stats.commitsByYear[activeYear] ?? 0).toLocaleString()} commits
            </span>
          </div>

          {/* Heatmap */}
          <div className="relative px-4 py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeYear}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
              >
                <ContributionGrid year={activeYear} commitsByDate={stats.commitsByDate} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 px-4 pb-3 justify-end">
            <span className="font-mono text-[9px] text-muted/40 mr-1">Less</span>
            {([0, 1, 2, 3, 4] as const).map(l => (
              <div
                key={l}
                style={{
                  width: 10, height: 10, borderRadius: 2,
                  backgroundColor: l === 0 ? 'rgba(26,26,26,0.06)' : `rgba(26,26,26,${LEVEL_OPACITY[l]})`,
                }}
              />
            ))}
            <span className="font-mono text-[9px] text-muted/40 ml-1">More</span>
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