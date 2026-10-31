import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { collaborations, projects, type Project } from "./data/projects";
import { creativeItems, type CreativeItem } from "./data/creative";
import StravaStats from "./components/StravaStats/StravaStats";
import CreativeModal from "./components/CreativeModal";

const email = "aniruddhballaldeeksha@gmail.com";
const filters = ["All", "Independent tools", "Finance", "Security"] as const;
type Filter = (typeof filters)[number];

function group(project: Project): Filter {
  if (project.category === "FinTech") return "Finance";
  if (project.category === "Independent tools") return "Independent tools";
  if (project.category === "Security") return "Security";
  return "All";
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

function Hero() {
  return (
    <section id="top" className="hero-section">
      <div className="site-width hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-line" aria-hidden="true" />
            <span className="hero-eyebrow-text">
              <span>Bengaluru, India</span>
              <span className="hero-eyebrow-dot" aria-hidden="true">
                {" · "}
              </span>
              <span>Engineer & curious mind</span>
            </span>
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
          <img
            className="hero-sunalyse-image"
            src="/projects/sunalyse-hero.png"
            alt="Sunalyse view of the Sun, coronal field lines, and a surrounding magnetic field model"
            width="1312"
            height="907"
            fetchPriority="high"
            decoding="async"
          />
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

function ProjectLinks({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const visitLabel =
    project.urlLabel ?? (featured ? "Explore live project" : "Visit project");
  return (
    <div className="project-links">
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${visitLabel}: ${project.name}`}
        >
          {visitLabel} <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
      {project.repo && (
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Source code: ${project.name}`}
        >
          Source code <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
    </div>
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
          <img
            className="feature-screenshot"
            src="/projects/satlies-screenshot.png"
            alt="SatLies showing orbital trajectories, force controls, separation graph, and live metrics"
            width="1917"
            height="907"
            loading="lazy"
            decoding="async"
          />
        )}
        <div className="art-bottom">
          <span>{solar ? "CORONAL FIELD STUDY" : "PERTURBATION STUDY"}</span>
          <span>{solar ? "2010-2024" : "TWO BODY ↔ J2 + GRAVITY"}</span>
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
            {solar ? "≤ 500" : "3"}
            <small>
              {solar ? "adaptive field seeds" : "perturbation sources"}
            </small>
          </span>
        </div>
        <div className="feature-bottom">
          <span>{project.tech.slice(0, 4).join(" · ")}</span>
          <ProjectLinks project={project} featured />
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
          <ProjectLinks project={project} />
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
            Physical models, private tools, and financial workflows. These
            projects make complex systems easier to explore, and question the
            defaults of the platforms I use.
          </p>
        </div>
        <div className="feature-list">
          {projects.slice(0, 2).map((project, index) => (
            <Feature key={project.id} project={project} index={index} />
          ))}
        </div>
        <div className="project-archive">
          <div className="archive-header">
            <div>
              <p className="eyebrow">MORE SELECTED WORK</p>
              <h3>
                Small revolts, <em>practical tools.</em>
              </h3>
              <p className="archive-intro">
                A few personal alternatives to platform clutter, alongside
                experiments in security and finance.
              </p>
            </div>
            <span>{archive.length} further projects</span>
          </div>
          <div
            className="project-filters"
            role="group"
            aria-label="Filter selected projects"
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
            Showing {visible.length} of {archive.length} projects
          </p>
          <div className="project-list personal-project-list">
            {visible.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={projects.indexOf(project)}
              />
            ))}
          </div>
        </div>
        <section
          className="collaboration-work"
          aria-labelledby="collaboration-title"
        >
          <div className="archive-header">
            <div>
              <p className="eyebrow">COLLABORATIONS</p>
              <h3 id="collaboration-title">Built for people I know.</h3>
            </div>
            <span>{collaborations.length} websites</span>
          </div>
          <div className="project-list collaboration-project-list">
            {collaborations.map((project, index) => (
              <ProjectRow key={project.id} project={project} index={index} />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

const experience = [
  {
    place: "Indiassetz",
    logo: "/organisations/indiassetz.webp",
    roles: [
      {
        period: "Mar - Oct 2026",
        role: "Assistant Software Engineer",
        detail:
          "Modernised existing mobile apps and added CRM workflows for payment reviews, approvals, and revenue reporting. I also developed an investor and back-office platform for document access, capital-call tracking, and portfolio reporting.",
      },
      {
        period: "Jun - Jul 2025",
        role: "Frontend Web Dev Intern",
        detail:
          "Built React and MUI interfaces and refined interactions for production workflows.",
      },
    ],
  },
  {
    place: "Qwixpert Consulting",
    logo: "/organisations/qwixpert.jpg",
    roles: [
      {
        period: "Jan - Mar 2026",
        role: "Data Analyst Intern",
        detail:
          "Analysed client data, automated reporting across linked workbooks, and prepared consulting presentations. I also built tools for planning supply-chain networks, comparing demand forecasts, and managing dispatch plans, with maps, dashboards, and spreadsheet reports.",
      },
    ],
  },
  {
    place: "IISc, Bengaluru",
    logo: "/organisations/iisc.png",
    roles: [
      {
        period: "Jun - Aug 2024",
        role: "Solar Physics Intern",
        detail:
          "Worked under Dr. Prantika Bhowmik on solar magnetic field and cycle modeling with Python and scientific computing tools.",
      },
    ],
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
              make software useful. A physics question becomes a visualization.
              A messy business process becomes a clearer product.
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
              <article className="experience-item" key={item.place}>
                <img
                  className="experience-logo"
                  src={item.logo}
                  alt=""
                  width="64"
                  height="64"
                  loading="lazy"
                  decoding="async"
                />
                <div className="experience-copy">
                  <h4>{item.place}</h4>
                  {item.roles.map((stint) => (
                    <div
                      className="experience-stint"
                      key={stint.role + stint.period}
                    >
                      <div className="experience-meta">
                        <p className="experience-role">{stint.role}</p>
                        <span className="experience-period">
                          {stint.period}
                        </span>
                      </div>
                      <p className="experience-detail">{stint.detail}</p>
                    </div>
                  ))}
                </div>
              </article>
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
