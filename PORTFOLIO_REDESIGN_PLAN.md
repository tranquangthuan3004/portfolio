# Portfolio Redesign Plan

> Archived PhoenixZ redesign record, not current homepage or execution instructions. The approved production is now Silver Editorial B2 at `/`; obsolete legacy source and early preview routes have been retired after backup. Historical file paths and approval boundaries below record completed work. Consult `docs/THN-CORE-DESIGN-BRIEF.md` for current direction; retain GLOBAL/AGENTS workflow.

**Status:** Phases 0–3 are complete. The Header-Hero-Work checkpoint was approved, the requested hero eyebrow was removed, and the full page was browser-verified on desktop and mobile.

## Goal and approved direction

Redesign the existing personal portfolio with the clarity and project focus of an agency-style portfolio, while keeping PhoenixZ and the owner's real work central. Use a white base, black typography, gray secondary text and dividers, large type, generous whitespace, and original-color project imagery. Remove the violet/cyan glow treatment, orb, and glass styling. Do not turn the site into a fictional agency/business.

## Current project evidence

- The active home route is composed in `app/page.tsx`: Hero, Work, Services, Stack, Process, About, Contact. The live app is under root `app/`; a duplicate `src/app/` exists and is out of scope for cleanup.
- `data/projects.ts` marks Kitchen Chicken archived, and Capstone Project and Interactive Web Experiment Coming Soon. Keep project facts, statuses, and existing preview/GitHub links accurate.
- Services and technology facts are separate in `data/services.ts` and `data/stack.ts`. Preserve the existing About, Process, and Contact content and valid links.
- `package.json` declares Next 16.2.9, React 19.2.4, Tailwind CSS 4, and scripts `lint`, `build`, `dev`, and `start`. No test script or test configuration appeared in the project file scan; the README is the default create-next-app guide.
- The asset scan found only starter SVGs under `public/`, and the Kitchen Chicken preview returned a network error during browser inspection. Phase 1 therefore uses text-led project rows without preview imagery or placeholders; original project captures can be added if supplied later. Do not copy assets from reference templates.
- The worktree was already dirty at baseline. Existing app/package changes and untracked context, components, data, lib, and src files were preserved.

## Reference evidence

These inspected pages inform layout and interaction only, not palette:

- [Unikon Digital Agency](https://unikon-next.vercel.app/digital-agency): oversized type, whitespace, large work previews, desktop side panel, and mobile menu.
- [Unikon Showcase](https://unikon-next.vercel.app/showcase): hovering a project changes the highlighted title and full background image.
- [Agenshark Creative](https://agenshark-next.vercel.app/creative-agency): numbered service rows expand project galleries.
- Agincy could not be visually inspected because the ThemeForest preview returned HTTP 403. No general timed or scroll-triggered behavior is assumed from the references; only the listed hover/menu/accordion states were observed.

## Scope and boundaries

Restyle the existing portfolio and responsive interactions. Preserve the personal identity, all factual project/service/stack/about content, and valid project, social, and contact destinations. Do not invent clients, team members, metrics, testimonials, projects, CV details, or contact capabilities. No backend/contact form, new dependencies, copied template imagery, deletion of `src/app/`, commit, or publish is included.

Services and Stack remain separate to preserve their existing labels and content. Phase 1 uses contained, text-led project rows because no original project imagery is available. No project-preview swapping behavior is included. Any future hover affordance needs keyboard-focus and touch equivalents.

## Acceptance criteria

- The result reads as a personal portfolio with the existing identity and real work; it does not imply a team, agency, or fictional social proof.
- White/black/neutral-gray styling is consistent. Violet/cyan glows, the orb, and glass styling are removed; project imagery keeps its original colors.
- Hero leads to Work. Kitchen Chicken remains labeled archived with its existing links; both upcoming items remain marked Coming Soon.
- Header anchors reach the correct sections without being hidden under the fixed header. Existing valid links still work.
- At 1440px desktop and 390px mobile widths, navigation and content are usable with no horizontal overflow. Project selection, where implemented, works with pointer, keyboard, and touch.
- Controls have visible keyboard focus and useful labels. Reduced-motion preferences suppress nonessential transitions and reveals.
- No reference-template or fabricated imagery, client logos, metrics, testimonials, or team photos are added.

## Ordered implementation and verification

### Phase 0 - Baseline

- [x] Re-check `git status`; identify and preserve pre-existing edits.
- [x] Confirm active root-app entry points, section anchors, project/service/stack facts, valid links, available original images, and current desktop/mobile rendering.
- [x] Confirm scripts and test setup. Before changing code, read relevant guides in `node_modules/next/dist/docs/` as required by `AGENTS.md`.
- [x] Review project assets. No original preview image is needed for the text-led Phase 1 layout; no template imagery was copied.

### Phase 1 - Header, Hero, Work (visual review checkpoint)

- [x] Restyle `components/site-header.tsx`, `components/hero-section.tsx`, `components/work-section.tsx`, and `components/project-card.tsx`; adjust `app/globals.css`, `app/layout.tsx`, and `app/page.tsx` only as needed.
- [x] Keep real project facts, statuses, and links visible. Use text-led entries because original preview imagery is unavailable; no selected-project preview behavior was added.
- [x] Capture and verify this slice at desktop and mobile. The user approved the Header-Hero-Work checkpoint before Phase 2 continued.

### Phase 2 - Remaining sections

- [x] Apply the approved visual system to Services, Stack, Process, About, and Contact; retain the existing content and destinations.
- [x] Keep Services and Stack separate so their original content remains easy to scan. No grouping decision is left open.

### Phase 3 - Responsive polish and checks

- [x] Verify the mobile menu opens, focuses its first item, closes with Escape and restores focus, and closes after anchor selection. Touch-sized menu controls remain usable.
- [x] Verify header links reach their sections without being hidden by the fixed header; reduced-motion mode disables smooth scrolling and nonessential transitions. Motion uses existing CSS only; no reveal dependency was added.
- [x] Check 1440, 1024, 768, and 390px widths for horizontal overflow; confirm Process dividers switch from a two-column pattern to three dividers at desktop.
- [x] Run `npm run lint` and `npm run build`. Lint completed with zero errors and one existing warning in the ignored duplicate `src/components/process-section.tsx`; no test command is declared.
- [x] Review fresh desktop, tablet, and mobile captures. Playwright returned HTTP 200 with no console or page errors. The full contact email and all existing links remain visible and accurate.

## Likely files

`app/page.tsx`, `app/globals.css`, `components/site-header.tsx`, `components/hero-section.tsx`, `components/work-section.tsx`, `components/project-card.tsx`, `components/services-section.tsx`, `components/stack-section.tsx`, `components/process-section.tsx`, `components/about-section.tsx`, `components/contact-section.tsx`, and existing `data/projects.ts`, `data/services.ts`, `data/stack.ts` only if the approved content mapping requires it.

## Current deliverable

- [x] Create this plan.
- [x] Implement Phase 1 through the Header-Hero-Work visual checkpoint.
- [x] Complete Phases 2 and 3 after the approved visual review.
