# Portfolio — Aniruddh Ballal

Built with **Vite + React + TypeScript + Tailwind CSS + Framer Motion**.

## Stack
- Vite · React 19 · TypeScript
- Tailwind CSS v3
- Framer Motion (animations & parallax)
- Lucide React (icons)
- Google Fonts: Bebas Neue + DM Sans + DM Mono

## Customising

### Details
- **`src/data/projects.ts`** — add/edit all projects (name, tagline, description, tech, category, url, year, color)
- **`src/components/Hero.tsx`** — name, tagline, stack pills, photo
- **`src/components/About.tsx`** — bio, skill %, timeline
- **`src/components/Contact.tsx`** — email, GitHub, LinkedIn URLs
- **`src/components/Navbar.tsx`** — logo initials
- **`src/components/Footer.tsx`** — name

### Photo
In `Hero.tsx`, replace the placeholder div inside `.photo-frame` with `<img src="/your-photo.jpg" ... />`.

### Accent color
Change `#E84B2E` in `tailwind.config.js` (colors.accent) and `src/index.css` (cursor styles).

## Structure
```
src/
  components/   Cursor, Navbar, Hero, Projects, ProjectCard, About, Contact, Footer
  data/         projects.ts
  index.css     global styles + cursor + grain overlay
  App.tsx
  main.tsx
```
