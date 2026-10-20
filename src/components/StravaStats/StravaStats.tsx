import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import stravaData from '../../data/strava.json'
import type { StravaData } from '../../data/strava-types'
import AllTimeCards from './AllTimeCards/AllTimeCards'
import ProgressionPanel from './ProgressionPanel/ProgressionPanel'

const data = stravaData as StravaData
const STRAVA_URL = 'https://www.strava.com/athletes/111442086'

type Tab = 'overall' | 'weekly' | 'monthly' | 'annual'

const TABS: { key: Tab; label: string }[] = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'annual', label: 'Annual' },
  { key: 'overall', label: 'Overall' },
]

export default function StravaStats() {
  const [tab, setTab] = useState<Tab>('weekly')

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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0 0 13.828h4.172" />
          </svg>
          View on Strava
        </motion.a>
      </div>

      {/* Tab bar */}
      <div className="grid grid-cols-4 items-stretch border border-ink/15 mb-6 w-full max-w-[520px]">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative font-mono text-xs px-2 md:px-4 py-3 transition-colors ${tab === t.key ? 'text-paper bg-ink' : 'text-ink/60 hover:text-ink hover:bg-ink/[0.04]'
              }`}
          >
            {tab === t.key && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-accent pointer-events-none"
              />
            )}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'overall' && <AllTimeCards />}
          {tab === 'weekly' && <ProgressionPanel mode="weekly" />}
          {tab === 'monthly' && <ProgressionPanel mode="monthly" />}
          {tab === 'annual' && <ProgressionPanel mode="annual" />}
        </motion.div>
      </AnimatePresence>

      <p className="font-mono text-[10px] text-ink/45 mt-4 text-right">
        Last synced: {new Date(data.fetchedAt).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short', year: 'numeric',
        })}
      </p>
    </div>
  )
}
