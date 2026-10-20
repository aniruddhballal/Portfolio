# Codex Mission: Content-Driven Portfolio Overhaul (`revamp2`)

## Mission
Reimagine and fully implement my personal portfolio's visual experience. This is a complete creative and engineering overhaul, not a superficial restyle. Let the content determine the design—not the other way around. You have broad creative and technical autonomy, including colors, themes, typography, composition, navigation, motion, interactions, and architecture.

## Non-negotiable Git safety
1. Inspect repository state first (`git status`, branches, remotes, and recent history). Protect uncommitted work; never discard, reset, stash, or overwrite it without explicit approval.
2. Fetch the latest remote main. Branch **`revamp2` from the current `origin/main`**. Do not base it on local `main` or `revamp1`.
3. **Leave `revamp1` untouched**. Do not modify or push `main` or `revamp1`.
4. If `revamp2` already exists locally or remotely, **do not delete, reset, overwrite, force-update, or reuse it blindly**. Stop and ask me how to proceed before changing it. Do not silently choose a different branch name.
5. Do all implementation work on `revamp2` only. Make clear, meaningful milestone commits, but do not push without my permission.

## First: Deep content and repository discovery
Read the entire relevant repository, including resume/CV, skills, achievements, experience, projects, descriptions, links, images, data files, design assets, existing pages, component architecture, configuration, and repository instructions. Identify what makes me distinctive and how the material relates. Verify content; never invent accomplishments, projects, or biographical details. Preserve factual accuracy and essential functionality.

Before writing the redesign, form a content inventory, information hierarchy, and portfolio narrative. The site's visual system and page structure must emerge from this analysis. Existing layouts are reference material, not constraints.

## Explore creative directions
Develop at least three substantially different visual concepts internally, with thoughtful approaches to typography, layout, visual identity, color, motion, and project storytelling. Compare them against the actual repository content, clarity, distinctiveness, accessibility, and feasibility. Select the strongest cohesive direction. Avoid generic AI portfolio templates, gratuitous glassmorphism, repetitive cards, and effects without purpose.

You have complete freedom to experiment with bold colors, restrained palettes, light/dark modes, editorial layouts, unusual but legible type, custom components, meaningful transitions, scroll-driven storytelling, tasteful microinteractions, and expressive project showcases. Choose based on what serves the content best—not on a checklist of fashionable effects.

## Use available capabilities fully
Inspect and use relevant installed skills, repository instructions, tools, subagents, parallel work, browser automation, screenshot comparison, and test tooling where available. Delegate bounded tasks (content audit, visual concepts, accessibility review, testing) when helpful, while keeping a single coherent design owner. Do not assume tools exist; discover them and use those actually available. If access, a required permission, or a crucial asset is missing, ask me. Otherwise, proceed independently.

## Implementation
Execute the complete redesign in the repository, not merely a plan or mockup. Refactor page layouts, navigation, component system, styling, assets, and dependencies as justified. Keep content accurate and working links intact. Build responsive experiences across mobile, tablet, and desktop. Prioritize accessible semantics, keyboard support, contrast, reduced-motion support, performance, SEO fundamentals, and maintainable code. Preserve important existing behavior unless there is a reason to improve it.

## Inspect, test, iterate
Run the site and inspect the *rendered* result using browser tools and screenshots, if available. Review at multiple viewport sizes, including mobile. Assess composition, visual hierarchy, typography, spacing, color harmony, motion, project presentation, navigation, overflow, and interaction quality. Iterate rather than stopping at the first compiling version. Run relevant lint, type checks, builds, and tests; fix regressions you introduce. If visual tooling is unavailable, report that limitation clearly rather than claiming visual validation.

## Workflow and autonomy
Take the time needed for thoughtful exploration and refinement. Commit meaningful milestones on `revamp2` to support rollback. You may make design and engineering decisions without repeatedly seeking my preferences. Ask only when a true blocker, missing permission, destructive operation, or Git branch conflict requires a decision. Do not claim to run indefinitely or in the background; complete as much as the active Codex session allows.

## Final report
Provide: the design concept and why it fits the content; major UX/UI and architectural changes; libraries added; screenshots or visual testing summary where available; lint/typecheck/build/test outcomes; commit hashes; known limitations; and any next steps.

**Begin with repository and Git safety checks. Then create `revamp2` from the latest `origin/main` if it is safe to do so, audit the content, choose the strongest design direction, and implement the complete redesign.**
