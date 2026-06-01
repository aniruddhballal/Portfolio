import { motion } from 'framer-motion'
import type { StravaData } from '../../data/strava-types'

interface PBListProps {
  pbs: StravaData['run']['pbs']
  direction?: number
}

export default function PBList({ pbs, direction = -1 }: PBListProps) {
  return (
    <>
      <div className="px-5 py-3 border-b border-ink/10">
        <span className="font-mono text-xs text-muted/50 tracking-widest uppercase">Personal bests</span>
      </div>
      <div className="divide-y divide-ink/[0.06]">
        {pbs.map((pb, i) => (
          <motion.div
            key={pb.label}
            className="flex items-center justify-between px-5 py-2.5"
            initial={{ opacity: 0, x: direction * 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <span className="font-body text-sm text-muted">{pb.label}</span>
            <span className="font-mono text-sm text-ink font-medium">{pb.time}</span>
          </motion.div>
        ))}
      </div>
    </>
  )
}