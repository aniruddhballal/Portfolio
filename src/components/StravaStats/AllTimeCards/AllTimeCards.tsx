import { motion } from 'framer-motion'
import stravaData from '../../../data/strava.json'
import type { StravaData } from '../../../data/strava-types'
import StatCell from './StatCell'
import PBList from './PBList'
import { fmtDist, fmtHours, fmtElev } from '../utils/strava-utils'

const data = stravaData as StravaData

export default function AllTimeCards() {
  const { run, ride } = data
  const fetchedDate = new Date(data.fetchedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* Running card */}
      <motion.div
        className="border border-ink/10 overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="px-5 py-4 border-b border-ink/10 flex items-center justify-between flex-wrap gap-1">
          <span className="font-mono text-xs text-muted tracking-widest uppercase">Running</span>
          <span className="font-mono text-xs text-muted/40">
            {run.allTime.activities} activities · {fmtDist(run.allTime.distanceKm)} km
          </span>
        </div>
        <div className="grid grid-cols-3 gap-0 border-b border-ink/10">
          <StatCell value={`${fmtDist(run.allTime.distanceKm)} km`} label="Total distance" />
          <StatCell value={fmtHours(run.allTime.timeHours)} label="Total time" />
          <StatCell value={fmtElev(run.allTime.elevGainM)} label="Elevation" border={false} />
        </div>
        <PBList pbs={run.pbs} direction={-1} />
        <div className="px-5 py-3 bg-ink/[0.02]">
          <span className="font-mono text-xs text-muted/50">As of {fetchedDate}</span>
        </div>
      </motion.div>

      {/* Cycling card */}
      <motion.div
        className="border border-ink/10 overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="px-5 py-4 border-b border-ink/10 flex items-center justify-between flex-wrap gap-1">
          <span className="font-mono text-xs text-muted tracking-widest uppercase">Cycling</span>
          <span className="font-mono text-xs text-muted/40">
            {ride.allTime.activities} activities · {fmtDist(ride.allTime.distanceKm)} km
          </span>
        </div>
        <div className="grid grid-cols-3 gap-0 border-b border-ink/10">
          <StatCell value={`${fmtDist(ride.allTime.distanceKm)} km`} label="Total distance" />
          <StatCell value={fmtHours(ride.allTime.timeHours)} label="Total time" />
          <StatCell value={fmtElev(ride.allTime.elevGainM)} label="Elevation" border={false} />
        </div>
        <PBList pbs={ride.pbs} direction={1} />
        <div className="px-5 py-3 bg-ink/[0.02]">
          <span className="font-mono text-xs text-muted/50">Ultramarathon · Triathlon · Self-supported</span>
        </div>
      </motion.div>
    </div>
  )
}