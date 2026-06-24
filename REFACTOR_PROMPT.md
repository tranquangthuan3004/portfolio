# Hero Section Cinematic Refactor — Opus Prompt

## Context

You are refactoring the hero section of a Next.js portfolio site (`src/components/hero-section.tsx` and related files) to match a cinematic reference video. The current implementation has the right content but the wrong visual architecture. Do not change any content text — only restructure layout, visual design, animation, and component composition.

Tech stack: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion. All animated components must have `"use client"`. No hardcoded content in presentational components.

---

## Target Visual Architecture (from reference video)

### 1. Overall Layout
- **Full-screen hero** (`min-h-screen`, `overflow-hidden`) with a cinematic video or dark background filling 100vw × 100vh.
- **Dark overlay** on top of background: `bg-gradient-to-t from-black/70 via-black/30 to-transparent` — heavier at bottom, lighter at top.
- **Three layers of z-index**: background (z-0) → overlay (z-10) → content (z-20).
- Hero content is **bottom-aligned**, not centered. Use `justify-end pb-16 md:pb-24` on the flex container, NOT `justify-center`.

### 2. Floating Pill Navbar
- Replace the current top navbar with a **floating pill** centered at the top of the viewport.
- Shape: `rounded-full`, `border border-white/10`, `backdrop-blur-md`, `bg-white/5`.
- Position: `fixed top-5 left-1/2 -translate-x-1/2 z-50` — floats above everything.
- Content: Logo left · Nav links center · CTA button right, all in one `flex items-center gap-6 px-5 py-2.5`.
- CTA button: `rounded-full bg-white text-black text-sm font-medium px-4 py-1.5` — compact pill shape.
- On scroll: add `shadow-lg shadow-black/20` transition for depth. No layout shift.
- Mobile: hamburger appears, pill collapses to logo + hamburger only.

### 3. Hero Content — Bottom-Left Aligned
All hero text and controls sit at the **bottom-left** of the viewport (not centered):
- Container: `flex flex-col items-start gap-4 max-w-3xl`.

**a. Eyebrow label** (appears first):
```
Frontend Developer / FPT Software Engineering Student
```
- Style: `text-xs tracking-widest uppercase text-white/50 font-normal`
- Animate: `fadeIn` at delay 0.2s

**b. Main headline** (the centerpiece):
```
Building polished
frontend experiences
for modern web products.
```
- Font size: `text-[56px] md:text-[72px] lg:text-[80px]` — massive, bold (`font-bold`), tight leading (`leading-[1.05]`), white.
- Each **word** animates individually: staggered `fadeSlideUp` (translateY 24px → 0, opacity 0 → 1), starting at delay 0.4s, 0.07s per word.
- The word "polished", "frontend", "modern" should have a subtle accent — either italic or a very slight color tint (`text-white/90`) to add rhythm. Do NOT use color gradients on the headline.

**c. Sub-copy** (below headline):
```
I design and build responsive landing pages, portfolio websites,
and interactive web interfaces — focused on clean structure,
smooth motion, and practical product thinking.
```
- Style: `text-[15px] text-white/60 font-light max-w-lg leading-relaxed`
- Animate: word-by-word stagger, delay starts at 1.4s

**d. CTA row** (two buttons):
```
[View Work]  [Contact Me →]
```
- Primary: `bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium`
- Secondary: `text-white/70 hover:text-white text-sm underline-offset-4 hover:underline`
- Animate: `fadeIn` at delay 2.4s

**e. Badge row** (tag pills, below CTAs):
```
[Internship ready] [React / Next.js] [UI Motion] [AI-assisted workflow]
```
- Style: `rounded-full border border-white/10 bg-white/5 text-white/50 text-xs px-3 py-1`
- Animate: stagger in at delay 2.7s, each 0.08s apart

### 4. Browser Mockup (Right side, Desktop only)
- On `md:` and above: render a **floating browser mockup** anchored to the **right side** of the hero, vertically centered or slightly below center.
- It slides in from the right: `x: 80 → 0, opacity: 0 → 1` at delay 1.0s, duration 0.9s, `ease: [0.22, 1, 0.36, 1]`.
- Shape: `rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40`
- Browser chrome bar at top: 3 colored dots (red/yellow/green) + fake URL bar `rounded-full bg-white/10 flex-1 h-4`
- Inside: show a simplified representation of the hero UI (dark bg, logo, text lines as placeholder bars) — this is purely decorative.
- Width: `w-[420px]` max, slight `rotate-1` tilt for depth.
- On mobile: **hide entirely** (`hidden md:block`).

### 5. Animation Orchestration (Page Load Sequence)
Implement a strict load sequence using Framer Motion's `useAnimate` or staggered `variants`:

```
t=0.0s  → Background fades in (video or dark bg)
t=0.2s  → Navbar pill slides down from top (y: -20 → 0)
t=0.3s  → Eyebrow label fades in
t=0.4s  → Headline words begin staggering in (word by word)
t=1.4s  → Sub-copy words begin staggering in
t=1.0s  → Browser mockup slides in from right (parallel with headline)
t=2.4s  → CTA buttons fade in
t=2.7s  → Badge pills stagger in
```

All animations: `ease: [0.22, 1, 0.36, 1]` (custom spring feel), duration 0.55s per word, 0.07s stagger between words.

### 6. Mouse Glow Effect
Add a radial glow that follows the mouse cursor within the hero section:
- Implementation: `useMotionValue` for x/y, `useSpring` with `stiffness: 80, damping: 20` for smooth lag.
- Render: `position: absolute` div with `background: radial-gradient(400px circle at {x}px {y}px, rgba(255,255,255,0.03), transparent 70%)` — extremely subtle, white.
- Visible only on desktop (`pointer-events-none`).

### 7. Responsive Breakpoints
- **375px (mobile)**: Single column, no mockup, pill nav collapses, headline at `text-[40px]`, bottom-aligned content with `pb-12`.
- **768px (tablet)**: Same as mobile layout but `text-[56px]`, more padding.
- **1024px (laptop)**: Two-column layout appears — content left, mockup right.
- **1440px (desktop)**: Full layout, headline `text-[72px]`.
- **1920px (ultrawide)**: `max-w-screen-2xl mx-auto` container to prevent over-stretching.

### 8. Performance & Polish
- `prefers-reduced-motion`: wrap all Framer Motion animations in `useReducedMotion()` check — if true, skip all delays and set initial = animate state.
- No layout shift: set explicit dimensions on mockup container before content loads.
- Video background (when added later): `autoPlay muted loop playsInline object-cover`, fade in via `onCanPlay`.
- 60fps target: avoid animating `width`/`height`, use only `transform` and `opacity`.

---

## File Plan

| File | Action | Purpose |
|---|---|---|
| `src/components/hero-section.tsx` | REWRITE | Client orchestrator — assembles all sub-components |
| `src/components/hero/hero-content.tsx` | CREATE | Eyebrow + headline + sub-copy + CTAs + badges |
| `src/components/hero/hero-mockup.tsx` | CREATE | Browser mockup component |
| `src/components/hero/background-effects.tsx` | CREATE | Mouse glow + future video slot |
| `src/components/site-header.tsx` | MODIFY | Convert to floating pill navbar |
| `src/app/globals.css` | MODIFY | Add `fadeSlideUp`, `fadeIn` keyframes + animation utilities |

---

## What NOT to Change
- All content text (copy, project names, section titles, about text, contact info)
- Section structure below the hero (`#work`, `#build`, `#workflow`, `#about`, `#contact`)
- Color palette and brand identity
- TypeScript types and prop interfaces
- Any existing shadcn/ui component configurations

---

## Acceptance Criteria
1. Page load triggers the full animation sequence in correct order
2. Navbar is a floating pill, not a full-width bar
3. Hero content is bottom-aligned (bottom-left on desktop)
4. Browser mockup slides in from right on desktop, hidden on mobile
5. Mouse glow follows cursor smoothly
6. Zero layout shifts at any breakpoint
7. `prefers-reduced-motion` disables all animations
8. Lighthouse performance score remains ≥ 90
