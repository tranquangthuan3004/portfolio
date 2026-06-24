"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Full-screen pointer-events-none layer that renders
 * a subtle white radial glow following the cursor position.
 * 400px radius, extremely subtle — visible only on desktop.
 */
export function MouseGlow() {
  const layerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [active, setActive] = useState(false);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const el = layerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });

    if (!active) setActive(true);
  }, [active]);

  const handleLeave = useCallback(() => {
    setActive(false);
  }, []);

  return (
    <div
      ref={layerRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="pointer-events-auto absolute inset-0 z-10 hidden md:block"
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(
            400px circle at var(--mx, 50%) var(--my, 50%),
            rgba(255, 255, 255, 0.03),
            transparent 70%
          )`,
        }}
      />
    </div>
  );
}
