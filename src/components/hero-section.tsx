"use client";

import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { CtaLink } from "@/components/cta-link";
import { AnimatedText, FadeIn } from "@/components/animated-text";
import { MouseGlow } from "@/components/mouse-glow";
import { HeroMockup } from "@/components/hero/hero-mockup";
import { BackgroundEffects } from "@/components/hero/background-effects";

const heroBadges = [
  "Internship ready",
  "React / Next.js",
  "UI Motion",
  "AI-assisted workflow",
];

/**
 * Cinematic hero section orchestrator.
 * Coordinates sequential entrance animations:
 * - Background + MouseGlow layer
 * - Eyebrow badge → Headline (word-by-word) → Subtext → CTAs → Badges
 * - Hero mockup slides in from right
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 pb-16 pt-40 sm:px-8 md:pt-32 lg:px-10"
    >
      {/* Background effects (gradient mesh + grid + particles) */}
      <BackgroundEffects />

      {/* Interactive mouse glow */}
      <MouseGlow />

      <div className="grid w-full items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] xl:gap-16">
        {/* ─── Left: Text content ─── */}
        <div className="relative z-20 max-w-3xl">
          {/* Eyebrow */}
          <FadeIn delay={0.3}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 shadow-[0_0_32px_rgba(34,211,238,0.08)]">
              <Sparkles className="size-4" />
              Frontend Developer / FPT Software Engineering Student
            </div>
          </FadeIn>

          {/* Main headline — word-by-word animation */}
          <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[4rem] xl:text-[4.5rem]">
            <AnimatedText
              text="Building polished"
              as="span"
              className="block"
              baseDelay={0.5}
              stagger={0.1}
            />
            <AnimatedText
              text="frontend experiences"
              as="span"
              className="block"
              baseDelay={0.8}
              stagger={0.1}
            />
            <AnimatedText
              text="for modern web products."
              as="span"
              className="block"
              baseDelay={1.1}
              stagger={0.1}
            />
          </h1>

          {/* Subtext — word-by-word, lighter and slower */}
          <div className="mt-6 max-w-2xl">
            <AnimatedText
              text="I design and build responsive landing pages, portfolio websites, and interactive web interfaces with React, Next.js, TypeScript, and Tailwind CSS — focused on clean structure, smooth motion, and practical product thinking."
              as="p"
              className="text-base leading-8 text-slate-300 sm:text-lg"
              baseDelay={1.6}
              stagger={0.03}
            />
          </div>

          {/* CTA buttons */}
          <FadeIn delay={2.4} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaLink href="#work" icon={ArrowRight}>
              View Work
            </CtaLink>
            <CtaLink href="#contact" icon={Mail} variant="secondary">
              Contact Me
            </CtaLink>
          </FadeIn>

          {/* Hero badges */}
          <div className="mt-8 flex flex-wrap gap-3">
            {heroBadges.map((badge, index) => (
              <span
                key={badge}
                className="animate-fade-in rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-semibold text-slate-200 backdrop-blur"
                style={{ animationDelay: `${2.6 + index * 0.1}s` }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* ─── Right: Hero mockup with slide-in animation ─── */}
        <div
          className="animate-slide-right relative z-20"
          style={{ animationDelay: "0.8s" }}
        >
          <HeroMockup />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="animate-fade-in absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex" style={{ animationDelay: "3s" }}>
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Scroll
        </span>
        <div className="animate-scroll-bounce h-6 w-px bg-gradient-to-b from-slate-500 to-transparent" />
      </div>
    </section>
  );
}
