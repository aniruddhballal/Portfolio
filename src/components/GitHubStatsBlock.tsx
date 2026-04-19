import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Config — set these in .env.local ────────────────────────────────────────
//
//   VITE_GITHUB_USERNAME=your_username
//   VITE_GITHUB_TOKEN=github_pat_xxxxxxxxxxxxxxxx
//
// Token needs: repo (read-only fine-grained PAT is ideal)
//
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME as string
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string

// ─── Types ───────────────────────────────────────────────────────────────────

interface GitHubStats {
  totalRepos: number
  totalCommits: number
  commitsByYear: Record<string, number>
  commitsByMonth: Record<string, number>
  commitsByDay: Record<string, number>
  stars: number
  longestStreak: number
  topLanguages: { name: string; pct: number }[]
}

type View = 'year' | 'month' | 'day'

// ─── GitHub fetcher ──────────────────────────────────────────────────────────

async function fetchGitHubStats(): Promise<GitHubStats> {
  const headers: HeadersInit = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  // 1. All repos (including private), paginated
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
  const stars = repos.reduce((s: number, r: any) => s + (r.stargazers_count ?? 0), 0)

  // Language breakdown from repo metadata — instant, no extra API calls needed
  const langCount: Record<string, number> = {}
  for (const repo of repos) {
    if (repo.language) langCount[repo.language] = (langCount[repo.language] ?? 0) + 1
  }

  // 2. Fetch actual commits via /repos/:owner/:repo/commits
  //    This endpoint returns real data immediately — no 202 caching issues like stats/commit_activity.
  //    We filter by author so we only count our own commits.
  //    Safety cap: 500 commits per repo max to keep rate limit usage sane (5000 req/hr with PAT).
  const commitsByYear:    Record<string, number> = {}
  const commitsByMonth:   Record<string, number> = {}
  const commitsByDay:     Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 }
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
          // 409 = empty repo (no git history yet), 404 = no access — both are fine to skip
          if (res.status === 409 || res.status === 404) break
          if (!res.ok) break

          const batch: any[] = await res.json()
          if (!Array.isArray(batch) || batch.length === 0) break

          repoCommits = repoCommits.concat(batch)
          if (batch.length < 100) break                   // last page
          if (repoCommits.length >= 500) break            // safety cap
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
      } catch { /* skip repos that error */ }
    })
  )

  const langTotal = Object.values(langCount).reduce((s, v) => s + v, 0) || 1
  const topLanguages = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, cnt]) => ({ name, pct: Math.round((cnt / langTotal) * 100) }))

  // Longest active-month streak
  const sortedMonths = Object.keys(commitsByMonth).sort()
  let maxStreak = 0, cur = 0
  for (const m of sortedMonths) {
    if ((commitsByMonth[m] ?? 0) > 0) { cur++; if (cur > maxStreak) maxStreak = cur }
    else cur = 0
  }

  return {
    totalRepos, totalCommits, commitsByYear, commitsByMonth,
    commitsByDay,
    stars, longestStreak: maxStreak, topLanguages,
  }
}

// ─── Mini bar chart ──────────────────────────────────────────────────────────

function BarChart({
  data, labelKey, valueKey,
}: {
  data: Record<string, number> | { name: string; count: number }[]
  labelKey: string
  valueKey: string
}) {
  const entries: [string, number][] = Array.isArray(data)
    ? (data as any[]).map((d) => [d[labelKey], d[valueKey]])
    : Object.entries(data as Record<string, number>)

  const peak = Math.max(...entries.map(([, v]) => v), 1)

  return (
    <div className="flex items-end gap-1 h-16 w-full mt-2">
      {entries.map(([label, val], i) => {
        const pct = Math.max((val / peak) * 100, 2)
        const display = label.includes('-') ? label.slice(5) : label
        const trimmed = display.length > 8 ? display.slice(0, 7) + '…' : display
        return (
          <motion.div
            key={label}
            className="flex flex-col items-center flex-1 gap-1 group relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0
                            group-hover:opacity-100 bg-ink text-paper font-mono text-[9px]
                            px-1.5 py-0.5 whitespace-nowrap pointer-events-none z-10 transition-opacity">
              {val.toLocaleString()}
            </div>
            <motion.div
              className="w-full bg-accent/80 group-hover:bg-accent transition-colors"
              initial={{ height: 0 }}
              animate={{ height: `${(pct / 100) * 64}px` }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              style={{ minHeight: 2 }}
            />
            <span className="font-mono text-[8px] text-muted/60 truncate w-full text-center leading-none">
              {trimmed}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── GitHub stats block ──────────────────────────────────────────────────────
export default function GitHubStatsBlock() {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<View>('year')

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
    { key: 'year', label: 'Year' },
    { key: 'month', label: 'Month' },
    { key: 'day', label: 'Day' },
  ]

  const last12Months = stats
    ? Object.fromEntries(
      Object.entries(stats.commitsByMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12)
    )
    : {}

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
      {!loading && !error && stats && (
        <div className="p-4 space-y-4">

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-0 border border-ink/10">
            {[
              { n: stats.totalCommits.toLocaleString(), l: 'Commits' },
              { n: stats.totalRepos.toString(), l: 'Repos' },
              { n: stats.stars.toString(), l: 'Stars' },
              { n: `${stats.longestStreak}mo`, l: 'Streak' },
            ].map((s, i) => (
              <div key={i} className={`px-3 py-3 ${i < 3 ? 'border-r border-ink/10' : ''}`}>
                <p className="font-display text-xl text-ink tracking-wide">{s.n}</p>
                <p className="font-mono text-[10px] text-muted mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex">
            {VIEWS.map((v, i) => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={`flex-1 font-mono text-[10px] py-1.5 border border-ink/10 transition-colors
                            tracking-widest uppercase ${i > 0 ? '-ml-px' : ''}
                            ${view === v.key
                    ? 'bg-accent text-paper border-accent z-10'
                    : 'text-muted hover:text-ink hover:border-ink/30'}`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Chart */}
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'year' && <BarChart data={stats.commitsByYear} labelKey="year" valueKey="count" />}
              {view === 'month' && <BarChart data={last12Months} labelKey="month" valueKey="count" />}
              {view === 'day' && <BarChart data={stats.commitsByDay} labelKey="day" valueKey="count" />}
            </motion.div>
          </AnimatePresence>

          {/* Languages */}
          {stats.topLanguages.length > 0 && (
            <div>
              <p className="font-mono text-[10px] text-muted/50 tracking-widest uppercase mb-2">
                Top Languages
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {stats.topLanguages.map(l => (
                  <div key={l.name} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-accent flex-shrink-0" />
                    <span className="font-mono text-[10px] text-ink">{l.name}</span>
                    <span className="font-mono text-[10px] text-muted">{l.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-ink/10">
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
        </div>
      )}
    </div>
  )
}