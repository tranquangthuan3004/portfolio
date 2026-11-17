# Thn. Portfolio

Personal Software Engineer portfolio of Tran Quang Thuan. Built with Next.js 16.2.9 (root App Router), React 19.2.4 and Tailwind CSS 4.

## Current routes

| Route | Purpose |
| --- | --- |
| `/` | Approved Silver Editorial B2 production composition, real portrait, graduate bio, Capstone-only presentation, Light/Dark and Ink Reveal. |
| `/preview/thn-core/visual-b` | Noindex mirror of the shared approved B2 composition. |
| `/preview/thn-core` | Noindex CORE Fluid/ScrollSmoother baseline. |
| `/preview/thn-core/v2` | Noindex B2 composition with refined Lenis/GSAP motion, awaiting visual approval. |

V2 reuses B2 visual/content with refined motion; production remains unchanged. Arctic White 60%, Graphite Grey 30%, Arcade Orange 10% (`#FF6A13`) is a planned palette, not implemented.

## Development and verification

```sh
npm ci
npm run dev
```

The development server defaults to `http://localhost:3000`. Production rehearsal:

```sh
npm run build
npm run start -- -p 3001
```

Run `npm run lint`, `npx tsc --noEmit` and `npm run build`. No test script is currently configured. After route deletion, build/type generation must refresh `.next` route types before checking TypeScript against them. Browser checks should cover B2 and retained previews, mobile 320/390px, desktop, anchors/history, project links, theme transitions, keyboard, reduced motion and V2 interaction. Functional headless checks are not real-user performance metrics.

## Source ownership

`app/page.tsx` renders `components/thn-portfolio/silver-editorial-portfolio.tsx`. Shared page/sections, visual wrappers, theme and motion live under `components/thn-portfolio/`; canonical content lives in `data/`, metadata in `lib/site-config.ts`, and the real portrait in `public/SE182998_1.jpg`. Old filenames such as `portrait-placeholder.tsx` and `visual-study-page.tsx` still support production.

GSAP/ScrollTrigger orchestrate motion. Current B2 and CORE baseline use ScrollSmoother; technical V2 opts into Lenis with no competing smoother. Three.js/R3F are retained for CORE references; B2's portrait branch does not mount Canvas. Historical preview/legacy source cleanup does not authorize changing project facts or deleting canonical data.

## Project instructions

Follow `GLOBAL_WORKING_CONTEXT.md`, `AGENTS.md`, existing `.agents/skills/`, and the current section of `docs/THN-CORE-DESIGN-BRIEF.md`. `docs/THN-CORE-DECISIONS.md` preserves scoped technical decisions; `V2_PROGRESS.md` records completed technical work. `PORTFOLIO_REDESIGN_PLAN.md` and `docs/THN-CORE-PHASE-4A.md` are historical records, not current production instructions. Keep the existing global-agent workflow.

The linked Vercel project/configuration is preserved. Do not commit, push or deploy without explicit authorization. Snapshot untracked source and Git metadata before destructive cleanup; the initial commit does not contain the approved site.
