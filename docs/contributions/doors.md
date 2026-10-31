# Contribution audit: doors

Audit date: 31 October 2026. This report separates identifiable feature work from the substantial inherited CRM and from uncommitted local changes. It supports the March-October 2026 Indiassetz experience entry.

## What the repository is

A large React/JavaScript CRM for real-estate operations: client and property management, orders, primary sales, invoicing, payment operations and financial workflows. The interface uses Material UI and its data grid, Redux Toolkit, React Router, Axios, spreadsheet export and charting libraries. This repository is a frontend; calling existing APIs does not establish authorship of the backend.

## Audit scope and identity rule

The review covered all reachable history metadata and changed-file inventories, project guidance and manifests, the imported baseline, checked-out HEAD, cached `origin/main`, and substantive patches/current source for the work groups below. Raw author names containing `Aniruddh`, case-insensitively, were included; email addresses were not used. Large imports, merges, replays and existing application code were not treated as new implementation merely because they have a matching name.

| Item                                                  | Finding                                                                                      |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| History availability                                  | Not shallow; local/cached remote refs and release tags; nothing fetched                      |
| All reachable commits                                 | 7,108, with history dating from April 2022                                                   |
| Matching author names                                 | `Aniruddh Ballal` (4,097); `aniruddhindiassetz` (3)                                          |
| All matching commits                                  | 4,100: 3,015 non-merge and 1,085 merge commits                                               |
| Matching commits with March-October 2026 author dates | 1,299: 1,186 non-merge and 113 merge commits                                                 |
| Matching commits outside that period                  | 2,801; excluded from this employment-period summary                                          |
| Period distribution                                   | March 80; April 72; May 20; June 13; July 684; August 371; September 31; October 28          |
| Checked-out HEAD                                      | `ed579640b3`, 20 July 2026; 135 reachable commits, all matching                              |
| Latest cached `origin/main`                           | `1dd063e099`, 9 October 2026; 724 reachable commits, 707 matching                            |
| Local worktree                                        | Extensive staged changes and unresolved merge conflicts; excluded from delivered-work claims |

All-history totals contain several related versions of the same changes and a much older company history. There are 977 distinct author-timestamp/subject pairs among the 1,299 matching period commits; that is only a duplication signal, not a count of unique patches. Author dates on replayed commits also need not follow the parent/import date. No productivity claim should use raw commit totals.

The two identities are included literally because they satisfy the requested rule. The older dates, imported histories and before-start marker leave historical identity/ownership context unresolved; matching a name is not sufficient to claim that the entire pre-existing CRM was created during this job.

## Baseline and ownership

`2e466451f4` explicitly records the state of the application before Aniruddh started working. It is a large imported application, not an empty scaffold. Its client/property/order/finance modules are a baseline, not proof of original product authorship.

The strongest contribution evidence is the feature-specific history added after that snapshot and corresponding committed changes in the more recent cached main. Older cached company refs contain additional March-June name-matching changes, including invoices and primary-sales payment support; they are recorded below at their original hashes without presenting the whole imported product as his creation.

The July checkout and October cached main differ substantially. Current source claims below use committed trees, particularly cached `origin/main`; unresolved worktree content is not used. Cached remote refs establish locally available committed work, not a live deployment check.

## Attributable work groups

### Payment/claim operations and workflow visibility

- Reworked payment-claim and upload listings into readable operational views with pipeline stages, status explanations, claim/SLA presentation, filters and navigation. Evidence: `4596fb281e`, `f01cee2a59`, `01d5f6eb15`, `4034a18890`, `6e49e8ea3d`, `3211891a3f`; paths under `src/features/NewPaymentListing/`.
- Implemented dependency-aware presentation of pending, blocked, approved, rejected and completed steps. `f01cee2a59` contains substantive resolver logic rather than only styling changes. Later code carries these concepts into shared utilities and focused grids. This is workflow visibility, not evidence that frontend code is the security authority for approval decisions.
- Improved filtering and result handling, including invalid ranges, backend-driven upload filters, pagination resets and stale-request protection. Evidence: `239ddcbe4f`, `ec91b33e79`, `e0a903927c`; latest `newPayment.slice.js` tracks request identifiers per view and separates tab state. Do not assert every later improvement originated in the early July version.
- Added column sorting, direct payment navigation, copy controls and a due-today timing option. Evidence: `c58ad55124`, `a4cb00ffdf`, `a6ba64925e`, `822c7d3b99`, `1dd063e099`; paths include `ClaimGrid.js`, `UploadGrid.js`, `constants.js` and `utils.js` in the payment-listing module.

### Exception and feedback approvals

- Added role-specific review flows and adapted them to revised backend response structures. Evidence: `c36eb87118`, `3598d68d62`, `af4b0e0fba`; paths include `PaymentOperatingListing.js`, `paymentOperating.api.js`, `paymentOperating.slice.js` and `components/FeedbackHistoryDrawer.js`.
- Implemented approval dependencies, distinct pending/rejected states and review actions associated with the correct approval stage. Evidence: `29a5852d43`, `b80de0fe3e`, `7f50e28e60`. The lengthy drawer-design sequence is iterative work on one workflow, not dozens of distinct capabilities.
- Added independent delayed-claim actions, status/re-upload handling and clearer ownership of review steps. Evidence: `2cd3323347`, `2368a678a0`, `0c887600b7`, `71ab376644`; paths include the operating listing, `DelayedClaimStatusModal.js` and shared feedback utilities.
- Tightened action availability and compatibility with response variants; normalized uploader/verifier metadata, sorted/deduplicated records and retained explicit null timestamps. Evidence: `3646f5567a`, `bd4aa3b875`, `b0bedf280c`, `827fd4f0aa`, `a2cfb9de53`, `463e9f3d3c`; latest `feedback.utils.js` and `FeedbackHistoryDrawer.utils.js` contain these helpers. Client-side role checks support usability; they do not prove server authorization or a security audit.

### Document review experience

- Replaced forced invoice downloads with in-app document preview, loading states, image sizing, zoom/pan and download controls, then generalized the viewer for reuse in feedback review. Evidence: `9115863738`, `1ea2af1310`, `23dfc514f6`, `0aa5d7780c`, `eb4a7fae1c`, `a3cee37c13`, `a85918a19d`; paths include `src/components/FileViewerModal/` and `PaymentDetailsDrawer/`.
- Added transaction skeleton states and later blocked SVG upload/preview in feedback handling. Evidence: `57c7d583a8`, `5990fc6537`. This supports a specific input/preview hardening statement, not a general claim that all uploads are secure.

### Revenue attribution and spreadsheet reporting

- Built a revenue-disposition interface that explains potential, pending, rejected and actualized revenue, with aggregate/member drilldowns and performance-credit charts. `655ee4fc7e` starts with dummy data and therefore proves a prototype only. `56ebd54217` then integrates backend data, and `27deb332a7` applies it to supported order flows. Paths are under `src/features/Orders/components/Payments/RevenueDispositionMatrix/` and the consuming order-detail pages.
- Added spreadsheet exports for the disposition matrix, totals and relationship-manager/partner-manager performance-credit breakdowns. Evidence: `e3e62b1052`, `4a70fa136a`; current committed code imports the spreadsheet library, constructs workbook sheets and writes a file. This is concrete reporting functionality, without evidence for any claimed revenue increase.
- Extended the matrix into primary-sales orders and fixed that integration. Evidence: `5ff32e446f`, `3ebc898ea8`; consuming path `src/features/PrimarySales/TransactionalOrders/TransactionalOrderDetails/TransactionalOrderDetails.js`.
- Subsequently split matrix logic, styles and helpers into smaller modules. Evidence: `6e3afb9e33`, `a59e8bc7af`. Later gate/approver concepts and alternative charts include explicit preview/playground work; do not present every prototype as production-delivered behavior. The latest real component has an API-backed path and a separate explicit preview mode.

### Loading behavior, fetch reuse and integration fixes

- Cached shared lookup values and reused in-flight requests to avoid redundant calls across page mounts; refined payment-feedback fetching. Evidence: `e10e24b317`, `c3b6cb8537`, later `5bd19cb2a7`; paths include `src/store/dropdownSlice.js` and the operating-payment slice. The code includes cache bypass support for explicit refresh. No request-count reduction was measured in this audit.
- Changed order pages from coarse whole-page loading toward section-specific skeletons and independent loaded/empty states, including primary-sales order details. Evidence: `c90f81f16f`, `6558633435`, `57e2921d10`; paths include order-detail pages, `src/App.js` and `TransactionalOrderDetails.skeletons.js`.
- The history also contains a reverted performance-porting PR (`5765e9453e`) followed by later porting/refinement commits. Current cached-main code was checked rather than assuming every earlier optimization survived. It supports improved loading behavior, not a measured latency or speed percentage.
- Delivered targeted operational fixes such as client app-download status (`67758839a7`), past-buyer read-only behavior, claim-linked payment autofill (`357c0da25b`) and builder edit-mode fixes (`5436f71325`). These are additions/fixes within an existing CRM.

### Additional matching work in older company refs

March-June period matches include invoice-in-order work (`1c06ca7650`), payment confirmation (`05ca6e206d`), primary-sales payment integration (`9e172eabed`), and finance-listing additions (`99718f0171`). Patches touch existing order, invoice, payment and listing modules rather than establishing a new application. Some are folded into shared/squashed integration commits. They support the functional breadth of available matching history, but the later before-start snapshot means they should not be used to claim sole origin of those baseline modules without reconciling the archive's history context.

## Quality, verification and limits

Positive source evidence includes explicit workflow states, response normalization, range validation, per-view request tracking, reusable preview/loading components, modular refactoring and cache/in-flight-request guards. This is meaningful application engineering beyond visual polish.

No committed test/spec files were found in the inspected HEAD or latest cached-main tree. A test runner script and historical release tags exist; neither proves tests passed for these contributions. Some PR descriptions mention testing, but an assertion in a message is weaker than executable tests/results. No dependency install, lint, build, unit test, browser test, API request or deployment verification was performed. No company service was contacted. The conflicted worktree cannot itself be treated as a functioning deliverable.

Do not invent cost savings, transaction volume, user counts, revenue uplift, measured performance gains or production reliability metrics. Do not claim backend ownership, complete CRM authorship or a security certification from frontend role-gating code.

## AI-assisted development evidence

Personal commit evidence is explicit:

- `06cada4113` describes performance-credit interface iterations as ChatGPT-generated and Claude-directed.
- `adf303dd76`, `5fab7cd072`, `46b5298005` and `ccef8d1cc5` describe Claude/GPT prompting for design iterations.
- `b2c88a038c` describes documenting a delayed-claim flow completed with Claude assistance.
- `10dd46b14a` credits Claude in a commit-message-renaming utility change.

These support high confidence in AI-assisted design/implementation/documentation activity. They do not prove automated testing, release management, autonomous delivery or an organization-wide AI SDLC process. An application feature integrating text suggestions is a separate product capability, not evidence of the development process used to build it.

## Appropriate public presentation

Suggested concise wording without project names:

> Built CRM payment and approval workflows, revenue-attribution dashboards and spreadsheet exports; improved order loading, document review and shared-data fetching.

For a more conversational website sentence:

> Made complex CRM payment and approval flows easier to use, with revenue breakdowns, document previews and clearer loading states.

These phrases deliberately describe substantial feature ownership within an existing application. They avoid claiming that the entire CRM, its backend or every imported primary-sales module was built by one person.
