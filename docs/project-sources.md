# Project content sources

Reviewed 31 October 2026. The selection follows the author's brief: nine personal projects, in the requested order, plus four websites built for people they know. Copy was checked against READMEs and key implementation files, rather than treating roadmaps as shipped functionality.

## Personal projects

| Project            | Public source                                                     | Reviewed commit | Main implementation evidence                                                                            |
| ------------------ | ----------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------- |
| Sunalyse           | [Repository](https://github.com/aniruddhballal/sunalyse)          | `ee485d9`       | `client/src/features/solar-globe/ViewerView.tsx`, PFSS Python pipeline and adaptive seed generator      |
| SatLies            | [Repository](https://github.com/aniruddhballal/SatLies)           | `c29bf9d`       | `frontend/src/features/fundamentals/physics/acceleration.ts`, `scene/Satellite.tsx`, production routing |
| Queen's Gambit 2.0 | [Repository](https://github.com/aniruddhballal/queens-gambit-2.0) | `8c13be9`       | Rust move generator, encode/decode workers, Web Crypto, README benchmark                                |
| mp3fy              | [Repository](https://github.com/aniruddhballal/mp3fy)             | `e0ee955`       | Library scanner, queue order, playback persistence, lyrics and local Wrapped storage                    |
| kNupdate           | [Repository](https://github.com/aniruddhballal/kNupdate)          | `1802e72`       | Kotlin activity catalog/store, delivery scopes, relay TTL and identity metadata storage                 |
| dedgram            | [Repository](https://github.com/aniruddhballal/dedgram)           | `69eafca`       | Android capture sessions, Playwright collector/model/history, static website builder                    |
| LOANlo             | [Repository](https://github.com/aniruddhballal/LOANlo)            | `7097bce`       | Applicant/underwriter/admin loan routes, GridFS, credit-risk service, email service                     |
| VenPay             | [Repository](https://github.com/aniruddhballal/VenPay)            | `58a1263`       | Product requests, payment requests/transactions, Razorpay Checkout UI, role authentication              |
| Credex             | [Repository](https://github.com/aniruddhballal/Credex)            | `6524833`       | RFQ/order/loan controllers, payment ledger, signed document URLs, wired optimiser routes                |

## Collaborations

- **Bheeshma:** reviewed the local repository at `D:/post engg/Bheeshma.website`, including its README, application views, data hook, and Zen audio player. Its source repository is private and deliberately has no portfolio source link. The public site is [bheeshma.vercel.app](https://bheeshma.vercel.app).
- **Project Gudi:** reviewed the local repository at `D:/post engg/project-gudi`, including its README, frontend content adapter, donation form, and Payload configuration. [Public source](https://github.com/aniruddhballal/project-gudi), reviewed commit `91a0c85`. The supplied [preview](https://project-gudi.vercel.app) is labelled as a preview, not a production CMS deployment.

## Copy boundaries

Sankalpa For Change and Nikhil Lab Site were restored to Collaborations at the author's request, using their previously approved portfolio content. Their repositories remain private, so only their public websites are linked.

- Sunalyse's 500 seeds are an upper limit. Height and polarity filter field lines; field strength also controls their colouring.
- SatLies' current production experience integrates locally in the browser. Dormant backend or development-only routes are not presented as deployed features.
- Queen's Gambit's speed figure is the README's specific benchmark, not a new performance measurement. File contents are processed locally; optional filename/mode analytics mean "nothing leaves your device" would be inaccurate.
- mp3fy's current repository supports folder libraries, queues and local listening statistics. The brief's Spotify playlist downloader, arbitrary-date Wrapped, and standalone playlist creation were not found and are not claimed.
- kNupdate keeps activity history on devices and expires relay payloads. Device identities and pairings are persisted server-side; no blanket "no cloud database" or end-to-end encryption claim is made.
- dedgram investigates suspected automated accounts. It is not presented as conclusive bot detection or as having established geopolitical findings. Its current public atlas is static HTML/CSS/JS, not the retired React dashboard.
- LOANlo's credit-risk service supports human review; it is not described as making loan decisions automatically.
- VenPay's Razorpay Checkout integration is described without claiming verified production settlement or comprehensive payment security.
- Credex is a prototype with a manual payment ledger. XGBoost integration has a heuristic fallback when its model is absent; the short copy does not claim a deployed trained model or a completed admin frontend.
- Bheeshma has reading and recitation features, not a working AI assistant or offline audio. Verse text and recitation attribution is distinguished from inherited chapter/topic metadata.
- Project Gudi's CMS connection is a local proof of concept. Its donation UI is not presented as processing real payments.

## Link handling

Public personal repositories have source links. Android binaries use explicit **Download APK** actions; their public raw GitHub URLs were checked with HEAD requests, without downloading or executing binaries. Credex has no verified live demo and exposes source only. Bheeshma exposes its public site only. The portfolio does not call collectors, relay services, payment endpoints or private APIs.
