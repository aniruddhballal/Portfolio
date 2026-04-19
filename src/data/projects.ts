export interface Project {
  id: number
  name: string
  tagline: string
  description: string
  tech: string[]
  category: string
  url: string
  year: string
  color: string
}

export const projects: Project[] = [
  {
    id: 1,
    name: 'Sprint Sync',
    tagline: 'Async standups for distributed teams',
    description:
      'Small teams were spending 45 minutes every morning in status meetings that could have been a Slack message. Sprint Sync replaces the daily standup with an async data layer — each team member answers three questions asynchronously, the system surfaces blockers automatically, and managers get a real-time velocity dashboard without scheduling a single meeting.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'WebSockets'],
    category: 'SaaS',
    url: 'https://example.com',
    year: '2024',
    color: '#2D6A4F',
  },
  {
    id: 2,
    name: 'Glyph Store',
    tagline: 'Marketplace for independent digital creators',
    description:
      'Independent creators were losing 30%+ to platform fees and fighting confusing payout systems. Glyph Store is an end-to-end e-commerce platform for selling digital goods — it handles Stripe payments, instant file delivery, automated VAT calculations for EU sales, and a clean storefront that\'s fully customisable. Creators keep more, ship faster, and own their audience.',
    tech: ['Next.js', 'Stripe', 'Prisma', 'S3'],
    category: 'E-commerce',
    url: 'https://example.com',
    year: '2024',
    color: '#7B2D8B',
  },
  {
    id: 3,
    name: 'Markup',
    tagline: 'Real-time UI annotation for design reviews',
    description:
      'Design reviews were happening in email threads with screenshots numbered "final_v3_ACTUAL_final.png". Markup lets design teams annotate live URLs directly — leave comments pinned to exact elements, resolve threads, and track changes across iterations. Built on WebSockets for zero-latency collaboration and Redis for persistent session state.',
    tech: ['Vue.js', 'WebSockets', 'Redis', 'Express'],
    category: 'Tool',
    url: 'https://example.com',
    year: '2023',
    color: '#B5451B',
  },
  {
    id: 4,
    name: 'Logbook',
    tagline: 'Structured journaling with AI reflection',
    description:
      'Most journaling apps are just text editors with a calendar. Logbook uses structured prompts that adapt to your patterns — it identifies recurring themes, surfaces entries you might want to revisit, and generates monthly reflection summaries. The AI layer never reads your entries directly; it works on extracted metadata to keep everything private.',
    tech: ['React Native', 'FastAPI', 'SQLite', 'OpenAI'],
    category: 'Mobile App',
    url: 'https://example.com',
    year: '2024',
    color: '#1A3A5C',
  },
  {
    id: 5,
    name: 'Parcel',
    tagline: 'Internal logistics tracker for SMEs',
    description:
      'A mid-size furniture company was tracking 200+ daily shipments in a shared spreadsheet. Parcel is a white-label logistics dashboard that integrates with major courier APIs, sends automated customer notifications, flags delayed shipments before customers complain, and gives ops teams a live map view of all active deliveries.',
    tech: ['React', 'Django', 'Celery', 'Google Maps API'],
    category: 'Dashboard',
    url: 'https://example.com',
    year: '2023',
    color: '#5C4A1A',
  },
  {
    id: 6,
    name: 'Cuecard',
    tagline: 'Spaced-repetition learning for developers',
    description:
      'Developers forget syntax constantly — not because they\'re bad at their jobs, but because spaced repetition tools aren\'t built for code. Cuecard uses the SM-2 algorithm with a code editor embedded in each card, so you practice typing actual syntax rather than just recognising it. Supports 30+ languages with syntax highlighting.',
    tech: ['SvelteKit', 'Deno', 'IndexedDB', 'Monaco Editor'],
    category: 'EdTech',
    url: 'https://example.com',
    year: '2023',
    color: '#1A4D4A',
  },
  {
    id: 7,
    name: 'Heatmap.fyi',
    tagline: 'No-cookie analytics for indie makers',
    description:
      'Google Analytics is overkill for a side project and illegal in Germany without a cookie banner. Heatmap.fyi is a privacy-first analytics tool — no cookies, no fingerprinting, just a 2KB script that tracks clicks and scroll depth. Self-hosted or cloud, with a one-page dashboard that shows exactly what matters. GDPR-compliant out of the box.',
    tech: ['Go', 'ClickHouse', 'React', 'TypeScript'],
    category: 'Analytics',
    url: 'https://example.com',
    year: '2024',
    color: '#3D1A5C',
  },
  {
    id: 8,
    name: 'Recipebook',
    tagline: 'Household recipe manager with smart scaling',
    description:
      'Recipe apps are either too simple or buried under monetisation. Recipebook is a household-scale recipe manager — it scales ingredient amounts dynamically, generates grocery lists grouped by supermarket aisle, and tracks what\'s already in your pantry to suggest meals before things expire. Built as a PWA that works fully offline.',
    tech: ['React', 'Supabase', 'PWA', 'TypeScript'],
    category: 'Consumer App',
    url: 'https://example.com',
    year: '2023',
    color: '#4A1A2D',
  },
  {
    id: 9,
    name: 'Relay',
    tagline: 'Webhook testing and replay tool',
    description:
      'Testing webhooks locally is a pain — ngrok tunnels expire, Stripe test events are hard to trigger, and debugging payload parsing means re-triggering events manually every time. Relay is a developer tool that captures, inspects, and replays webhook events. It stores a 30-day history, lets you modify payloads before replaying, and has a diff view for payload changes between events.',
    tech: ['Rust', 'React', 'SQLite', 'Axum'],
    category: 'Developer Tool',
    url: 'https://example.com',
    year: '2024',
    color: '#1A2D4A',
  },
  {
    id: 10,
    name: 'Folio',
    tagline: 'Investment tracker without the noise',
    description:
      'Most portfolio trackers are either too complex or push brokerage integrations. Folio is a manual-entry investment tracker focused on clarity — you log trades, it calculates XIRR returns, tax lots, and realised/unrealised P&L. No ads, no upsells, no connecting your brokerage. Just clean numbers and a net worth timeline that actually makes sense.',
    tech: ['Next.js', 'Drizzle ORM', 'PostgreSQL', 'Recharts'],
    category: 'FinTech',
    url: 'https://example.com',
    year: '2024',
    color: '#1A3A1A',
  },
]
