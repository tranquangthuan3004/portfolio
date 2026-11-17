"use client";

import { useEffect, useRef, type ReactNode } from "react";

export type PreviewProfile = "v1" | "core";

type PreviewMotionProps = {
  children: ReactNode;
  className: string;
  id: string;
  profile?: PreviewProfile;
};

export default function PreviewMotion({
  children,
  className,
  id,
  profile = "v1",
}: PreviewMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let disposed = false;
    let generation = 0;
    let cleanup = () => {};
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

          const target = root.querySelector<HTMLElement>(initialHash);
          if (!target) return;

          const scrollMargin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
          if (Math.abs(target.getBoundingClientRect().top - scrollMargin) > 2) {
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

    const initialize = async () => {
      const currentGeneration = ++generation;

      try {
        const [gsapModule, scrollTriggerModule] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (disposed || reducedMotion.matches || currentGeneration !== generation) return;

        const { gsap } = gsapModule;
        const { ScrollTrigger } = scrollTriggerModule;
        gsap.registerPlugin(ScrollTrigger);

        let coreProgressModule: typeof import("./core-progress") | null = null;
        if (profile === "core") {
          try {
            coreProgressModule = await import("./core-progress");
          } catch {
            // The V1 motion remains available if the optional Core contract cannot load.
          }
          if (disposed || reducedMotion.matches || currentGeneration !== generation) return;
        }

        let context: ReturnType<typeof gsap.context> | null = null;
        let scene: HTMLElement | null = null;
        let finaleFooter: HTMLElement | null = null;
        let releaseCoreProgress = () => {};
        try {
          context = gsap.context(() => {}, root);
          context.add(() => {
            const hero = root.querySelector<HTMLElement>("#hero");
            const movingWordmark = root.querySelector<HTMLElement>("[data-thn-moving-wordmark]");
            const aboutHeading = root.querySelector<HTMLElement>("[data-thn-about-heading]");
            const dock = root.querySelector<HTMLElement>("[data-thn-wordmark-dock]");
            const primaryAction = root.querySelector<HTMLElement>("[data-thn-primary-action]");
            const toolLine = root.querySelector<HTMLElement>("[data-thn-tool-line]");
            const folioRule = root.querySelector<HTMLElement>("[data-thn-folio-rule]");
            const markParts = {
              t: root.querySelector<HTMLElement>('[data-thn-mark-part="t"]'),
              hn: root.querySelector<HTMLElement>('[data-thn-mark-part="hn"]'),
              period: root.querySelector<HTMLElement>('[data-thn-mark-part="period"]'),
            };
            const aboutLines = root.querySelectorAll<HTMLElement>("[data-thn-about-line]");
            scene = root.querySelector<HTMLElement>("[data-thn-hero-about-scene]");

            if (
              hero &&
              movingWordmark &&
              aboutHeading &&
              dock &&
              primaryAction &&
              toolLine &&
              folioRule &&
              markParts.t &&
              markParts.hn &&
              markParts.period &&
              scene
            ) {
              const headingBounds = aboutHeading.getBoundingClientRect();
              const headingIsVisible =
                headingBounds.top < window.innerHeight && headingBounds.bottom > 0;
              const shouldSkipHandoff =
                deepLinkHashes.has(window.location.hash) ||
                headingIsVisible ||
                headingBounds.bottom <= 0;

              if (!shouldSkipHandoff) {
                scene.setAttribute("data-thn-motion-ready", "");
                scene.setAttribute("data-thn-folio-ready", "");

                const measureTarget = () => {
                  const sourceRect = movingWordmark.getBoundingClientRect();
                  const currentScale = Math.max(
                    0.001,
                    Number(gsap.getProperty(movingWordmark, "scaleX")) || 1,
                  );
                  const currentX = Number(gsap.getProperty(movingWordmark, "x")) || 0;
                  const currentY = Number(gsap.getProperty(movingWordmark, "y")) || 0;
                  const sourceCenterX = sourceRect.left + sourceRect.width / 2 - currentX;
                  const sourceCenterY = sourceRect.top + sourceRect.height / 2 - currentY;
                  const targetRect = dock.getBoundingClientRect();
                  const sourceWidth = sourceRect.width / currentScale;
                  const sourceHeight = sourceRect.height / currentScale;
                  const scale = Math.min(
                    targetRect.width / sourceWidth,
                    targetRect.height / sourceHeight,
                  );
                  const y = targetRect.top + targetRect.height / 2 - sourceCenterY;
                  const toolLineRect = toolLine.getBoundingClientRect();
                  const stagingGap = Math.max(
                    12,
                    Math.min(24, targetRect.top - toolLineRect.bottom - targetRect.height),
                  );
                  const mobileStageY =
                    y - Math.max(0, targetRect.top - toolLineRect.bottom - stagingGap);

                  return {
                    x: targetRect.left + (sourceWidth * scale) / 2 - sourceCenterX,
                    y,
                    mobileStageY,
                    scale,
                  };
                };

                let measuredTarget = measureTarget();
                if (!compactLayout.matches) gsap.set(aboutHeading, { scale: 0.94 });
                gsap.set(folioRule, { scaleX: 0 });
                const headerHeight =
                  Number.parseFloat(
                    getComputedStyle(root).getPropertyValue("--thn-header-height"),
                  ) || 76;
                const readMarkUnit = () => {
                  const wordmark = movingWordmark.querySelector<HTMLElement>('[role="img"]');
                  return Number.parseFloat(getComputedStyle(wordmark ?? movingWordmark).fontSize) || 160;
                };
                let markUnit = readMarkUnit();
                const handoff = gsap.timeline({ paused: true });

                if (compactLayout.matches) {
                  const heroTop = hero.getBoundingClientRect().top + window.scrollY;
                  const dockTop = dock.getBoundingClientRect().top + window.scrollY;
                  const ctaBottom = primaryAction.getBoundingClientRect().bottom + window.scrollY;
                  const startScroll = heroTop - headerHeight;
                  const endScroll = dockTop - headerHeight - 24;
                  const ctaClearedScroll = ctaBottom - headerHeight;
                  const lateStart = Math.max(
                    0.86,
                    Math.min(0.9, (ctaClearedScroll - startScroll) / Math.max(1, endScroll - startScroll)),
                  );
                  const finalSpan = 1 - lateStart;

                  handoff
                    .addLabel("hero-mark-rhythm", 0)
                    .to(
                      markParts.t,
                      { x: () => -markUnit * 0.035, y: () => markUnit * 0.04, duration: 0.05, ease: "power1.inOut" },
                      0,
                    )
                    .to(markParts.t, { x: 0, y: 0, duration: 0.08, ease: "power2.out" }, 0.05)
                    .to(
                      markParts.hn,
                      { x: () => markUnit * 0.06, y: () => -markUnit * 0.04, duration: 0.06, ease: "power1.inOut" },
                      0.04,
                    )
                    .to(markParts.hn, { x: 0, y: 0, duration: 0.08, ease: "power2.out" }, 0.1)
                    .to(
                      markParts.period,
                      { x: () => markUnit * 0.12, y: () => markUnit * 0.07, duration: 0.05, ease: "power1.inOut" },
                      0.09,
                    )
                    .to(markParts.period, { x: 0, y: 0, duration: 0.07, ease: "power2.out" }, 0.14)
                    .addLabel("reading-hold", 0.2)
                    .addLabel("cta-cleared", lateStart)
                    .to(
                      movingWordmark,
                      {
                        x: () => measuredTarget.x,
                        y: () => measuredTarget.mobileStageY,
                        scale: () => measuredTarget.scale,
                        duration: finalSpan * 0.15,
                        ease: "power2.out",
                      },
                      lateStart,
                    )
                    .to(
                      movingWordmark,
                      {
                        x: () => measuredTarget.x,
                        y: () => measuredTarget.y,
                        scale: () => measuredTarget.scale,
                        duration: finalSpan * 0.85,
                        ease: "power2.out",
                      },
                      lateStart + finalSpan * 0.15,
                    )
                    .to(
                      markParts.t,
                      { x: () => -markUnit * 0.045, y: () => markUnit * 0.055, duration: finalSpan * 0.08, ease: "power1.inOut" },
                      lateStart + finalSpan * 0.18,
                    )
                    .to(
                      markParts.t,
                      { x: 0, y: 0, duration: finalSpan * 0.1, ease: "power2.out" },
                      lateStart + finalSpan * 0.26,
                    )
                    .to(
                      markParts.hn,
                      { x: () => markUnit * 0.075, y: () => -markUnit * 0.05, duration: finalSpan * 0.09, ease: "power1.inOut" },
                      lateStart + finalSpan * 0.42,
                    )
                    .to(
                      markParts.hn,
                      { x: 0, y: 0, duration: finalSpan * 0.11, ease: "power2.out" },
                      lateStart + finalSpan * 0.51,
                    )
                    .to(
                      markParts.period,
                      { x: () => markUnit * 0.14, y: () => markUnit * 0.075, duration: finalSpan * 0.09, ease: "power1.inOut" },
                      lateStart + finalSpan * 0.65,
                    )
                    .to(
                      markParts.period,
                      { x: 0, y: 0, duration: finalSpan * 0.12, ease: "power2.out" },
                      lateStart + finalSpan * 0.74,
                    )
                    .to(
                      folioRule,
                      { scaleX: 1, duration: finalSpan * 0.4, ease: "power2.out" },
                      lateStart + finalSpan * 0.3,
                    )
                    .addLabel("folio-lock", 1);
                } else {
                  handoff
                    .addLabel("wordmark-descent", 0)
                    .to(
                      movingWordmark,
                      { x: 14, y: 42, scale: 0.66, duration: 0.24, ease: "power1.inOut" },
                      0,
                    )
                    .to(
                      movingWordmark,
                      {
                        x: () => measuredTarget.x * 0.76,
                        y: () => measuredTarget.y * 0.62,
                        scale: () => Math.max(measuredTarget.scale * 1.7, 0.28),
                        duration: 0.5,
                        ease: "power1.inOut",
                      },
                      0.24,
                    )
                    .to(
                      movingWordmark,
                      {
                        x: () => measuredTarget.x,
                        y: () => measuredTarget.y,
                        scale: () => measuredTarget.scale,
                        duration: 0.26,
                        ease: "power2.out",
                      },
                      0.74,
                    )
                    .addLabel("letter-reassembly", 0.2)
                    .to(
                      markParts.t,
                      { x: () => -markUnit * 0.045, y: () => markUnit * 0.055, duration: 0.28, ease: "power1.inOut" },
                      0.02,
                    )
                    .to(markParts.t, { x: 0, y: 0, duration: 0.34, ease: "power2.out" }, 0.3)
                    .to(
                      markParts.hn,
                      { x: () => markUnit * 0.075, y: () => -markUnit * 0.05, duration: 0.3, ease: "power1.inOut" },
                      0.16,
                    )
                    .to(markParts.hn, { x: 0, y: 0, duration: 0.38, ease: "power2.out" }, 0.46)
                    .to(
                      markParts.period,
                      { x: () => markUnit * 0.14, y: () => markUnit * 0.075, duration: 0.25, ease: "power1.inOut" },
                      0.34,
                    )
                    .to(markParts.period, { x: 0, y: 0, duration: 0.38, ease: "power2.out" }, 0.62)
                    .to(folioRule, { scaleX: 1, duration: 0.4, ease: "power2.out" }, 0.58)
                    .addLabel("folio-lock", 1);
                }

                if (!compactLayout.matches) {
                  handoff.to(
                    aboutHeading,
                    { scale: 1, duration: 0.44, ease: "power2.out" },
                    0.56,
                  );
                }

                ScrollTrigger.create({
                  id: "thn-hero-about-handoff",
                  trigger: hero,
                  endTrigger: compactLayout.matches ? dock : undefined,
                  start: () => {
                    return `top top+=${headerHeight}`;
                  },
                  end: () =>
                    compactLayout.matches
                      ? `top top+=${headerHeight + 24}`
                      : `+=${Math.round(window.innerHeight * 0.64)}`,
                  scrub: 0.16,
                  invalidateOnRefresh: true,
                  animation: handoff,
                  onRefreshInit: () => {
                    markUnit = readMarkUnit();
                    measuredTarget = measureTarget();
                  },
                });

                if (compactLayout.matches && aboutLines.length === 2) {
                  const [sansLine, serifLine] = aboutLines;
                  const headingHandoff = gsap
                    .timeline({ paused: true })
                    .to(sansLine, { y: 0, duration: 0.42, ease: "power2.out" }, 0)
                    .to(serifLine, { x: 0, duration: 0.42, ease: "power2.out" }, 0.08);
                  gsap.set(sansLine, { y: 6 });
                  gsap.set(serifLine, { x: -10 });
                  ScrollTrigger.create({
                    id: "thn-about-typography",
                    trigger: aboutHeading,
                    start: "top 78%",
                    once: true,
                    animation: headingHandoff,
                  });
                }

              }
            }

            const compact = compactLayout.matches;
            const expertiseRegion = root.querySelector<HTMLElement>("#expertise");
            const toolsRegion = root.querySelector<HTMLElement>("#stack");
            const expertiseHeading = root.querySelector<HTMLElement>("[data-thn-expertise-heading]");
            const expertiseEmphasis = root.querySelector<HTMLElement>("[data-thn-expertise-emphasis]");
            const buildRegion = root.querySelector<HTMLElement>("#services");
            const capabilityHeading = root.querySelector<HTMLElement>("[data-thn-capability-heading]");
            const serviceCopies = root.querySelectorAll<HTMLElement>("[data-thn-service-copy]");
            const serviceIndices = root.querySelectorAll<HTMLElement>("[data-thn-service-index]");
            const serviceRules = root.querySelectorAll<HTMLElement>("[data-thn-service-rule]");
            const toolGroups = root.querySelectorAll<HTMLElement>("[data-thn-tool-group]");

            if (
              expertiseRegion &&
              buildRegion &&
              toolsRegion &&
              expertiseHeading &&
              expertiseEmphasis &&
              capabilityHeading &&
              serviceCopies.length &&
              serviceIndices.length &&
              serviceRules.length &&
              toolGroups.length
            ) {
              const axisTravel = compact ? 12 : 34;
              const wordTravel = compact ? 18 : 58;
              const inventoryTravel = compact ? 12 : 30;
              const stageStagger = compact ? 0.06 : 0.1;
              const expertiseSequence = gsap.timeline({ paused: true });
              expertiseSequence
                .addLabel("statement-axis", 0)
                .fromTo(
                  expertiseHeading,
                  { x: compact ? -8 : -26 },
                  { x: 0, duration: 0.4, ease: "power2.out" },
                  0,
                )
                .fromTo(
                  expertiseEmphasis,
                  { x: wordTravel, y: compact ? 3 : 9 },
                  { x: 0, y: 0, duration: 0.46, ease: "power2.out" },
                  0,
                )
                .addLabel("capability-axis", 0.28)
                .fromTo(
                  capabilityHeading,
                  { x: -axisTravel },
                  { x: 0, duration: 0.48, ease: "power2.out" },
                  "capability-axis",
                )
                .fromTo(
                  serviceIndices,
                  { x: compact ? -8 : -20 },
                  { x: 0, duration: 0.42, stagger: stageStagger, ease: "power2.out" },
                  "capability-axis",
                )
                .fromTo(
                  serviceCopies,
                  { x: axisTravel },
                  { x: 0, duration: 0.48, stagger: stageStagger, ease: "power2.out" },
                  "capability-axis",
                )
                .fromTo(
                  serviceRules,
                  { scaleY: 0.16 },
                  { scaleY: 1, duration: 0.46, stagger: stageStagger, ease: "power2.out" },
                  0.34,
                )
                .addLabel("toolkit-axis", 0.82);

              toolGroups.forEach((group, index) => {
                const label = group.querySelector<HTMLElement>("dt");
                const inventory = group.querySelector<HTMLElement>("dd");
                const offset = 0.82 + index * stageStagger;

                if (label) {
                  expertiseSequence.fromTo(
                    label,
                    { x: -inventoryTravel },
                    { x: 0, duration: 0.42, ease: "power2.out" },
                    offset,
                  );
                }
                if (inventory) {
                  expertiseSequence.fromTo(
                    inventory,
                    { x: inventoryTravel },
                    { x: 0, duration: 0.48, ease: "power2.out" },
                    offset,
                  );
                }
              });

              ScrollTrigger.create({
                id: "thn-expertise-spread",
                trigger: expertiseRegion,
                endTrigger: toolsRegion,
                start: "top 78%",
                end: "bottom 58%",
                scrub: 0.22,
                invalidateOnRefresh: true,
                animation: expertiseSequence,
              });
            }

            const processRegion = root.querySelector<HTMLElement>("#process");
            const processHeading = root.querySelector<HTMLElement>("[data-thn-process-heading]");
            const processProgress = root.querySelector<HTMLElement>("[data-thn-process-progress]");
            const processSteps = root.querySelectorAll<HTMLElement>("[data-thn-process-step]");
            const processNumbers = root.querySelectorAll<HTMLElement>("[data-thn-process-number]");
            if (processRegion && processHeading && processProgress && processSteps.length && processNumbers.length) {
              const processTitles: HTMLElement[] = [];
              const processDescriptions: HTMLElement[] = [];
              processSteps.forEach((step) => {
                const title = step.querySelector<HTMLElement>("h4");
                const description = step.querySelector<HTMLElement>("p");
                if (title) processTitles.push(title);
                if (description) processDescriptions.push(description);
              });

              const numberTravel = compact ? 8 : 20;
              const titleTravel = compact ? 12 : 30;
              const descriptionTravel = compact ? 16 : 46;
              const processSequence = gsap.timeline({ paused: true });
              processSequence
                .addLabel("ledger-opens", 0)
                .fromTo(
                  processProgress,
                  { scaleY: 0.12 },
                  { scaleY: 1, duration: 1.14, ease: "none" },
                  0,
                )
                .fromTo(
                  processHeading,
                  { x: compact ? -8 : -22 },
                  { x: 0, duration: 0.45, ease: "power2.out" },
                  0,
                );

              processNumbers.forEach((number, index) => {
                const offset = index * 0.18;
                processSequence.fromTo(
                  number,
                  { x: -numberTravel, scale: 0.95, color: "#9c9c9c" },
                  { x: 0, scale: 1, color: "#ffffff", duration: 0.32, ease: "power2.out" },
                  offset,
                );
                const title = processTitles[index];
                const description = processDescriptions[index];

                if (title) {
                  processSequence.fromTo(
                    title,
                    { x: titleTravel },
                    { x: 0, duration: 0.38, ease: "power2.out" },
                    offset + 0.04,
                  );
                }
                if (description) {
                  processSequence.fromTo(
                    description,
                    { x: descriptionTravel },
                    { x: 0, duration: 0.42, ease: "power2.out" },
                    offset + 0.08,
                  );
                }
              });

              ScrollTrigger.create({
                id: "thn-process-sequence",
                trigger: processRegion,
                start: "top 76%",
                end: "bottom 52%",
                scrub: 0.22,
                invalidateOnRefresh: true,
                animation: processSequence,
              });
            }

            const contactSection = root.querySelector<HTMLElement>("[data-thn-contact-finale]");
            const contactHeading = root.querySelector<HTMLElement>("[data-thn-contact-heading]");
            const contactPhrases = contactHeading?.querySelectorAll<HTMLElement>(
              "[data-thn-contact-phrase]",
            );
            const contactEmphasis = root.querySelector<HTMLElement>("[data-thn-contact-emphasis]");
            const contactCopy = contactSection?.querySelector<HTMLElement>("[data-thn-contact-copy]");
            const footer = root.querySelector<HTMLElement>("footer");
            const footerWordmark = footer?.querySelector<HTMLElement>(
              '[data-thn-finale-signature] [role="img"]',
            );
            const footerPeriod = footerWordmark?.lastElementChild as HTMLElement | null;
            const footerRule = footer?.querySelector<HTMLElement>("[data-thn-finale-rule]");

            if (
              contactSection &&
              contactHeading &&
              contactPhrases?.length === 2 &&
              contactEmphasis &&
              contactCopy &&
              footer &&
              footerPeriod &&
              footerRule
            ) {
              const headingBounds = contactHeading.getBoundingClientRect();
              const headingIsVisible =
                headingBounds.top < window.innerHeight && headingBounds.bottom > 0;
              const shouldSkipFinale =
                window.location.hash === "#contact" ||
                headingIsVisible ||
                headingBounds.bottom <= 0;

              if (!shouldSkipFinale) {
                finaleFooter = footer;
                footer.setAttribute("data-thn-finale-ready", "");
                const [firstPhrase, secondPhrase] = contactPhrases;
                const phraseTravel = compact ? 10 : 30;
                const emphasisTravel = compact ? 14 : 38;

                gsap.set(firstPhrase, { x: -phraseTravel });
                gsap.set(secondPhrase, { x: compact ? 6 : 18 });
                gsap.set(contactEmphasis, {
                  x: emphasisTravel,
                  y: compact ? 8 : 18,
                });
                gsap.set(contactCopy, { y: compact ? 5 : 12 });
                gsap.set(footerPeriod, { y: compact ? 6 : 10 });
                gsap.set(footerRule, { scaleX: 0.04 });

                const finale = gsap.timeline({ paused: true });
                finale
                  .addLabel("statement-opens", 0)
                  .to(firstPhrase, { x: 0, duration: 0.24, ease: "power2.out" }, 0)
                  .to(secondPhrase, { x: 0, duration: 0.28, ease: "power2.out" }, 0.1)
                  .addLabel("serif-resolves", 0.24)
                  .to(
                    contactEmphasis,
                    { x: 0, y: 0, duration: 0.34, ease: "power2.out" },
                    0.2,
                  )
                  .to(contactCopy, { y: 0, duration: 0.28, ease: "power2.out" }, 0.38)
                  .addLabel("footer-rule", 0.82)
                  .to(footerRule, { scaleX: 1, duration: 0.14, ease: "power2.out" }, 0.82)
                  .addLabel("terminal-period", 0.88)
                  .to(footerPeriod, { y: 0, duration: 0.12, ease: "power2.out" }, 0.88)
                  .addLabel("final-baseline", 1);

                ScrollTrigger.create({
                  id: "thn-contact-finale",
                  trigger: contactSection,
                  endTrigger: footer,
                  start: "top 84%",
                  end: "bottom bottom",
                  scrub: 0.18,
                  invalidateOnRefresh: true,
                  animation: finale,
                });
              }
            }

            if (coreProgressModule) {
              releaseCoreProgress = coreProgressModule.observeCoreProgress(root, ScrollTrigger);
            }
          });
          if (shouldCorrectInitialAnchor) {
            void document.fonts.ready.then(() => {
              if (!disposed && currentGeneration === generation) {
                ScrollTrigger.refresh();
                scheduleInitialAnchorScroll(currentGeneration);
              }
            });
          }
          cleanup = () => {
            context?.revert();
            releaseCoreProgress();
            scene?.removeAttribute("data-thn-motion-ready");
            scene?.removeAttribute("data-thn-folio-ready");
            finaleFooter?.removeAttribute("data-thn-finale-ready");
            finaleFooter = null;
          };
        } catch {
          context?.revert();
          releaseCoreProgress();
          root
            .querySelector<HTMLElement>("[data-thn-hero-about-scene]")
            ?.removeAttribute("data-thn-motion-ready");
          root
            .querySelector<HTMLElement>("[data-thn-hero-about-scene]")
            ?.removeAttribute("data-thn-folio-ready");
          root
            .querySelector<HTMLElement>("footer")
            ?.removeAttribute("data-thn-finale-ready");
          cleanup = () => {};
          scheduleInitialAnchorScroll(currentGeneration);
        }
      } catch {
        // Keep all server-rendered content available if the animation code cannot load.
        scheduleInitialAnchorScroll(currentGeneration);
      }
    };

    const resetMotion = () => {
      generation += 1;
      cleanup();
      cleanup = () => {};

      if (!reducedMotion.matches) void initialize();
    };

    reducedMotion.addEventListener("change", resetMotion);
    compactLayout.addEventListener("change", resetMotion);
    if (!reducedMotion.matches) void initialize();

    return () => {
      disposed = true;
      generation += 1;
      cancelInitialAnchorScroll();
      reducedMotion.removeEventListener("change", resetMotion);
      compactLayout.removeEventListener("change", resetMotion);
      cleanup();
    };
  }, [profile]);

  return (
    <div ref={rootRef} className={className} id={id} data-thn-preview="">
      {children}
    </div>
  );
}
