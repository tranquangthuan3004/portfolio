"use client";

import { type ReactNode, createElement } from "react";

type AnimatedTextProps = {
  text: string;
  baseDelay?: number;
  stagger?: number;
  className?: string;
  wordClassName?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  children?: ReactNode;
};

/**
 * Splits text into words and applies staggered fadeSlideUp animation.
 * Each word fades in from below with an increasing delay.
 */
export function AnimatedText({
  text,
  baseDelay = 0,
  stagger = 0.08,
  className = "",
  wordClassName = "",
  as = "span",
}: AnimatedTextProps) {
  const words = text.split(" ");

  return createElement(
    as,
    { className },
    words.map((word, index) => (
      <span
        key={`${word}-${index}`}
        className={`inline-block animate-fade-slide-up ${wordClassName}`}
        style={{ animationDelay: `${baseDelay + index * stagger}s` }}
      >
        {word}
        {index < words.length - 1 ? "\u00A0" : ""}
      </span>
    )),
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
