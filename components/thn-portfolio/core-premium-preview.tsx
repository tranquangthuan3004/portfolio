"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { PreviewProfile } from "./preview-motion";
import type { CoreMotionProfile, CoreScrollEngine } from "./core-premium-motion";
import { CoreSceneProgressContext } from "./core-scene-progress";
import styles from "./core-ui-polish.module.css";

export type CorePremiumPreviewProps = {
  children: ReactNode;
  className: string;
  id: string;
  profile?: PreviewProfile;
  clampAnchorArrival?: boolean;
  suppressHydrationWarning?: boolean;
  scrollEngine?: CoreScrollEngine;
  motionProfile?: CoreMotionProfile;
  flowStory?: boolean;
};

export function CorePremiumContentWrapper({ children }: { children: ReactNode }) {
  return (
    <div className={styles.smoothContent} data-thn-smoother-content="">
      {children}
    </div>
  );
}

export default function CorePremiumPreview({
  children,
  className,
  id,
  clampAnchorArrival = false,
  suppressHydrationWarning = false,
  scrollEngine = "scroll-smoother",
  motionProfile = "default",
  flowStory = false,
}: CorePremiumPreviewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneProgressRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let disposed = false;
    let generation = 0;
    let cleanupMotion = () => {};
    let scrollToAnchor: ((target: HTMLElement, smooth: boolean, focusTarget?: boolean) => void) | null = null;
    let pendingAnchorTarget: () => HTMLElement | null = () => null;
    let anchorRestoreIntent: { id: string } | null = null;
    let smootherReady = false;
    let historyNavigationFrame = 0;
    let interactionRootClassName: string | null = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactLayout = window.matchMedia("(max-width: 820px)");
    const initialHash = window.location.hash;
    const deepLinkHashes = new Set([
      "#about",
      "#expertise",
      "#services",
      "#stack",
      "#process",
      "#engineering",
      "#work",
      "#contact",
    ]);
    const shouldCorrectInitialAnchor = deepLinkHashes.has(initialHash);
    let initialAnchorScrollCancelled = false;
    let initialAnchorScrollQueued = false;
    let initialAnchorScrollDone = false;
    let initialAnchorFirstFrame = 0;
    let initialAnchorSecondFrame = 0;
    const interactionStylesReady = import("./core-premium-interaction-styles")
      .then(({ rootClassName }) => {
        if (!disposed) {
          interactionRootClassName = rootClassName;
          root.classList.add(rootClassName);
        }
        return !disposed;
      })
      .catch(() => false);

    const resolveHashTarget = (hash: string) => {
      if (!hash.startsWith("#") || hash.length < 2) return null;
      let id = hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        return null;
      }
      const target = root.ownerDocument.getElementById(id);
      return target && root.contains(target) ? target : null;
    };

    const cancelParkedAnchorRestore = () => {
      anchorRestoreIntent = null;
    };
    const parkedRestoreInterruptEvents: Array<[string, AddEventListenerOptions | boolean]> = [
      ["wheel", { capture: true, passive: true }],
      ["touchstart", { capture: true, passive: true }],
      ["touchmove", { capture: true, passive: true }],
      ["pointerdown", { capture: true, passive: true }],
      ["keydown", true],
      ["click", true],
      ["popstate", true],
      ["hashchange", true],
    ];
    if (scrollEngine === "lenis") {
      parkedRestoreInterruptEvents.forEach(([type, options]) =>
        window.addEventListener(type, cancelParkedAnchorRestore, options),
      );
    }

    const finishParkedAnchorNatively = () => {
      const intent = anchorRestoreIntent;
      const view = root.ownerDocument.defaultView;
      if (!intent || !view) return false;

      const expectedHash = `#${encodeURIComponent(intent.id)}`;
      const target = window.location.hash === expectedHash
        ? resolveHashTarget(window.location.hash)
        : null;
      if (!target || target.id !== intent.id) {
        anchorRestoreIntent = null;
        return false;
      }

      const scrollMargin = Number.parseFloat(view.getComputedStyle(target).scrollMarginTop) || 0;
      const requestedY = target.getBoundingClientRect().top + view.scrollY - scrollMargin;
      const documentHeight = Math.max(
        root.ownerDocument.documentElement.scrollHeight,
        root.ownerDocument.body.scrollHeight,
      );
      const maxScrollY = Math.max(0, documentHeight - view.innerHeight);
      anchorRestoreIntent = null;
      view.scrollTo({
        top: Math.min(maxScrollY, Math.max(0, requestedY)),
        behavior: "instant",
      });
      return true;
    };

    const clampFixedWrapperScroll = () => {
      if (
        !smootherReady ||
        root.scrollTop === 0 ||
        window.getComputedStyle(root).position !== "fixed"
      ) {
        return;
      }
      root.scrollTop = 0;
    };

    const scheduleHistoryNavigation = () => {
      if (!smootherReady || !scrollToAnchor) return;
      clampFixedWrapperScroll();
      if (historyNavigationFrame) cancelAnimationFrame(historyNavigationFrame);
      historyNavigationFrame = requestAnimationFrame(() => {
        historyNavigationFrame = 0;
        if (!smootherReady || !scrollToAnchor) return;
        clampFixedWrapperScroll();
        const target = window.location.hash ? resolveHashTarget(window.location.hash) : root;
        if (target) scrollToAnchor(target, true);
      });
    };

    const handleAnchorClick = (event: MouseEvent) => {
      if (
        !smootherReady ||
        !scrollToAnchor ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }
      const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = anchor?.getAttribute("href");
      const target = hash ? resolveHashTarget(hash) : null;
      if (!anchor || !hash || !target) return;

      event.preventDefault();
      cancelInitialAnchorScroll();
      if (window.location.hash !== hash) {
        window.history.pushState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
      }
      scrollToAnchor(target, true, target.id === "main-content");
    };

    const removeInitialAnchorListeners = () => {
      window.removeEventListener("wheel", cancelInitialAnchorScroll, true);
      window.removeEventListener("touchstart", cancelInitialAnchorScroll, true);
      window.removeEventListener("pointerdown", cancelInitialAnchorScroll, true);
      window.removeEventListener("keydown", cancelInitialAnchorScroll, true);
      window.removeEventListener("hashchange", cancelInitialAnchorScroll, true);
      window.removeEventListener("popstate", cancelInitialAnchorScroll, true);
      document.removeEventListener("click", cancelInitialAnchorScroll, true);
    };

    const cancelInitialAnchorScroll = () => {
      initialAnchorScrollCancelled = true;
      if (initialAnchorFirstFrame) cancelAnimationFrame(initialAnchorFirstFrame);
      if (initialAnchorSecondFrame) cancelAnimationFrame(initialAnchorSecondFrame);
      initialAnchorFirstFrame = 0;
      initialAnchorSecondFrame = 0;
      initialAnchorScrollQueued = false;
      removeInitialAnchorListeners();
    };

    const scheduleInitialAnchorScroll = (expectedGeneration: number) => {
      if (
        !shouldCorrectInitialAnchor ||
        initialAnchorScrollCancelled ||
        initialAnchorScrollQueued ||
        initialAnchorScrollDone ||
        disposed
      ) {
        return;
      }

      initialAnchorScrollQueued = true;
      initialAnchorFirstFrame = requestAnimationFrame(() => {
        initialAnchorFirstFrame = 0;
        initialAnchorSecondFrame = requestAnimationFrame(() => {
          initialAnchorSecondFrame = 0;
          initialAnchorScrollQueued = false;

          if (
            disposed ||
            initialAnchorScrollCancelled ||
            initialAnchorScrollDone ||
            expectedGeneration !== generation ||
            window.location.hash !== initialHash
          ) {
            return;
          }

          const target = resolveHashTarget(initialHash);
          if (!target) return;

          if (smootherReady && scrollToAnchor) {
            scrollToAnchor(target, false);
          } else {
            target.scrollIntoView({ behavior: "instant", block: "start" });
          }
          initialAnchorScrollDone = true;
          removeInitialAnchorListeners();
        });
      });
    };

    if (shouldCorrectInitialAnchor && !reducedMotion.matches) {
      window.addEventListener("wheel", cancelInitialAnchorScroll, { capture: true, passive: true });
      window.addEventListener("touchstart", cancelInitialAnchorScroll, { capture: true, passive: true });
      window.addEventListener("pointerdown", cancelInitialAnchorScroll, { capture: true, passive: true });
      window.addEventListener("keydown", cancelInitialAnchorScroll, true);
      window.addEventListener("hashchange", cancelInitialAnchorScroll, true);
      window.addEventListener("popstate", cancelInitialAnchorScroll, true);
      document.addEventListener("click", cancelInitialAnchorScroll, true);
    }

    const initializeMotion = async () => {
      const currentGeneration = ++generation;

      try {
        if (!(await interactionStylesReady)) {
          if (!finishParkedAnchorNatively()) scheduleInitialAnchorScroll(currentGeneration);
          return;
        }
        const premiumMotionModule = await import("./core-premium-motion");
        if (disposed || reducedMotion.matches || currentGeneration !== generation) return;

        const premiumMotion = await premiumMotionModule.mountCorePremiumMotion(root, sceneProgressRef, {
          clampAnchorArrival,
          scrollEngine,
          motionProfile,
        });
        if (disposed || reducedMotion.matches || currentGeneration !== generation) {
          premiumMotion.cleanup();
          return;
        }
        cleanupMotion = premiumMotion.cleanup;
        pendingAnchorTarget = premiumMotion.pendingAnchorTarget;
        scrollToAnchor = premiumMotion.scrollToAnchor;
        smootherReady = true;
        clampFixedWrapperScroll();
        const restoreIntent = anchorRestoreIntent;
        if (restoreIntent) {
          const expectedHash = `#${encodeURIComponent(restoreIntent.id)}`;
          if (window.location.hash === expectedHash) {
            const target = resolveHashTarget(window.location.hash);
            if (target?.id === restoreIntent.id && anchorRestoreIntent === restoreIntent) {
              premiumMotion.refresh();
              premiumMotion.scrollToAnchor(target, true);
              anchorRestoreIntent = null;
            }
          } else {
            anchorRestoreIntent = null;
          }
        }
        if (shouldCorrectInitialAnchor) {
          void document.fonts.ready.then(() => {
            if (!disposed && currentGeneration === generation) {
              premiumMotion.refresh();
              scheduleInitialAnchorScroll(currentGeneration);
            }
          });
        }
      } catch (error) {
        console.error("THN. CORE motion failed to initialize.", error);
        if (!finishParkedAnchorNatively()) scheduleInitialAnchorScroll(currentGeneration);
      }
    };

    const resetMotion = () => {
      generation += 1;
      cleanupMotion();
      cleanupMotion = () => {};
      scrollToAnchor = null;
      pendingAnchorTarget = () => null;
      smootherReady = false;
      if (reducedMotion.matches) sceneProgressRef.current = 0;
      if (!reducedMotion.matches) void initializeMotion();
    };

    const handleCompactLayoutChange = () => {
      if (scrollEngine === "lenis" && smootherReady) {
        const pendingTarget = pendingAnchorTarget();
        const targetHash = pendingTarget ? `#${encodeURIComponent(pendingTarget.id)}` : null;
        anchorRestoreIntent = targetHash === window.location.hash && pendingTarget
          ? { id: pendingTarget.id }
          : null;
      }
      resetMotion();
    };

    const handleReducedMotionChange = () => {
      if (scrollEngine === "lenis" && reducedMotion.matches && smootherReady && !anchorRestoreIntent) {
        const pendingTarget = pendingAnchorTarget();
        const targetHash = pendingTarget ? `#${encodeURIComponent(pendingTarget.id)}` : null;
        if (pendingTarget && targetHash === window.location.hash) {
          anchorRestoreIntent = { id: pendingTarget.id };
        }
      }
      resetMotion();
      if (scrollEngine === "lenis" && reducedMotion.matches) finishParkedAnchorNatively();
    };

    reducedMotion.addEventListener("change", handleReducedMotionChange);
    compactLayout.addEventListener("change", handleCompactLayoutChange);
    root.addEventListener("click", handleAnchorClick);
    root.addEventListener("scroll", clampFixedWrapperScroll, { passive: true });
    window.addEventListener("popstate", scheduleHistoryNavigation);
    window.addEventListener("hashchange", scheduleHistoryNavigation);
    if (!reducedMotion.matches) void initializeMotion();

    return () => {
      disposed = true;
      generation += 1;
      cancelInitialAnchorScroll();
      reducedMotion.removeEventListener("change", handleReducedMotionChange);
      compactLayout.removeEventListener("change", handleCompactLayoutChange);
      root.removeEventListener("click", handleAnchorClick);
      root.removeEventListener("scroll", clampFixedWrapperScroll);
      window.removeEventListener("popstate", scheduleHistoryNavigation);
      window.removeEventListener("hashchange", scheduleHistoryNavigation);
      if (historyNavigationFrame) cancelAnimationFrame(historyNavigationFrame);
      if (scrollEngine === "lenis") {
        parkedRestoreInterruptEvents.forEach(([type, options]) =>
          window.removeEventListener(type, cancelParkedAnchorRestore, options),
        );
      }
      anchorRestoreIntent = null;
      cleanupMotion();
      pendingAnchorTarget = () => null;
      if (interactionRootClassName) root.classList.remove(interactionRootClassName);
      sceneProgressRef.current = 0;
    };
  }, [clampAnchorArrival, motionProfile, scrollEngine]);

  return (
    <CoreSceneProgressContext.Provider value={sceneProgressRef}>
      <div
        ref={rootRef}
        className={`${className} ${styles.root}`}
        id={id}
        data-thn-preview=""
        data-thn-scroll-engine={scrollEngine === "lenis" ? "lenis" : undefined}
        data-thn-motion-profile={motionProfile === "refined" ? motionProfile : undefined}
        data-thn-flow-story={flowStory ? "" : undefined}
        suppressHydrationWarning={suppressHydrationWarning}
      >
        {children}
      </div>
    </CoreSceneProgressContext.Provider>
  );
}

export function CoreV2PreviewMotion(
  props: Omit<CorePremiumPreviewProps, "clampAnchorArrival" | "scrollEngine" | "motionProfile">,
) {
  return (
    <CorePremiumPreview
      {...props}
      clampAnchorArrival
      motionProfile="refined"
      scrollEngine="lenis"
    />
  );
}
