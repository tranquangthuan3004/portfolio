"use client";

import { ReactLenis } from "lenis/react";

/**
 * Global smooth scrolling provider using Lenis.
 */
export function SmoothScrolling({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      {children}
    </ReactLenis>
  );
}
