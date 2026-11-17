# THN. CORE V2 Progress

> Historical record of the original Fluid/Lenis technical-reference work. On 2026-11-16, the authorized Recovery & Rebase changed `/preview/thn-core/v2` to the shared Silver Editorial B2 composition with refined Lenis/GSAP motion, portrait, Capstone-only selection and theme system. Production and the historical CORE baseline remain unchanged. The measurements and inventories below describe the earlier task, not the current V2 visual selection. The future palette remains planned only; see the current design brief and D-027.

**Updated:** 2026-11-15  
**Status:** Phases 0-5 complete. V2 is implemented and verified as a local noindex preview; no deployment, commit, or push was performed.

## Authorized scope and preservation

- Build V2 as an isolated preview at /preview/thn-core/v2.
- Reuse the existing shared THN. CORE page and Fluid Construct; do not duplicate the page composition or portfolio facts.
- Preserve the approved Silver Editorial B2 production homepage at /, /preview/thn-site, /preview/thn-core, and all existing study routes.
- Integrate Lenis only on V2. V2 must have one scroll owner; V1's existing ScrollSmoother behavior remains unchanged.
- No deploy, commit, or push.

The route and scroll-owner isolation is recorded as D-023 in docs/THN-CORE-DECISIONS.md.

## Phase 0 — Repository audit and safety baseline

**Status:** Complete.

### Architecture and inventory

- The root app/ directory is the active Next.js App Router. The installed Next.js 16.2.9 docs say src/app is ignored when root app exists. Changes must use the active root route tree.
- app/page.tsx renders SilverEditorialPortfolio; the approved homepage uses the open Silver Editorial portrait hero, a Capstone-only Engineering list, and no Three.js canvas.
- app/preview/thn-core/page.tsx renders the shared ThnPortfolioPage with profile="core", CorePremiumPreview, CorePremiumContentWrapper, and the interactive Fluid Construct. Its default Engineering list contains all three shared projects.
- ThnPortfolioPage is the common page composition. The V2 route can reuse it with a route-specific motion wrapper while retaining the existing content, section IDs, navigation, and links.
- Current CORE motion is in core-premium-preview.tsx and core-premium-motion.ts; it loads GSAP/ScrollTrigger and creates ScrollSmoother. preview-motion.tsx is the existing default GSAP/ScrollTrigger path for other preview profiles. The installed package set has GSAP 3.15.0, React Three Fiber 9.8.2, and Three.js 0.186.1; Lenis is not installed.
- Shared project data has three records: Kitchen Chicken (archived, existing preview and GitHub links), Capstone Project (coming soon), and Interactive Web Experiment (coming soon). The homepage's Capstone-only selection does not change the shared project records.
- Package scripts include dev, build, start, and lint; there is no test script or repository test/spec file found.
- README is the default create-next-app README; AGENTS.md, the CORE design brief, decision log, plan, and applicable skills were read before implementation.

### Existing worktree preserved

At the start of the task, tracked files already modified were .gitignore, AGENTS.md, app/favicon.ico, app/globals.css, app/layout.tsx, app/page.tsx, package-lock.json, and package.json. Untracked work already included .agents/, .playwright-cli/, .vercelignore, CODEX_PLAN.md, GLOBAL_WORKING_CONTEXT.md, PORTFOLIO_REDESIGN_PLAN.md, app/icon.svg, app/preview/, app/robots.ts, app/sitemap.ts, components.json, components/, data/, docs/, lib/, public/SE182998_1.jpg, skills-lock.json, and src/. These were treated as pre-existing work and not reverted.

### Baseline checks

| Check | Result |
| --- | --- |
| npm run lint | Exit 0; one existing warning at src/components/process-section.tsx:54 for unused index. |
| npx tsc --noEmit | Pass, exit 0. |
| npm run build | Pass on Next.js 16.2.9; all 19 existing static routes generated. |
| Repository tests | No test script or test/spec files found. |

### Production-browser baseline

Captured with Microsoft Edge through the existing E:\Portfolio-QA\Tools\cp2-playwright-venv Playwright environment against the production build at http://127.0.0.1:3001. Evidence is outside the repository at E:\Portfolio-QA\Thn\THN-CORE\V2\run-2026-11-15-phase0\.

- / and /preview/thn-core returned HTTP 200 at 1440×900, 390×844, and 320×780.
- None of those six cases had horizontal overflow, missing same-page fragments, page errors, console errors, HTTP errors, or failed requests.
- The homepage reported one project row and zero canvases. CORE V1 reported three project rows. Its 320px case used the static SVG scene fallback (zero canvas); desktop and 390px loaded the interactive canvas.
- Three desktop CORE Contact-anchor samples settled in 2255.6ms, 2272.5ms, and 2265.6ms (median 2265.6ms). The settled target top was 91.6px; header bottom was 77px. No page/console/network errors occurred in those samples.
- Representative hero and full-page screenshots were saved in the external evidence folder.

### QA tooling incident

The supplied cp2_capture.py script has hard-coded /preview/thn-site, port 3001, and Phase-8.2/Checkpoint-2 output paths, and its --help invocation runs the capture instead of printing help. It was invoked before the production server was started and overwrote E:\Portfolio-QA\Thn\Phase-8.2\Checkpoint-2\reports\viewport-matrix.json with ten connection-refused cases. It did not reach screenshot writes. A targeted search found no verified backup/copy of that file, so the original cannot be recovered and has not been reconstructed. The failed JSON remains at the old path; subsequent QA uses direct Playwright calls and writes only under the new V2 run folder.

### Known baseline limits

Browser captures used headless Edge; hardware GPU acceleration was not confirmed. Treat these as functional/layout evidence, not a real-GPU performance benchmark.

## Phase 1 — Verified integration guidance

The official Lenis README and current maintainer source were checked before implementation. The package installed is 1.3.27. Its documented GSAP integration forwards Lenis scroll events to ScrollTrigger.update, calls lenis.raf(time * 1000) from GSAP's ticker, and uses one ticker loop. The maintainer source confirms anchor scrolling accounts for target scroll-margin and container scroll-padding. Lenis respects prefers-reduced-motion by default; syncTouch is disabled, retaining native touch movement. V2 uses these behaviors and cleans up ticker/listener registrations on teardown.

## Phase checklist

- [x] Phase 0 - Audit, preserve initial worktree, establish baseline checks and browser evidence.
- [x] Phase 1 - Integrate V2-only Lenis with GSAP/ScrollTrigger; verify anchors, history, interruption, resize, reduced motion, cleanup, and touch.
- [x] Phase 2 - Refine the V2 hero while preserving the Fluid Construct, identity, existing controls, and fallbacks.
- [x] Phase 3 - Refine shared section motion/style through V2-only profile overrides while preserving content, project rows, and links.
- [x] Phase 4 - Verify requested and intermediate widths, keyboard/focus, touch, reduced motion, no-JavaScript, and WebGL failure fallback.
- [x] Phase 5 - Capture bounded bundle/runtime measurements, confirm only Lenis was added for V2, rerun final checks, and record limitations.

## Phase 2 - Hero evolution

**Status:** Complete.

- The isolated route is `/preview/thn-core/v2`; it reuses `ThnPortfolioPage`, `CorePremiumPreview`, the desktop two-column/mobile Split composition, existing Fluid Construct, and shared project records. The 2D `Thn.` wordmark and existing geometry remain in place.
- V2 passes the currently approved graduate education/experience copy through the existing `identityCopy` prop. This text matches the production homepage; older copy on `/preview/thn-core` is unchanged. Decision D-024 records this.
- The V2-only refined profile staggers existing wordmark parts and the name's existing words. Scoped styling adds a monochrome studio-light field. It does not add SplitText or another animation dependency.
- Existing desktop drag and keyboard rotation remain active. V2 opts into the existing controller's touch rotation while retaining `touch-action: pan-y`.
- Edge browser evidence in `run-2026-11-15-phase2-final/reports/phase2-interaction-qa.json` records desktop drag markers and a changed release quaternion, keyboard rotation without page scrolling, horizontal touch rotation with a changed quaternion, and vertical touch scrolling from y=0 to y=135 with drag ended. Before/after scene captures are in that run's `screenshots` folder. This is automated Edge/CDP touch input, not a physical-device test.
- Desktop V2 viewport screenshot: `run-2026-11-15-phase-final/screenshots/core-v2-1440x900-hero.png`. At 1440x900 the actions occupy y=725.2-773.2 and the tool line y=836.9-873; both are visible with opacity 1. The earlier concern that the CTA was absent was not reproduced in DOM or screenshot.

## Phase 3 - Section evolution

**Status:** Complete.

- V2 applies its smaller motion token profile to the shared hero, headings, support text, Process, project rows, and contact sequences. A V2-scoped project hover/focus title travel change is 10px; the existing default remains 8px. Shared section composition, every project row, content, and links are preserved.
- A wheel-only measurement from the top recorded actual scroll stability after 1,566.8ms. The Contact heading became fully opaque at 1,255.5ms (311ms before that stop); supporting copy reached 0.98 opacity at 1,844.1ms (277ms after stop). An anchor to Contact landed at top 92.6px against a 92px scroll margin; first heading opacity >=0.05 was 913.5ms after stable arrival, heading opacity >=0.98 at 1,312.6ms, and support opacity >=0.98 at 1,928ms. These are one bounded headless Edge capture, not timing guarantees.
- Project rows remain Kitchen Chicken, Capstone Project, and Interactive Web Experiment. Baseline-versus-final parity checks matched titles, descriptions, robots metadata, headings, project titles, and HTTP(S) external links for `/` and `/preview/thn-core` at 1440x900, 390x844, and 320x780. The parity report notes that the baseline recorder omitted `mailto:` and `tel:` when collecting external links. V2 graduate education/bio match the approved homepage text, the three project rows match V1, and V2 is noindex.
- A real wheel traversal through the How I Work section showed all four step descriptions at opacity 1 in the section viewport. The screenshot is `run-2026-11-15-phase-final/screenshots/core-v2-process-in-view.png`.
- Contact and general section sequence checks reported no page, console, HTTP, or failed-request errors. V1 motion and visual defaults remain unchanged.

## Phase 4 - Interaction, responsive, and accessibility

**Status:** Complete.

- Final production matrix: `/` and `/preview/thn-core` at 1440x900, 390x844, and 320x780; V2 at 1440x900, 768x900, 430x932, 390x844, 360x800, and 320x780. All 15 cases returned HTTP 200 with no horizontal overflow, missing same-page fragments, page errors, console errors, HTTP errors, or failed requests. V2 and V1 retain three project rows; the homepage stays Capstone-only. The 320px CORE routes use their existing static SVG fallback.
- V2's interactive sculpture exposed an accessible group name and keyboard tab stop. The focus outline was solid 2px; ArrowRight rotated without scrolling the page and Home remains the reset key. Desktop pointer drag and CDP touch tests are recorded in the Phase 2 interaction report. Horizontal touch rotated the object; vertical touch advanced page scroll and ended drag.
- With reduced motion enabled, headings/content remained visible, all three projects rendered, Canvas/Lenis motion did not initialize, and the interactive surface was not tabbable. A mid-anchor reduced-motion switch landed Contact at 91.6px against a 92px margin.
- No-JavaScript V2 returned HTTP 200 with the H1 and three projects visible and no canvas. A forced WebGL-context failure left the readable SVG fallback and H1 in place with no page crash; the injected failure predictably produced a WebGL console error, which is recorded separately from normal browser runs.
- Breakpoint rebuild and reduced-motion toggle cycles removed and restored the V2 motion trigger marker; manual scrolling stayed near y=675-676 across a breakpoint with no hash or forced anchor. The corrected lifecycle report uses marker presence/removal rather than asserting a fixed trigger count. Navigation to `/` had no V2 scroll-owner marker or canvas.
- The initial full-page screenshot after wheel traversal showed the wordmark parts rendered inconsistently in that full-page capture. A separate live DOM check before/after the same real scroll and a normal viewport screenshot showed all V2 wordmark parts at opacity 1 and rgb(17,17,17); V1 showed the same before/after state. This full-page capture artifact is not treated as runtime proof. Evidence: `run-2026-11-15-phase-final/reports/wordmark-traversal-check.json` and `screenshots/v2-wordmark-after-return.png`.
- The first resize/wheel interruption attempt moved the browser pointer outside the new 390px viewport, so no wheel event was observed; its stale `contactWasNotReplayed` field is not valid acceptance evidence. The corrected in-viewport probe observes wheel capture while V2 uses Lenis and after the current trigger marker is restored; upward input moves scrollY from 4,343 to 3,660 within 100ms and ends at 3,143, with Contact at 2,008.8px rather than its 84px margin. This confirms interruption on the mounted new Lenis instance; the specific async initialization gap was not independently instrumented. V1's ScrollSmoother branch is unchanged. Evidence: `run-2026-11-15-phase2-final/reports/phase2-resize-wheel-order.json`; reviewer static pass found no confirmed issue.

## Phase 5 - Performance, cleanup, and release readiness

**Status:** Complete, with bounded measurement limits below.

- The only new direct dependency for this work is exact `lenis@1.3.27`; `npm ls --depth=0` confirms it. No React Bits package or unrelated upgrade was added. The existing shared motion engine selects either Lenis or the existing ScrollSmoother; V1 retains its default ScrollSmoother owner.
- One Edge performance capture measured encoded JavaScript resource bodies: `/` 234,319 bytes / 15 chunks; `/preview/thn-site` 197,094 / 10; `/preview/thn-core` 467,649 / 16; V2 467,865 / 16 (216 bytes above V1 in this capture). The identified CORE WebGL renderer chunk was absent from `/` and `/preview/thn-site`; those routes also had no canvas. Performance observer totals in this short run were 0 layout shifts on all four routes; homepage/site had no long tasks. The sequential V1 run recorded tasks of 613ms, 125ms, and 277ms; the later V2 run recorded one 62ms task. Because this is one ordered run with warm shader/cache effects, it does not support a causal V2 performance-improvement claim.
- Edge's WebGL renderer string identified `ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 Ti, Direct3D11)` in this environment. This confirms an NVIDIA adapter was exposed to the browser, but the captures are still headless and do not constitute a representative user-device benchmark.
- Three balanced V1/V2 pairs sampled animation-frame intervals during the same short wheel path at 1440x900. Across six runs, p50 intervals were 5.5-5.6ms, p95 5.7ms, and max 5.7-5.8ms, with no interval above 33ms. This headless cadence is reported as raw timing only, not FPS or a user-device frame-rate claim. Evidence: `run-2026-11-15-phase-final/reports/scroll-frame-samples.json`.
- Final checks after the last source change: `npx tsc --noEmit` passed; `npm run lint` exited 0 with the same existing warning at `src/components/process-section.tsx:54` for unused `index`; `npm run build` passed on Next.js 16.2.9. The repository has no test script or test/spec files.
- Dependency installation reported 33 vulnerabilities in the resolved dependency tree. Attribution to the pre-existing dependency set versus Lenis was not determined; no broad audit remediation or unrelated upgrade was performed.
- No unused V2-only helper or package was left behind. Historical study routes, existing previews, and pre-existing untracked/modified work were preserved. The task-start source hash report shows the production homepage, `/preview/thn-core` route, shared page composition, approved Silver Editorial copy, and other recorded baseline files unchanged.
- No deployment, commit, or push was performed. The local production preview server remains available at `http://127.0.0.1:3001`.

### Final evidence folder

All final production-browser artifacts are outside the repository under `E:\Portfolio-QA\Thn\THN-CORE\V2\run-2026-11-15-phase-final\`. Key reports are `final-route-matrix.json`, `final-content-link-parity.json`, `final-motion-accessibility.json`, `final-wheel-stop-timing.json`, `final-lifecycle-cleanup-corrected.json`, `final-performance-profile.json`, and `scroll-frame-samples.json`. The earlier resize probe and corrected run are kept separately; the old Phase-8.2 QA file was not touched again after the documented Phase 0 tooling incident.
