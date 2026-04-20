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
    name: 'Credex',
    tagline: 'B2B procurement and embedded trade finance for Indian SMEs',
    description:
      'A unified platform that brings procurement, payment tracking, cash flow optimisation, and trade finance into a single product. Buyers submit RFQs, negotiate terms, confirm purchase orders, and access working capital — linked directly to confirmed orders. A Python FastAPI microservice runs a linear programming cash flow optimiser (PuLP/CBC solver) and an XGBoost credit scoring model. The backend spans 17 MongoDB collections covering immutable payment and audit records, signed-URL KYC document access via Backblaze B2, and role-based access for buyers, suppliers, underwriters, and admins. Credex is the unification of VenPay, LOANlo, and VenPayRL.',
    tech: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Python', 'FastAPI', 'XGBoost', 'PuLP'],
    category: 'FinTech',
    url: 'https://github.com/aniruddhballal/Credex',
    year: '2026',
    color: '#1A3A5C',
  },
  {
    id: 2,
    name: 'Sunalyse',
    tagline: 'Interactive 3D viewer for 14 years of solar coronal magnetic fields',
    description:
      'A physics-based 3D visualisation tool covering 181 Carrington Rotations (2010–2024). HMI synoptic FITS magnetograms from NASA/SDO are processed through a Python PFSS pipeline: spherical harmonic coefficients computed up to lmax=85, 500 adaptive seeds placed at peak photospheric field locations via haversine clustering, and field lines traced with Euler integration using multiprocessing. The React + Three.js frontend renders three layers — the photosphere texture, 3D coronal field lines colour-coded per-vertex by field strength via a GLSL shader, and the heliospheric current sheet at 2.5Rs. The full data pipeline took ~20 hours on Kaggle across 181 CRs.',
    tech: ['React', 'TypeScript', 'Three.js', 'Python', 'SciPy', 'PFSS', 'GLSL'],
    category: 'Simulation',
    url: 'https://sunalyse.vercel.app',
    year: '2025',
    color: '#B5451B',
  },
  {
    id: 3,
    name: 'SatLies',
    tagline: 'Satellite orbit simulator with real astrodynamics',
    description:
      "A full-stack satellite mission simulator backed by real orbital mechanics. The orbit simulator numerically integrates the equations of motion using RK45 with optional J2 oblateness perturbation, rendering the orbit and ground track on a 3D Earth in real time via Three.js. The mission planner computes Hohmann transfers between circular orbits — showing delta-V budget, the transfer ellipse, and fuel consumed via the Tsiolkovsky rocket equation. The ground station tracker predicts passes over any location on Earth, reporting next pass time, duration, and maximum elevation angle. The Python FastAPI backend handles all physics via NumPy and SciPy.",
    tech: ['React', 'TypeScript', 'Three.js', 'Python', 'FastAPI', 'NumPy', 'SciPy'],
    category: 'Simulation',
    url: 'https://github.com/aniruddhballal/SatLies',
    year: '2026',
    color: '#2D3A6B',
  },
  {
    id: 4,
    name: 'Graphite',
    tagline: 'Simulate npm dependency upgrades before you run them',
    description:
      "A browser-only dependency upgrade impact analyser. Upload a lockfile, pick a package and target version — Graphite resolves the full transitive dependency tree of the new version, diffs it against your current graph, detects every version conflict and peer dependency violation, and renders a 3D force-directed graph of the cascade. No backend, no installs: the npm registry has open CORS headers so all calls happen directly from the browser. A safe-mode upgrade path computes the lowest version of each affected package that satisfies all constraints simultaneously. Tested against a 20,000-line package-lock.json.",
    tech: ['React', 'TypeScript', 'Vite', 'Three.js', 'semver', 'Tailwind CSS'],
    category: 'Developer Tool',
    url: 'https://graphite-neon.vercel.app',
    year: '2026',
    color: '#3D1A5C',
  },
  {
    id: 5,
    name: "Queen's Gambit 2.0",
    tagline: 'Browser-based steganography rebuilt in Rust + WASM — 38× faster',
    description:
      "A full rebuild of Queen's Gambit as a client-side web app. The chess move generator was rewritten in Rust using shakmaty and compiled to WebAssembly via wasm-pack. The encode/decode loops run entirely in Web Workers (zero-copy ArrayBuffer transfer), keeping the React UI fully responsive. The result: a 32KB file that took 3m 15s in the original now encodes in 5.2 seconds — a 38× improvement. Optional AES-256-GCM encryption uses PBKDF2 key derivation via the Web Crypto API. No file data ever leaves your device. A lightweight Express + MongoDB backend optionally logs conversion analytics.",
    tech: ['React', 'TypeScript', 'Rust', 'WASM', 'Web Workers', 'AES-256-GCM'],
    category: 'Security',
    url: 'https://queens-gambit-2-0.vercel.app',
    year: '2025',
    color: '#1A2D4A',
  },
  {
    id: 6,
    name: 'VenPayRL',
    tagline: 'Reinforcement learning simulator for vendor payment decisions',
    description:
      'A vendor payment RL environment that models a company managing cash reserves against invoices with due dates, penalty rates, and daily inflows. Five agents compete — rule-based, random, heuristic, Q-table (180-state), and DQN (TensorFlow.js, 6D state vector with amountRatio) — across 5 hardcoded scenarios and unlimited custom scenarios. Training streams live via SSE. The rule and heuristic agents use a three-pass partial payment strategy that reduces penalties by 92% on cash-constrained scenarios. Backed by 51 Vitest tests and a per-day trace validation script.',
    tech: ['React', 'TypeScript', 'Express', 'TensorFlow.js', 'Q-Learning', 'DQN', 'SSE'],
    category: 'ML / RL',
    url: 'https://venpayrl.vercel.app',
    year: '2025',
    color: '#4A1A2D',
  },
  {
    id: 7,
    name: 'VenPay',
    tagline: 'B2B procurement and payment platform for vendors and companies',
    description:
      'A full-stack MERN platform handling the entire vendor-company transaction lifecycle. Companies browse vendor listings, submit purchase requests with quantities and optional repayment notes, and vendors accept — with default Net30 or custom payment deadlines. Accepted requests become tracked payment obligations: companies make partial or full payments via Razorpay Checkout, a full transaction history updates outstanding dues in real time, and ratings unlock after payment clears. Role-based dashboards, JWT cookie auth, Cloudinary-backed image uploads, Redux Toolkit for auth/profile state, and 645 commits of iterative development.',
    tech: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Razorpay', 'Cloudinary', 'Redux'],
    category: 'FinTech',
    url: 'https://ven-pay.vercel.app',
    year: '2025',
    color: '#2D6A4F',
  },
  {
    id: 8,
    name: 'LOANlo',
    tagline: 'Role-based loan origination and underwriting workflow platform',
    description:
      'A workflow-centric fintech platform for three roles — applicant, underwriter, and system admin. Applicants complete gated onboarding, submit loan applications, upload documents via GridFS, and track status through a full lifecycle. Underwriters review applications, request documents, and manage loan products. Admins govern soft-deleted records, restoration requests, IP whitelisting, and session control. A Python ML microservice handles credit-risk predictions. Gmail OAuth2 drives transactional emails at every lifecycle event. Security includes CAPTCHA, rate limiting, input sanitisation, and inactivity-based auto logout.',
    tech: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'GridFS', 'Python', 'Gmail OAuth2'],
    category: 'FinTech',
    url: 'https://loanlo.vercel.app',
    year: '2025',
    color: '#5C3A1A',
  },
  {
    id: 9,
    name: "Queen's Gambit",
    tagline: 'Hide any file inside chess game notation using information theory',
    description:
      'A Flask web app that hides arbitrary files inside chess PGN notation using information-theoretic steganography — binary data is encoded by mapping bits to legal chess moves via log₂-indexed selection (Shannon entropy maximisation). The encoded output looks exactly like real chess games with randomised metadata. Layered on top: AES-256-CBC encrypts the data, RSA-4096 encrypts the AES key, and XOR-obfuscated filenames link keys to ciphertext without any central index. SMTP-based OTP two-factor authentication gates access, and an admin dashboard handles user management.',
    tech: ['Python', 'Flask', 'AES-256', 'RSA-4096', 'python-chess', 'SMTP OTP'],
    category: 'Security',
    url: 'https://github.com/aniruddhballal/Queen-s-Gambit',
    year: '2024',
    color: '#1A3A5C',
  },
  {
    id: 10,
    name: 'Aavritti',
    tagline: 'Private daily activity intelligence dashboard',
    description:
      'A password-gated personal productivity platform for capturing daily activities, building a reusable category taxonomy over time, and reviewing how time was spent. A drill-down pie chart lets you explore distribution from category level down to individual activities. An activity trends panel uses ECharts to show category-specific hours across 7-day windows. A draggable Cache board stores floating quick-note cards with persistent position in MongoDB. The category system learns usage patterns — suggestions are sorted by usage count so the most-used categories always surface first.',
    tech: ['React', 'TypeScript', 'Vite', 'Node.js', 'MongoDB', 'ECharts', 'Framer Motion'],
    category: 'Productivity',
    url: 'https://aavritti.vercel.app',
    year: '2025',
    color: '#1A4D4A',
  },
  {
    id: 11,
    name: 'Sankalpa For Change',
    tagline: 'NGO website for a children\'s life skills and counselling organisation',
    description:
      'A responsive public-facing website for Sankalpa For Change, a Karnataka-based NGO focused on children\'s emotional well-being, life skills coaching, and community outreach. Built with Next.js App Router, it presents the organisation\'s mission, five program areas, an image-rich field stories blog with 8 published posts at dynamic routes, and a funding/support history. Full SEO coverage: per-page metadata, Open Graph, Twitter cards, sitemap, robots, and a generated favicon. Deployed at sankalpaforchange.com.',
    tech: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'App Router'],
    category: 'Web App',
    url: 'https://sankalpaforchange.com',
    year: '2025',
    color: '#5C4A1A',
  },
  {
    id: 12,
    name: 'Nikhil Lab Site',
    tagline: 'Academic website for Dr. Nikhil\'s NRG Laboratory at IISc',
    description:
      "A static React SPA for the NRG Laboratory at IISc, presenting the lab's diabetes research mission, a research gallery with modal image previews, 27 publications and 37 lectures/posters rendered from structured JSON, a funding and support history, current and alumni member profiles, and contact/recruitment information for postdoc and PhD candidates. Content is entirely data-driven through local JSON files. Deployed with Vercel SPA rewrite rules.",
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'React Router'],
    category: 'Web App',
    url: 'https://nikhil-lab-site.vercel.app',
    year: '2025',
    color: '#3D5C1A',
  },
]
