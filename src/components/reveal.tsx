"use client";

import { useInView } from "@/hooks/use-in-view";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in seconds */
  delay?: number;
  /** Direction of reveal */
  direction?: "up" | "left" | "right";
}

/**
 * Scroll-reveal wrapper. Fades and slides content into view
 * when it enters the viewport. Slow, smooth, premium transitions.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: RevealProps) {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const translateMap = {
    up: "translate3d(0, 40px, 0)",
    left: "translate3d(-40px, 0, 0)",
    right: "translate3d(40px, 0, 0)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate3d(0, 0, 0)" : translateMap[direction],
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
