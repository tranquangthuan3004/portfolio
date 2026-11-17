# THN. CORE V2 - Current Development Direction

## Current authority

- Approved production: **Silver Editorial B2** at `/`, sharing composition with `/preview/thn-core/visual-b`.
- Current isolated V2: B2 design/content with the existing refined **Lenis + GSAP** motion, implemented under the Recovery & Rebase authorization and awaiting visual approval.
- `/preview/thn-core/v2` reuses B2's portrait and Capstone-only composition. Keep `/preview/thn-core` as the historical Fluid baseline; do not restore Fluid to V2.
- Planned palette only: **Arctic White 60%, Graphite Grey 30%, Arcade Orange 10% (`#FF6A13`)**. Current colors are unchanged.

## Preservation and implementation boundaries

Read `GLOBAL_WORKING_CONTEXT.md`, `AGENTS.md`, the current design brief and applicable skills. Keep the user's existing global workflow; do not introduce another documentation framework.

Preserve the 2D `Thn.` identity, open editorial desktop/mobile layouts, real graduation portrait, verified graduate copy, production Capstone Project - Coming Soon (01 entry), canonical project data, links, Light/Dark persistence and organic Ink Reveal. Do not copy the technical V2's Fluid hero or three-project presentation over B2.

Keep one scrolling engine per route. B2 currently uses ScrollSmoother; technical V2 uses Lenis. Reuse the existing opt-in motion profile and shared page rather than duplicating the portfolio. Preserve anchor arrival/delay, independent typography, Process choreography, keyboard/focus, native touch, reduced-motion/no-JS and scene failure fallbacks. No broad architecture change or dependency upgrade is implied.

## Completed reference work

The original phases 0-5 established the repository baseline, isolated Lenis integration, refined Hero/section motion, touch interaction and responsive/accessibility/performance evidence. `V2_PROGRESS.md` records the actual results and limitations. That completed Fluid-first plan is not an instruction to restart those phases or select Fluid for production.

Historical preview routes and inactive duplicate source were retired during verified repository cleanup. Their original design decisions remain in `docs/THN-CORE-DECISIONS.md`; do not restore deleted routes automatically.

## Next work

Stop after verifying the authorized B2-plus-motion rebase and wait for visual approval before further redesign or colors. Validate production and retained previews after changes, including 320/390/1440px, anchors/history, theme/Ink Reveal, keyboard, reduced motion, project/content parity, lint, TypeScript and build. Record progress in the existing `V2_PROGRESS.md` when requested; create no replacement context system.

No homepage redesign, palette implementation, commit, push or deployment is authorized by this document alone.
