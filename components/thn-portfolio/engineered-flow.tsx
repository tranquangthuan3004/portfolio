"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CoreSceneProgressContext } from "./core-scene-progress";

const FlowCanvas = dynamic(() => import("./engineered-flow-canvas"), { ssr: false });

function FlowFallback() {
  return (
    <svg data-thn-flow-fallback="" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="thn-flow-metal" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#252b32" /><stop offset=".45" stopColor="#9ea7ad" /><stop offset=".58" stopColor="#e8edef" /><stop offset=".72" stopColor="#555e67" /><stop offset="1" stopColor="#242a31" /></linearGradient>
      </defs>
      <g fill="none" stroke="url(#thn-flow-metal)" strokeWidth="74"><path d="M780 1000C1220 880 1370 590 1190 310S1050 90 1390-80" /><path d="M1510 920C1170 820 860 560 1040 320S1260 40 1080-100" /><path d="M1500 190C1110 120 930 440 1180 760S1300 940 1550 970" /></g>
      <path d="M799 1000C1238 880 1388 590 1208 310S1068 90 1408-80" fill="none" stroke="#FF6A13" strokeWidth="5" />
    </svg>
  );
}

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function EngineeredFlow({ persistent = false }: { persistent?: boolean } = {}) {
  const host = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const progress = useContext(CoreSceneProgressContext);
  const [eligible, setEligible] = useState(false);
  const [active, setActive] = useState(false);
  const [compact, setCompact] = useState(false);
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const fail = useCallback(() => setFailed(true), []);

  useEffect(() => {
    const element = host.current;
    const root = element?.closest<HTMLElement>("[data-thn-preview]");
    const interactionRegion = persistent ? root : element?.closest<HTMLElement>("#hero");
    if (!element || !root || !interactionRegion) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 820px)");
    let inView = false;
    const preferences = () => { setEligible(!reduced.matches); setCompact(mobile.matches); };
    const visibility = () => setActive(inView && !document.hidden);
    const theme = () => setDark(root.dataset.thnVisualBTheme === "dark");
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; visibility(); }, { rootMargin: "100px" });
    const mutation = new MutationObserver(theme);
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer.current.x = event.clientX / innerWidth * 2 - 1;
      pointer.current.y = event.clientY / innerHeight * 2 - 1;
      progress?.invalidate?.();
    };
    const leave = () => { pointer.current.x = 0; pointer.current.y = 0; progress?.invalidate?.(); };
    preferences(); theme(); observer.observe(interactionRegion);
    mutation.observe(root, { attributes: true, attributeFilter: ["data-thn-visual-b-theme"] });
    reduced.addEventListener("change", preferences); mobile.addEventListener("change", preferences);
    document.addEventListener("visibilitychange", visibility);
    interactionRegion.addEventListener("pointermove", move, { passive: true }); interactionRegion.addEventListener("pointerleave", leave);
    return () => {
      observer.disconnect(); mutation.disconnect(); reduced.removeEventListener("change", preferences); mobile.removeEventListener("change", preferences);
      document.removeEventListener("visibilitychange", visibility); interactionRegion.removeEventListener("pointermove", move); interactionRegion.removeEventListener("pointerleave", leave);
    };
  }, [persistent, progress]);

  return (
    <div ref={host} data-thn-flow-visual="" data-thn-flow-ready={ready && !failed && eligible ? "true" : "false"}>
      <FlowFallback />
      {eligible && !failed && <SceneBoundary onFailure={fail}><FlowCanvas active={active} compact={compact} dark={dark} pointer={pointer} progress={progress} onReady={setReady} onFailure={fail} /></SceneBoundary>}
    </div>
  );
}
