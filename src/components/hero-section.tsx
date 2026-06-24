"use client";

import { MouseGlow } from "@/components/mouse-glow";
import { HeroContent } from "@/components/hero/hero-content";
import { VideoBackground } from "@/components/hero/video-background";

/**
 * Cinematic hero section orchestrator.
 * Full-screen, three z-layers: background → overlay → content.
 * Content is centered.
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-background text-foreground"
    >
      {/* Z-0: Dynamic Video Background */}
      <VideoBackground />

      {/* Z-10: Interactive mouse glow */}
      <MouseGlow />

      {/* Z-20: Centered Content container */}
      <div className="relative z-20 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-5 py-24 text-center">
        {/* Hero content — centered */}
        <HeroContent />
      </div>

      {/* Scroll indicator */}
      <div
        className="animate-fade-in absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
        style={{ animationDelay: "3s" }}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground/30">
          Scroll
        </span>
        <div className="animate-scroll-bounce h-6 w-px bg-gradient-to-b from-foreground/40 to-transparent" />
      </div>
    </section>
  );
}
