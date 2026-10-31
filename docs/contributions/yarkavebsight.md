# Contribution audit: yarkavebsight

Audit date: 31 October 2026. This is the repository the request referred to as `yaskavebsight`. This report records evidence for the March-October 2026 Indiassetz role; it is not an assertion of sole ownership of the underlying website.

## What the repository is

A Next.js/React/TypeScript investment-business website with a corporate site, research articles and business-unit microsites. Material UI, Emotion and Framer Motion provide the interface; static export and image optimization support distribution. Contact forms use an existing Firebase integration. It is a public-facing website, distinct from the separately audited investor application and its backend.

## Audit scope and attribution

The audit reviewed all locally reachable git-history metadata and changed-file inventories, the README and package manifest, baseline and recent committed trees, and substantive patches for the contribution groups below. It used raw git author names containing `Aniruddh`, case-insensitively, without consulting email addresses. Commit counts describe reachable objects, not unique features or work volume.

| Item                              | Finding                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------ |
| History availability              | Not shallow; local, cached remote and `refs/original` histories available; nothing fetched |
| Reachable commits across all refs | 1,524                                                                                      |
| Matching author                   | `Aniruddh Ballal`                                                                          |
| Matching commits                  | 1,446: 1,443 non-merge and 3 merge commits                                                 |
| Matching author-date range        | 20 May-10 July 2026; all within the requested employment period                            |
| Matching monthly distribution     | May 86; June 1,012; July 348                                                               |
| Checked-out committed baseline    | `8b1877ff81`, 4 July 2026; 742 reachable commits, 739 matching                             |
| Latest cached `origin/main`       | `387a52f3f7`, 10 July 2026; 808 reachable commits, 805 matching                            |
| Working tree                      | Clean when inspected                                                                       |

Several refs preserve rewritten or replayed versions of the same work. For example, the two Yantra metadata commits `5ea15143dc` and `2526cc96eb` carry the same author timestamp and subject. Across all 1,446 matching commits there are only 710 distinct author-timestamp/subject combinations. This is a duplication indicator, not a verified patch-equivalence count. Raw commit totals must not become a productivity claim.

The available history ends in July; absence of later commits is not evidence that the role ended then. Cached refs are local evidence, not a live GitHub or production deployment check.

## Baseline and extent of ownership

`403311b5f9` is explicitly labelled as the existing website before Aniruddh started work. It imports a substantial application: corporate pages, business-unit routes, themes, contact infrastructure, structured-data helpers and accessibility documentation already exist. That snapshot is excluded as proof that he originally implemented those features.

Older refs independently expose earlier contributions by other authors. In particular, the shared SEO helper and JSON-LD component precede his changes; `7d068f7` introduced SEO/image work and `c171533` introduced standards/audit documentation in April. Existing contact forms and another business-unit site also predate his snapshot. The defensible description is a substantial redesign, business-unit interface development and production preparation of an inherited website, rather than original authorship of the complete product.

## Work supported by attributable patches

### Business-unit experiences and reusable styling: May-June

- Rebuilt the real-estate platform's explanation and service sections as data-driven visual layouts, including operating-model diagrams and responsive content structure. Evidence: `696a8e379f`, `0963fddbb8`, `b7636ab277`, followed by diagram refinements `2d0af2f001`; paths include `src/components/real-estate/YantraPlatform/YantraTheShift.tsx`, `YantraWhatWeDo.tsx` and `src/lib/yantraData.ts`.
- Developed and repeatedly refined investment-banking sector presentation: sticky visual panels, shared sector components, differentiated presentation and subsequently a consolidated sector-focus structure. Evidence: `8bb39c8dae`, `495f6751ca`, `61958c025a`, `97d4da0db9`, `53858d36e8`; paths under `src/components/private-equity/InvestmentBanking/` and its route page. These are successive iterations, not separate delivered features to count individually.
- Replaced scattered colors, typography and hardcoded content with theme tokens and data modules across business-unit components. Evidence: `69df4f770b`, `819c995e40`, `f05679fdad`, `664afe8e74`, `530b0005e8`; paths include business-unit `ThemeRegistry` folders, `src/theme.d.ts` and `src/lib/investmentBankingData.ts`. This supports maintainability and consistency claims, without a quantified maintenance-time saving.
- Added an investment-banking enquiry modal, category-aware React context and page wiring. The patch actually creates the modal and context; current committed code includes validation, international phone handling, asynchronous submission and feedback states. Evidence: `82188edf70`, followed by `349d1a8535`, `2f80215b94` and `53c8c34061`; paths include `IBContactModal.tsx`, `src/context/IBContactContext.tsx` and the business-unit page. Its use of an existing Firebase service does not establish authorship of that service or verification of server-side rules.

### Corporate-site redesign: June-July

- Reworked the corporate visual identity, homepage structure, platform navigation, company pages, research listing/article template, contact presentation and terms content. Evidence: `a9a103fa11`, `78a369a248`, `563700bbf4`, `35a013a07e`, `1f5ba7609d`, `2c3cd077ba` and later July refinements. Main paths are `src/components/Home/`, `About/`, `Platform/`, `Research/`, `Contact/`, `Terms/` and `src/app/(arca)/`.
- Centralized corporate-site copy in a data module, complementing the shared design tokens. Evidence: `2f84df1a59`, `5891c6c6f9`; paths `src/lib/mainsiteData.ts`, `src/components/ThemeRegistry/themes.ts` and the consuming components.
- Introduced section-level light/dark surfaces and a header that responds to visible section/surface changes. Evidence: `1fa4f6377e`, `c0cb43c6bb`, `10f6d38624`; paths `src/components/ThemeRegistry/surfaceTokens.ts`, `SurfaceToggleSwitch.tsx`, layout/header and page components. Current code includes accessible switch attributes; this is not a complete accessibility certification.
- Refined responsive layouts and display-scaling behavior, then made page-specific mobile readability fixes. Evidence: `3736f13` for the business-unit modal/display-scaling pass and `d7ed52bf2c`, `fe6dc2edf4`, `344635552f` for later mobile work. Some leadership layouts were explicitly reverted: experimental variants and their commit count are not additional shipped functionality.

### Search metadata, assets and static-export preparation

- Extended the existing SEO system to the newly worked business-unit pages and corporate page types. Evidence: `5ea15143dc`, `e61964c16e`, `9baf28a118`, `300d5a1f53`, `2dcb4de6ed`; paths include `src/lib/seo/jsonld.ts`, business-unit route pages and corporate route metadata. Credit the extensions, not creation of the earlier shared SEO architecture.
- Routed business-unit imagery through the shared optimized-image wrapper and refined production output handling. Evidence: `3d50a93daa`, `433f4ddec5`, `df699a1741`, `74b23681b0`; paths include `src/components/Shared/OptimizedImage.tsx`, `src/app/sitemap.ts` and `scripts/clean-prod-output.mjs`.
- Prepared and adjusted responsive imagery and social-share assets. Asset replacement is supporting release work, not evidence for performance or conversion gains.

There is a material checkout difference: the 4 July HEAD still contains production cleanup that removes the private-equity output directory. The later cached-main fix `74b23681b0` removes that behavior. Report this as committed build-preparation work; neither checkout proves which version is publicly deployed.

## Current feature status and engineering assessment

The latest cached-main tree contains the redesigned corporate pages, research routes, business-unit routes, data/theme structure, enquiry flow and export preparation described above. The contact flow is implemented in source, but no request was submitted during this audit. Legacy README theme descriptions and older scope documents are not a reliable inventory of the final design.

Useful engineering evidence includes shared data and theme boundaries, reusable image handling, explicit field validation, asynchronous form states and route/build fixes. The history also contains many short-lived visual experiments and reversions; its size should not be confused with a similarly large number of business capabilities.

No committed test/spec files were found in the inspected HEAD or cached-main trees. The package declares build and lint scripts. No install, lint, build, browser test, accessibility audit, service request or deployment verification was run. The existing WCAG-oriented document explicitly leaves manual checks outstanding and describes an older scope, so avoid claims of certified accessibility, measured speed gains, improved search rankings or production readiness inferred solely from its prose.

## AI-assisted development evidence

- The inherited `PROJECT_STANDARDS_AND_HANDOFF.md` explicitly describes earlier Claude and Codex work. Git history attributes that document to the pre-Aniruddh baseline. It is evidence about the repository's earlier development process, not his personal AI usage.
- His own June work adds theme-refactoring guidance and token-extraction documents in `5891c6c6f9`; `f76695b9de` subsequently describes deleting "Claude's helping docs." This supports use of AI assistance for that design/refactoring activity.
- Confidence: moderate for personal AI-assisted interface/refactoring work; insufficient for a claim that he introduced AI SDLC across this product or used AI for every implementation, test or review stage.

## Appropriate public presentation

Suggested concise wording, using functional descriptions without project names:

> Redesigned investment-business websites in Next.js, built enquiry flows, and improved responsive layouts, reusable design systems and static-export delivery.

If the role needs fewer words, keep this as supporting work behind the investor-platform and CRM accomplishments. Avoid claiming original ownership of the whole website, global SEO/accessibility infrastructure, verified deployment, search/lead-conversion gains, or AI-process ownership based on inherited documents.
