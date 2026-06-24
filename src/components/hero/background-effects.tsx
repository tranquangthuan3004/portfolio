/**
 * Enhanced background effects for the hero section.
 * Gradient orbs now drift with CSS animation, grid and floating particles are retained.
 */
export function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Gradient orbs with slow drift animation */}
      <div className="animate-mesh-drift absolute left-1/2 top-0 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-violet-600/18 blur-3xl" />
      <div className="animate-mesh-drift-reverse absolute right-0 top-1/4 h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="animate-mesh-drift absolute -left-24 top-[42rem] h-[24rem] w-[24rem] rounded-full bg-violet-500/10 blur-3xl [animation-delay:4s]" />
      <div className="animate-mesh-drift-reverse absolute bottom-0 right-1/4 h-[20rem] w-[20rem] rounded-full bg-cyan-400/8 blur-3xl [animation-delay:8s]" />

      {/* Faint grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_0,rgba(3,7,18,0.18)_34%,#030712_80%)]" />

      {/* Floating light particles */}
      <div className="floating-light absolute left-[8%] top-[18%] size-2 rounded-full bg-cyan-200" />
      <div className="floating-light absolute right-[18%] top-[34%] size-2 rounded-full bg-violet-200 [animation-delay:1.5s]" />
      <div className="floating-light absolute bottom-[18%] left-[32%] size-2 rounded-full bg-cyan-100 [animation-delay:2.6s]" />
      <div className="floating-light absolute right-[40%] top-[55%] size-1.5 rounded-full bg-violet-100 [animation-delay:3.8s]" />
      <div className="floating-light absolute left-[60%] top-[12%] size-1.5 rounded-full bg-cyan-200/80 [animation-delay:5s]" />
    </div>
  );
}
