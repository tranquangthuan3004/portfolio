"use client";

import { useLayoutEffect, useRef, useSyncExternalStore } from "react";
import type { MouseEvent } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./site.module.css";

type Theme = "light" | "dark";
type ThemeTransition = {
  skipTransition: () => void;
  finished: Promise<void>;
  ready?: Promise<void>;
  updateCallbackDone?: Promise<void>;
};
type TransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => ThemeTransition;
};

const STORAGE_KEY = "thn-core-visual-b-theme";
const THEME_EVENT = "thn-visual-b-theme-change";
// Animate the existing V2 semantic tokens, not duplicate palette values or page snapshots.
const LIVE_THEME_PROPERTIES = [
  "--thn-surface", "--thn-mist", "--thn-ink", "--thn-ink-muted", "--thn-ink-rule",
  "--thn-body", "--thn-muted", "--thn-rule", "--thn-soft-rule", "--thn-control",
  "--thn-action", "--thn-focus", "--thn-work-card", "--thn-hero-ground",
  "--thn-hero-ambient", "--thn-hero-light", "--thn-hero-frame",
  "--thn-glass-solid", "--thn-glass-tint", "--thn-glass-border",
] as const;
const INK_RATIOS = [1, 0.82, 1.12, 0.91, 1.2, 0.86, 1.1, 0.93, 1.16, 0.84, 1.13, 0.9, 1.18, 0.85, 1.08, 0.95];
const INK_CURVE_STEPS = 12;
type InkPoint = { x: number; y: number };
type InkSegment = { start: InkPoint; firstControl: InkPoint; secondControl: InkPoint; end: InkPoint };
let desiredTheme: Theme = "light";

function getPreviewRoot() {
  return document.querySelector<HTMLElement>("[data-thn-preview]");
}

function getThemeSnapshot(): Theme {
  return desiredTheme;
}

function subscribeToTheme(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

function notifyThemeChange() {
  window.dispatchEvent(new Event(THEME_EVENT));
}

function commitTheme(theme: Theme) {
  const root = getPreviewRoot();
  if (root) root.dataset.thnVisualBTheme = theme;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // The theme remains active for this visit when storage is unavailable.
  }
  notifyThemeChange();
}

function inkSegments(centerX: number, centerY: number, radius: number): InkSegment[] {
  const points = INK_RATIOS.map((ratio, index) => {
    const angle = (index / INK_RATIOS.length) * Math.PI * 2 - Math.PI / 2;
    const pointRadius = radius * ratio;
    return { x: centerX + Math.cos(angle) * pointRadius, y: centerY + Math.sin(angle) * pointRadius };
  });
  return points.map((point, index) => {
    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const afterNext = points[(index + 2) % points.length];
    return {
      start: point,
      firstControl: { x: point.x + (next.x - previous.x) / 6, y: point.y + (next.y - previous.y) / 6 },
      secondControl: { x: next.x - (afterNext.x - point.x) / 6, y: next.y - (afterNext.y - point.y) / 6 },
      end: next,
    };
  });
}

function inkPath(centerX: number, centerY: number, radius: number) {
  const segments = inkSegments(centerX, centerY, radius);
  const coordinate = (value: number) => Number(value.toFixed(2));
  const first = segments[0].start;
  const commands = [`M ${coordinate(first.x)} ${coordinate(first.y)}`];
  segments.forEach(({ firstControl, secondControl, end }) => {
    commands.push(`C ${coordinate(firstControl.x)} ${coordinate(firstControl.y)} ${coordinate(secondControl.x)} ${coordinate(secondControl.y)} ${coordinate(end.x)} ${coordinate(end.y)}`);
  });

  commands.push("Z");
  return `path("${commands.join(" ")}")`;
}

function clipInkPolygon(polygon: InkPoint[], axis: "x" | "y", bound: number, keepGreater: boolean): InkPoint[] {
  if (polygon.length === 0) return [];
  const clipped: InkPoint[] = [];
  let previous = polygon[polygon.length - 1];
  let previousInside = keepGreater ? previous[axis] >= bound : previous[axis] <= bound;

  for (const current of polygon) {
    const currentInside = keepGreater ? current[axis] >= bound : current[axis] <= bound;
    if (currentInside !== previousInside) {
      const delta = current[axis] - previous[axis];
      const ratio = delta === 0 ? 0 : (bound - previous[axis]) / delta;
      clipped.push({
        x: previous.x + ratio * (current.x - previous.x),
        y: previous.y + ratio * (current.y - previous.y),
      });
    }
    if (currentInside) clipped.push(current);
    previous = current;
    previousInside = currentInside;
  }
  return clipped;
}

function inkCoveragePercent(centerX: number, centerY: number, radius: number, width: number, height: number) {
  const segments = inkSegments(centerX, centerY, radius);
  const polygon: InkPoint[] = [segments[0].start];

  for (const { start, firstControl, secondControl, end } of segments) {
    for (let step = 1; step <= INK_CURVE_STEPS; step += 1) {
      const t = step / INK_CURVE_STEPS;
      const inverse = 1 - t;
      polygon.push({
        x: inverse ** 3 * start.x + 3 * inverse ** 2 * t * firstControl.x + 3 * inverse * t ** 2 * secondControl.x + t ** 3 * end.x,
        y: inverse ** 3 * start.y + 3 * inverse ** 2 * t * firstControl.y + 3 * inverse * t ** 2 * secondControl.y + t ** 3 * end.y,
      });
    }
  }

  const clipped = clipInkPolygon(
    clipInkPolygon(
      clipInkPolygon(clipInkPolygon(polygon, "x", 0, true), "x", width, false),
      "y",
      0,
      true,
    ),
    "y",
    height,
    false,
  );
  if (clipped.length < 3) return 0;

  let twiceArea = 0;
  clipped.forEach((point, index) => {
    const next = clipped[(index + 1) % clipped.length];
    twiceArea += point.x * next.y - next.x * point.y;
  });
  return Math.abs(twiceArea) / 2 / (width * height) * 100;
}

function inkRadiusForCoverage(targetPercent: number, centerX: number, centerY: number, width: number, height: number, maxRadius: number) {
  let lower = 2;
  let upper = maxRadius;
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const radius = (lower + upper) / 2;
    if (inkCoveragePercent(centerX, centerY, radius, width, height) < targetPercent) lower = radius;
    else upper = radius;
  }
  return upper;
}

function prepareInkReveal(root: HTMLElement, origin: { x: number; y: number }) {
  const width = document.documentElement.clientWidth || window.innerWidth;
  const height = document.documentElement.clientHeight || window.innerHeight;
  const farthestCorner = Math.max(
    Math.hypot(origin.x, origin.y),
    Math.hypot(width - origin.x, origin.y),
    Math.hypot(origin.x, height - origin.y),
    Math.hypot(width - origin.x, height - origin.y),
  );
  root.style.setProperty("--thn-visual-b-ink-from", inkPath(origin.x, origin.y, 2));
  const maxRadius = farthestCorner * 1.5 + 80;
  for (const [keyframe, targetCoverage] of [[25, 22], [50, 50], [75, 82]] as const) {
    const radius = inkRadiusForCoverage(targetCoverage, origin.x, origin.y, width, height, maxRadius);
    root.style.setProperty(`--thn-visual-b-ink-${keyframe}`, inkPath(origin.x, origin.y, radius));
  }
  const completionRadius = inkRadiusForCoverage(99.999, origin.x, origin.y, width, height, maxRadius) * 1.03;
  root.style.setProperty("--thn-visual-b-ink-to", inkPath(origin.x, origin.y, completionRadius));
}

function clearInkReveal(root: HTMLElement) {
  root.style.removeProperty("--thn-visual-b-ink-from");
  root.style.removeProperty("--thn-visual-b-ink-25");
  root.style.removeProperty("--thn-visual-b-ink-50");
  root.style.removeProperty("--thn-visual-b-ink-75");
  root.style.removeProperty("--thn-visual-b-ink-to");
}

export default function VisualBThemeToggle({ liveThemeTransition = false }: { liveThemeTransition?: boolean } = {}) {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => "light");
  const activeTransition = useRef<ThemeTransition | null>(null);
  const pendingTheme = useRef<Theme | null>(null);
  const mounted = useRef(false);
  const liveTween = useRef<{ kill: () => void } | null>(null);
  const liveRequest = useRef(0);
  const liveStyles = useRef(new Map<string, { value: string; priority: string }>());

  const restoreLiveStyles = (root: HTMLElement) => {
    liveStyles.current.forEach(({ value, priority }, name) => {
      if (value) root.style.setProperty(name, value, priority);
      else root.style.removeProperty(name);
    });
    liveStyles.current.clear();
    delete root.dataset.thnLiveThemeTransitioning;
  };

  useLayoutEffect(() => {
    mounted.current = true;
    const routeRoot = getPreviewRoot();
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Keep the light default if storage is unavailable.
    }
    desiredTheme = stored === "dark" || (stored !== "light" && routeRoot?.dataset.thnVisualBTheme === "dark")
      ? "dark"
      : "light";
    if (routeRoot) {
      if (desiredTheme === "dark") routeRoot.dataset.thnVisualBTheme = "dark";
      else delete routeRoot.dataset.thnVisualBTheme;
    }
    notifyThemeChange();
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
        if (!motionQuery.matches) return;
      liveRequest.current += 1;
        liveTween.current?.kill();
      liveTween.current = null;
      if (routeRoot) restoreLiveStyles(routeRoot);
      commitTheme(desiredTheme);
    };
    if (liveThemeTransition) motionQuery.addEventListener("change", onMotionChange);

    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      mounted.current = false;
      liveRequest.current += 1;
      liveTween.current?.kill();
      liveTween.current = null;
      if (routeRoot) restoreLiveStyles(routeRoot);
      activeTransition.current?.skipTransition();
      activeTransition.current = null;
      pendingTheme.current = null;
      const documentRoot = document.documentElement;
      delete documentRoot.dataset.thnVisualBTransitioning;
      clearInkReveal(documentRoot);
      if (routeRoot) delete routeRoot.dataset.thnVisualBTheme;
      desiredTheme = "light";
      notifyThemeChange();
    };
  }, [liveThemeTransition]);

  const applyLiveTheme = async (next: Theme, reducedMotion: boolean) => {
    const request = ++liveRequest.current;
    const root = getPreviewRoot();
    if (!root) return;
    if (reducedMotion) {
      liveTween.current?.kill();
      liveTween.current = null;
      restoreLiveStyles(root);
      commitTheme(next);
      return;
    }
    try {
      const { gsap } = await import("gsap");
      if (!mounted.current || request !== liveRequest.current) return;
      liveTween.current?.kill();
      const from: Record<string, string> = {};
      const before = getComputedStyle(root);
      LIVE_THEME_PROPERTIES.forEach((name) => {
        from[name] = before.getPropertyValue(name).trim();
        if (!liveStyles.current.has(name)) liveStyles.current.set(name, {
          value: root.style.getPropertyValue(name), priority: root.style.getPropertyPriority(name),
        });
      });
      // Read both token sets in one task; the page never paints the intermediate reset.
      root.dataset.thnLiveThemeTransitioning = "true";
      liveStyles.current.forEach(({ value, priority }, name) => {
        if (value) root.style.setProperty(name, value, priority);
        else root.style.removeProperty(name);
      });
      commitTheme(next);
      const target = getComputedStyle(root);
      const to: Record<string, string> = {};
      LIVE_THEME_PROPERTIES.forEach((name) => { to[name] = target.getPropertyValue(name).trim(); });
      gsap.set(root, from);
      liveTween.current = gsap.to(root, {
        ...to, duration: 0.9, ease: "power2.inOut",
        onComplete: () => {
          if (request !== liveRequest.current) return;
          liveTween.current = null;
          restoreLiveStyles(root);
        },
      });
    } catch {
      if (!mounted.current || request !== liveRequest.current) return;
      liveTween.current?.kill();
      liveTween.current = null;
      restoreLiveStyles(root);
      commitTheme(next);
    }
  };

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = desiredTheme === "dark" ? "light" : "dark";
    desiredTheme = next;
    notifyThemeChange();

    const documentRoot = document.documentElement;
    const transitionDocument = document as TransitionDocument;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (liveThemeTransition) {
      void applyLiveTheme(next, reducedMotion);
      return;
    }
    const supportsInkPaths = window.CSS.supports("clip-path", 'path("M 0 0 C 1 0 1 1 0 1 Z")');

    if (activeTransition.current) {
      pendingTheme.current = next;
      activeTransition.current.skipTransition();
      return;
    }

    if (!transitionDocument.startViewTransition || reducedMotion || !supportsInkPaths) {
      commitTheme(next);
      return;
    }

    documentRoot.dataset.thnVisualBTransitioning = "true";
    const bounds = event.currentTarget.getBoundingClientRect();
    prepareInkReveal(documentRoot, { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 });
    let interrupted = false;
    let transition: ThemeTransition;
    const removeInterruptListeners = () => {
      documentRoot.removeEventListener("wheel", interrupt, true);
      documentRoot.removeEventListener("touchstart", interrupt, true);
      documentRoot.removeEventListener("click", interruptForNavigation, true);
      window.removeEventListener("keydown", interruptForScroll, true);
      window.removeEventListener("hashchange", interrupt, true);
      window.removeEventListener("popstate", interrupt, true);
    };

    const interrupt = () => {
      if (interrupted) return;
      interrupted = true;
      removeInterruptListeners();
      delete documentRoot.dataset.thnVisualBTransitioning;
      clearInkReveal(documentRoot);
      transition.skipTransition();
      commitTheme(desiredTheme);
    };

    const interruptForScroll = (keyboardEvent: KeyboardEvent) => {
      const target = keyboardEvent.target;
      if (
        keyboardEvent.key === " " &&
        target instanceof Element &&
        target.closest("button, a, input, textarea, select, [contenteditable='true']")
      ) return;
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(keyboardEvent.key)) {
        interrupt();
      }
    };

    const interruptForNavigation = (mouseEvent: globalThis.MouseEvent) => {
      if (mouseEvent.target instanceof Element && mouseEvent.target.closest("a[href]")) interrupt();
    };

    try {
      transition = transitionDocument.startViewTransition(() => {
        if (mounted.current) commitTheme(desiredTheme);
      });
    } catch {
      delete documentRoot.dataset.thnVisualBTransitioning;
      clearInkReveal(documentRoot);
      commitTheme(desiredTheme);
      return;
    }

    void transition.ready?.catch(() => {});
    void transition.updateCallbackDone?.catch(() => {});
    activeTransition.current = transition;
    documentRoot.addEventListener("wheel", interrupt, { capture: true, passive: true });
    documentRoot.addEventListener("touchstart", interrupt, { capture: true, passive: true });
    documentRoot.addEventListener("click", interruptForNavigation, true);
    window.addEventListener("keydown", interruptForScroll, true);
    window.addEventListener("hashchange", interrupt, true);
    window.addEventListener("popstate", interrupt, true);

    const finishTransition = () => {
      removeInterruptListeners();
      delete documentRoot.dataset.thnVisualBTransitioning;
      clearInkReveal(documentRoot);
      if (activeTransition.current === transition) activeTransition.current = null;
      if (!mounted.current) return;
      const queued = pendingTheme.current;
      pendingTheme.current = null;
      if (queued && queued !== getPreviewRoot()?.dataset.thnVisualBTheme) {
        commitTheme(desiredTheme);
      }
    };
    void transition.finished.then(finishTransition, finishTransition);
  };

  return (
    <Button
      type="button"
      className={styles.themeToggle}
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      aria-pressed={theme === "dark"}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <Sun aria-hidden="true" focusable="false" className={`${styles.themeIcon} ${styles.themeIconSun} size-5`} />
      <Moon aria-hidden="true" focusable="false" className={`${styles.themeIcon} ${styles.themeIconMoon} size-5`} />
    </Button>
  );
}
