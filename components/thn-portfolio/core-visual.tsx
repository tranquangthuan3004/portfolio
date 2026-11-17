"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import type { CoreVisualCanvasProps, CoreVisualConcept } from "./core-visual-stage";
import type { CoreRotationControls } from "./core-visual-stage";
import { CoreSceneProgressContext } from "./core-scene-progress";
import styles from "./core-visual.module.css";

function StaticMark({ concept }: { concept: CoreVisualConcept }) {
  const markId = useId().replace(/:/g, "");
  const gradientId = `${markId}-chrome`;

  if (concept === "fluid") {
    return (
      <svg
        className={styles.fallbackMark}
        viewBox="0 0 240 180"
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#62666a" />
            <stop offset="0.24" stopColor="#f3f4f4" />
            <stop offset="0.48" stopColor="#a4a8ab" />
            <stop offset="0.7" stopColor="#ffffff" />
            <stop offset="1" stopColor="#5d6266" />
          </linearGradient>
        </defs>
        <g fill={`url(#${gradientId})`} stroke="#64696d" strokeLinejoin="round" strokeWidth="1.2">
          <path d="M17 105C29 71 51 49 81 48c31-1 40 30 68 39 25 8 42-8 67-37l10 12c-24 34-46 54-74 47-28-7-39-37-68-34-24 2-39 18-51 44z" />
          <path d="M34 140c25-21 34-50 52-74 20-27 48-42 77-30l-5 14c-23-9-43 5-58 27-16 24-27 55-55 77z" opacity="0.92" />
          <path d="M22 51c29 4 43 26 59 48 17 23 33 38 59 42 25 4 43-10 61-27l10 12c-23 22-46 37-75 30-32-7-49-31-66-54-16-22-27-35-51-38z" opacity="0.86" />
          <path d="m32 73 14-7 10 8-9 12-15-3z" />
          <path d="m187 128 15-5 8 9-10 12-14-4z" />
          <path d="m109 92 10-7 9 9-8 11z" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      className={styles.fallbackMark}
      viewBox="0 0 240 180"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#5b6064" />
          <stop offset="0.22" stopColor="#f4f4f4" />
          <stop offset="0.47" stopColor="#9da2a6" />
          <stop offset="0.72" stopColor="#ffffff" />
          <stop offset="1" stopColor="#585d61" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${gradientId})`} strokeLinecap="round" strokeWidth="7">
        <path d="M24 119A71 71 0 0 1 132 29" />
        <path d="M116 18A61 78 0 0 1 199 111" />
        <path d="M55 151A84 51 0 0 1 196 82" />
      </g>
      <g stroke="#555a5e" strokeLinejoin="round" strokeWidth="1">
        <path d="m26 45 26-8 10 8-22 12z" fill={`url(#${gradientId})`} />
        <path d="m171 28 17 8-2 18-19-5z" fill="#555a5e" />
        <path d="m43 132 24-10 7 10-20 14z" fill="#777c80" />
        <path d="m182 133 18-7 6 11-14 11z" fill={`url(#${gradientId})`} />
        <path d="m108 77 13-11 13 13-11 14z" fill={`url(#${gradientId})`} />
      </g>
    </svg>
  );
}

const OrbitalCanvas = dynamic<CoreVisualCanvasProps>(() => import("./core-visual-canvas"), {
  ssr: false,
  loading: () => <StaticMark concept="orbital" />,
});

const FluidCanvas = dynamic<CoreVisualCanvasProps>(() => import("./core-visual-fluid-canvas"), {
  ssr: false,
  loading: () => <StaticMark concept="fluid" />,
});

type BoundaryProps = { children: ReactNode; fallback: ReactNode };
type BoundaryState = { failed: boolean };

class VisualBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("The optional Core sculpture fell back to its static study.", error);
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function CoreVisual({
  concept,
  presentation = "study",
  interactive = false,
  touchRotation = false,
}: {
  concept: CoreVisualConcept;
  presentation?: "study" | "hero";
  interactive?: boolean;
  touchRotation?: boolean;
}) {
  const slotRef = useRef<HTMLSpanElement>(null);
  const chapterProgressRef = useContext(CoreSceneProgressContext);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const rotationControlsRef = useRef<CoreRotationControls | null>(null);
  const [canvasEligible, setCanvasEligible] = useState(false);
  const [compactGeometry, setCompactGeometry] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [pageVisible, setPageVisible] = useState(false);
  const [hasActivatedCanvas, setHasActivatedCanvas] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [canvasFailed, setCanvasFailed] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const largeEnough = window.matchMedia("(min-width: 360px)");
    const compact = window.matchMedia("(max-width: 820px) and (min-width: 360px)");
    const syncPreferences = () => {
      setReducedMotion(reduced.matches);
      setCanvasEligible(largeEnough.matches);
      setCompactGeometry(compact.matches);
    };
    const syncPageVisibility = () => setPageVisible(document.visibilityState === "visible");

    syncPreferences();
    syncPageVisibility();
    reduced.addEventListener("change", syncPreferences);
    largeEnough.addEventListener("change", syncPreferences);
    compact.addEventListener("change", syncPreferences);
    document.addEventListener("visibilitychange", syncPageVisibility);

    const slot = slotRef.current;
    if (!slot || typeof IntersectionObserver === "undefined") {
      return () => {
        reduced.removeEventListener("change", syncPreferences);
        largeEnough.removeEventListener("change", syncPreferences);
        compact.removeEventListener("change", syncPreferences);
        document.removeEventListener("visibilitychange", syncPageVisibility);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    observer.observe(slot);

    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", syncPreferences);
      largeEnough.removeEventListener("change", syncPreferences);
      compact.removeEventListener("change", syncPreferences);
      document.removeEventListener("visibilitychange", syncPageVisibility);
    };
  }, []);

  useEffect(() => {
    if (canvasEligible && visible && pageVisible && !reducedMotion) {
      const activationFrame = requestAnimationFrame(() => setHasActivatedCanvas(true));
      return () => cancelAnimationFrame(activationFrame);
    }
    return undefined;
  }, [canvasEligible, pageVisible, reducedMotion, visible]);

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType === "touch" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerTarget.current = {
      x: Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2)),
      y: Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2)),
    };
  };

  const handleContextLoss = useCallback(() => setCanvasFailed(true), []);
  const handleCanvasReady = useCallback((ready: boolean) => setCanvasReady(ready), []);
  const visibleWithoutObserver = typeof window !== "undefined" && typeof IntersectionObserver === "undefined";
  const visibleForCanvas = visible || visibleWithoutObserver;
  const renderCanvas = canvasEligible && hasActivatedCanvas && !reducedMotion && !canvasFailed;
  const fallback = <StaticMark concept={concept} />;
  const ActiveCanvas = concept === "orbital" ? OrbitalCanvas : FluidCanvas;

  const handleKeyboardRotation = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!interactive || !canvasReady || !renderCanvas) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === "Home" || event.key.toLowerCase() === "r") {
      event.preventDefault();
      rotationControlsRef.current?.reset();
      return;
    }
    const command = {
      ArrowLeft: { axis: "y" as const, angle: -0.28 },
      ArrowRight: { axis: "y" as const, angle: 0.28 },
      ArrowUp: { axis: "x" as const, angle: -0.22 },
      ArrowDown: { axis: "x" as const, angle: 0.22 },
    }[event.key];
    if (!command) return;
    event.preventDefault();
    rotationControlsRef.current?.rotate(command.axis, command.angle);
  };

  const visual = (
    <span
      ref={slotRef}
      className={`${styles.visualSlot} ${presentation === "hero" ? styles.heroVisualSlot : ""}`}
      data-thn-interactive-visual={interactive ? "" : undefined}
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerTarget.current = { x: 0, y: 0 };
      }}
    >
      {renderCanvas ? (
        <VisualBoundary key={`${concept}-${compactGeometry ? "compact" : "desktop"}`} fallback={fallback}>
          <ActiveCanvas
            pointerTarget={pointerTarget}
            fallback={fallback}
            onContextLoss={handleContextLoss}
            onCanvasReady={handleCanvasReady}
            active={visibleForCanvas && pageVisible}
            compact={compactGeometry}
            interactive={interactive}
            touchRotation={touchRotation}
            rotationControlsRef={rotationControlsRef}
            chapterProgressRef={interactive ? chapterProgressRef : null}
          />
        </VisualBoundary>
      ) : (
        fallback
      )}
    </span>
  );

  if (!interactive) return visual;

  return (
    <div
      className={styles.interactiveSurface}
      data-thn-interactive-surface=""
      role={canvasReady && renderCanvas ? "group" : undefined}
      aria-label={canvasReady && renderCanvas ? "Fluid Construct sculpture" : undefined}
      aria-describedby={canvasReady && renderCanvas ? "fluid-rotation-help" : undefined}
      tabIndex={canvasReady && renderCanvas ? 0 : undefined}
      onKeyDown={handleKeyboardRotation}
    >
      {visual}
    </div>
  );
}
