"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedText, FadeIn } from "@/components/animated-text";

/**
 * Hero content block — editorial, cinematic, centered.
 * Off-white text hierarchy. Glassy CTAs. Premium breathing room.
 */
export function HeroContent() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-8 max-w-4xl">
      {/* Mono eyebrow */}
      <FadeIn delay={0.2}>
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-white/40">
          Frontend Developer · PhoenixZ
        </span>
      </FadeIn>

      {/* Main headline — editorial, intentional line breaks */}
      <h1 className="text-[36px] sm:text-[52px] lg:text-[68px] xl:text-[80px] font-bold leading-[1.08] tracking-tighter text-white/90">
        <AnimatedText
          text="Building polished"
          as="span"
          className="block"
          baseDelay={0.4}
          stagger={0.07}
          accentWords={["polished"]}
        />
        <AnimatedText
          text="digital experiences."
          as="span"
          className="block"
          baseDelay={0.56}
          stagger={0.07}
          accentWords={["experiences."]}
        />
      </h1>

      {/* Sub-copy */}
      <div className="max-w-xl mx-auto">
        <AnimatedText
          text="I design and build responsive landing pages, portfolio websites, and interactive web interfaces — focused on clean structure, smooth motion, and practical product thinking."
          as="p"
          className="text-[15px] sm:text-[17px] text-white/45 font-light leading-relaxed"
          baseDelay={1.2}
          stagger={0.02}
        />
      </div>

      {/* CTA row — glassy buttons */}
      <FadeIn delay={2.0} className="flex items-center justify-center gap-4 mt-4">
        <Link
          href="#work"
          className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-7 py-3.5 text-[14px] font-semibold text-white/90 backdrop-blur-sm transition-all duration-500 hover:bg-white/20 hover:border-white/25 hover:shadow-[0_0_40px_rgba(167,139,250,0.15)]"
        >
          View Work
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="#contact"
          className="text-white/50 hover:text-white/80 text-[14px] font-medium transition duration-500"
        >
          Contact Me →
        </Link>
      </FadeIn>
    </div>
  );
}
