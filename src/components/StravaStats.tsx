import { motion } from 'framer-motion'

// ── Strava data (hardcoded — update manually or swap for API later) ──────
const runningStats = {
  allTime: { activities: 293, distanceKm: 1525.8, timeHours: 138, elevGainM: 7652 },
  last4Weeks: { activitiesPerWeek: 8, avgDistKm: 51.4, avgTimeHm: '4h 50m', elevGainM: 142 },
  pbs: [
    { label: '5K (1st December 2025)',            time: '20:44' },
    { label: '10K (7th April 2026)',              time: '46:02' },
    { label: '15K (9th April 2026)',              time: '1:15:48' },
    { label: 'Half-Marathon (26th January 2026)', time: '1:57:42' },
    { label: '30K (15th November 2025)',          time: '3:13:44' },
    { label: 'Marathon (15th November 2025)',     time: '4:32:14' },
    { label: '50K (15th November 2025)',          time: '5:24:45' },
  ],
}

const cyclingStats = {
  allTime: { activities: 152, distanceKm: 2168.1, timeHours: 222.34, elevGainM: 15790 },
  pbs: [
    { label: '5K (9th July 2025)',  time: '7:51' },
    { label: '10K (9th July 2025)', time: '16:49' },
    { label: '20K (9th July 2025)', time: '38:14' },
    { label: '30K (9th July 2025)', time: '57:30' },
    { label: '40K (9th July 2025)', time: '1:20:04' },
    { label: '50K (9th July 2025)', time: '1:44:05' },
    { label: '77.8K (1st May 2024)', time: '3:22:52' },
  ],
}

const STRAVA_URL = 'https://www.strava.com/athletes/111442086'

export default function StravaStats() {
  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-4 mb-6">
        <span className="font-mono text-xs text-muted tracking-widest uppercase">Endurance</span>
        <div className="flex-1 h-px bg-ink/10" />
        <motion.a
          href={STRAVA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-mono text-xs text-muted border border-ink/15 px-3 py-1.5 hover:border-accent hover:text-accent transition-colors flex-shrink-0"
          whileHover={{ scale: 1.02 }}
          data-hover
        >
          {/* Strava-ish icon */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0 0 13.828h4.172"/>
          </svg>
          View on Strava
        </motion.a>
      </div>

      {/* Running + Cycling side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

        {/* Running */}
        <motion.div
          className="border border-ink/10 overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="px-5 py-4 border-b border-ink/10 flex items-center justify-between">
            <span className="font-mono text-xs text-muted tracking-widest uppercase">Running (as of 28th May 2026)</span>
            <span className="font-mono text-xs text-muted/40">
              {runningStats.allTime.activities} activities · {runningStats.allTime.distanceKm.toLocaleString()} km
            </span>
          </div>

          {/* Weekly snapshot */}
          <div className="grid grid-cols-3 gap-0 border-b border-ink/10">
            {[
              { n: `${runningStats.last4Weeks.avgDistKm} km`, l: 'Avg / week' },
              { n: runningStats.last4Weeks.avgTimeHm,         l: 'Time / week' },
              { n: `${runningStats.last4Weeks.activitiesPerWeek}`, l: 'Runs / week' },
            ].map((s, i) => (
              <div key={i} className={`px-4 py-4 ${i < 2 ? 'border-r border-ink/10' : ''}`}>
                <p className="font-display text-2xl text-ink tracking-wide leading-none">{s.n}</p>
                <p className="font-mono text-xs text-muted mt-1">{s.l}</p>
              </div>
            ))}
          </div>

          {/* PBs */}
          <div className="px-5 py-3 border-b border-ink/10">
            <span className="font-mono text-xs text-muted/50 tracking-widest uppercase">Personal bests</span>
          </div>
          <div className="divide-y divide-ink/[0.06]">
            {runningStats.pbs.map((pb, i) => (
              <motion.div
                key={pb.label}
                className="flex items-center justify-between px-5 py-2.5"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <span className="font-body text-sm text-muted">{pb.label}</span>
                <span className="font-mono text-sm text-ink font-medium">{pb.time}</span>
              </motion.div>
            ))}
          </div>

          {/* All-time footer */}
          <div className="px-5 py-3 bg-ink/[0.02]">
            <span className="font-mono text-xs text-muted/50">
              {runningStats.allTime.timeHours}h total · {runningStats.allTime.elevGainM.toLocaleString()}m elevation
            </span>
          </div>
        </motion.div>

        {/* Cycling */}
        <motion.div
          className="border border-ink/10 overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="px-5 py-4 border-b border-ink/10 flex items-center justify-between">
            <span className="font-mono text-xs text-muted tracking-widest uppercase">Cycling (As of 9th July 2025)</span>
            <span className="font-mono text-xs text-muted/40">
              {cyclingStats.allTime.activities} activities
            </span>
          </div>

          {/* All-time stats */}
          <div className="grid grid-cols-3 gap-0 border-b border-ink/10">
            {[
              { n: `${cyclingStats.allTime.distanceKm.toLocaleString()} km`, l: 'Total distance' },
              { n: `${cyclingStats.allTime.timeHours}h`,                     l: 'Total time' },
              { n: `${(cyclingStats.allTime.elevGainM / 1000).toFixed(1)}k m`, l: 'Elevation' },
            ].map((s, i) => (
              <div key={i} className={`px-4 py-4 ${i < 2 ? 'border-r border-ink/10' : ''}`}>
                <p className="font-display text-xl md:text-2xl text-ink tracking-wide leading-none">{s.n}</p>
                <p className="font-mono text-xs text-muted mt-1">{s.l}</p>
              </div>
            ))}
          </div>

          {/* PBs */}
          <div className="px-5 py-3 border-b border-ink/10">
            <span className="font-mono text-xs text-muted/50 tracking-widest uppercase">Personal bests</span>
          </div>
          <div className="divide-y divide-ink/[0.06]">
            {cyclingStats.pbs.map((pb, i) => (
              <motion.div
                key={pb.label}
                className="flex items-center justify-between px-5 py-2.5"
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <span className="font-body text-sm text-muted">{pb.label}</span>
                <span className="font-mono text-sm text-ink font-medium">{pb.time}</span>
              </motion.div>
            ))}
          </div>

          {/* Note */}
          <div className="px-5 py-3 bg-ink/[0.02]">
            <span className="font-mono text-xs text-muted/50">Ultramarathon · Triathlon · Self-supported</span>
          </div>
        </motion.div>

      </div>
    </div>
  )
}