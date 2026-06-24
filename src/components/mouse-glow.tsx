"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Full-screen pointer-events-none layer that renders
 * a cyan radial glow following the cursor position.
 */
export function MouseGlow() {
  const layerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [active, setActive] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const el = layerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      posRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      el.style.setProperty("--mx", `${posRef.current.x}px`);
      el.style.setProperty("--my", `${posRef.current.y}px`);
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
      className="pointer-events-auto absolute inset-0 z-10"
      style={{
        /* The interactive layer needs to capture mouse events,
           but the glow itself is purely visual */
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(
            220px circle at var(--mx, 50%) var(--my, 50%),
            rgba(103, 232, 249, 0.12),
            rgba(139, 92, 246, 0.06) 40%,
            transparent 70%
          )`,
          transition: "opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      />
    </div>
  );
}
