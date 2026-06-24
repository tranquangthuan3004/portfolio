import { CheckCircle2 } from "lucide-react";

/**
 * The custom coded hero visual — a floating glass browser window
 * with abstract UI panels, code lines, and gradient orbs.
 * Renders as a premium frontend studio/product interface preview.
 */
export function HeroMockup() {
  return (
    <div className="relative z-10 mx-auto w-full max-w-2xl lg:mx-0">
      <div className="absolute -inset-10 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute -right-8 top-12 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="hero-float relative rounded-[2rem] border border-white/10 bg-white/[0.055] p-3 shadow-[0_30px_100px_rgba(34,211,238,0.14)] backdrop-blur-2xl">
        <div className="relative overflow-hidden rounded-[1.45rem] border border-white/10 bg-slate-950/80">
          {/* Browser chrome */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-red-300/80" />
              <span className="size-2.5 rounded-full bg-amber-200/80" />
              <span className="size-2.5 rounded-full bg-emerald-200/80" />
            </div>
            <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold text-slate-300 sm:block">
              phoenixz.dev/landing-preview
            </div>
            <div className="h-2 w-10 rounded-full bg-cyan-200/50" />
          </div>

          {/* Main content area */}
          <div className="relative grid gap-4 p-4 sm:grid-cols-[0.95fr_1.05fr] sm:p-5">
            <div className="absolute left-1/2 top-8 size-44 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(103,232,249,0.45),rgba(168,85,247,0.16)_45%,transparent_70%)] blur-sm" />
            {/* Left panel — landing page preview */}
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.045] p-5">
              <div className="mb-6 flex items-center justify-between">
                <span className="h-3 w-24 rounded-full bg-white/55" />
                <span className="h-8 w-8 rounded-full border border-cyan-200/30 bg-cyan-200/10" />
              </div>
              <div className="space-y-3">
                <span className="block h-4 w-4/5 rounded-full bg-cyan-200/55" />
                <span className="block h-4 w-3/5 rounded-full bg-violet-200/55" />
                <span className="block h-2 w-full rounded-full bg-white/20" />
                <span className="block h-2 w-5/6 rounded-full bg-white/15" />
              </div>
              <div className="mt-8 flex gap-2">
                <span className="h-10 flex-1 rounded-full bg-cyan-200/80" />
                <span className="h-10 flex-1 rounded-full border border-white/15 bg-white/[0.04]" />
              </div>
            </div>

            {/* Right panels — system + code */}
            <div className="relative grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">
                    UI System
                  </span>
                  <CheckCircle2 className="size-5 text-cyan-200" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["Hero", "Cards", "Motion"].map((item) => (
                    <span
                      key={item}
                      className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-4 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                <div className="space-y-2">
                  {[92, 68, 78, 52].map((width, index) => (
                    <span
                      key={width}
                      className="block h-2 rounded-full bg-gradient-to-r from-cyan-200/70 to-violet-200/50"
                      style={{
                        width: `${width}%`,
                        opacity: 1 - index * 0.13,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="grid grid-cols-3 gap-3 border-t border-white/10 p-4">
            {["Responsive", "Fast", "Polished"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-3 text-center text-xs font-semibold text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
