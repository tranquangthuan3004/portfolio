"use client";

import { useState } from "react";
import { MouseGlow } from "@/components/mouse-glow";
import { HeroContent } from "@/components/hero/hero-content";
import { GridBackground, BackgroundVibe } from "@/components/hero/grid-background";

/**
 * Cinematic hero section orchestrator.
 * Full-screen, three z-layers: background → overlay → content.
 * Content is centered.
 */
export function HeroSection() {
  const [vibe, setVibe] = useState<BackgroundVibe>("grid");

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-[#03030f] text-white"
    >
      {/* Z-0: Dynamic Canvas-based Grid Background */}
      <GridBackground vibe={vibe} />

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
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white/30">
          Scroll
        </span>
        <div className="animate-scroll-bounce h-6 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </div>

      {/* Z-30: Floating Vibe Controller at bottom right */}
      <div 
        className="animate-fade-in absolute bottom-4 right-4 z-30 flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1 backdrop-blur-md md:bottom-6 md:right-6"
        style={{ animationDelay: "2.4s" }}
      >
        {(["grid", "wave", "tunnel", "rain"] as BackgroundVibe[]).map((v) => (
          <button
            key={v}
            onClick={() => setVibe(v)}
            className={`rounded-full px-3.5 py-1.5 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.08em] transition-all duration-300 ${
              vibe === v
                ? "bg-white/15 text-white shadow-sm border border-white/20"
                : "text-white/40 border border-transparent hover:bg-white/5 hover:text-white/70"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </section>
  );
}


