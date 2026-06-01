// ── Formatting helpers ────────────────────────────────────────────────────────

export function fmtDist(km: number) {
  return km.toFixed(1)
}

export function fmtHours(h: number) {
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  if (hrs === 0) return `${mins}m`
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`
}

export function fmtElev(m: number) {
  return `${Math.round(m)} m`
}

// ── Date/label helpers ────────────────────────────────────────────────────────

/** X-axis label: e.g. "9 Mar" */
export function weekLabelAxis(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

/** Hover tooltip: full range e.g. "7 Jul 2025 – 13 Jul 2025" */
export function weekRangeLabel(iso: string) {
  const start = new Date(iso)
  const end = new Date(iso)
  end.setDate(end.getDate() + 6)
  const s = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const e = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  return `${s} – ${e}`
}

/** Header range start: e.g. "9 Mar 2025" */
export function weekStartLabel(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Header range end (adds 6 days): e.g. "31 May 2026" */
export function weekEndLabel(iso: string) {
  const end = new Date(iso)
  end.setDate(end.getDate() + 6)
  return end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Monthly x-axis: "Jan", "Feb", etc. */
export function monthLabelAxis(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { month: 'short' })
}