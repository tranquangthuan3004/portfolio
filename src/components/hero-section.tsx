"use client";

import { MouseGlow } from "@/components/mouse-glow";
import { HeroMockup } from "@/components/hero/hero-mockup";
import { HeroContent } from "@/components/hero/hero-content";
import { BackgroundEffects } from "@/components/hero/background-effects";

/**
 * Cinematic hero section orchestrator.
 * Full-screen, three z-layers: background → overlay → content.
 * Content is bottom-left aligned (not centered).
 * Browser mockup floats on the right side (desktop only).
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-black text-white"
    >
      {/* Z-0: Background effects (gradient orbs + grid + dark overlay) */}
      <BackgroundEffects />

      {/* Z-10: Interactive mouse glow */}
      <MouseGlow />

      {/* Z-20: Content container — bottom-aligned */}
      <div className="relative z-20 mx-auto flex min-h-screen max-w-screen-2xl flex-col justify-end px-5 pb-12 sm:px-8 md:pb-24 lg:px-10 xl:px-16">
        {/* Hero content — bottom-left */}
        <HeroContent />

        {/* Browser mockup — absolutely positioned right, desktop only */}
        <HeroMockup />
      </div>

      {/* Scroll indicator */}
      <div
        className="animate-fade-in absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
        style={{ animationDelay: "3s" }}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white/30">
          Scroll
        </span>
        <div className="animate-scroll-bounce h-6 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}
