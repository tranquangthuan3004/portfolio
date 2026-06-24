/**
 * Cinematic dark background effects for the hero section.
 * Three layers: subtle gradient orbs, faint grid, dark gradient overlay.
 */
export function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {/* Subtle gradient orbs — dimmed for cinematic feel */}
      <div className="animate-mesh-drift absolute left-1/2 top-0 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="animate-mesh-drift-reverse absolute right-0 top-1/4 h-[30rem] w-[30rem] rounded-full bg-cyan-500/6 blur-3xl" />
      <div className="animate-mesh-drift absolute -left-24 top-[42rem] h-[24rem] w-[24rem] rounded-full bg-violet-500/6 blur-3xl [animation-delay:4s]" />

      {/* Faint grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-15" />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_0,rgba(3,7,18,0.18)_34%,#030712_80%)]" />

      {/* Dark cinematic overlay — heavier at bottom, lighter at top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
    </div>
  );
}
