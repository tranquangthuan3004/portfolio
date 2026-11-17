# THN. CORE Design Brief

**Current authority - updated 2026-11-17**

- **Production:** Silver Editorial B2 at `/`, shared with `/preview/thn-core/visual-b`. Preserve the open editorial composition, original 2D `Thn.` wordmark, real graduation portrait, approved graduate bio, Capstone Project - Coming Soon (01 entry), verified links, theme persistence and Ink Reveal.
- **Current V2 preview:** `/preview/thn-core/v2` is the authorized Engineered Flow full-page composition study, awaiting visual approval. A single persistent WebGL scene connects Identity, About, Expertise/Toolkit, Process, Engineering and Contact. Preserve the original 2D wordmark, verified graduate copy, Capstone-only selection and links. The portrait remains in production and in the asset library, but is not the V2 Hero. See D-034 through D-037 for scoped decisions.
- `/preview/thn-core` remains the historical Fluid/ScrollSmoother baseline. Fluid is not the V2 hero; shared scene source and canonical project records remain preserved.
- **V2 palette implemented:** Arctic White 60%, Graphite Grey 30%, Arcade Orange 10% (`#FF6A13`), as a hierarchy guideline. V2 uses live semantic-color transitions with free scrolling; production B2 retains its existing palette and Ink Reveal.
- Keep one scroll owner per page: production B2/baseline use ScrollSmoother; the B2 V2 preview uses Lenis. Preserve delayed independent typography, native touch, anchors/history, reduced motion and cleanup.
- Preserve `GLOBAL_WORKING_CONTEXT.md`, `.agents/skills/`, and applicable agent rules. This brief specifies project direction, not a replacement global workflow.
- Historical preview routes have been retired during approved cleanup. Do not recreate them from the archived requirements below. Retained preview routes are `/preview/thn-core`, `/preview/thn-core/v2`, and `/preview/thn-core/visual-b`; all remain noindex.
- No deployment, commit or push is authorized by this document.

## Historical Phase 2.5-4A specification (archive, not current instructions)

The following records the original sculpture study and its later scoped approvals. References to unselected production concepts, native-only scrolling, old routes, or phase stop boundaries describe their historical time, not the current production state. Preserve their meaning when consulting past evidence; the current authority above takes precedence for new work.

## Objective

Develop two original abstract metallic sculpture studies for the THN. portfolio. The work should bring carefully art-directed motion and material presence to the existing portfolio while preserving its content, layout, functionality, accessibility, and black-and-white identity. HELIOS is an interaction-quality reference only. Do not copy its geometry, radial silhouette, shaders, assets, or layout.

Reference: [HELIOS experience](https://demo.somanathkhadanga.com/helios), for motion quality only.

The sculpture must remain abstract from multiple viewing angles. It must not read as lettering, an owner monogram, a logo, or another brand mark. The existing 2D `Thn.` wordmark remains the sole brand signature and retains visual priority.

## Non-negotiable preservation

- Keep the V1 homepage, `/preview/thn-site`, portfolio copy, project records and statuses, navigation, contact destinations, metadata, and links unchanged.
- Keep the existing 2D wordmark and typography unchanged.
- Keep the existing shared visual and interaction behavior; experimental scene choices stay behind the Core preview routes.
- Do not create 3D text spelling `THN`, `Thn.`, or the owner’s name; do not create letter-shaped meshes, monograms, logos, or competing brand marks.
- Do not copy HELIOS’s 72-blade arrangement, radial silhouette, or shader treatment.
- Do not add deployment, commit, or push actions. Do not start Phase 3 without explicit approval.

## Concept A — Orbital Architecture

An asymmetrical, open arrangement of intersecting partial metallic arcs, separated structural fragments, and one restrained central focal element. Use varied arc radii, different planes, broken segments, and unequal spacing so the sculpture reads as a constructed system rather than a radial cage or letterform. Favor precision, negative space, and engineered balance. Do not center repeated spokes around the focal element.

## Concept B — Fluid Construct

An original assembly of broad polished ribbons, curved surfaces, and interlocking structural elements. Create flowing changes in direction and depth around open negative space. Its silhouette and construction should differ clearly from the partial-arc architecture of Concept A; it must not be a thinner or merely recolored variation of the same tubes. Keep the surfaces restrained and technically lightweight. Avoid copied radial blades, generic spinning spheres, and stock-style decorative objects.

Both concepts should remain visually compelling when stationary. Chrome, silver, or graphite surfaces may use restrained studio-style reflections and lighting. The original wordmark must remain more prominent than the sculpture in the hero composition.

## Preview route behavior

- In Phase 2.5, `/preview/thn-core` was the neutral concept-comparison entry. Phase 3A turns it into a Fluid Construct hero candidate; this is not a production selection. The former neutral comparison UI remains at `/preview/thn-core-studies`.
- `/preview/thn-core-studies` is a neutral concept-comparison entry with links to both concepts and no default sculpture.
- `/preview/thn-core-orbital` continues to show Concept A in its existing comparison layout.
- `/preview/thn-core-fluid` continues to show Concept B in its existing comparison layout. Their existing Compare links lead to `/preview/thn-core-studies`.
- The two concept routes are independently reviewable, share the same portfolio content and scene safety behavior, and remain non-indexable previews.
- These route labels describe studies; they do not imply a final choice or a production selection.

## Motion and interaction

After each static composition is reviewed, add only subtle idle movement and damped pointer response where it improves the object. Preserve native page scrolling and touch behavior. Do not add chapter-based GSAP choreography, postprocessing, a new animation library, persistent loops unrelated to the object, or interaction that hides essential content. Reduced motion must show a complete static sculpture. Pointer response must have a keyboard/touch-safe static equivalent.

## Technical architecture and fallbacks

Reuse the Phase 2 React Three Fiber/Three.js architecture and pinned dependencies. Keep the Canvas lazy and route-scoped; V1 and `/preview/thn-site` must not request Three.js/R3F scene chunks. Use a static, concept-specific SVG fallback for server rendering, reduced motion, narrow viewports, delayed or failed chunk loading, unavailable WebGL, context loss, and scene errors. Preserve offscreen pause/resume and explicit disposal of geometries, materials, and PMREM resources. Keep the desktop/mobile quality tier and reduced-motion listeners scoped and cleaned up. Do not introduce external HDRs or image assets.

## Phase 2 performance baseline

Recorded on 2026-10-30 using headless Microsoft Edge with ANGLE SwiftShader; these are software-renderer measurements, not real-device GPU benchmarks:

- About 8 WebGL draw calls per rendered frame.
- About 2,188 triangles per desktop frame and 1,132 per compact/mobile frame.
- Approximately 180 requestAnimationFrame callbacks per second during the bounded headless sample.
- The normal-motion Core route transferred 444,846 encoded JavaScript bytes; the route-only Canvas chunk accounted for 244,565 encoded bytes (923,998 raw). Reduced-motion Core transferred 154,613 encoded JavaScript bytes without the Canvas chunk.
- Root and `/preview/thn-site` each transferred 197,049 encoded JavaScript bytes in the Phase 2 build and requested no Three.js/R3F chunks.

Use `E:\Portfolio-QA\Thn\THN-CORE\Phase-2\reports\PHASE-2-TECHNICAL-REPORT.md` and its JSON evidence for measurement details. Compare the two new concepts against the same Phase 2 baseline and viewport conditions. Report bundle bytes, draw calls, triangles, and renderer environment separately. Never present SwiftShader FPS as device performance.

## Review and acceptance

1. Review each concept in a static capture before considering motion.
2. Capture both concepts at matching 1440px, 390px, and 320px viewports, with consistent camera, lighting, and resting state. Check the sculpture and its fallback at 320px, narrow mobile, desktop, and reduced motion.
3. Verify the wordmark, role, identity, CTA, navigation, and section content remain readable and unobstructed. Verify no overflow or collisions during pointer movement and viewport changes.
4. Run lint, TypeScript, production build, and focused browser checks for the two routes, V1 routes, fallbacks, reduced motion, WebGL failure, pointer response, and offscreen cleanup.
5. Compare network requests to the Phase 2 baseline. Only the selected Core concept route may request its scene chunk; the neutral comparison entry, homepage, and `/preview/thn-site` must not load Three.js/R3F scene chunks.
6. Record implementation files, evidence, known warnings, bundle/performance changes, and limitations. Do not state that a concept is selected, production-ready, or phase-complete if an acceptance item failed.

## Phase boundary

Phase 2.5 delivers two comparison-ready abstract studies and a neutral entry, plus evidence. It does not select a winner, redesign or deploy the homepage, change project content, or implement Phase 3. A later phase must begin by reading this brief and the decision log, and requires its own explicit authorization.

## Phase 3A authorization - Hero Recomposition

**Status:** Explicitly authorized by the user on 2026-10-31. This scoped addendum supersedes the Phase 2.5 `/preview/thn-core` entry composition only.

- `/preview/thn-core` presents the Fluid Construct as an exploratory hero candidate, not a final production choice. Keep `/preview/thn-core-studies` as the neutral comparison entry. Keep `/preview/thn-core-orbital` and `/preview/thn-core-fluid` and their existing layouts unchanged; their existing Compare links may point to the studies entry.
- On desktop, compose the existing `Thn.` wordmark, Software Engineer role, name, education, intro, and existing CTAs in a left column, with a large Fluid sculpture on the right. Add a quiet link back to the neutral studies entry. On mobile, show the identity content first and a large sculpture below it.
- Preserve all existing copy, links, project data and status, navigation, metadata, V1 routes, typography, and 2D wordmark. The 2D wordmark remains the sole brand signature; the sculpture stays abstract. Keep the wordmark glyphs and font roles unchanged; its size and wrapping may adapt to this route-specific composition.
- Keep the existing scene safety, lazy loading, SVG fallback, responsive quality tiers, reduced-motion behavior, offscreen pause, and explicit resource cleanup. At 320px and in reduced motion or failure states, use a large readable static SVG fallback.
- If necessary, disable only the existing Hero-to-About wordmark flight on `/preview/thn-core`; preserve the wordmark's CSS entrance and all other motion and page interactions.
- Use a subtle monochrome CSS light field or shadow for atmosphere. Add no dependency, external asset, new section, or competing large text column.
- This authorization does not approve a production selection, homepage migration, deployment, commit, push, or further Core phase.

## Phase 3B authorization - Mobile composition comparison

**Status:** Authorized by the user on 2026-10-31. This addendum covers two mobile layout studies only; it does not select a mobile direction.

- Keep `/preview/thn-core` and its Phase 3A composition unchanged. Add two isolated, non-indexable comparison routes: `/preview/thn-core-mobile-split` and `/preview/thn-core-mobile-layered`. Neither variant is the default or a production selection.
- Preserve the Phase 3A desktop composition and rendering at 1440px in both routes. The variant rules apply only at mobile/tablet widths up to 820px. Preserve the two-dimensional wordmark, its typefaces and glyph proportions, all copy (including education), CTA targets, page content, metadata behavior, and existing scene geometry and safety architecture.
- **Split:** place the wordmark on the left and the existing large Fluid sculpture on the right within one shared visual region; place identity copy and actions after that region. The wordmark and sculpture must read clearly at 320px, 390px, and 430px.
- **Layered:** place the wordmark toward the top of one shared atmospheric region, with the large Fluid sculpture below or offset within that region without overlap; place the same identity copy and actions after it.
- Share one responsive hero implementation and one sculpture instance per route. Do not render duplicate mobile/desktop canvases, create 3D text or another brand mark, add dependencies, or change scrolling, projects, or later sections.
- Keep reduced-motion, static SVG, WebGL-failure, context-loss, and offscreen safeguards. Compare both studies at 320px, 360px, 390px, 430px, 768px, and 1440px. Capture desktop pixel comparisons against Phase 3A and report renderer cost honestly.
- Preserve the studies routes and stop after this comparison. Do not choose a mobile layout, change the base route, deploy, commit, or push.

## Phase 4A authorization - Preview-only scroll storytelling

**Status:** Explicitly authorized by the user on 2026-11-01. This addendum authorizes chapter motion only on `/preview/thn-core`; it does not select a production concept or authorize a production migration.

- Keep the Phase 3A desktop composition, Phase 3B Split A mobile composition, Fluid Construct sculpture, 2D `Thn.` wordmark, existing content, project data, navigation, links, metadata, and all V1 routes unchanged.
- Use native page scrolling and one root GSAP ScrollTrigger snapshot as the progress source. The hero-to-About scene may unfold while visible and exits with the hero. Use R3F refs for interpolation and keep scroll pose separate from user drag rotation.
- Continue the motion through existing Expertise and Engineering elements, process structure, and a restrained Contact close. Keep later chapters DOM-only. Do not add pinning, a persistent sculpture, new sections, altered copy, or hidden project content.
- Preserve reduced motion, SVG fallback, delayed or failed scene loading, WebGL context-loss recovery, offscreen pause/resume, resource cleanup, touch scrolling, keyboard controls, and Reset.
- Stop after Phase 4A review. Do not change production V1, deploy, commit, push, or begin another phase without a new authorization.

See `THN-CORE-PHASE-4A.md` for the implemented progress ranges and evidence notes.
