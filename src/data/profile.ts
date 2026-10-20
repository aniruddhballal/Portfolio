export const profile = {
  name: 'Aniruddh Ballal',
  location: 'Bengaluru, India',
  eyebrow: 'Physics, systems, software',
  statement:
    'I build software for systems that are too complex to understand at a glance — physical, financial, operational, or human — and make them explorable.',
  availability: 'Open to full-time roles, technical product work, and ambitious collaborations.',
  proof: [
    { value: '181', label: 'Carrington rotations modelled' },
    { value: '38×', label: 'faster local steganography' },
    { value: '92%', label: 'penalty reduction in VenPayRL' },
  ],
  capabilities: [
    {
      title: 'Build interactive simulations',
      detail: 'Turn orbital mechanics, magnetic fields, and invisible forces into things people can explore.',
      tools: 'Three.js · SciPy · NumPy · GLSL',
    },
    {
      title: 'Ship production systems',
      detail: 'Design frontend, backend, data, authentication, and workflow layers as one connected system.',
      tools: 'React · Next.js · FastAPI · PostgreSQL',
    },
    {
      title: 'Model complex decisions',
      detail: 'Use optimisation, machine learning, and careful state design where rules alone stop being enough.',
      tools: 'XGBoost · PuLP · TensorFlow.js · MongoDB',
    },
    {
      title: 'Work close to the machine',
      detail: 'Move performance-critical work into Rust, WebAssembly, workers, and browser-native computation.',
      tools: 'Rust · WASM · Web Workers · Web Crypto',
    },
  ],
  experience: [
    { period: '2025 — now', role: 'Assistant Software Engineer', place: 'Indiassetz', detail: 'React Native, Next.js, CRM and investor workflows.' },
    { period: '2024', role: 'Solar Physics Intern', place: 'Indian Institute of Science', detail: 'Coronal magnetic fields and solar-cycle modelling.' },
    { period: '2024', role: 'Data Analyst Intern', place: 'Qwixpert Consulting', detail: 'Data systems, analysis, and operational problem solving.' },
    { period: '2023', role: 'Frontend Web Developer Intern', place: 'Indiassetz', detail: 'Production interfaces and workflow foundations.' },
  ],
  skillGroups: [
    { label: 'Languages', values: 'TypeScript · Python · JavaScript · Rust · Kotlin · C/C++ · SQL' },
    { label: 'Interaction', values: 'React · Next.js · React Native · Three.js · Tailwind · Redux Toolkit' },
    { label: 'Backend & data', values: 'FastAPI · Node · Express · PostgreSQL · SQLAlchemy · MongoDB · Firebase' },
    { label: 'Scientific & systems', values: 'NumPy · SciPy · XGBoost · PuLP · AstroPy · WebAssembly · Docker · KiCad' },
  ],
} as const
