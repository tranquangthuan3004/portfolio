"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedText, FadeIn } from "@/components/animated-text";

/**
 * Hero content block — centered.
 * Contains: headline → sub-copy → CTAs.
 * All animations follow the cinematic timeline from the spec.
 */
export function HeroContent() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-6 max-w-4xl">
      {/* Main headline — t=0.4s, word-by-word stagger */}
      <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] xl:text-[80px] font-bold leading-[1.1] tracking-tight text-white">
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
      <div className="max-w-2xl mx-auto">
        <AnimatedText
          text="I design and build responsive landing pages, portfolio websites, and interactive web interfaces — focused on clean structure, smooth motion, and practical product thinking."
          as="p"
          className="text-[15px] sm:text-[17px] text-white/60 font-light leading-relaxed"
          baseDelay={1.4}
          stagger={0.03}
        />
      </div>

      {/* CTA row — t=2.4s */}
      <FadeIn delay={2.4} className="flex items-center justify-center gap-5 mt-2">
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
    </div>
  );
}

