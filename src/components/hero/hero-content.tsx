"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedText, FadeIn } from "@/components/animated-text";

const heroBadges = [
  "Internship ready",
  "React / Next.js",
  "UI Motion",
  "AI-assisted workflow",
];

/**
 * Hero content block — bottom-left aligned.
 * Contains: eyebrow → headline → sub-copy → CTAs → badges.
 * All animations follow the cinematic timeline from the spec.
 */
export function HeroContent() {
  return (
    <div className="flex flex-col items-start gap-4 max-w-3xl">
      {/* Eyebrow label — t=0.3s */}
      <FadeIn delay={0.3}>
        <p className="text-xs tracking-widest uppercase text-white/50 font-normal">
          Frontend Developer / FPT Software Engineering Student
        </p>
      </FadeIn>

      {/* Main headline — t=0.4s, word-by-word stagger */}
      <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] xl:text-[80px] font-bold leading-[1.05] tracking-tight text-white">
        <AnimatedText
          text="Building polished"
          as="span"
          className="block"
          baseDelay={0.4}
          stagger={0.07}
          accentWords={["polished"]}
        />
        <AnimatedText
          text="frontend experiences"
          as="span"
          className="block"
          baseDelay={0.54}
          stagger={0.07}
          accentWords={["frontend"]}
        />
        <AnimatedText
          text="for modern web products."
          as="span"
          className="block"
          baseDelay={0.68}
          stagger={0.07}
          accentWords={["modern"]}
        />
      </h1>

      {/* Sub-copy — t=1.4s, word-by-word stagger */}
      <div className="max-w-lg">
        <AnimatedText
          text="I design and build responsive landing pages, portfolio websites, and interactive web interfaces — focused on clean structure, smooth motion, and practical product thinking."
          as="p"
          className="text-[15px] text-white/60 font-light leading-relaxed"
          baseDelay={1.4}
          stagger={0.03}
        />
      </div>

      {/* CTA row — t=2.4s */}
      <FadeIn delay={2.4} className="flex items-center gap-5 mt-2">
        <Link
          href="#work"
          className="inline-flex items-center gap-2 rounded-full bg-white text-black text-sm font-medium px-6 py-2.5 transition duration-300 hover:bg-white/90 hover:-translate-y-0.5"
        >
          View Work
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="#contact"
          className="text-white/70 hover:text-white text-sm underline-offset-4 hover:underline transition duration-300"
        >
          Contact Me →
        </Link>
      </FadeIn>

      {/* Badge pills — t=2.7s, stagger 0.08s */}
      <div className="flex flex-wrap gap-2 mt-2">
        {heroBadges.map((badge, index) => (
          <span
            key={badge}
            className="animate-fade-in rounded-full border border-white/10 bg-white/5 text-white/50 text-xs px-3 py-1"
            style={{ animationDelay: `${2.7 + index * 0.08}s` }}
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}
