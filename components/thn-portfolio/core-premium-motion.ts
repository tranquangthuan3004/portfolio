import { observeCoreProgress } from "./core-progress";
import type { CoreSceneProgressRef } from "./core-scene-progress";

export type CoreScrollEngine = "scroll-smoother" | "lenis";
export type CoreMotionProfile = "default" | "refined";

const MOTION = {
  heroReveal: 0.92,
  heroStagger: 0.072,
  sectionSequence: 0.84,
  compactReveal: 0.62,
  rowTravel: 8,
  processTravel: 64,
  compactProcessTravel: 16,
  processStartOpacity: 0.2,
  compactProcessStartOpacity: 0.72,
  processEntranceDelay: 0.25,
  processEntranceDuration: 0.9,
  timeEase: "power3.out",
} as const;

const REFINED_MOTION = {
  ...MOTION,
  heroReveal: 0.82,
  heroStagger: 0.064,
  sectionSequence: 0.76,
  compactReveal: 0.56,
  rowTravel: 7,
  processTravel: 56,
  compactProcessTravel: 14,
  processStartOpacity: 0.3,
  compactProcessStartOpacity: 0.8,
  processEntranceDelay: 0.24,
  processEntranceDuration: 0.82,
} as const;

const SCROLL = {
  lenisLerp: 0.12,
  wheelMultiplier: 1,
} as const;

const headingEnd = { x: 0, opacity: 1, clipPath: "inset(-10% 0% -15% 0%)" };
const revealedTypographyByRoot = new WeakMap<HTMLElement, Set<string>>();
const TYPOGRAPHY = {
  wheelDelay: 0.3,
  anchorDelay: 1,
  headingDuration: 0.8,
  supportDelay: 0.94,
  supportDuration: 0.46,
  viewportStart: 0.73,
  lineStagger: 0.11,
  supportStagger: 0,
  wordStagger: 0.055,
} as const;

const REFINED_TYPOGRAPHY = {
  ...TYPOGRAPHY,
  wheelDelay: 0.28,
  headingDuration: 0.68,
  supportDelay: 0.22,
  supportDuration: 0.4,
  lineStagger: 0.095,
  supportStagger: 0.075,
  wordStagger: 0.05,
} as const;

const REFINED_HANDOFF = {
  entryViewport: 0.84,
  compactEntryViewport: 0.82,
  supportAt: 0.22,
  folioTravel: 6,
} as const;

type HeadingPreset = "left" | "right" | "bottom" | "maskedLine" | "wordStagger";

type TypographyReveal = {
  schedule: (delay?: number, onStart?: () => void) => void;
  complete: () => void;
  settle: () => void;
  cancel: () => void;
  prepareForAnchor: () => void;
  resumeSuppressed: () => void;
};

type PendingAnchorReveal = {
  target: HTMLElement;
  reveal: TypographyReveal | null;
  startedAt: number;
  expectedTop: number;
  expectedScrollY: number | null;
  lastTop: number;
  lastScrollY: number;
  stableSince: number | null;
  stopObservedAt: number | null;
  deadlineAt: number;
  poll: (now: number) => void;
  frame: number;
  timeout: number;
};

function splitHeadingWords(element: HTMLElement) {
  const document = element.ownerDocument;
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(element, 4);
  let current = walker.nextNode();

  while (current) {
    if (current.nodeType === 3 && current.textContent?.trim()) textNodes.push(current as Text);
    current = walker.nextNode();
  }

  const words: HTMLElement[] = [];
  const replacements: Array<{ parent: Node; original: Text; generated: Node[] }> = [];

  textNodes.forEach((original) => {
    const parent = original.parentNode;
    if (!parent) return;
    const fragment = document.createDocumentFragment();
    const tokens = original.textContent?.match(/\s+|[^\s]+/gu) ?? [];

    tokens.forEach((token) => {
      if (/^\s+$/u.test(token)) {
        fragment.appendChild(document.createTextNode(token));
        return;
      }

      const word = document.createElement("span");
      word.dataset.thnMotionWord = "";
      word.textContent = token;
      words.push(word);
      fragment.appendChild(word);
    });

    const generated = Array.from(fragment.childNodes);
    parent.replaceChild(fragment, original);
    replacements.push({ parent, original, generated });
  });

  let restored = false;
  return {
    words,
    restore: () => {
      if (restored) return;
      restored = true;
      [...replacements].reverse().forEach(({ parent, original, generated }) => {
        const first = generated.find((node) => node.parentNode === parent);
        if (!first) return;
        parent.insertBefore(original, first);
        generated.forEach((node) => {
          if (node.parentNode === parent) parent.removeChild(node);
        });
      });
    },
  };
}

type MotionTimeline = {
  progress: (value: number, suppressEvents?: boolean) => unknown;
};

type ScrollRange = {
  timeline: MotionTimeline;
  startElement: HTMLElement;
  startEdge: "top" | "bottom";
  startViewport: number;
  endElement: HTMLElement;
  endEdge: "top" | "bottom";
  endViewport: number;
  startY: number;
  endY: number;
  lastProgress: number | null;
};

type MotionHandle = {
  cleanup: () => void;
  refresh: () => void;
  scrollToAnchor: (target: HTMLElement, smooth: boolean, focusTarget?: boolean) => void;
  pendingAnchorTarget: () => HTMLElement | null;
};

type ScrollOwner = {
  scrollTop: () => number;
  scrollTo: (target: HTMLElement | number, smooth: boolean, position?: string) => void;
  interrupt?: () => void;
  kill: () => void;
};

export async function mountCorePremiumMotion(
  root: HTMLElement,
  sceneProgressRef: CoreSceneProgressRef,
  options: {
    clampAnchorArrival?: boolean;
    scrollEngine?: CoreScrollEngine;
    motionProfile?: CoreMotionProfile;
  } = {},
): Promise<MotionHandle> {
  const clampAnchorArrival = options.clampAnchorArrival ?? false;
  const scrollEngine = options.scrollEngine ?? "scroll-smoother";
  const motionProfile = options.motionProfile ?? "default";
  const motion = motionProfile === "refined" ? REFINED_MOTION : MOTION;
  const typography = motionProfile === "refined" ? REFINED_TYPOGRAPHY : TYPOGRAPHY;
  const [gsapModule, scrollTriggerModule, scrollEngineModule] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    scrollEngine === "lenis" ? import("lenis") : import("gsap/ScrollSmoother"),
  ]);
  const { gsap } = gsapModule;
  const { ScrollTrigger } = scrollTriggerModule;
  const ScrollSmoother = scrollEngine === "scroll-smoother"
    ? (scrollEngineModule as typeof import("gsap/ScrollSmoother")).ScrollSmoother
    : null;
  const Lenis = scrollEngine === "lenis"
    ? (scrollEngineModule as typeof import("lenis")).default
    : null;
  gsap.registerPlugin(ScrollTrigger);
  if (ScrollSmoother) gsap.registerPlugin(ScrollSmoother);

  let active = true;
  const scrollOwnerRef = { current: null as ScrollOwner | null };
  let pendingFocusTarget: HTMLElement | null = null;
  let pendingTopNavigation = false;
  const previouslyRevealed = revealedTypographyByRoot.get(root) ?? new Set<string>();
  revealedTypographyByRoot.set(root, previouslyRevealed);
  const typographyReveals = new Map<string, TypographyReveal>();
  const anchorTypography = new Map<string, TypographyReveal>();
  let pendingAnchorReveal: PendingAnchorReveal | null = null;
  let startAnchorArrival: (
    target: HTMLElement,
    reveal: TypographyReveal | null,
    offset: number,
  ) => void = () => {};
  let cancelAnchorArrival: () => void = () => {};
  let notifyAnchorStop = () => {};
  let scheduleScroll: (
    target: HTMLElement | number,
    smooth: boolean,
    position?: string,
    onResolved?: (effectiveScrollY: number) => void,
  ) => void = () => {};
  let settleTypography: (preserve?: TypographyReveal | null) => void = () => {};
  let resumeSuppressedTypography = () => {};
  let disposeTypography = () => {};
  let releaseCoreProgress = () => {};
  let updateAboutHandoff: (progress: number) => void = () => {};
  let refreshScrollRanges = () => {};
  let updateScrollRanges: (scrollY: number) => void = () => {};
  const textSplitRestorers: Array<() => void> = [];
  const interactionDisposers: Array<() => void> = [];
  const restoreSplitWords = () => {
    textSplitRestorers.splice(0).reverse().forEach((restore) => restore());
  };
  const context = gsap.context(() => {}, root);
  try {
    context.add(() => {
    const smoothContent = root.querySelector<HTMLElement>("[data-thn-smoother-content]");
    if (!smoothContent) throw new Error("Core smooth content wrapper is missing.");
    if (Lenis) {
      const lenis = new Lenis({
        anchors: false,
        autoRaf: false,
        lerp: SCROLL.lenisLerp,
        respectReducedMotion: true,
        smoothWheel: true,
        stopInertiaOnNavigate: true,
        syncTouch: false,
        wheelMultiplier: SCROLL.wheelMultiplier,
      });
      const onLenisScroll = () => {
        ScrollTrigger.update();
        if (lenis.isScrolling !== false) return;
        notifyAnchorStop();
        if (pendingTopNavigation && Math.abs(lenis.animatedScroll) <= 1.5) {
          pendingTopNavigation = false;
        }
        const target = pendingFocusTarget;
        pendingFocusTarget = null;
        target?.focus({ preventScroll: true });
      };
      const tickLenis = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", onLenisScroll);
      gsap.ticker.lagSmoothing(0);
      gsap.ticker.add(tickLenis);
      scrollOwnerRef.current = {
        scrollTop: () => lenis.animatedScroll,
        scrollTo: (target, smooth) => lenis.scrollTo(target, { immediate: !smooth }),
        interrupt: () => lenis.scrollTo(lenis.animatedScroll, { immediate: true }),
        kill: () => {
          lenis.off("scroll", onLenisScroll);
          gsap.ticker.remove(tickLenis);
          gsap.ticker.lagSmoothing(500, 33);
          lenis.destroy();
        },
      };
    } else {
      if (!ScrollSmoother) throw new Error("Core scroll owner is unavailable.");
      const smoother = ScrollSmoother.create({
        wrapper: root,
        content: smoothContent,
        smooth: 1,
        smoothTouch: 0,
        effects: false,
        onStop: () => {
          notifyAnchorStop();
          const target = pendingFocusTarget;
          pendingFocusTarget = null;
          target?.focus({ preventScroll: true });
        },
        onFocusIn: (_instance, event) =>
          event.target === root.querySelector<HTMLElement>("#main-content") ? false : undefined,
      });
      scrollOwnerRef.current = {
        scrollTop: () => smoother.scrollTop(),
        scrollTo: (target, smooth, position) => smoother.scrollTo(target, smooth, position),
        kill: () => smoother.kill(),
      };
    }

    const hero = root.querySelector<HTMLElement>("#hero");
    const brand = root.querySelector<HTMLElement>("[data-thn-premium-brand]");
    const role = root.querySelector<HTMLElement>("[data-thn-premium-role]");
    const name = root.querySelector<HTMLElement>("[data-thn-premium-name]");
    const education = root.querySelector<HTMLElement>("[data-thn-premium-education]");
    const bio = root.querySelector<HTMLElement>("[data-thn-premium-bio]");
    const actions = root.querySelector<HTMLElement>("[data-thn-premium-actions]");
    const stage = root.querySelector<HTMLElement>("[data-thn-premium-stage]");
    const light = root.querySelector<HTMLElement>("[data-thn-premium-light]");
    const shadow = root.querySelector<HTMLElement>("[data-thn-premium-shadow]");
    const toolLine = root.querySelector<HTMLElement>("[data-thn-premium-tool-line]");
    const compactLayout = root.ownerDocument.defaultView?.matchMedia("(max-width: 820px)").matches ?? false;
    const deepLink = [
      "#about", "#expertise", "#services", "#stack", "#process", "#engineering", "#work", "#contact",
    ].includes(root.ownerDocument.defaultView?.location.hash ?? "");

    if (hero && brand && role && name && education && bio && actions && stage && !deepLink) {
      const heroNameSplit = motionProfile === "refined" ? splitHeadingWords(name) : null;
      if (heroNameSplit) textSplitRestorers.push(heroNameSplit.restore);
      const brandParts = motionProfile === "refined"
        ? Array.from(brand.querySelectorAll<HTMLElement>("[data-thn-mark-part]"))
        : [];
      const nameTargets = heroNameSplit?.words ?? [name];
      const introFrom = (distance: number) => motionProfile === "refined"
        ? { x: 0, y: compactLayout ? 4 : 7, opacity: 0.82 }
        : { x: distance };
      const introEnd = motionProfile === "refined" ? { y: 0, opacity: 1 } : {};
      const entrance = gsap.timeline({ defaults: { ease: motion.timeEase } });
      entrance
        .fromTo(brand, { x: -10, y: 2 }, { x: 0, y: 0, duration: motion.heroReveal * 0.9 }, 0)
        .fromTo(role, { x: -8 }, { x: 0, duration: motion.heroReveal * 0.82 }, motion.heroStagger)
        .fromTo(nameTargets, { y: 10, clipPath: "inset(0 0 4% 0)" }, {
          y: 0,
          clipPath: "inset(0 0 0 0)",
          duration: motion.heroReveal,
          stagger: heroNameSplit ? motion.heroStagger * 0.72 : 0,
        }, motion.heroStagger * 2)
        .fromTo(education, introFrom(10), { x: 0, ...introEnd, duration: motion.heroReveal * 0.94 }, motion.heroStagger * 3)
        .fromTo(bio, introFrom(12), { x: 0, ...introEnd, duration: motion.heroReveal * 0.98 }, motion.heroStagger * 4)
        .fromTo(actions, { y: 7 }, { y: 0, duration: motion.heroReveal * 0.88 }, motion.heroStagger * 5)
        .fromTo(stage, { y: 12 }, { y: 0, duration: motion.heroReveal * 1.1 }, motion.heroStagger);

      if (brandParts.length) {
        entrance.fromTo(brandParts, { y: 4, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: motion.heroReveal * 0.72,
          stagger: motion.heroStagger * 1.15,
        }, 0.04);
      }
      if (light) entrance.fromTo(light, { scale: 0.97, opacity: 0.62 }, { scale: 1, opacity: 1, duration: motion.heroReveal }, 0.08);
      if (shadow) entrance.fromTo(shadow, { scaleX: 0.94, opacity: 0.72 }, { scaleX: 1, opacity: 1, duration: motion.heroReveal }, 0.2);
      if (toolLine) entrance.fromTo(toolLine, { x: motion.rowTravel }, { x: 0, duration: motion.compactReveal }, 0.38);
      const cinematicLight = hero.querySelector<HTMLElement>("[data-thn-cinematic-light]");
      if (cinematicLight) entrance.fromTo(cinematicLight, { opacity: 0.4 }, {
        opacity: 1, duration: motion.heroReveal, ease: motion.timeEase,
      }, 0);
      const aperture = hero.querySelector<HTMLElement>("[data-thn-cinematic-aperture]");
      if (aperture) entrance.fromTo(aperture, {
        clipPath: compactLayout ? "inset(2% 3% 2% 3%)" : "inset(5% 7% 5% 7%)",
        scale: 0.98,
      }, {
        clipPath: "inset(0% 0% 0% 0%)", scale: 1,
        duration: 1, ease: motion.timeEase,
      }, 0.02);
    }

    const addHeadingEntry = (
      key: string,
      trigger: HTMLElement,
      targets: HTMLElement[],
      preset: HeadingPreset,
      supportTargets: HTMLElement[] = [],
      entry: { viewport?: number; supportAt?: number } = {},
    ): TypographyReveal | null => {
      if (!targets.length) return null;
      const view = root.ownerDocument.defaultView;
      if (!view) return null;
      const entryViewport = entry.viewport ?? typography.viewportStart;
      const timeline = gsap.timeline({ paused: true });
      const alreadyRevealed = previouslyRevealed.has(key);
      const addTreatment = (
        treatmentTargets: HTMLElement[],
        treatment: HeadingPreset,
        support: boolean,
        at: number,
      ) => {
        if (!treatmentTargets.length) return;
        // Supporting information must not leave an apparently empty column while headings wait.
        const opacity = support && motionProfile === "refined" ? 1 : 0;
        const distance = support ? (compactLayout ? 3 : 5) : (compactLayout ? 14 : 24);
        const duration = support ? typography.supportDuration : typography.headingDuration;
        const to = { opacity: 1, duration, ease: motion.timeEase };

        if (treatment === "left" || treatment === "right") {
          if (!alreadyRevealed) {
            gsap.set(treatmentTargets, {
              opacity,
              x: treatment === "left" ? -distance : distance,
            });
          }
          timeline.to(treatmentTargets, { ...to, x: 0, stagger: support ? typography.supportStagger : 0 }, at);
        } else if (treatment === "maskedLine") {
          const verticalMask = motionProfile === "refined";
          if (!alreadyRevealed) {
            gsap.set(treatmentTargets, {
              opacity,
              clipPath: verticalMask ? "inset(0% -2% 100% -2%)" : "inset(-12% 0% -18% 100%)",
              ...(verticalMask ? { y: compactLayout ? 6 : 10 } : {}),
            });
          }
          timeline.to(treatmentTargets, {
            ...to,
            clipPath: verticalMask ? "inset(-12% -2% -18% -2%)" : "inset(-12% 0% -18% 0%)",
            ...(verticalMask ? { y: 0 } : {}),
            stagger: support ? typography.supportStagger : typography.lineStagger,
          }, at);
        } else if (treatment === "wordStagger") {
          gsap.set(treatmentTargets, { display: "inline-block", verticalAlign: "baseline" });
          if (!alreadyRevealed) {
            gsap.set(treatmentTargets, {
              opacity,
              y: support ? 3 : (compactLayout ? 8 : 12),
            });
          }
          timeline.to(treatmentTargets, {
            ...to,
            y: 0,
            stagger: support ? typography.supportStagger : typography.wordStagger,
          }, at);
        } else {
          if (!alreadyRevealed) {
            gsap.set(treatmentTargets, {
              opacity,
              y: support ? 3 : (compactLayout ? 10 : 18),
            });
          }
          timeline.to(treatmentTargets, { ...to, y: 0, stagger: support ? typography.supportStagger : 0 }, at);
        }
      };

      addTreatment(targets, preset, false, 0);
      addTreatment(supportTargets, "bottom", true, entry.supportAt ?? typography.supportDelay);

      let state: "idle" | "waiting" | "playing" | "done" = alreadyRevealed ? "done" : "idle";
      let suppressedByAnchor = false;
      const revealTargets = [...targets, ...supportTargets];
      const stickyHeader = root.querySelector<HTMLElement>("header");
      const allTargetsOutsideViewport = () => {
        const visibleTop = Math.max(0, stickyHeader?.getBoundingClientRect().bottom ?? 0);
        return revealTargets.every((target) => {
          const bounds = target.getBoundingClientRect();
          return bounds.bottom <= visibleTop || bounds.top >= view.innerHeight;
        });
      };
      const anyTargetMeaningfullyVisible = () => {
        const visibleTop = Math.max(0, stickyHeader?.getBoundingClientRect().bottom ?? 0);
        return revealTargets.some((target) => {
          const bounds = target.getBoundingClientRect();
          return bounds.bottom > visibleTop && bounds.top < view.innerHeight * entryViewport;
        });
      };
      timeline.eventCallback("onComplete", () => {
        state = "done";
        suppressedByAnchor = false;
        previouslyRevealed.add(key);
      });
      let delayTimer = 0;
      const clearDelay = () => {
        if (!delayTimer) return;
        view.clearTimeout(delayTimer);
        delayTimer = 0;
      };
      const complete = () => {
        if (state === "done") return;
        clearDelay();
        state = "done";
        suppressedByAnchor = false;
        previouslyRevealed.add(key);
        timeline.pause();
        timeline.progress(1, false);
      };
      const schedule = (delay: number = typography.wheelDelay, onStart?: () => void) => {
        if (state !== "idle") {
          onStart?.();
          return;
        }
        if (pendingAnchorReveal && !onStart) {
          suppressedByAnchor = true;
          return;
        }
        suppressedByAnchor = false;
        state = "waiting";
        delayTimer = view.setTimeout(() => {
          delayTimer = 0;
          if (!active) return;
          if (allTargetsOutsideViewport()) {
            complete();
            onStart?.();
            return;
          }
          onStart?.();
          state = "playing";
          timeline.play();
        }, Math.max(0, delay * 1000));
      };
      const settle = () => {
        if (state === "done") return;
        if (allTargetsOutsideViewport()) {
          complete();
          return;
        }
        if (state === "waiting") {
          clearDelay();
          state = "playing";
          timeline.play();
          return;
        }
        if (state === "idle" && anyTargetMeaningfullyVisible()) {
          suppressedByAnchor = false;
          schedule(0);
        }
      };
      const cancel = () => {
        clearDelay();
        timeline.pause();
      };
      const prepareForAnchor = () => {
        if (state === "waiting") {
          clearDelay();
          state = "idle";
        } else if (state === "playing") {
          timeline.pause();
          state = "idle";
        }
        suppressedByAnchor = false;
      };
      const resumeSuppressed = () => {
        if (!active || !suppressedByAnchor || state !== "idle" || pendingAnchorReveal) return;
        const bounds = trigger.getBoundingClientRect();
        if (
          bounds.bottom <= (stickyHeader?.getBoundingClientRect().bottom ?? 0) ||
          bounds.top >= view.innerHeight * entryViewport
        ) return;
        schedule();
      };

      if (state === "done") {
        timeline.progress(1, false);
      } else {
        ScrollTrigger.create({
          trigger,
          start: `top ${entryViewport * 100}%`,
          end: "bottom top",
          onEnter: () => schedule(),
          onEnterBack: () => schedule(),
          onLeave: () => {
            if ((state === "waiting" || state === "playing") && allTargetsOutsideViewport()) complete();
          },
          onLeaveBack: () => {
            if ((state === "waiting" || state === "playing") && allTargetsOutsideViewport()) complete();
          },
          onUpdate: (self) => {
            if ((state === "waiting" || state === "playing") && allTargetsOutsideViewport()) {
              complete();
              return;
            }
            if (self.isActive && suppressedByAnchor && !pendingAnchorReveal) resumeSuppressed();
          },
          invalidateOnRefresh: true,
        });
      }

      const reveal = { schedule, complete, settle, cancel, prepareForAnchor, resumeSuppressed };
      typographyReveals.set(key, reveal);
      return reveal;
    };

    const about = root.querySelector<HTMLElement>("#about");
    const aboutHeading = root.querySelector<HTMLElement>("[data-thn-about-heading]");
    const aboutLines = aboutHeading
      ? Array.from(aboutHeading.querySelectorAll<HTMLElement>("[data-thn-about-line]"))
      : [];
    const aboutAside = aboutHeading?.parentElement?.parentElement?.lastElementChild;
    const aboutSupport = aboutAside?.lastElementChild?.querySelector<HTMLElement>("p") ?? null;
    const folioRule = root.querySelector<HTMLElement>("[data-thn-folio-rule]");
    let sceneMotionEndScrollY = 200;
    let aboutHandoffStart = 0.66;
    let aboutHandoffEnd = 0.98;
    if (about && aboutHeading) {
      const sequence = gsap.timeline({ paused: true });
      const refinedHandoff = motionProfile === "refined";
      if (folioRule) sequence.fromTo(folioRule, { scaleX: 0.88 }, { scaleX: 1, duration: motion.compactReveal, ease: "none" }, 0.18);
      const heroIdentity = refinedHandoff ? hero?.querySelector<HTMLElement>(compactLayout
        ? "[data-thn-interactive-layout] > div:first-child > div:last-child"
        : "[data-thn-interactive-layout] > div:first-child") : null;
      if (heroIdentity) sequence.fromTo(heroIdentity, { y: 0 }, {
        y: compactLayout ? -REFINED_HANDOFF.folioTravel / 2 : -REFINED_HANDOFF.folioTravel,
        duration: motion.compactReveal,
        ease: "none",
      }, 0.18);
      const folioLabel = refinedHandoff ? about.querySelector<HTMLElement>("[data-thn-folio-band] p") : null;
      if (folioLabel) sequence.fromTo(folioLabel, {
        y: compactLayout ? REFINED_HANDOFF.folioTravel / 2 : REFINED_HANDOFF.folioTravel,
      }, { y: 0, duration: motion.compactReveal, ease: "none" }, 0.18);
      updateAboutHandoff = (heroProgress) => {
        const normalized = Math.max(0, Math.min(1, (heroProgress - aboutHandoffStart) / (aboutHandoffEnd - aboutHandoffStart)));
        sequence.progress(normalized, false);
      };
      const reveal = addHeadingEntry(
        "about",
        aboutHeading,
        aboutLines,
        "maskedLine",
        aboutSupport ? [aboutSupport] : [],
      );
      if (reveal) anchorTypography.set("about", reveal);
    }

    const scrollRanges: ScrollRange[] = [];
    const addScrollRange = (
      timeline: MotionTimeline,
      startElement: HTMLElement,
      startEdge: ScrollRange["startEdge"],
      startViewport: number,
      endElement: HTMLElement,
      endEdge: ScrollRange["endEdge"],
      endViewport: number,
    ) => {
      scrollRanges.push({
        timeline,
        startElement,
        startEdge,
        startViewport,
        endElement,
        endEdge,
        endViewport,
        startY: 0,
        endY: 1,
        lastProgress: null,
      });
    };
    refreshScrollRanges = () => {
      const view = root.ownerDocument.defaultView;
      if (!view) return;
      const visualScrollY = scrollOwnerRef.current?.scrollTop() ?? view.scrollY;

      scrollRanges.forEach((range) => {
        const startRect = range.startElement.getBoundingClientRect();
        const endRect = range.endElement.getBoundingClientRect();
        const startEdge = range.startEdge === "top" ? startRect.top : startRect.bottom;
        const endEdge = range.endEdge === "top" ? endRect.top : endRect.bottom;
        range.startY = startEdge + visualScrollY - view.innerHeight * range.startViewport;
        range.endY = Math.max(
          range.startY + 1,
          endEdge + visualScrollY - view.innerHeight * range.endViewport,
        );
        range.lastProgress = null;
      });
    };
    updateScrollRanges = (scrollY) => {
      scrollRanges.forEach((range) => {
        const rawProgress = (scrollY - range.startY) / (range.endY - range.startY);
        const progress = rawProgress <= 0 ? 0 : rawProgress >= 1 ? 1 : rawProgress;
        if (range.lastProgress === progress) return;
        range.lastProgress = progress;
        range.timeline.progress(progress, false);
      });
    };

    // Keep scroll depth and pointer response on separate inner portrait layers.
    const portraitDepth = motionProfile === "refined"
      ? hero?.querySelector<HTMLElement>("[data-thn-portrait-depth]") : null;
    const portraitPointer = portraitDepth?.querySelector<HTMLElement>("[data-thn-portrait-pointer]");
    if (hero && portraitDepth && portraitPointer) {
      const cinematicSpace = hero.querySelector<HTMLElement>("[data-thn-cinematic-space]");
      const cinematicPortal = hero.querySelector<HTMLElement>("[data-thn-cinematic-portal]");
      const cinematicFrame = hero.querySelector<HTMLElement>("[data-thn-cinematic-frame]");
      const cinematicLight = hero.querySelector<HTMLElement>("[data-thn-cinematic-light]");
      const depth = gsap.timeline({ paused: true });
      depth.fromTo(portraitDepth, { y: 0 }, {
        y: compactLayout ? -4 : -12, duration: 1, ease: "none",
      });
      if (cinematicSpace) depth.fromTo(cinematicSpace, { y: 0, scale: 1 }, {
        y: compactLayout ? -4 : -16, x: compactLayout ? 0 : -12,
        scale: compactLayout ? 1.01 : 1.07,
        duration: 1, ease: "none",
      }, 0);
      if (cinematicPortal) depth.fromTo(cinematicPortal, { y: 0, scale: 1 }, {
        y: compactLayout ? -8 : -30, scale: compactLayout ? 0.98 : 0.9,
        duration: 1, ease: "none",
      }, 0);
      const nearGate = cinematicFrame?.querySelector<HTMLElement>('[data-thn-spatial-gate="near"]');
      const farGate = cinematicFrame?.querySelector<HTMLElement>('[data-thn-spatial-gate="far"]');
      if (nearGate) depth.fromTo(nearGate, { scale: 1, y: 0 }, {
        scale: compactLayout ? 1.025 : 1.12, y: compactLayout ? -3 : -18,
        duration: 1, ease: "none",
      }, 0);
      if (farGate) depth.fromTo(farGate, { scale: 1 }, {
        scale: compactLayout ? 0.99 : 0.96, duration: 1, ease: "none",
      }, 0);
      addScrollRange(depth, hero, "top", 0, hero, "bottom", 0.18);
      const threshold = hero.querySelector<HTMLElement>("[data-thn-cinematic-threshold]");
      if (threshold) {
        const handoff = gsap.timeline({ paused: true });
        handoff.fromTo(threshold, { yPercent: 100 }, { yPercent: 0, duration: 1, ease: "none" });
        addScrollRange(handoff, hero, "bottom", 0.95, hero, "bottom", 0.2);
      }
      const view = root.ownerDocument.defaultView;
      const pointerQuery = view?.matchMedia("(hover: hover) and (pointer: fine)");
      const frame = portraitDepth.parentElement;
      if (view && pointerQuery && frame) {
        const xTo = gsap.quickTo(portraitPointer, "x", { duration: 0.45, ease: "power3.out" });
        const yTo = gsap.quickTo(portraitPointer, "y", { duration: 0.45, ease: "power3.out" });
        const scaleXTo = gsap.quickTo(portraitPointer, "scaleX", { duration: 0.55, ease: "power3.out" });
        const scaleYTo = gsap.quickTo(portraitPointer, "scaleY", { duration: 0.55, ease: "power3.out" });
        const frameXTo = cinematicFrame ? gsap.quickTo(cinematicFrame, "x", { duration: 0.55, ease: "power3.out" }) : null;
        const frameYTo = cinematicFrame ? gsap.quickTo(cinematicFrame, "rotationY", { duration: 0.55, ease: "power3.out" }) : null;
        const frameTiltTo = cinematicFrame ? gsap.quickTo(cinematicFrame, "rotationX", { duration: 0.55, ease: "power3.out" }) : null;
        const lightXTo = cinematicLight ? gsap.quickTo(cinematicLight, "x", { duration: 0.6, ease: "power3.out" }) : null;
        const lightYTo = cinematicLight ? gsap.quickTo(cinematicLight, "y", { duration: 0.6, ease: "power3.out" }) : null;
        let bounds: DOMRect | null = null;
        let measuredScrollY = 0;
        const resetPortrait = () => {
          bounds = null;
          xTo(0); yTo(0); scaleXTo(1); scaleYTo(1);
          frameXTo?.(0); frameYTo?.(-10); frameTiltTo?.(3);
          lightXTo?.(0); lightYTo?.(0);
        };
        const enterPortrait = (event: PointerEvent) => {
          if (!pointerQuery.matches || event.pointerType === "touch") return;
          bounds = frame.getBoundingClientRect();
          measuredScrollY = view.scrollY;
          scaleXTo(1.025); scaleYTo(1.025);
        };
        const movePortrait = (event: PointerEvent) => {
          if (!bounds || !pointerQuery.matches || event.pointerType === "touch") return;
          const px = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
          const py = Math.max(-1, Math.min(1,
            (event.clientY - bounds.top + view.scrollY - measuredScrollY) / bounds.height * 2 - 1));
          xTo(px * 8); yTo(py * 8);
          frameXTo?.(-px * 4); frameYTo?.(-10 + px * 2); frameTiltTo?.(3 - py * 1.5);
          lightXTo?.(-px * 24); lightYTo?.(-py * 12);
        };
        frame.addEventListener("pointerenter", enterPortrait);
        frame.addEventListener("pointermove", movePortrait);
        frame.addEventListener("pointerleave", resetPortrait);
        frame.addEventListener("pointercancel", resetPortrait);
        view.addEventListener("resize", resetPortrait);
        pointerQuery.addEventListener("change", resetPortrait);
        interactionDisposers.push(() => {
          frame.removeEventListener("pointerenter", enterPortrait);
          frame.removeEventListener("pointermove", movePortrait);
          frame.removeEventListener("pointerleave", resetPortrait);
          frame.removeEventListener("pointercancel", resetPortrait);
          view.removeEventListener("resize", resetPortrait);
          pointerQuery.removeEventListener("change", resetPortrait);
        });
      }
    }

    const expertise = root.querySelector<HTMLElement>("#expertise");
    const expertiseHeading = root.querySelector<HTMLElement>("[data-thn-expertise-heading]");
    if (expertise && expertiseHeading) {
      const support = expertiseHeading.nextElementSibling;
      const reveal = addHeadingEntry(
        "expertise",
        expertiseHeading,
        [expertiseHeading],
        "left",
        support instanceof HTMLElement ? [support] : [],
      );
      if (reveal) anchorTypography.set("expertise", reveal);
    }

    const servicesRegion = root.querySelector<HTMLElement>("#services");
    const servicesHeading = servicesRegion?.querySelector<HTMLElement>("[data-thn-capability-heading]");
    if (servicesRegion && servicesHeading) {
      const reveal = addHeadingEntry("services", servicesHeading, [servicesHeading], "right", [],
        motionProfile === "refined" ? { viewport: 0.85 } : {},
      );
      if (reveal) anchorTypography.set("services", reveal);
    }

    root.querySelectorAll<HTMLElement>("[data-thn-service-row]").forEach((row) => {
      const rule = row.querySelector<HTMLElement>("[data-thn-service-rule]");
      if (!rule) return;
      const sequence = gsap.timeline({ paused: true });
      sequence.fromTo(rule, { scaleY: 0.42 }, { scaleY: 1, duration: motion.sectionSequence, ease: "none" }, 0);
      addScrollRange(sequence, row, "top", 0.88, row, "top", 0.62);
    });

    const toolsRegion = root.querySelector<HTMLElement>("#stack");
    const toolsLead = toolsRegion?.querySelector<HTMLElement>("[data-thn-tool-heading]");
    const toolGroups = toolsRegion?.querySelectorAll<HTMLElement>("[data-thn-tool-group]");
    if (toolsRegion && toolsLead) {
      const groups = toolGroups ? Array.from(toolGroups) : [];
      const reveal = addHeadingEntry("stack", toolsLead, [toolsLead], "bottom", groups,
        motionProfile === "refined" ? {
          viewport: compactLayout ? REFINED_HANDOFF.compactEntryViewport : REFINED_HANDOFF.entryViewport,
          supportAt: REFINED_HANDOFF.supportAt,
        } : {},
      );
      if (reveal) anchorTypography.set("stack", reveal);
    }

    const process = root.querySelector<HTMLElement>("#process");
    const processProgress = process?.querySelector<HTMLElement>("[data-thn-process-progress]");
    const processHeading = process?.querySelector<HTMLElement>("[data-thn-process-heading]");
    const processSteps = process?.querySelectorAll<HTMLElement>("[data-thn-process-step]");
    if (process && processProgress && processSteps?.length) {
      const progressLine = gsap.timeline({ paused: true });
      progressLine.fromTo(processProgress, { scaleY: 0 }, { scaleY: 1, duration: 1, ease: "none" });
      if (motionProfile === "refined") {
        let activeStep = -1;
        const markStep = () => {
          const next = Math.min(processSteps.length - 1, Math.floor(progressLine.progress() * processSteps.length));
          if (next === activeStep) return;
          activeStep = next;
          processSteps.forEach((step, index) => {
            if (index === next) step.dataset.thnProcessActive = "";
            else delete step.dataset.thnProcessActive;
          });
        };
        progressLine.eventCallback("onUpdate", markStep);
        markStep();
        interactionDisposers.push(() => {
          processSteps.forEach((step) => delete step.dataset.thnProcessActive);
        });
      }

      if (processHeading) {
        const headingSequence = gsap.timeline({ paused: true });
        headingSequence.fromTo(processHeading, {
          x: 0,
          y: 6,
          opacity: compactLayout ? 0.92 : 0.84,
          clipPath: "inset(-10% 4% -15% 0%)",
        }, {
          ...headingEnd,
          y: 0,
          duration: 0.68,
          ease: motion.timeEase,
        }, 0);
        addScrollRange(headingSequence, process, "top", 0.88, process, "top", 0.54);
      }
      processSteps.forEach((step, index) => {
        const rowTravel = compactLayout ? motion.compactProcessTravel : motion.processTravel;
        const stepTravel = index % 2 === 0 ? -rowTravel : rowTravel;
        const startOpacity = compactLayout
          ? motion.compactProcessStartOpacity
          : motion.processStartOpacity;
        const entrance = gsap.timeline({ paused: true });
        entrance.fromTo(step, { x: stepTravel, opacity: startOpacity }, {
          x: 0,
          opacity: 1,
          duration: motion.processEntranceDuration,
          ease: motion.timeEase,
        }, motion.processEntranceDelay);
        ScrollTrigger.create({
          trigger: step,
          start: "top 88%",
          animation: entrance,
          toggleActions: "play none play reverse",
          invalidateOnRefresh: true,
        });
      });
      addScrollRange(progressLine, process, "top", 0.78, process, "bottom", 0.34);
    }

    const work = root.querySelector<HTMLElement>("#work");
    const workHeading = root.querySelector<HTMLElement>("#engineering");
    if (work && workHeading) {
      const split = splitHeadingWords(workHeading);
      textSplitRestorers.push(split.restore);
      const workHeader = workHeading.parentElement?.parentElement;
      const workCount = workHeader?.querySelector<HTMLElement>(":scope > p");
      const workIntro = work.querySelector<HTMLElement>(":scope > p");
      const support = [workCount, workIntro].filter((item): item is HTMLElement => item instanceof HTMLElement);
      const reveal = addHeadingEntry("work", workHeading, split.words, "wordStagger", support,
        motionProfile === "refined" ? {
          viewport: compactLayout ? REFINED_HANDOFF.compactEntryViewport : REFINED_HANDOFF.entryViewport,
          supportAt: REFINED_HANDOFF.supportAt,
        } : {},
      );
      if (reveal) {
        anchorTypography.set("work", reveal);
        anchorTypography.set("engineering", reveal);
      }
    }

    root.querySelectorAll<HTMLElement>("[data-thn-project-row]").forEach((row) => {
      const projectIndex = row.closest("li")?.querySelector<HTMLElement>(
        ":scope > span[aria-hidden='true']",
      );
      if (!projectIndex) return;
      const sequence = gsap.timeline({ paused: true });
      sequence.fromTo(projectIndex, { y: 6, scale: 0.96 }, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "none",
      });
      addScrollRange(sequence, row, "top", 0.88, row, "top", 0.6);
    });

    const contact = root.querySelector<HTMLElement>("[data-thn-contact-finale]");
    const contactHeading = contact?.querySelector<HTMLElement>("[data-thn-contact-heading]");
    const contactCopy = contact?.querySelector<HTMLElement>("[data-thn-contact-copy]");
    const footerRule = root.querySelector<HTMLElement>("[data-thn-finale-rule]");
    if (contactHeading) {
      const contactLines = motionProfile === "refined"
        ? Array.from(contactHeading.querySelectorAll<HTMLElement>(":scope > [data-thn-contact-setup], :scope > [data-thn-contact-emphasis]"))
        : [];
      const reveal = addHeadingEntry(
        "contact",
        contactHeading,
        contactLines.length ? contactLines : [contactHeading],
        contactLines.length ? "maskedLine" : "left",
        contactCopy ? [contactCopy] : [],
      );
      if (reveal) anchorTypography.set("contact", reveal);
    }
    if (contact && contactCopy) {
      const finale = gsap.timeline({ paused: true });
      if (footerRule) finale.fromTo(footerRule, { scaleX: 0.9 }, { scaleX: 1, duration: 0.36, ease: "none" }, 0.52);
      addScrollRange(
        finale,
        contact,
        "top",
        0.86,
        root.querySelector<HTMLElement>("footer") ?? contact,
        "bottom",
        1,
      );
    }

    const view = root.ownerDocument.defaultView;
    if (view) {
      resumeSuppressedTypography = () => {
        typographyReveals.forEach((reveal) => reveal.resumeSuppressed());
      };
      let deferredAnchorScrollFrame = 0;
      let pendingAnchorReconcileFrame = 0;
      let pendingAnchorRefreshReconcile = false;
      const cancelDeferredAnchorScroll = () => {
        if (!deferredAnchorScrollFrame) return;
        view.cancelAnimationFrame(deferredAnchorScrollFrame);
        deferredAnchorScrollFrame = 0;
      };
      const resolveAnchorScrollY = (target: HTMLElement) => {
        const scrollOwner = scrollOwnerRef.current;
        if (!scrollOwner) return null;
        const offset = Number.parseFloat(view.getComputedStyle(target).scrollMarginTop) || 0;
        const documentY = target.getBoundingClientRect().top + scrollOwner.scrollTop();
        const requestedScrollY = documentY - offset;
        return gsap.utils.clamp(0, ScrollTrigger.maxScroll(view), requestedScrollY);
      };
      scheduleScroll = (target, smooth, position, onResolved) => {
        cancelDeferredAnchorScroll();
        deferredAnchorScrollFrame = view.requestAnimationFrame(() => {
          deferredAnchorScrollFrame = 0;
          const scrollOwner = scrollOwnerRef.current;
          if (!active || !scrollOwner) return;
          if (!clampAnchorArrival) {
            scrollOwner.scrollTo(target, smooth, position);
            return;
          }
          const effectiveScrollY = typeof target === "number"
            ? gsap.utils.clamp(0, ScrollTrigger.maxScroll(view), target)
            : resolveAnchorScrollY(target);
          if (effectiveScrollY === null) return;
          onResolved?.(effectiveScrollY);
          scrollOwner.scrollTo(effectiveScrollY, smooth);
        });
      };

      const clearPendingAnchor = () => {
        const pending = pendingAnchorReveal;
        if (!pending) return;
        pendingAnchorReveal = null;
        if (pending.frame) view.cancelAnimationFrame(pending.frame);
        if (pending.timeout) view.clearTimeout(pending.timeout);
      };
      const armPendingAnchorTimeout = (pending: PendingAnchorReveal) => {
        if (pending.timeout || pendingAnchorReveal !== pending) return;
        const remaining = Math.max(0, pending.deadlineAt - view.performance.now());
        pending.timeout = view.setTimeout(() => {
          if (pendingAnchorReveal !== pending) return;
          clearPendingAnchor();
          pending.reveal?.complete();
        }, remaining);
      };
      const restartPendingAnchorTimeout = (pending: PendingAnchorReveal) => {
        if (pending.timeout) view.clearTimeout(pending.timeout);
        pending.timeout = 0;
        pending.deadlineAt = view.performance.now() + 4000;
        armPendingAnchorTimeout(pending);
      };
      cancelAnchorArrival = clearPendingAnchor;
      settleTypography = (preserve = null) => {
        typographyReveals.forEach((reveal) => {
          if (reveal !== preserve) reveal.settle();
        });
      };
      startAnchorArrival = (target, reveal, offset) => {
        clearPendingAnchor();
        const pending: PendingAnchorReveal = {
          target,
          reveal,
          startedAt: view.performance.now(),
          expectedTop: offset,
          expectedScrollY: null,
          lastTop: Number.NaN,
          lastScrollY: Number.NaN,
          stableSince: null,
          stopObservedAt: null,
          deadlineAt: 0,
          poll: () => {},
          frame: 0,
          timeout: 0,
        };
        pending.deadlineAt = pending.startedAt + 4000;
        pendingAnchorReveal = pending;

        const arrive = () => {
          if (pendingAnchorReveal !== pending) return;
          if (pending.frame) view.cancelAnimationFrame(pending.frame);
          if (pending.timeout) view.clearTimeout(pending.timeout);
          pending.frame = 0;
          pending.timeout = 0;
          if (!pending.reveal) {
            pendingAnchorReveal = null;
            return;
          }
          pending.reveal.schedule(typography.anchorDelay, () => {
            if (pendingAnchorReveal === pending) pendingAnchorReveal = null;
            resumeSuppressedTypography();
          });
        };
        const poll = (now: number) => {
          if (!active || pendingAnchorReveal !== pending) return;
          const top = target.getBoundingClientRect().top;
          const scrollY = scrollOwnerRef.current?.scrollTop() ?? view.scrollY;
          const position = clampAnchorArrival ? scrollY : top;
          const previousPosition = clampAnchorArrival ? pending.lastScrollY : pending.lastTop;
          const stable = Math.abs(position - previousPosition) < 0.08;
          pending.stableSince = stable ? (pending.stableSince ?? now) : null;
          pending.lastTop = top;
          pending.lastScrollY = scrollY;
          const atDestination = clampAnchorArrival
            ? pending.expectedScrollY !== null && Math.abs(scrollY - pending.expectedScrollY) <= 1.5
            : Math.abs(top - pending.expectedTop) <= 1.5;
          if (
            atDestination &&
            pending.stableSince !== null &&
            now - pending.startedAt >= 160 &&
            now - pending.stableSince >= 240 &&
            (pending.stopObservedAt === null || now - pending.stopObservedAt >= 160)
          ) {
            arrive();
            return;
          }
          pending.frame = view.requestAnimationFrame(poll);
        };
        pending.poll = poll;
        armPendingAnchorTimeout(pending);
        pending.frame = view.requestAnimationFrame(poll);
      };
      notifyAnchorStop = () => {
        const pending = pendingAnchorReveal;
        if (!pending) return;
        if (clampAnchorArrival) {
          const scrollY = scrollOwnerRef.current?.scrollTop();
          if (
            scrollY !== undefined &&
            pending.expectedScrollY !== null &&
            Math.abs(scrollY - pending.expectedScrollY) <= 1.5
          ) {
            pending.stopObservedAt = view.performance.now();
          }
          return;
        }
        const top = pending.target.getBoundingClientRect().top;
        if (Math.abs(top - pending.expectedTop) <= 1.5) {
          pending.stopObservedAt = view.performance.now();
        }
      };
      const reconcilePendingAnchor = (afterRefresh = false) => {
        const pending = pendingAnchorReveal;
        if (!clampAnchorArrival || !pending || pending.expectedScrollY === null) return;
        const effectiveScrollY = resolveAnchorScrollY(pending.target);
        if (effectiveScrollY === null) return;
        const destinationChanged = Math.abs(effectiveScrollY - pending.expectedScrollY) > 0.5;
        const refreshRestoreOverwroteScroll = afterRefresh && !destinationChanged &&
          Math.abs(view.scrollY - effectiveScrollY) > 1.5;
        if (!destinationChanged && !refreshRestoreOverwroteScroll) return;

        pending.reveal?.prepareForAnchor();
        pending.expectedScrollY = effectiveScrollY;
        pending.lastTop = Number.NaN;
        pending.lastScrollY = Number.NaN;
        pending.stableSince = null;
        pending.stopObservedAt = null;
        if (!pending.frame) pending.frame = view.requestAnimationFrame(pending.poll);
        restartPendingAnchorTimeout(pending);
        scrollOwnerRef.current?.scrollTo(effectiveScrollY, true);
      };
      const schedulePendingAnchorReconcile = (afterRefresh = false) => {
        if (!clampAnchorArrival || !pendingAnchorReveal) return;
        pendingAnchorRefreshReconcile ||= afterRefresh;
        if (pendingAnchorReconcileFrame) return;
        pendingAnchorReconcileFrame = view.requestAnimationFrame(() => {
          pendingAnchorReconcileFrame = 0;
          const refreshReconcile = pendingAnchorRefreshReconcile;
          pendingAnchorRefreshReconcile = false;
          reconcilePendingAnchor(refreshReconcile);
        });
      };
      const handleResize = () => schedulePendingAnchorReconcile();
      const handleScrollTriggerRefresh = () => schedulePendingAnchorReconcile(true);
      if (clampAnchorArrival) {
        view.addEventListener("resize", handleResize, { passive: true });
        ScrollTrigger.addEventListener("refresh", handleScrollTriggerRefresh);
      }

      const isSamePageAnchorActivation = (event: Event) => {
        if (!["click", "pointerdown", "touchstart", "keydown"].includes(event.type)) return false;
        if (event.type === "keydown" && (!(event instanceof KeyboardEvent) || event.key !== "Enter")) {
          return false;
        }
        if (event.type === "click" || event.type === "pointerdown") {
          const pointer = event as MouseEvent;
          if (pointer.button !== 0 || pointer.metaKey || pointer.ctrlKey || pointer.shiftKey || pointer.altKey) {
            return false;
          }
        }
        if (!(event.target instanceof Element)) return false;
        const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
        const hash = anchor?.getAttribute("href");
        if (!hash || hash.length < 2) return false;
        let targetId = hash.slice(1);
        try {
          targetId = decodeURIComponent(targetId);
        } catch {
          return false;
        }
        const target = root.ownerDocument.getElementById(targetId);
        return Boolean(target && root.contains(target));
      };
      const interruptAnchorNavigation = (event: Event) => {
        if (isSamePageAnchorActivation(event)) return;
        if (!pendingAnchorReveal && !pendingTopNavigation) return;
        cancelDeferredAnchorScroll();
        scrollOwnerRef.current?.interrupt?.();
        pendingTopNavigation = false;
        if (!pendingAnchorReveal) return;
        clearPendingAnchor();
        settleTypography();
        resumeSuppressedTypography();
      };
      const interruptEvents: Array<[string, AddEventListenerOptions | boolean]> = [
        ["wheel", { capture: true, passive: true }],
        ["touchstart", { capture: true, passive: true }],
        ["touchmove", { capture: true, passive: true }],
        ["pointerdown", { capture: true, passive: true }],
        ["keydown", true],
        ["popstate", true],
        ["hashchange", true],
      ];
      interruptEvents.forEach(([type, options]) => view.addEventListener(type, interruptAnchorNavigation, options));
      root.addEventListener("click", interruptAnchorNavigation, true);
      disposeTypography = () => {
        cancelDeferredAnchorScroll();
        if (pendingAnchorReconcileFrame) view.cancelAnimationFrame(pendingAnchorReconcileFrame);
        pendingAnchorReconcileFrame = 0;
        pendingAnchorRefreshReconcile = false;
        if (clampAnchorArrival) {
          view.removeEventListener("resize", handleResize);
          ScrollTrigger.removeEventListener("refresh", handleScrollTriggerRefresh);
        }
        clearPendingAnchor();
        typographyReveals.forEach((reveal) => reveal.cancel());
        interruptEvents.forEach(([type, options]) => view.removeEventListener(type, interruptAnchorNavigation, options));
        root.removeEventListener("click", interruptAnchorNavigation, true);
        typographyReveals.clear();
        anchorTypography.clear();
      };
    }

    const flowStory = motionProfile === "refined" && root.hasAttribute("data-thn-flow-story");
    let storyAnchors: Array<{ scrollY: number; progress: number }> = [];
    const measureStoryAnchors = () => {
      if (!flowStory) return;
      const view = root.ownerDocument.defaultView;
      if (!view) return;
      const scrollY = scrollOwnerRef.current?.scrollTop() ?? view.scrollY;
      const maxY = Math.max(0, root.ownerDocument.documentElement.scrollHeight - view.innerHeight);
      const chapters = [
        { id: "hero", progress: 0 }, { id: "about", progress: 1 },
        { id: "expertise", progress: 2 }, { id: "stack", progress: 2.55 },
        { id: "process", progress: 3 }, { id: "work", progress: 4 },
        { id: "contact", progress: 5 },
      ];
      storyAnchors = chapters.map(({ id, progress }, index) => {
        const element = root.querySelector<HTMLElement>(`#${id}`);
        const top = element ? element.getBoundingClientRect().top + scrollY : 0;
        return { scrollY: Math.max(0, Math.min(maxY, top - (index ? view.innerHeight * 0.18 : 0))), progress };
      });
    };
    const readStoryProgress = (scrollY: number) => {
      if (storyAnchors.length !== 7) return 0;
      for (let index = 0; index < storyAnchors.length - 1; index += 1) {
        const start = storyAnchors[index];
        const end = storyAnchors[index + 1];
        if (scrollY < end.scrollY) {
          const fraction = Math.max(0, Math.min(1, (scrollY - start.scrollY) / Math.max(1, end.scrollY - start.scrollY)));
          return start.progress + fraction * (end.progress - start.progress);
        }
      }
      return 5;
    };
    const measureSceneVisibleEnd = () => {
      measureStoryAnchors();
      const view = root.ownerDocument.defaultView;
      const heroElement = root.querySelector<HTMLElement>("#hero");
      const aboutElement = root.querySelector<HTMLElement>("#about");
      const stageElement = root.querySelector<HTMLElement>("[data-thn-premium-stage]");
      if (!view || !heroElement || !aboutElement || !stageElement) return;
      const visualScrollY = scrollOwnerRef.current?.scrollTop() ?? view.scrollY;

      const heroStart = heroElement.getBoundingClientRect().top + visualScrollY;
      const aboutStart = aboutElement.getBoundingClientRect().top + visualScrollY;
      const stageExit = stageElement.getBoundingClientRect().bottom + visualScrollY;
      const chapterLength = aboutStart - heroStart;
      if (chapterLength <= 0) return;

      const stageHeight = stageElement.getBoundingClientRect().height;
      const responseDistance = stageHeight * (compactLayout ? 0.5 : 0.4);
      sceneMotionEndScrollY = Math.max(1, Math.min(stageExit, responseDistance));

      if (aboutHeading) {
        const headingDocumentTop = aboutHeading.getBoundingClientRect().top + visualScrollY;
        const startY = headingDocumentTop - view.innerHeight * 0.88;
        const endY = headingDocumentTop - view.innerHeight * 0.52;
        aboutHandoffStart = Math.max(0, Math.min(0.99, (startY - heroStart) / chapterLength));
        aboutHandoffEnd = Math.max(aboutHandoffStart + 0.01, Math.min(1, (endY - heroStart) / chapterLength));
      }
    };
    measureSceneVisibleEnd();
    refreshScrollRanges();
    releaseCoreProgress = observeCoreProgress(root, ScrollTrigger, {
      readScrollY: () => scrollOwnerRef.current?.scrollTop() ?? root.ownerDocument.defaultView?.scrollY ?? 0,
      triggerElement: smoothContent,
      onRefresh: () => {
        measureSceneVisibleEnd();
        refreshScrollRanges();
      },
      onSnapshot: (snapshot) => {
        const heroProgress = snapshot.chapters.find((chapter) => chapter.id === "hero")?.progress ?? 0;
        const nextSceneProgress = flowStory ? readStoryProgress(snapshot.scrollY) : Math.max(0, Math.min(1, snapshot.scrollY / sceneMotionEndScrollY));
        if (Math.abs(sceneProgressRef.current - nextSceneProgress) > 0.00001) {
          sceneProgressRef.current = nextSceneProgress;
          sceneProgressRef.invalidate?.();
        }
        updateAboutHandoff(heroProgress);
        updateScrollRanges(snapshot.scrollY);
      },
    });
    const routeTriggers = ScrollTrigger.getAll().filter((trigger) => {
      const triggerElement = trigger.trigger;
      return triggerElement instanceof Element && root.contains(triggerElement);
    }).length;
    root.dataset.thnPremiumTriggerCount = String(routeTriggers);
    });
  } catch (error) {
    try {
      interactionDisposers.splice(0).forEach((dispose) => dispose());
      disposeTypography();
      context.revert();
    } finally {
      try {
        restoreSplitWords();
      } finally {
        releaseCoreProgress();
        try {
          scrollOwnerRef.current?.kill();
        } finally {
          scrollOwnerRef.current = null;
          sceneProgressRef.current = 0;
          delete root.dataset.thnPremiumTriggerCount;
        }
      }
    }
    throw error;
  }

  const refresh = () => {
    if (active) ScrollTrigger.refresh();
  };
  const scrollToAnchor = (target: HTMLElement, smooth: boolean, focusTarget = false) => {
    if (!active || !scrollOwnerRef.current) return;
    pendingTopNavigation = false;
    const destinationReveal = target === root ? null : anchorTypography.get(target.id) ?? null;
    root.scrollTop = 0;
    cancelAnchorArrival();
    settleTypography(destinationReveal);
    destinationReveal?.prepareForAnchor();
    if (target === root) {
      pendingFocusTarget = null;
      pendingTopNavigation = scrollEngine === "lenis" && smooth;
      scheduleScroll(0, smooth);
      return;
    }
    const view = root.ownerDocument.defaultView;
    if (!view) return;
    const offset = Number.parseFloat(view.getComputedStyle(target).scrollMarginTop) || 0;
    pendingFocusTarget = focusTarget && smooth ? target : null;
    startAnchorArrival(target, destinationReveal, offset);
    if (clampAnchorArrival) {
      scheduleScroll(target, smooth, `top ${offset}px`, (effectiveScrollY) => {
        const pending = pendingAnchorReveal;
        if (pending?.target !== target) return;
        pending.expectedScrollY = effectiveScrollY;
        pending.lastTop = Number.NaN;
        pending.lastScrollY = Number.NaN;
        pending.stableSince = null;
        pending.stopObservedAt = null;
      });
    } else {
      scheduleScroll(target, smooth, `top ${offset}px`);
    }
    const targetRect = target.getBoundingClientRect();
    if (
      focusTarget &&
      (!smooth || (targetRect.bottom > 0 && targetRect.top < view.innerHeight))
    ) {
      target.focus({ preventScroll: true });
      pendingFocusTarget = null;
    }
  };
  void root.ownerDocument.fonts.ready.then(refresh);

  const cleanup = () => {
    if (!active) return;
    active = false;
    try {
      interactionDisposers.splice(0).forEach((dispose) => dispose());
      disposeTypography();
      context.revert();
    } finally {
      try {
        restoreSplitWords();
      } finally {
        releaseCoreProgress();
        try {
          scrollOwnerRef.current?.kill();
        } finally {
          pendingFocusTarget = null;
          scrollOwnerRef.current = null;
          sceneProgressRef.current = 0;
          delete root.dataset.thnPremiumTriggerCount;
        }
      }
    }
  };

  return {
    cleanup,
    refresh,
    scrollToAnchor,
    pendingAnchorTarget: () =>
      pendingTopNavigation ? root : pendingAnchorReveal?.target ?? null,
  };
}
