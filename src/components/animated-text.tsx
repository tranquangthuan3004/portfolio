"use client";

import { type ReactNode, createElement } from "react";

type AnimatedTextProps = {
  text: string;
  baseDelay?: number;
  stagger?: number;
  className?: string;
  wordClassName?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  /** Words to apply accent styling (italic) */
  accentWords?: string[];
  children?: ReactNode;
};

/**
 * Splits text into words and applies staggered fadeSlideUp animation.
 * Each word fades in from below with an increasing delay.
 * Accent words get italic styling for visual rhythm.
 */
export function AnimatedText({
  text,
  baseDelay = 0,
  stagger = 0.07,
  className = "",
  wordClassName = "",
  accentWords = [],
  as = "span",
}: AnimatedTextProps) {
  const words = text.split(" ");
  const accentSet = new Set(accentWords.map((w) => w.toLowerCase()));

  return createElement(
    as,
    { className },
    words.map((word, index) => {
      const isAccent = accentSet.has(word.toLowerCase().replace(/[.,!?]/, ""));
      return (
        <span
          key={`${word}-${index}`}
          className={`inline-block animate-fade-slide-up ${isAccent ? "italic text-white/90" : ""} ${wordClassName}`}
          style={{ animationDelay: `${baseDelay + index * stagger}s` }}
        >
          {word}
          {index < words.length - 1 ? "\u00A0" : ""}
        </span>
      );
    }),
  );
}

type FadeInProps = {
  delay?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Simple fade-in wrapper with configurable delay.
 */
export function FadeIn({ delay = 0, className = "", children }: FadeInProps) {
  return (
    <div
      className={`animate-fade-in ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
