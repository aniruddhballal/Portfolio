# Aniruddh Ballal — Systems Atlas

An editorial portfolio about making complex systems explorable. The page opens with science case studies, then offers a browsable project archive, verified experience, writing, artwork, and endurance data.

## Run locally

```sh
npm install
npm run dev
```

The app uses Vite, React, TypeScript, Tailwind CSS, and Lucide icons. No runtime API key is needed.

## Content and structure

- `src/App.tsx` contains the page sections, project filter, experience summary, and inline project diagrams.
- `src/portfolio.css` contains the responsive visual system.
- `public/organisations/` contains official logos for the organisation-led work history; `docs/organisation-assets.md` records their sources.
- `src/data/projects.ts` contains the nine selected personal projects and four collaborations, with verified public source, live demo, and Android download links. Sunalyse and SatLies lead as featured studies; the remaining personal projects retain their selected order in the expandable list.
- `docs/project-sources.md` records the repository review, source revisions, and factual boundaries behind the project copy.
- `src/data/creative.ts` contains the six written pieces and six artworks. The artwork JPGs remain in `public/creative`; smaller WebP thumbnails are in `public/creative/thumbs`.
- `src/data/strava.json` is a dated snapshot. `scripts/fetch-strava.ts` refreshes it when Strava credentials are available locally. The visible page uses no visitor credentials.
- `public/resume.pdf` is the source for the dated work history.

The endurance feature shows a 50 km running highlight, lifetime running and cycling totals, and selected 5K, 10K, and half-marathon best efforts. It links to Strava for the full history. The complete snapshot and collection scripts are retained; the display reads its highlights from that snapshot. The writing and artwork viewer uses a native modal dialog.

## Checks

```sh
npm run lint
npm run build
npm run test:visual
npm run format
```

`test:visual` expects a running local Vite server at `http://localhost:5173/`; set `PORTFOLIO_TEST_URL` to use another URL. It uses Playwright with Microsoft Edge on Windows and Playwright Chromium elsewhere. The test captures desktop, tablet, mobile, and compact screenshots in ignored `artifacts/` and checks accessibility, filters, dialogs, keyboard interaction, mobile navigation, endurance highlights, and horizontal overflow. Update the expected running bests in the check when refreshing the snapshot. On non-Windows systems, install the browser with `npx playwright install chromium` if needed.
