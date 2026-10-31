# Vantage3D: contribution review

## Scope and ownership

Reviewed all 70 locally reachable commits and the implementation at `cf991f9ad` on 31 October 2026. Every commit matches the author-name rule and falls inside March–October 2026. Implementation work is concentrated in 11–15 May; July and October also contain retrospective documentation. The repository is not shallow. Email identities were ignored.

Treat this as a **self-directed mobile 3D proof of concept**, not a delivered company walkthrough product. The history starts with a prompt and a React Native scaffold, then adds the custom viewer/backend integration. That supports original implementation of the experiment, not authorship of the rendering engine or framework.

## Implemented result

The current app browses GLB models served by a local Express backend and displays them in a PlayCanvas viewer inside a React Native WebView. The native shell sends typed commands and receives readiness, frame-rate and error messages. Camera controls include orbit/trackball and a first-person-style walk mode; render controls expose textured, wireframe and points modes.

The backend serves the viewer and rendering runtime, lists available models, and repairs known binary alignment problems before serving GLB data. This is a delivery/viewing experiment for existing models. It is **not a working video-to-3D reconstruction system**: the old upload/job hook remains, but the active server no longer exposes its corresponding processing routes.

## Attributable delivery sequence

| Evidence                                           | Contribution                                                                                                                                                                         |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `458fe53b0`, `4b86f242e`, `7fa24ddd7`              | Established the prototype, initial splat viewer, upload/job flow and native app integration.                                                                                         |
| `ff610202d`, `1a3b81a59`                           | Added the WebView message bridge and model-loading commands.                                                                                                                         |
| `c87bcb38b`, `ec749bbe7`, `51297e033`              | Added walk controls and pivoted from Gaussian splats to GLB rendering.                                                                                                               |
| `5da74d833`, `31ed94787`, `67616a2d7`, `368e729ac` | Iterated through client/server alignment workarounds and implemented binary buffer-view realignment. Current evidence is `server/lib/fixGlbAlignment.js` and `server/routes/glb.js`. |
| `1ddca1208`, `9e993e85e`, `f241ec94f`              | Reworked readiness/retry handling, viewer layout and diagnostics. These commits show engineering work, not a fresh runtime certification.                                            |
| `a559244a9`, `eabea7fb4`, `07fc474c6`              | Moved the viewer to a server-hosted origin, self-hosted the rendering runtime, and addressed Android/WebView networking behavior.                                                    |
| `7e9c1adfe`, `c69b1539b`, `4297eea6e`, `5e85f9b2b` | Corrected model appearance, modularized native/server code, and replaced the active upload flow with stored-model browsing.                                                          |
| `915fb0b6a`, `da4945aae`, `81eb432fb`              | Implemented and repaired quaternion trackball rotation and model orientation correction.                                                                                             |

## Quality and limitations

The meaningful engineering is the native/browser boundary: model delivery, binary alignment, startup sequencing, camera controls and diagnostics. The modular screen, bridge and server routes make those concerns identifiable rather than burying them in one app component.

The current GLB repair handles a particular family of alignment problems; it is not a universal model validator. Walk-mode clamping uses model bounds rather than a full navigable-interior/collision solution. A local backend and models are required. Caching the rendering engine does not make the whole application independently offline.

`src/screens/ViewerScreen.tsx` currently resets UI state in its retry handler without itself reloading the WebView. Initial model commands and viewer readiness also warrant device-level checks before calling the integration reliable. The repository includes a starter render test, not demonstrated coverage of the model, camera or native networking pipeline.

No Android build, native install, scan upload, live model retrieval or device benchmark was run during this audit. Development networking assumptions must not be presented as production deployment or verified performance for client walkthroughs.

## AI-assisted development evidence

`prompt.md` contains a step-by-step implementation request; `git_history_for_claude.md` is a later AI-oriented context artifact. Those establish the presence of prompt/context material. They do not establish an exact assistant run for each implementation commit, or prove that the requested original Gaussian-splat pipeline was delivered. No screened assistant-name terms were found in matching commit messages. **Evidence of AI-oriented planning/context exists; executed SDLC attribution remains limited.**

## Reporting decision

Keep this experiment separate from company products. “Prototyped mobile 3D viewing with native/WebView integration and GLB compatibility fixes” is defensible in a personal research inventory. Do not credit it as a deployed employer feature, a production reconstruction pipeline, an adopted client tool or a measured business improvement. Its name is omitted from the résumé and website work entry.
