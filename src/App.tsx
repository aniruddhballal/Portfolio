import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { projects, type Project } from "./data/projects";
import { creativeItems, type CreativeItem } from "./data/creative";
import stravaData from "./data/strava.json";
import StravaStats from "./components/StravaStats/StravaStats";
import CreativeModal from "./components/CreativeModal";

const email = "aniruddhballaldeeksha@gmail.com";
const filters = [
  "All",
  "Finance",
  "Developer tools",
  "Security",
  "Other",
] as const;
type Filter = (typeof filters)[number];

function group(project: Project): Filter {
  if (project.category === "FinTech") return "Finance";
  if (project.category === "Developer Tool") return "Developer tools";
  if (project.category === "Security") return "Security";
  return "Other";
}

function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: string;
}) {
  return (
    <div className="section-label">
      <span>{number}</span>
      <span className="label-rule" />
      {children}
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  const links = [
    ["Work", "#work"],
    ["Practice", "#practice"],
    ["Elsewhere", "#elsewhere"],
    ["Contact", "#contact"],
  ];
  return (
    <header className="site-header">
      <div className="header-inner site-width">
        <a className="brand" href="#top">
          <span className="brand-mark">
            AB<span>•</span>
          </span>
          <span className="brand-caption">
            Aniruddh Ballal
            <br />
            Engineering & exploration
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-contact" href={`mailto:${email}`}>
          Let’s talk <ArrowUpRight size={15} />
        </a>
        <button
          ref={menuButton}
          className="menu-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
              <ArrowUpRight size={18} />
            </a>
          ))}
          <a href={`mailto:${email}`} onClick={() => setOpen(false)}>
            Email me <ArrowUpRight size={18} />
          </a>
        </nav>
      )}
    </header>
  );
}

function SolarDiagram({ hero = false }: { hero?: boolean }) {
  const paths = Array.from({ length: 11 }, (_, index) => {
    const angle = (index / 10) * Math.PI;
    const x1 = 245 + Math.cos(angle) * 55;
    const y1 = 208 - Math.sin(angle) * 55;
    const x2 = 245 + Math.cos(angle) * 193;
    const y2 = 208 - Math.sin(angle) * 145;
    return (
      <path
        key={index}
        d={`M ${x1} ${y1} C ${x1 + (x1 - 245) * 0.65} ${y1 - 80}, ${x2} ${y2 - 58}, ${x2} ${y2}`}
      />
    );
  });
  const gradient = hero ? "heroSun" : "studySun";
  return (
    <svg
      className={hero ? "solar-diagram hero-diagram" : "solar-diagram"}
      viewBox="0 0 490 390"
      role="img"
      aria-label="Illustration of curved magnetic field lines around a sun"
    >
      <defs>
        <radialGradient id={gradient}>
          <stop offset="0" stopColor="#fbd88c" />
          <stop offset=".72" stopColor="#ef9b54" />
          <stop offset="1" stopColor="#d96037" />
        </radialGradient>
      </defs>
      <circle className="diagram-orbit" cx="245" cy="208" r="172" />
      <circle className="diagram-orbit" cx="245" cy="208" r="118" />
      <g className="field-lines">{paths}</g>
      <circle className="sun-halo" cx="245" cy="208" r="77" />
      <circle cx="245" cy="208" r="55" fill={`url(#${gradient})`} />
      <circle className="diagram-point" cx="403" cy="125" r="4" />
      <circle className="diagram-point" cx="112" cy="116" r="3" />
      <path
        className="diagram-cross"
        d="M245 15v20m-10-10h20M445 207h20m-10-10v20M25 208h20m-10-10v20"
      />
    </svg>
  );
}

function OrbitDiagram() {
  return (
    <svg
      className="orbit-diagram"
      viewBox="0 0 550 380"
      role="img"
      aria-label="Two diverging orbital paths around Earth"
    >
      <defs>
        <radialGradient id="earth">
          <stop offset="0" stopColor="#638d9b" />
          <stop offset="1" stopColor="#294d60" />
        </radialGradient>
      </defs>
      <circle className="orbit-grid" cx="275" cy="190" r="72" />
      <circle className="orbit-grid" cx="275" cy="190" r="133" />
      <circle className="orbit-grid" cx="275" cy="190" r="192" />
      <ellipse
        className="orbit-path orbit-reference"
        cx="275"
        cy="190"
        rx="195"
        ry="113"
        transform="rotate(-19 275 190)"
      />
      <path
        className="orbit-path orbit-perturbed"
        d="M82 226 C108 78 309 41 456 127 C544 180 461 301 305 309 C190 315 107 271 82 226Z"
      />
      <circle cx="275" cy="190" r="46" fill="url(#earth)" />
      <path
        d="M246 169c19 0 17 14 36 13 8 14-8 15-6 31m15-45c4 14 19 13 22 20"
        stroke="#8fb4b5"
        strokeWidth="3"
        fill="none"
        opacity=".65"
      />
      <circle cx="428" cy="94" r="5" fill="#eac494" />
      <circle cx="447" cy="133" r="5" fill="#e96743" />
      <path d="M438 96l29-25M454 135l37 16" stroke="#b7cdd0" strokeWidth="1" />
      <text x="469" y="69">
        TWO BODY
      </text>
      <text x="455" y="167">
        PERTURBED
      </text>
    </svg>
  );
}

function Hero() {
  return (
    <section id="top" className="hero-section">
      <div className="site-width hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-line" /> Bengaluru, India · Engineer &
            curious mind
          </p>
          <h1>
            Making complex
            <br />
            <em>systems</em> feel
            <br />
            tangible<span className="accent-dot">.</span>
          </h1>
          <p className="hero-intro">
            I’m Aniruddh Ballal. I build tools that turn hard to see behavior
            into something people can explore, from the solar corona and orbital
            motion to financial workflows and software systems.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#work">
              Explore the work <ArrowDown size={17} />
            </a>
            <a
              className="text-link"
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              View résumé <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="hero-footnote">
            <span>01 / FIELD NOTES</span>
            <span>Physics · product · code</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-visual-top">
            <span>FIG. 01</span>
            <span>THE INVISIBLE, MADE VISIBLE</span>
          </div>
          <SolarDiagram hero />
          <div className="portrait-card">
            <img
              src="/aniruddh.jpg"
              alt="Aniruddh Ballal outdoors"
              width="864"
              height="1152"
              fetchPriority="high"
            />
            <span>Behind the work ↗</span>
          </div>
          <p className="hero-visual-caption">
            A visual motif inspired by the magnetic fields behind Sunalyse.
          </p>
        </div>
      </div>
      <div className="hero-tracks site-width">
        <span>
          Exploration 01 <b>Physical systems</b>
        </span>
        <span>
          Exploration 02 <b>Financial systems</b>
        </span>
        <span>
          Exploration 03 <b>Software systems</b>
        </span>
      </div>
    </section>
  );
}

function Feature({ project, index }: { project: Project; index: number }) {
  const solar = index === 0;
  return (
    <article className={`feature feature-${solar ? "solar" : "orbit"}`}>
      <div className="feature-art">
        <div className="art-top">
          <span>CASE STUDY / 0{index + 1}</span>
          <span>{solar ? "SOLAR PHYSICS" : "ORBITAL MECHANICS"}</span>
        </div>
        {solar ? (
          <img
            className="feature-screenshot"
            src="/projects/sunalyse-screenshot.png"
            alt="Sunalyse showing the solar photosphere, coronal field lines, and display controls"
            width="1917"
            height="917"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <OrbitDiagram />
        )}
        <div className="art-bottom">
          <span>{solar ? "CORONAL FIELD STUDY" : "PERTURBATION STUDY"}</span>
          <span>{solar ? "2010—2024" : "TWO BODY ↔ J2 + GRAVITY"}</span>
        </div>
      </div>
      <div className="feature-copy">
        <p className="feature-kicker">
          {solar ? "01 / A 14 year solar archive" : "02 / An orbital sandbox"}
        </p>
        <h3>
          {project.name}
          <span className="accent-dot">.</span>
        </h3>
        <p className="feature-tagline">{project.tagline}</p>
        <p className="feature-description">
          {solar
            ? "I processed NASA/SDO magnetograms through a Python PFSS pipeline, then made the resulting field lines explorable in a browser. The result connects large scale scientific processing to direct, visual inquiry."
            : "An interactive comparison between an ideal two body orbit and one shaped by Earth’s oblateness and lunar and solar gravity. Adjust the orbit, then watch the trajectories and telemetry diverge."}
        </p>
        <div className="feature-proof">
          <span>
            {solar ? "181" : "RK4"}
            <small>
              {solar ? "Carrington rotations" : "fixed step integration"}
            </small>
          </span>
          <span>
            {solar ? "500" : "3"}
            <small>
              {solar ? "adaptive field seeds" : "perturbation sources"}
            </small>
          </span>
        </div>
        <div className="feature-bottom">
          <span>{project.tech.slice(0, 4).join(" · ")}</span>
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              Explore live project <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <details className="project-row">
      <summary>
        <span className="project-number">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="project-row-main">
          <strong>{project.name}</strong>
          <span>{project.tagline}</span>
        </span>
        <span className="project-category">{project.category}</span>
        <span className="project-plus" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="project-detail">
        <p>{project.description}</p>
        <div className="project-detail-bottom">
          <div className="project-tech">
            {project.tech.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              Visit project <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>
    </details>
  );
}

function Work() {
  const [filter, setFilter] = useState<Filter>("All");
  const archive = projects.slice(2);
  const visible =
    filter === "All"
      ? archive
      : archive.filter((project) => group(project) === filter);
  return (
    <section id="work" className="work-section section-space">
      <div className="site-width">
        <SectionLabel number="01">Selected work</SectionLabel>
        <div className="section-intro">
          <h2>
            Ideas become clearer
            <br />
            <em>when you can interact.</em>
          </h2>
          <p>
            From scientific models to tools for decisions, these projects make
            underlying systems legible. Two deep dives lead into a wider
            archive.
          </p>
        </div>
        <div className="feature-list">
          {projects.slice(0, 2).map((project, index) => (
            <Feature key={project.id} project={project} index={index} />
          ))}
        </div>
        <div className="archive-header">
          <div>
            <p className="eyebrow">THE PROJECT ARCHIVE</p>
            <h3>
              More work, <em>same curiosity.</em>
            </h3>
          </div>
          <span>10 further projects / 2024—2026</span>
        </div>
        <div
          className="project-filters"
          role="group"
          aria-label="Filter project archive"
        >
          {filters.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={option === filter}
              onClick={() => setFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <p className="results-count" aria-live="polite">
          Showing {visible.length} of {archive.length} archive projects
        </p>
        <div className="project-list">
          {visible.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={projects.indexOf(project)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const experience = [
  {
    period: "Mar – Oct 2026",
    role: "Assistant Software Engineer",
    place: "Indiassetz",
    detail:
      "React Native and Next.js product work across mobile compatibility, CRM sales and payment flows, and the ARCA investor platform.",
  },
  {
    period: "Jan – Mar 2026",
    role: "Data Analyst Intern",
    place: "Qwixpert Consulting",
    detail:
      "Translated client data and legacy spreadsheet workflows into deployed software tools.",
  },
  {
    period: "Jun – Jul 2025",
    role: "Frontend Web Dev Intern",
    place: "Indiassetz",
    detail:
      "Built React and MUI interfaces and refined interactions for production workflows.",
  },
  {
    period: "Jun – Aug 2024",
    role: "Solar Physics Intern",
    place: "IISc, Bengaluru",
    detail:
      "Worked under Dr. Prantika Bhowmik on solar magnetic field and cycle modeling with Python and scientific computing tools.",
  },
];

function Practice() {
  return (
    <section id="practice" className="practice-section section-space">
      <div className="site-width">
        <SectionLabel number="02">Practice & experience</SectionLabel>
        <div className="practice-grid">
          <div className="practice-statement">
            <h2>
              Curiosity,
              <br />
              <em>with a method.</em>
            </h2>
            <p>
              I move between models, interfaces, and the practical details that
              make software useful. A physics question might become a
              visualization. A messy business process might become a clearer
              product.
            </p>
            <div className="skill-groups">
              <div>
                <span>MODEL</span>
                <p>Python · SciPy · NumPy · orbital and solar physics</p>
              </div>
              <div>
                <span>BUILD</span>
                <p>React · TypeScript · Node.js · FastAPI · MongoDB</p>
              </div>
              <div>
                <span>MAKE VISIBLE</span>
                <p>Three.js · data visualization · product interfaces</p>
              </div>
            </div>
            <div className="practice-note">
              <span>ROOTS & COMMUNITY</span>
              <p>
                B.Tech Information Technology at Manipal Institute of
                Technology. Beyond coursework: MIT Astronomy Club, ThrustMIT
                avionics, and coaching with Manipal Runners’ Club.
              </p>
            </div>
            <a
              className="text-link"
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the full résumé <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="experience-list">
            <h3>Where I’ve worked</h3>
            {experience.map((item) => (
              <div className="experience-item" key={item.role + item.place}>
                <span>{item.period}</span>
                <div>
                  <strong>{item.role}</strong>
                  <em>{item.place}</em>
                  <p>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CreativeTile({
  item,
  onOpen,
}: {
  item: CreativeItem;
  onOpen: (item: CreativeItem) => void;
}) {
  return (
    <button
      className="creative-tile"
      type="button"
      onClick={() => onOpen(item)}
    >
      <span>
        {item.type === "poem" ? "POEM" : "ESSAY"} · {item.date}
      </span>
      <strong>{item.title}</strong>
      <p>{item.excerpt}</p>
      <span className="creative-read">
        Read piece <ArrowUpRight size={15} />
      </span>
    </button>
  );
}

function thumbnailPath(imagePath: string | undefined) {
  return imagePath
    ?.replace("/creative/", "/creative/thumbs/")
    .replace(".jpg", ".webp");
}

function Elsewhere() {
  const [active, setActive] = useState<CreativeItem | null>(null);
  const writing = creativeItems.filter((item) => item.type !== "sketch");
  const art = creativeItems.filter((item) => item.type === "sketch");
  return (
    <section id="elsewhere" className="elsewhere-section section-space">
      <div className="site-width">
        <SectionLabel number="03">Beyond the screen</SectionLabel>
        <div className="elsewhere-intro">
          <h2>
            The other ways
            <br />
            <em>I pay attention.</em>
          </h2>
          <p>
            Questions become essays and poems. Observation becomes sketches.
            Endurance is another long experiment in consistency.
          </p>
        </div>
        <div className="creative-heading">
          <h3>Words, on their own terms.</h3>
          <span>03 poems / 03 essays</span>
        </div>
        <div className="writing-grid">
          {writing.map((item) => (
            <CreativeTile key={item.id} item={item} onOpen={setActive} />
          ))}
        </div>
        <div className="creative-heading art-heading">
          <h3>Drawn by hand.</h3>
          <span>06 pieces / pencil, ink, watercolor & acrylic</span>
        </div>
        <div className="art-grid">
          {art.map((item) => (
            <button
              key={item.id}
              type="button"
              className="art-tile"
              onClick={() => setActive(item)}
            >
              <img src={thumbnailPath(item.imagePath)} alt="" loading="lazy" />
              <span>
                <span className="sr-only">View </span>
                <strong>{item.title}</strong>
                <small>{item.medium}</small>
              </span>
            </button>
          ))}
        </div>
        <div className="endurance-header">
          <div>
            <p className="eyebrow">ENDURANCE / THE LONG VIEW</p>
            <h3>Movement, measured.</h3>
            <p>
              Running and riding data, with periods to explore and personal
              bests from a Strava snapshot.
            </p>
          </div>
          <div className="endurance-totals">
            <span>
              <strong>
                {Math.round(stravaData.run.allTime.distanceKm).toLocaleString()}
              </strong>{" "}
              km run
            </span>
            <span>
              <strong>
                {Math.round(
                  stravaData.ride.allTime.distanceKm,
                ).toLocaleString()}
              </strong>{" "}
              km ridden
            </span>
          </div>
        </div>
        <div className="strava-wrap">
          <StravaStats />
        </div>
      </div>
      <CreativeModal item={active} onClose={() => setActive(null)} />
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="site-width">
        <SectionLabel number="04">Start a conversation</SectionLabel>
        <div className="contact-grid">
          <div>
            <h2>
              Have a complex
              <br />
              thing to <em>untangle?</em>
            </h2>
            <p>
              I’m interested in meaningful engineering problems and
              collaborations where understanding the system changes the
              solution.
            </p>
            <a className="contact-email" href={`mailto:${email}`}>
              {email}
              <ArrowUpRight size={24} />
            </a>
          </div>
          <div className="contact-links">
            <span>FIND ME ELSEWHERE</span>
            <a
              href="https://github.com/aniruddhballal"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <ArrowUpRight size={19} />
            </a>
            <a
              href="https://www.linkedin.com/in/aniruddh-ballal-979797276/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <ArrowUpRight size={19} />
            </a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              Résumé <ArrowUpRight size={19} />
            </a>
            <a
              href="https://www.strava.com/athletes/111442086"
              target="_blank"
              rel="noopener noreferrer"
            >
              Strava <ArrowUpRight size={19} />
            </a>
          </div>
        </div>
        <footer className="site-footer">
          <span>© 2026 Aniruddh Ballal</span>
          <span>Built to make things clearer.</span>
          <a href="#top">
            Back to top <ArrowRight size={14} />
          </a>
        </footer>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <Work />
        <Practice />
        <Elsewhere />
        <Contact />
      </main>
    </>
  );
}
