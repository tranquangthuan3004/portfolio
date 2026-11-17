# THN. CORE Decision Log

**Current interpretation:** Silver Editorial B2 is the approved production design at `/`. The V2 preview now shares B2 composition with opt-in refined Lenis/GSAP motion; the historical Fluid reference remains at `/preview/thn-core`. See D-027 and the current section of `THN-CORE-DESIGN-BRIEF.md`. Earlier decisions remain historical and scoped; retired route references do not instruct agents to recreate those routes.

This log records durable design and architecture decisions for THN. CORE. Read it together with `THN-CORE-DESIGN-BRIEF.md` before beginning later CORE work. Later phase-scoped decisions supersede earlier decisions only within their stated scope.

## D-001 - Reject literal 3D typography

**Status:** Approved 2026-10-31  
**Decision:** Do not model `Thn.`, `THN`, the owner's name, or recognizable letterforms as 3D geometry.  
**Reason:** The 2D `Thn.` wordmark is the established brand signature. A 3D text duplicate would compete with it, weaken its hierarchy, and turn the scene into a second logo rather than the requested abstract sculpture. The Phase 2 letterform study is therefore replaced on the Core comparison path by non-typographic concepts.  
**Consequence:** Preserve the 2D wordmark and its typography exactly. All 3D meshes, silhouettes, and static fallbacks must remain abstract and non-letter-like.

## D-002 - Compare two distinct sculptures without choosing a winner

**Status:** Historical Phase 2.5 decision; the `/preview/thn-core` entry composition is superseded by D-005.  
**Decision:** Build Orbital Architecture and Fluid Construct as separate preview routes. Keep `/preview/thn-core` as a neutral comparison entry with links in the existing hero visual area and no default sculpture.  
**Reason:** Independent routes make the difference in geometry and material composition reviewable under the same V1 content and layout. A neutral entry avoids implying that either concept has been selected.  
**Consequence:** Use `/preview/thn-core-orbital` and `/preview/thn-core-fluid` for the concepts; keep all three routes non-indexable and leave root/V1 routes unchanged.

## D-003 - Retain the Phase 2 scene-safety architecture

**Status:** Approved 2026-10-31  
**Decision:** Reuse the existing lazy React Three Fiber/Three.js path, SVG fallback, reduced-motion behavior, WebGL context-loss recovery, offscreen pause, responsive quality tiers, and explicit resource cleanup. Keep scene implementations route-scoped.  
**Reason:** Phase 2 validated these safeguards and established a measurable baseline. Replacing that architecture would add risk without improving the concept comparison.  
**Consequence:** The homepage, `/preview/thn-site`, and the neutral comparison entry do not load 3D scene chunks. Do not add new dependencies or external scene assets.

## D-004 - No selection or Phase 3 advancement in Phase 2.5

**Status:** Historical Phase 2.5 boundary; scoped Phase 3A implementation is explicitly authorized by D-005.  
**Decision:** Present both concepts for review and report their measured tradeoffs; do not declare a final selection or start Phase 3.  
**Reason:** The creative comparison is the purpose of this phase. Choosing a direction or expanding the experience requires the user's next decision.  
**Consequence:** Keep descriptions neutral, preserve both routes until the user decides, and stop at the Phase 2.5 acceptance gate.

## D-005 - Scoped Phase 3A hero candidate

**Status:** Explicitly authorized by the user on 2026-10-31.  
**Decision:** Recompose only `/preview/thn-core` as a two-column Fluid Construct hero candidate: existing identity and CTAs at left, large abstract sculpture at right. Preserve the neutral concept comparison at `/preview/thn-core-studies`. This is an exploration, not a final production selection.  
**Reason:** The user authorized a more expressive preview of the Fluid study while preserving the production V1 page and the existing Phase 2.5 concept routes.  
**Consequence:** Keep the root homepage, `/preview/thn-site`, project content, navigation, metadata, dependencies, and the existing `/preview/thn-core-orbital` and `/preview/thn-core-fluid` layouts unchanged, apart from retargeting their existing Compare links to the preserved studies entry. Preserve the 2D `Thn.` wordmark as the sole brand signature and keep the existing fallback, reduced-motion, offscreen, and cleanup safeguards. Do not deploy, commit, push, select a production concept, or continue beyond this authorized hero scope.

## D-006 - Compare two isolated mobile compositions

**Status:** Authorized by the user on 2026-10-31.
**Decision:** Add `/preview/thn-core-mobile-split` and `/preview/thn-core-mobile-layered` as noindex studies. Keep `/preview/thn-core` at its Phase 3A design and do not choose a mobile default. Both study routes use the same copy and Fluid scene; their differences are limited to the mobile composition. At 1440px they retain the Phase 3A desktop presentation.
**Reason:** The two spatial arrangements should be reviewed side by side without changing the current preview or declaring a winner.
**Consequence:** Implement the split wordmark-left/sculpture-right row and the layered wordmark-plus-sculpture atmospheric region in route-scoped mobile CSS. Preserve one scene instance, content, metadata behavior, fallbacks, motion preferences, and all other routes. Stop after comparative QA; no production migration, deployment, commit, or push is included.

## D-007 - Approve the Phase 3C CORE composition

**Status:** Explicitly approved by the user on 2026-10-31.
**Decision:** Keep the Phase 3A two-column composition on desktop and use Phase 3B Variant A (Compact Split) on mobile for `/preview/thn-core`. Use Fluid Construct as the hero sculpture. The existing two-dimensional `Thn.` wordmark remains the only brand signature; do not add 3D lettering, logos, or monograms.
**Reason:** The approved desktop and mobile studies form one coherent hero composition for the Phase 3C motion and interaction work. The decision closes those layout comparisons for this preview without selecting a production concept.
**Consequence:** Apply Phase 3C interaction and motion only to `/preview/thn-core`. Preserve the two mobile study routes and all previous comparison routes, portfolio content, project data, links, contact details, metadata, and production V1 behavior. Do not deploy, commit, push, or start a later CORE phase.

## D-008 - Refine the Phase 3D CORE preview controls

**Status:** Explicitly authorized by the user on 2026-11-01.
**Decision:** On `/preview/thn-core` only, remove the visible â€œFluid Construct / exploratory candidateâ€ caption and â€œCompare sculpture studiesâ€ link. Give the figure an accessible name and present a concise interaction hint with an inline disclosure for four-axis rotation plus a 44px reset target. Keep arrow-key rotation available to the focused sculpture region. Preserve native vertical touch scrolling; do not make touch dragging trap page scroll. Under reduced motion, retain the static SVG, portfolio copy, and CTAs while hiding controls that cannot act.
**Reason:** The approved desktop and mobile compositions are now the Core preview, and the study-only labeling and comparison shortcut no longer belong in that hero. The controls should remain discoverable without dominating the editorial composition or requiring drag input.
**Consequence:** Keep study captions, comparison links, and implementations unchanged on all other routes. Keep the figure name, control labels, focus indicators, and 44px button targets accessible. Do not change production V1, route content, metadata, 3D lettering, or dependencies, and do not deploy, commit, or push.

## D-009 - Do not retain the tested startup shader gate

**Status:** Experiment evaluated and reverted on 2026-11-01.
**Decision:** Keep the existing StudioReflection and Fluid sculpture render order. Do not delay the interactive scene children until the PMREM environment attaches.
**Reason:** Three matched cold production runs in Edge headless SwiftShader reduced program links from 10 to 8 and moved the first submitted envmapped draw from a 1,619ms median to 1,524ms. However, the maximum Long Task median increased from 461ms to 636ms and the total Long Task median from 852ms to 951ms; the three-run ranges overlap. The candidate also exposed controls later than the earlier renderer-ready callback, though that callback did not represent a rendered sculpture and the two readiness marks are not equivalent. This did not establish a main-thread improvement and does not justify changing the established render and fallback lifecycle. The experiment removes two MeshPhysical no-environment links but still performs the PMREM work and final environment variant compilation.
**Consequence:** Retain the established scene, fallback, and context-loss behavior for the preview and all studies. Treat these numbers as headless SwiftShader measurements, not physical-GPU performance. Revisit only with better attributable evidence; do not disable shader diagnostics or change environment quality to mask startup work.

## D-010 - Scope Phase 4A scroll storytelling to the Core preview

**Status:** Explicitly authorized by the user on 2026-11-01.
**Decision:** On `/preview/thn-core` only, connect the hero, About, Expertise, Engineering / Work, and Contact chapters with reversible scroll progress. One root `ScrollTrigger` snapshot owns the progress source. R3F reads a ref for the hero scene pose while the existing inner drag group retains user rotation; subsequent chapters animate existing DOM elements and the sculpture leaves with the hero.
**Reason:** The approved Phase 3A desktop and Phase 3B Split A mobile compositions can carry one continuous, native-scroll narrative without pinning sections, moving the sculpture across the page, or changing portfolio content.
**Consequence:** Preserve every existing section, project, link, accessibility path, comparison route, and V1 behavior. Keep later chapters DOM-only, maintain SVG/reduced-motion/WebGL/offscreen/resource safeguards, add no dependencies, and stop after Phase 4A review. This decision does not authorize production migration, deployment, commit, push, or a later phase.


## D-011 - Remove the visible CORE hero controls and refine chapter motion

**Status:** Explicitly authorized by the user on 2026-11-04.
**Decision:** On `/preview/thn-core` only, remove the visible sculpture control row while keeping pointer drag and inertia plus focused arrow-key rotation and Home/R reset. Use small, alternating left/right heading reveals tied to the existing CORE progress owner, and arrange the desktop Process steps as a vertical left/right zigzag. Keep mobile Process in its existing single-column layout. Retain native document scrolling.
**Reason:** The hero control row and its reserved space competed with the approved composition. The restrained heading and Process motion adds a clear reading rhythm without changing the content. A bounded trial of the installed GSAP ScrollSmoother used the existing GSAP/ScrollTrigger instance and kept the sticky header outside transformed content. Although mobile touch and history navigation worked, the settled desktop Contact anchor landed at 60.25px for a 92px scroll margin, while native scrolling landed at 92.25px; that repeatable offset regression rules out the trial for this route.
**Consequence:** Preserve the approved desktop and Split A mobile hero, all copy, projects, links, metadata, fallbacks, keyboard access, reduced-motion behavior, comparison routes, and production V1 behavior. Keep the established native scroll owner; add no dependency and make no production migration, deployment, commit, or push.

## D-012 - Enable CORE-only smooth scroll with corrected anchors

**Status:** Explicitly authorized by the user on 2026-11-04.  
**Decision:** Enable the installed GSAP ScrollSmoother on `/preview/thn-core` only, with desktop smoothing set to 1 second, native touch scrolling (`smoothTouch: 0`), and no Smoother under reduced motion. Keep the sticky header and skip link outside transformed content. Drive the existing CORE progress observer from Smoother's visual scroll position. Use computed anchor scroll margins for same-page links and browser history; return `#top` to scroll position zero. Process steps use independent, reversible ScrollTrigger entrances with a 0.25-second delay and 0.9-second `power3.out` motion.  
**Reason:** The earlier bounded trial recorded a settled Contact anchor offset error. A focused history probe then found the fixed wrapper restoring 95px of internal scroll on Back; the final integration clamps that restoration before anchor measurement. About and Contact now align to their 92px scroll margin on click and Back/Forward while the header remains fixed, and native mobile touch and reduced-motion behavior are preserved.  
**Consequence:** Keep ScrollSmoother and Process animation scoped to the CORE preview, retain all current content, fallbacks, interactions, comparison routes, and V1 behavior, and add no dependency. This does not authorize production migration, deployment, commit, or push.

## D-013 - CORE typography entry motion

**Status:** Explicitly authorized by the user on 2026-11-05.  
**Decision:** On `/preview/thn-core` only, use five reusable, time-based GSAP entry treatments?left, right, bottom, masked line, and word stagger?for the About, Expertise, Services, Stack, Engineering, and Contact headings. Entries reverse as headings leave above the viewport. Restore decorative Engineering word wrappers during GSAP context cleanup.
**Reason:** The distinct, restrained reveals add typographic rhythm while continuing after scrolling stops and preserving readable text during reduced motion, no-JS rendering, or failed initialization.
**Consequence:** Preserve the approved hero assembly, independent How I Work timelines, ScrollSmoother and history handling, all copy and project data, comparison routes, and V1 behavior. Do not add a SplitText dependency or change the hero, Process, or scroll ownership.

## D-014 - Reduce desktop interactive Fluid canvas pixel ratio

**Status:** Explicitly authorized by the user on 2026-11-05.
**Decision:** Set the active desktop interactive Fluid hero Canvas to DPR 0.85 on `/preview/thn-core`. Keep compact/mobile Fluid canvases, Orbital, and study canvases at DPR 1. Preserve geometry, camera, environment, materials, and drag/inertia behavior.
**Reason:** In three balanced Edge headless SwiftShader runs at 1440×900, the visible-stage rAF gap p50/p95/max medians changed from 22.25/66.7/66.7ms at DPR 1 to 16.7/50/50ms at DPR 0.85, with no range overlap in visible p95 (baseline 61–72.3ms; candidate 49.9–50ms). A matched screenshot showed slight softness at the rendered CSS size, but no material degradation. These results describe this controlled software-rendering run, not physical GPU performance.
**Consequence:** Keep this pixel-ratio cap limited to the desktop interactive Fluid hero. Preserve all other Canvas defaults, geometry, materials, fallback and interaction behavior, study routes, and V1 output. Do not add dependencies, deploy, commit, or push.

## D-015 - Time-based CORE typography arrival

**Status:** Explicitly authorized by the user on 2026-11-05.
**Decision:** On `/preview/thn-core` only, retain the five typographic treatments from D-013 but play each heading and its brief supporting copy as a once-only time-based reveal after viewport entry. After same-page anchor navigation, begin the reveal only when the target is within its computed scroll margin and has settled, then wait one second. Defer anchor destination measurement by one animation frame so a closing mobile menu no longer shifts the target after measurement. Entries suppressed during anchor travel resume only if still visible when the anchor delay begins, or when they later become active; untouched offscreen headings remain dormant. A fast pass or interrupted anchor completes pending text to its readable state; already-revealed text stays visible across reinitialization. This supersedes D-013's reversible heading timing.
**Reason:** The reveals should finish after scrolling stops, while anchored navigation keeps the same header offset on desktop and touch layouts.
**Consequence:** Preserve static, no-JavaScript, reduced-motion, and initialization-failure readability, all copy and links, the Hero and Process motion owners, ScrollSmoother/history behavior, the Fluid scene and interaction, comparison routes, and V1. Keep decorative scroll progress unchanged; add no dependency and do not deploy, commit, or push.

## D-016 - Preserve natural CORE reveals when navigation is interrupted

**Status:** Explicitly authorized by the user on 2026-11-07.  
**Decision:** On `/preview/thn-core` only, keep first-entry heading and supporting-copy poses hidden only after GSAP successfully initializes, while leaving their DOM text accessible. Anchor replacement preserves the destination reveal: restart its one-second wait from the initial pose, or pause/resume an in-progress reveal without rewinding. If wheel, touch, pointer, or keyboard input interrupts anchor travel, continue a visible reveal naturally instead of snapping it to completion; finish immediately only when all reveal targets are outside the viewport. Cancel timers and paused timelines on teardown so GSAP rollback restores readable content on initialization failure.
**Reason:** Rapid navigation and user interruption must not flash prepared text to its final state, and visible supporting copy must not be completed early when only its heading leaves the viewport.
**Consequence:** Preserve no-JavaScript, reduced-motion, initialization-failure, accessibility, anchor margin, Hero, Process, Fluid, ScrollSmoother, comparison-route, and V1 behavior. This does not authorize new routes, dependencies, deployment, commit, or push.

## D-017 - Isolate Phase 5A visual studies

**Status:** Explicitly authorized by the user on 2026-11-08.
**Decision:** Add `/preview/thn-core/visual-a` and `/preview/thn-core/visual-b` as noindex visual studies using the shared CORE portfolio and motion components. Scope variant styles to each study root. Visual A uses a refined monochrome editorial system; Visual B uses a warm silver and graphite system with cobalt reserved for interactions. Keep copy, project data, status/order, links, wordmark, layout, scene, and interaction behavior shared.
**Reason:** Compare stronger navigation, spacing, heading rhythm, and Engineering presentations without branching content or altering the CORE baseline.
**Consequence:** Preserve `/preview/thn-core`, all existing study routes, production V1 behavior, scene geometry, Canvas quality, drag behavior, GSAP typography, ScrollSmoother, and Process motion. Neither route is a production selection. Add no dependency, deployment, commit, or push.

## D-018 - Use a portrait placeholder in the selected visual B study

**Status:** Explicitly authorized by the user on 2026-11-08.
**Decision:** On `/preview/thn-core/visual-b` only, replace the Fluid Construct hero visual with a responsive neutral portrait placeholder labeled “Portrait / Coming soon.” Keep an optional reusable image source paired with required alternative text for a future supplied portrait. The placeholder must not depict a person or initialize the 3D scene.
**Reason:** The user selected visual B as the preferred visual direction for further preview refinement and asked to compare the layout with a clear portrait slot, without selecting the production CORE page.
**Consequence:** Preserve the shared hero composition, copy, navigation, GSAP entrances, all other sections, visual A, `/preview/thn-core`, and production V1. Keep the portrait plane within the existing artwork/stage layout hooks, add no upload flow, image effects, dependencies, deployment, commit, or push.

## D-019 - Refine visual B as an open editorial hero

**Status:** Explicitly authorized by the user on 2026-11-09.
**Decision:** On `/preview/thn-core/visual-b` only, present the 2D wordmark and existing introduction directly on the warm ivory surface without the graphite identity card. Keep the Silver visual system, compact split mobile composition, cobalt action styling, and the existing 2D wordmark proportions. Use a right-side portrait placeholder with a stable 3:4 portrait ratio and a compact coming-soon label.
**Reason:** The user selected B2 Open Editorial and requested a lighter left introduction plus a clearly portrait-oriented placeholder while preserving the approved visual B direction.
**Consequence:** Limit layout and color changes to the visual B hero and its placeholder. Preserve every word, link, navigation and section, motion behavior, optional source/alt API, visual A, CORE baseline, V1, and the no-Canvas B route. Make no education-status changes, add no effect or dependency, and do not deploy, commit, or push.

## D-020 - Show only the Capstone project in visual B

**Status:** Explicitly authorized by the user on 2026-11-09.
**Decision:** On `/preview/thn-core/visual-b` only, show the existing Capstone Project row in Engineering & Experiments. Keep Kitchen Chicken and Interactive Web Experiment in the shared project data and in all other routes.
**Reason:** The user asked to remove those two rows from the selected visual B study while keeping the Capstone entry.
**Consequence:** Pass a typed optional project-ID selection through the shared page to WorkSection; the default project list and its order remain unchanged. Preserve the Capstone title, status, description, and links. Do not edit project data or alter CORE, visual A, V1, or any other route.

## D-021 - Polish visual B's Capstone presentation

**Status:** Explicitly authorized by the user on 2026-11-09.
**Decision:** On `/preview/thn-core/visual-b` only, present the single Capstone Project row with a restrained editorial hierarchy, fine dividers, clear Coming Soon status, and a quiet responsive layout. Keep the existing title, type, status, and description unchanged; add no media, project link, or invented project detail.
**Reason:** The user requested a clearer Silver Editorial treatment for the approved Capstone-only Engineering section and consistent visual hierarchy across B.
**Consequence:** Scope styling to the Silver visual B hero/sections, with project-row refinements applying only when the list contains one item. Preserve the B2 portrait hero, Capstone-only selection, all other content, focus behavior, motion system, CORE baseline, visual A, and V1. Add no effect or dependency, and do not deploy, commit, or push.

## D-022 - Clamp visual B anchor arrival to reachable scroll positions

**Status:** Explicitly authorized by the user on 2026-11-10.
**Decision:** On `/preview/thn-core/visual-b` only, resolve each anchor destination after the existing deferred animation frame, clamp it to the document's reachable scroll range, and use that same effective scroll Y for ScrollSmoother and arrival verification. Preserve the computed header offset when it is reachable. During an active anchor arrival, resize or ScrollTrigger refresh remeasures the destination and retargets only when the effective scroll Y changes. After refresh, reassert the requested native scroll position only when refresh restoration overwrote it; unchanged geometry and an intact native position do nothing. A changed destination or confirmed refresh restoration during the one-second reveal wait cancels that wait and starts a new arrival check. Keep the four-second failure timeout, starting a fresh bounded timeout only for either confirmed retarget.
**Reason:** At the document end, ScrollSmoother clamps the requested anchor position, but the existing arrival check waits for an exact target top that cannot be reached. A viewport resize can also update the anchor geometry before ScrollTrigger refresh restores the previous native scroll position, leaving the reveal waiting for its failure timeout.
**Consequence:** Keep the existing default anchor behavior on visual A, `/preview/thn-core`, and other routes. Preserve the one-second post-arrival reveal delay, one-second desktop smoothing, native touch scrolling, current content, reduced-motion behavior, and cleanup lifecycle. Add no dependency, visual change, deployment, commit, or push.

## D-023 - Isolate the authorized THN. CORE V2 work

**Status:** Explicitly authorized by the user's CODEX_PLAN.md execution instruction on 2026-11-15.
**Decision:** Execute V2 on /preview/thn-core/v2 using the shared THN. CORE page and existing Fluid Construct. Keep /, /preview/thn-site, /preview/thn-core, and all existing study routes as their current baselines. Give V2 its own motion wrapper; Lenis may run only on V2 and must be its sole smooth-scroll owner. The existing V1 defaults and /preview/thn-core ScrollSmoother behavior remain unchanged.
**Reason:** Continue the portfolio evolution in an isolated preview while preserving the approved Silver Editorial B2 production homepage and current Fluid Construct CORE baseline.
**Consequence:** Keep all existing portfolio facts, sections, project statuses, links, metadata, and route behaviors. Scope V2 motion and styling to V2; any shared changes must preserve existing default behavior. Do not deploy, commit, or push.

## D-024 - Use the approved graduate identity copy on V2

**Status:** Explicitly authorized by the primary agent using the user's current approved portfolio facts on 2026-11-15.
**Decision:** On /preview/thn-core/v2, pass the existing graduate education and experience copy from SilverEditorialPortfolio through CoreFluidHero's identityCopy prop. Keep the older copy on /preview/thn-core and every other route unchanged.
**Reason:** The existing CORE hero text predates the approved graduation update and must not be propagated into the new V2 preview.
**Consequence:** Reuse the existing copy and prop; add no new claim or portfolio detail. Preserve all V2 project rows and links and leave baseline routes untouched.

## D-025 - Refine hero motion and touch rotation on V2 only

**Status:** Explicitly authorized by the user's CODEX_PLAN.md execution instruction on 2026-11-15.
**Decision:** On `/preview/thn-core/v2` only, use a compact refined motion token profile with staggered existing 2D wordmark parts and name words, and a scoped monochrome studio-light field and slightly longer project-title hover/focus travel. Enable touch drag-to-rotate through the existing Fluid controller on V2 while retaining `touch-action: pan-y` so vertical page panning remains available. Keep the existing desktop two-column/mobile Split composition and current scene geometry.
**Reason:** Give the V2 preview a visible but restrained motion and interaction evolution without duplicating the shared page, changing the sculpture, or changing V1 behavior.
**Consequence:** Keep the default profile, ScrollSmoother, touch behavior, layout, content, project data, links, and scene geometry unchanged on `/preview/thn-core` and all existing routes. Add no effect library or external asset; do not deploy, commit, or push.


## D-026 - Preserve B2 authority while cleaning historical repository material

**Status:** Authorized by the owner's verified-cleanup instruction on 2026-11-15.
**Decision:** Preserve `/`, `/preview/thn-core`, `/preview/thn-core/v2`, and the shared B2 mirror `/preview/thn-core/visual-b`. Retire thirteen historical preview routes with their private navigation/implementation, the inactive legacy `src`/root-component closure, verified unused UI/placeholder files, starter SVGs, and backed-up obsolete browser snapshots. Preserve shared motion/3D source and all canonical project data, content and links.
**Current direction:** Production B2 includes the real portrait, confirmed graduate biography, Capstone-only presentation and persisted Light/Dark Ink Reveal. The future V2 combines this approved visual/content baseline with refined Lenis/GSAP motion. The current Fluid V2 remains a technical reference. Arctic White 60%, Graphite Grey 30%, Arcade Orange 10% (`#FF6A13`) is planned, not implemented.
**Consequence:** Do not reinterpret D-001-025 as current production-selection instructions, discard their technical history, replace GLOBAL/skills, migrate the homepage during cleanup, or deploy/commit/push without authorization. Preserve one page-scroll owner and existing fallbacks.

## D-027 - Rebase the isolated V2 preview onto B2

**Status:** Authorized by the owner's Recovery & Rebase instruction on 2026-11-16.
**Decision:** Render the shared SilverEditorialPortfolio on `/preview/thn-core/v2` with opt-in refined motion. Keep the Silver wrapper, real portrait, graduate copy, Capstone-only selection, persisted theme key and Ink Reveal. The wrapper selects the existing Lenis/refined GSAP path; production and Visual B keep their default ScrollSmoother profile. Extend early theme bootstrap to the V2 path without replacing the theme system.
**Consequence:** No page duplication, Fluid hero, palette change, new library or motion-engine rewrite. Preserve `/` and historical CORE behavior. This scoped rebase supersedes D-023-025's Fluid presentation only on V2 and awaits visual approval before further design work. No commit, push or deployment.


## D-028 - Develop V2 as a portrait-led cinematic editorial portfolio

**Status:** Authorized by the owner on 2026-11-16 after reviewing the personal-perspective plan.
**Decision:** On `/preview/thn-core/v2` only, strengthen the shared portrait/identity composition, retain Compact Split on mobile, use separate inner portrait layers for restrained pointer response and scroll depth, and refine section rhythm using existing surfaces. Extend the existing Process progress timeline with an orange active marker. Preserve approved copy, Capstone-only Coming Soon presentation, theme transitions, typography timing, Lenis ownership and fallbacks.
**Consequence:** Keep production B2 and historical CORE unchanged. Do not introduce a WebGL hero, fabricated imagery, claims, project detail content or a new animation library. Review the V2 implementation before any homepage migration or deployment.


## D-029 - Preview the Into the Frame cinematic hero on V2

**Status:** Authorized by the owner on 2026-11-16.
**Decision:** Add an opt-in graphite Hero stage on `/preview/thn-core/v2`, preserving the real portrait, original 2D wordmark, graduate copy and CTAs. Use CSS perspective, a quiet studio-light field and separate portrait/framing motion layers. Extend the existing GSAP scroll ranges for the frame and a reversible page-colored threshold into About; reuse the pointer lifecycle without a new scroll owner or animation loop. Keep Compact Split, reduced-motion and no-JS readability.
**Consequence:** The Hero is graphite in both themes; the threshold follows the surrounding page theme. No WebGL, new asset, library, fabricated professional claim or change to production B2/historical CORE is authorized. This preview awaits visual review; no migration, commit, push or deployment.


## D-030 - Add V2-only floating glass navigation

**Status:** Authorized by the owner on 2026-11-16.
**Decision:** Restyle the existing V2 sticky header as a bounded graphite glass bar over the cinematic Hero. Preserve its DOM, links, theme toggle, keyboard/mobile handlers and single scroll owner. Use a 16px backdrop blur with a solid fallback, a separate mobile dropdown that does not reflow the page, and CSS scroll margins that account for the floating inset.
**Consequence:** Keep production B2 and historical CORE headers unchanged. No new observer, animation engine, dependency, content, commit, push or deployment.


## D-031 - Make V2 cinematic surfaces follow Light/Dark selection

**Status:** Authorized by the owner on 2026-11-16.
**Decision:** Replace fixed graphite colors on the V2 Hero and glass navigation with centralized theme-aware atmosphere/surface tokens. Make Process, Contact and the adjoining footer follow the selected theme; use Process surface tokens for number backgrounds instead of the foreground ink token. Preserve composition, portrait, pointer/scroll motion, reveal timing, anchors and theme persistence.
**Consequence:** This supersedes D-029 and D-030 only where they specified graphite in both themes. The existing Hero is CSS 2.5D, not a WebGL or video scene; further creative changes require review. Keep production B2 and historical CORE unchanged. No commit, push or deployment.


## D-032 - Fix V2 Work band and wheel-interrupted Ink Reveal

**Status:** Authorized by the owner's bug report on 2026-11-16.
**Decision:** Paint the V2 Work section across the viewport while preserving its existing content grid through responsive padding. On V2 only, keep Lenis at the captured scroll position during the one-second root-snapshot theme reveal, collect wheel intent and resume it through the same Lenis owner after completion. Explicit navigation, touch, keyboard and zoom interruption retain an immediate escape; failed/unsupported transitions and teardown release the owner.
**Reason:** The capped Work background exposed differently colored page gutters, and the theme wheel handler explicitly skipped the active reveal. Root snapshots cannot continuously track newly scrolled content, so wheel input is briefly deferred rather than canceling the animation or jumping to a different viewport at completion.
**Consequence:** Preserve production B2's existing theme/scroll behavior, content, projects, reveal timings and historical CORE. No new animation engine, dependency, commit, push or deployment.


## D-033 - Coordinate V2 readability, Hero signature and section rhythm

**Status:** Authorized by the owner's combined items 1-3 implementation approval on 2026-11-16.
**Decision:** Keep V2 supporting copy and Toolkit facts readable from initialization; retain a small independent positional stagger while headings keep their once-only delayed entrances and one-second settled-anchor delay. Shorten the support stagger offset and bring Toolkit/Engineering heading entry forward. Develop Into the Frame using separate aperture-entrance, portrait-pointer and portal-scroll layers: the photograph settles into its frame on entry and recedes as the frame opens toward About. Reduce secondary display sizes and excess section padding without changing copy, order, project data or navigation.
**Consequence:** These readability changes supersede the hidden-support treatment only for V2. Preserve Light/Dark, the wheel-safe Ink Reveal, navbar, Lenis ownership, Process timing, no-JS/reduced-motion content and production/historical defaults. This remains CSS 2.5D; no WebGL, media, new dependency, commit, push or deployment. Await visual review.

## D-034 - Replace V2 snapshot reveal with freely scrollable live theme colors

**Status:** Explicitly selected by the owner on 2026-11-16.
**Decision:** On V2 only, tween existing semantic color properties on the mounted page with GSAP over 0.9 seconds. Replace the snapshot Ink Reveal and remove its wheel deferral/Lenis pause contract. Repeated requests start from the currently displayed colors; reduced motion switches immediately. Preserve storage, icon accessibility, layout and motion ownership.
**Evidence:** Production-browser checks at 1440, 390 and 320px showed scrolling continuing while the color tween remained active, no stopped Lenis state, no View Transition calls and unchanged root identity. Both directions, rapid requests, reload persistence, reduced motion and desktop Expertise navigation passed. Lint, TypeScript and production build passed.
**Consequence:** Supersedes D-032's V2 wheel deferral and D-033's retained V2 Ink Reveal. Production B2 and historical CORE keep their existing defaults. Live color interpolation can briefly reduce foreground/background contrast between the two stable, readable themes; it does not provide an organic ink boundary. No dependencies, commit, push or deployment.

## D-035 - Study V2 Identity in Space with a constructed portrait aperture

**Status:** Implementation authorized by the owner on 2026-11-16; visual approval pending.
**Decision:** Replace the thin portrait backing frame on V2 with an architectural aperture: ceiling, side wall, floor, two structural gates and a restrained orange seam. Keep the real photograph and original wordmark as the identity. Reuse the existing GSAP portrait scroll timeline for different near/far gate depth, and the existing frame pointer owner. Use compact framing on mobile and a complete static composition without JavaScript or under reduced motion.
**Evidence:** Lint, TypeScript and production build passed. Primary-agent production-browser review at 1440, 390 and 320px in Light/Dark found readable content, no overflow, page errors or failed requests; pointer response remained active.
**Consequence:** This is a CSS 3D composition study, not WebGL rendering or a claim of SceneAI-equivalent cinematic quality. Preserve V2 live theme colors, Lenis, typography, content and production/historical routes. No dependency, commit, push or deployment. Await the owner's visual review.
## D-036 - Prototype Engineered Flow as the V2 WebGL Hero

**Status:** Implementation authorized by the owner on 2026-11-16; awaiting visual approval.
**Decision:** Replace V2's portrait/architectural-frame Hero with a full-width original Three.js/R3F stage: three broad silver/graphite ribbons and one orange seam, subtle pointer damping and an opening movement driven by the existing scene progress ref. Preserve the 2D wordmark, exact identity copy, CTA, Lenis, live theme colors and section content. Keep the portrait asset and production composition intact.
**Implementation:** Lazy canvas, procedural studio environment, desktop DPR 0.85/compact DPR 0.8, smaller mobile geometry, offscreen/hidden pause, disposed resources and static SVG for no-JS, reduced motion or WebGL failure. No new package, shader, postprocessing or scroll owner. This supersedes D-035's V2 CSS architectural composition, not production B2.
**Verification:** Production-build Edge checks at 1440/390/320px in both themes passed without overflow, page errors or failed resources. About/Contact anchors, mobile navigation, reverse scrolling and theme changes while scrolling passed. Theme changes retained the same Canvas/root. Injected context loss returned to fallback; offscreen sampling recorded zero draw calls over 700ms. Lint, TypeScript and build passed.
**Limitations:** One bounded headless run recorded initialization long tasks of 430ms and 79ms; raw frame timings are not real-device FPS. Scene quality and real-device performance still require owner review. No commit, push or deployment.

## D-037 - Connect V2 through a persistent Engineered Flow story

**Status:** Continued design and implementation authorized by the owner; prototype verified on 2026-11-17 and awaiting visual approval.
**Decision:** Extend the Hero study into a full-page spatial narrative: Identity, Perspective/About, Structure/Expertise and Toolkit, Assembly/Process, quiet Evidence/Engineering, and Resolution/Contact. Use one fixed Canvas outside the scrolling content and reserve different editorial reading zones per section. Preserve exact copy, Capstone Coming Soon/01 entry, verified links, original wordmark and all production defaults.
**Architecture:** Existing Lenis/GSAP snapshots drive cached section anchors mapped to scene progress 0–5, including an explicit Toolkit anchor at 2.55. The existing progress ref carries an optional invalidation callback. R3F demand rendering continues only while input or damping changes the scene; no additional scroll owner, persistent render loop, pinning or new dependency. Keep reduced-motion/no-JS/WebGL-failure fallbacks.
**Verification:** Production-browser checks at 1440/768/390/320px passed without overflow, normal console/page errors or failed resources. Main-content text matched the preceding V2. One Canvas retained a viewport-fixed rect across all chapters. Settled sampling recorded zero WebGL draws over 700ms in Hero/About/Process/Work/Contact; repeated reduced-motion changes restored one Canvas and five route trigger markers. Theme switching while scrolling retained Canvas/root identity; anchors, browser Back, injected context loss and simulated native touch scrolling passed. Final narrow Contact email occupied one 24px line. Lint, TypeScript and production build passed.
**Consequence:** Supersedes D-036's Hero-only scene boundary. Production B2, its mirror and historical CORE remain unchanged; portrait assets and project data are preserved. Mobile uses restrained scene visibility and full reading surfaces. Lab checks do not establish real-device GPU performance or final creative approval. No commit, push or deployment.

