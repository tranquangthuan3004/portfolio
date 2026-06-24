import { CheckCircle2 } from "lucide-react";

/**
 * Floating browser mockup — anchored to the right side of the hero.
 * Desktop only (hidden md:block). Slides in from right at t=1.0s.
 * Slight rotate-1 tilt for depth. w-[420px] max.
 */
export function HeroMockup() {
  return (
    <div
      className="animate-slide-right hidden md:block absolute right-6 lg:right-10 xl:right-16 top-1/2 -translate-y-1/2 w-[340px] lg:w-[400px] xl:w-[420px] z-20"
      style={{ animationDelay: "1.0s" }}
    >
      <div className="hero-float relative rotate-1">
        {/* Glow behind mockup */}
        <div className="absolute -inset-8 rounded-full bg-white/[0.03] blur-3xl" />

        <div className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
          {/* Browser chrome bar */}
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400/80" />
              <span className="size-2.5 rounded-full bg-amber-300/80" />
              <span className="size-2.5 rounded-full bg-emerald-300/80" />
            </div>
            <div className="flex-1 rounded-full bg-white/10 h-4" />
          </div>

          {/* Main content area */}
          <div className="relative p-4 lg:p-5">
            <div className="absolute left-1/2 top-6 size-32 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_70%)] blur-sm" />

            {/* Top section: logo + text placeholder */}
            <div className="relative rounded-xl border border-white/10 bg-white/[0.04] p-4 mb-3">
              <div className="mb-4 flex items-center justify-between">
                <span className="h-3 w-20 rounded-full bg-white/40" />
                <span className="size-6 rounded-full border border-white/15 bg-white/10" />
              </div>
              <div className="space-y-2.5">
                <span className="block h-3 w-4/5 rounded-full bg-white/30" />
                <span className="block h-3 w-3/5 rounded-full bg-white/20" />
                <span className="block h-2 w-full rounded-full bg-white/10" />
                <span className="block h-2 w-5/6 rounded-full bg-white/8" />
              </div>
              <div className="mt-5 flex gap-2">
                <span className="h-8 flex-1 rounded-full bg-white/80" />
                <span className="h-8 flex-1 rounded-full border border-white/15 bg-white/[0.04]" />
              </div>
            </div>

            {/* UI System panel */}
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 mb-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                  UI System
                </span>
                <CheckCircle2 className="size-4 text-white/40" />
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {["Hero", "Cards", "Motion"].map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-white/10 bg-black/30 px-2 py-2.5 text-center text-[9px] font-bold uppercase tracking-wider text-white/50"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Code lines */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-3">
              <div className="space-y-1.5">
                {[88, 64, 72, 48].map((width, index) => (
                  <span
                    key={width}
                    className="block h-1.5 rounded-full bg-gradient-to-r from-white/25 to-white/10"
                    style={{
                      width: `${width}%`,
                      opacity: 1 - index * 0.15,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
