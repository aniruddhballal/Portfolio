export interface Project {
  id: number;
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  category: string;
  url: string | null; // Live demo or published download, when available.
  urlLabel?: string;
  repo: string | null; // Public source only.
  year: string;
  color: string;
}

export const projects: Project[] = [
  {
    id: 1,
    name: "Sunalyse",
    tagline: "Explore 14 years of the Sun's magnetic field in 3D",
    description:
      "An interactive 3D viewer built from NASA/SDO magnetograms across 181 Carrington rotations. A Python PFSS pipeline reconstructs coronal field lines, with adaptive seeds placed in strong magnetic regions. In the browser, explore the photosphere, open and closed field lines, and source-surface polarity; filter by height and polarity or play through the solar-cycle archive.",
    tech: ["React", "TypeScript", "Three.js", "Python", "SciPy", "PFSS"],
    category: "Simulation",
    url: "https://sunalyse.vercel.app",
    repo: "https://github.com/aniruddhballal/sunalyse",
    year: "2025",
    color: "#B5451B",
  },
  {
    id: 2,
    name: "SatLies",
    tagline: "Shape an orbit. See what makes it drift.",
    description:
      "A browser-based orbital mechanics sandbox for seeing how ideal orbits drift under additional forces. Shape a satellite's orbit, change Earth's oblateness, and compare a clean two-body baseline with J2, lunar, and solar gravity. A fixed-step RK4 integrator runs locally, while a Three.js scene, live metrics, and separation graphs make the differences visible.",
    tech: [
      "React",
      "TypeScript",
      "Three.js",
      "React Three Fiber",
      "Zustand",
      "Recharts",
    ],
    category: "Simulation",
    url: "https://satlies.vercel.app",
    repo: "https://github.com/aniruddhballal/SatLies",
    year: "2026",
    color: "#2D3A6B",
  },
  {
    id: 3,
    name: "Queen's Gambit 2.0",
    tagline: "Hide files in chess moves, with Rust-powered encoding",
    description:
      "A browser-based steganography tool that maps file bits to legal chess moves and decodes them back. Rust, WebAssembly, and Web Workers keep the encoding work off the interface thread, with optional AES-256-GCM password protection. In the documented 32 KB benchmark, the rewrite reduced encoding time from 3m 15s to 5.2 seconds. File processing stays in the browser.",
    tech: [
      "React",
      "TypeScript",
      "Rust",
      "WebAssembly",
      "Web Workers",
      "Web Crypto",
    ],
    category: "Security",
    url: "https://queens-gambit-2-0.vercel.app",
    repo: "https://github.com/aniruddhballal/queens-gambit-2.0",
    year: "2025",
    color: "#1A2D4A",
  },
  {
    id: 4,
    name: "mp3fy",
    tagline: "My music library, with the useful parts of Spotify",
    description:
      "A local MP3 player I built as my alternative to Spotify. Browse folders on an Android phone or SD card, search tracks, reorder the queue, and keep listening in the background. On-demand synced lyrics sit alongside Wrapped-style listening stats and artist/song rankings. Playback state and listening history stay on the phone, with portable backups for reinstalls.",
    tech: ["React Native", "Expo", "TypeScript", "SQLite", "LRCLIB"],
    category: "Independent tools",
    url: "https://raw.githubusercontent.com/aniruddhballal/mp3fy/main/mp3fy.apk",
    urlLabel: "Download APK",
    repo: "https://github.com/aniruddhballal/mp3fy",
    year: "2026",
    color: "#4A5230",
  },
  {
    id: 5,
    name: "kNupdate",
    tagline: "Small updates for your people, without the social feed",
    description:
      "An Android alternative to social feeds, built around small updates about everyday life. Pair devices with invite codes and send to selected connections (a leaf) or broadcast to the active tree. Sent and received histories stay on the devices. A Cloudflare relay forwards activity payloads and discards them after acknowledgement or 30 seconds, without keeping a permanent server-side activity history.",
    tech: [
      "Kotlin",
      "Jetpack Compose",
      "SQLite",
      "Cloudflare Workers",
      "Durable Objects",
    ],
    category: "Independent tools",
    url: "https://raw.githubusercontent.com/aniruddhballal/kNupdate/main/kNupdate.apk",
    urlLabel: "Download APK",
    repo: "https://github.com/aniruddhballal/kNupdate",
    year: "2026",
    color: "#3A6044",
  },
  {
    id: 6,
    name: "dedgram",
    tagline: "Investigating the bot-like accounts behind the endless scroll",
    description:
      "A research toolkit for looking past Instagram reels and examining suspected automated accounts. An Android capture app builds a candidate catalog; a Playwright collector gathers profile details, reel metadata, and visible engagement figures. A public atlas turns reviewed snapshots into profile records and comparisons, preserving source evidence, changing usernames, and missing fields rather than presenting suspicion as conclusive bot detection.",
    tech: [
      "Java",
      "Android",
      "Node.js",
      "Playwright",
      "JavaScript",
      "HTML/CSS",
    ],
    category: "Independent tools",
    url: "https://dedgram.vercel.app",
    urlLabel: "Explore the atlas",
    repo: "https://github.com/aniruddhballal/dedgram",
    year: "2026",
    color: "#5C3E38",
  },
  {
    id: 7,
    name: "LOANlo",
    tagline: "Loan origination, from application to underwriting",
    description:
      "A loan origination system for applicants, underwriters, and administrators. Applicants complete onboarding, upload documents, and track reviews; underwriters request information and approve or reject applications. GridFS stores supporting files, while status histories, soft deletion, and admin-led restoration preserve the lifecycle. A Python credit-risk service supports reviews, with Gmail notifications and session controls connecting the workflow.",
    tech: [
      "React",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "GridFS",
      "Python",
      "FastAPI",
    ],
    category: "FinTech",
    url: "https://loanlo.vercel.app",
    repo: "https://github.com/aniruddhballal/LOANlo",
    year: "2025",
    color: "#5C3A1A",
  },
  {
    id: 8,
    name: "VenPay",
    tagline: "B2B procurement with payment deadlines and partial payments",
    description:
      "A two-sided marketplace connecting vendor listings, purchase requests, and payment tracking. Companies request products with quantities and repayment notes; vendors accept with Net30 or custom deadlines. Accepted requests become tracked dues with partial payments and transaction histories. Role-based dashboards, Razorpay Checkout, Cloudinary images, and post-payment reviews bring procurement and collections into one interface.",
    tech: [
      "React",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "Razorpay",
      "Cloudinary",
      "Redux Toolkit",
    ],
    category: "FinTech",
    url: "https://ven-pay.vercel.app",
    repo: "https://github.com/aniruddhballal/VenPay",
    year: "2025",
    color: "#2D6A4F",
  },
  {
    id: 9,
    name: "Credex",
    tagline: "Procurement, trade finance, and cash-flow planning together",
    description:
      "A B2B prototype connecting product discovery, RFQ negotiation, purchase orders, and order-linked loan applications. Buyers and suppliers share order and payment histories; underwriters review documents through expiring signed URLs. A Python service generates cash-flow schedules with PuLP/CBC and supports credit-risk scoring. It brings my earlier procurement and lending experiments into one system, with payments recorded in a shared ledger.",
    tech: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "Python",
      "FastAPI",
      "PuLP",
    ],
    category: "FinTech",
    url: null,
    repo: "https://github.com/aniruddhballal/Credex",
    year: "2026",
    color: "#1A3A5C",
  },
];

export const collaborations: Project[] = [
  {
    id: 10,
    name: "Bheeshma",
    tagline: "A Bhagavad Gita study and listening experience",
    description:
      "Built for a friend: a Bhagavad Gita reader with chapter context, four script options, English translation, and Sanskrit recitation. Subject-based guidance and browser-local bookmarks support study; a separate Zen mode follows continuous verse playback. Verse text and recitation are sourced from IIT Kanpur's Gita Supersite, with theme and reading position saved locally.",
    tech: ["React", "Vite", "Tailwind CSS", "Framer Motion", "react-pageflip"],
    category: "Web App",
    url: "https://bheeshma.vercel.app",
    repo: null,
    year: "2026",
    color: "#824429",
  },
  {
    id: 11,
    name: "Project Gudi",
    tagline: "A temple website rebuild with an editable content system",
    description:
      "A rebuild of the Vasavi Penugonda temple website, made for people I know. Next.js presents the temple's story, trust information, galleries, and donation pages. A connected Payload CMS lets editors update page content, articles, and media without changing the layout. The CMS integration is a local proof of concept; the linked site is a preview.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Payload CMS", "SQLite"],
    category: "CMS prototype",
    url: "https://project-gudi.vercel.app",
    urlLabel: "View preview",
    repo: "https://github.com/aniruddhballal/project-gudi",
    year: "2026",
    color: "#6A432B",
  },
];
