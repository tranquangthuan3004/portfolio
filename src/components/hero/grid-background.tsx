"use client";

import { useEffect, useRef } from "react";

export type BackgroundVibe = "grid" | "wave" | "tunnel" | "rain";

interface GridBackgroundProps {
  vibe?: BackgroundVibe;
}

export function GridBackground({ vibe = "grid" }: GridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vibeRef = useRef<BackgroundVibe>(vibe);
  const prevVibeRef = useRef<BackgroundVibe>(vibe);
  const transitionFrameRef = useRef<number>(0);

  // Sync prop to ref immediately so animation loop can read the latest value
  // without rebuilding the useEffect or resetting animation frames
  useEffect(() => {
    if (vibeRef.current !== vibe) {
      prevVibeRef.current = vibeRef.current;
      vibeRef.current = vibe;
      transitionFrameRef.current = 1;
    }
  }, [vibe]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1920;
    const H = 1080;
    canvas.width = W;
    canvas.height = H;

    let frame = 0;
    const LOOP = 780;

    // ── shared helpers ──
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // ── particles shared ──
    const pts = Array.from({ length: 100 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -Math.random() * 0.5 - 0.1,
      r: 0.6 + Math.random() * 1.8,
      a: 0.2 + Math.random() * 0.6,
    }));

    function drawPts(cx: CanvasRenderingContext2D) {
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) {
          p.y = H + 4;
          p.x = Math.random() * W;
        }
        if (p.x < -4) p.x = W + 4;
        if (p.x > W + 4) p.x = -4;
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fillStyle = `rgba(160,190,255,${p.a})`;
        cx.fill();
      });
    }

    // ── rain drops ──
    const drops = Array.from({ length: 200 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      len: 40 + Math.random() * 120,
      speed: 8 + Math.random() * 14,
      alpha: 0.15 + Math.random() * 0.55,
      width: 0.5 + Math.random() * 1.2,
    }));

    function drawRain(cx: CanvasRenderingContext2D) {
      drops.forEach((d) => {
        d.y += d.speed;
        if (d.y > H + d.len) {
          d.y = -d.len;
          d.x = Math.random() * W;
        }
        const g = cx.createLinearGradient(d.x, d.y - d.len, d.x, d.y);
        g.addColorStop(0, `rgba(100,160,255,0)`);
        g.addColorStop(0.6, `rgba(120,180,255,${d.alpha * 0.6})`);
        g.addColorStop(1, `rgba(160,210,255,${d.alpha})`);
        cx.beginPath();
        cx.moveTo(d.x, d.y - d.len);
        cx.lineTo(d.x, d.y);
        cx.strokeStyle = g;
        cx.lineWidth = d.width;
        cx.stroke();
      });
      // floor splash glow
      const fg = cx.createLinearGradient(0, H * 0.7, 0, H);
      fg.addColorStop(0, "rgba(60,100,200,0)");
      fg.addColorStop(1, "rgba(60,100,200,0.15)");
      cx.fillStyle = fg;
      cx.fillRect(0, H * 0.7, W, H * 0.3);
    }

    // ── GRID MODE ──
    function drawGrid(cx: CanvasRenderingContext2D) {
      const progress = (frame % LOOP) / LOOP;
      const oy = progress; // 0→1 vertical scroll offset

      // horizon point
      const hx = W / 2;
      const hy = H * 0.48;
      const GCOLS = 20;
      const GROWS = 30;
      const floorY = H + 100;

      // vertical lines
      for (let c = 0; c <= GCOLS; c++) {
        const frac = c / GCOLS; // 0..1
        const xTop = lerp(hx - 0.5, hx + 0.5, frac); // converge to horizon
        const xBot = lerp(-W * 0.3, W * 1.3, frac);
        const isMajor = c % 5 === 0;
        const alpha = isMajor ? 0.7 : 0.28;
        const g = cx.createLinearGradient(xTop, hy, xBot, floorY);
        g.addColorStop(0, `rgba(80,120,255,0)`);
        g.addColorStop(0.15, `rgba(80,130,255,${alpha * 0.6})`);
        g.addColorStop(0.6, `rgba(100,150,255,${alpha})`);
        g.addColorStop(1, `rgba(120,160,255,${alpha * 0.3})`);
        cx.beginPath();
        cx.moveTo(xTop, hy);
        cx.lineTo(xBot, floorY);
        cx.strokeStyle = g;
        cx.lineWidth = isMajor ? 1.2 : 0.5;
        cx.stroke();
      }

      // horizontal lines — scroll upward
      for (let r = 0; r < GROWS + 2; r++) {
        const rawT = (r / GROWS + oy) % 1; // 0..1 with wrap
        // perspective: rawT=0 → horizon, rawT=1 → floor
        const pt = Math.pow(rawT, 1.6); // ease perspective
        const y = lerp(hy, floorY, pt);
        const xL = lerp(hx, -W * 0.3, pt);
        const xR = lerp(hx, W * 1.3, pt);
        const isMajor =
          Math.round((r + Math.floor((frame / LOOP) * GROWS)) % 5) === 0;
        const alpha = pt * (isMajor ? 0.75 : 0.3);
        const g = cx.createLinearGradient(xL, y, xR, y);
        g.addColorStop(0, `rgba(80,130,255,0)`);
        g.addColorStop(0.15, `rgba(80,140,255,${alpha})`);
        g.addColorStop(0.5, `rgba(110,160,255,${alpha * 1.1})`);
        g.addColorStop(0.85, `rgba(80,140,255,${alpha})`);
        g.addColorStop(1, `rgba(80,130,255,0)`);
        cx.beginPath();
        cx.moveTo(xL, y);
        cx.lineTo(xR, y);
        cx.strokeStyle = g;
        cx.lineWidth = isMajor ? 1.0 : 0.45;
        cx.stroke();
      }

      // horizon glow line
      const hg = cx.createLinearGradient(0, hy, W, hy);
      hg.addColorStop(0, "rgba(80,140,255,0)");
      hg.addColorStop(0.3, "rgba(100,160,255,0.6)");
      hg.addColorStop(0.5, "rgba(140,180,255,0.9)");
      hg.addColorStop(0.7, "rgba(100,160,255,0.6)");
      hg.addColorStop(1, "rgba(80,140,255,0)");
      cx.beginPath();
      cx.moveTo(0, hy);
      cx.lineTo(W, hy);
      cx.strokeStyle = hg;
      cx.lineWidth = 2;
      cx.stroke();

      // glow orb at horizon
      const pulse = 0.8 + 0.2 * Math.sin(frame * 0.04);
      const og = cx.createRadialGradient(hx, hy, 0, hx, hy, W * 0.5 * pulse);
      og.addColorStop(0, "rgba(60,100,255,0.22)");
      og.addColorStop(0.3, "rgba(40,80,200,0.10)");
      og.addColorStop(0.7, "rgba(20,40,140,0.04)");
      og.addColorStop(1, "rgba(0,0,0,0)");
      cx.fillStyle = og;
      cx.fillRect(0, 0, W, H);
    }

    // ── WAVE MODE ──
    function drawWave(cx: CanvasRenderingContext2D) {
      const t = frame / LOOP;
      const LINES = 50;
      for (let l = 0; l < LINES; l++) {
        const yBase = (l / LINES) * H;
        const amp = 60 + 40 * Math.sin(l * 0.3);
        const freq = 2.5 + l * 0.05;
        const phase = t * Math.PI * 2 * (0.5 + l * 0.03) + l * 0.4;
        const alpha = 0.15 + 0.4 * Math.pow(Math.sin((l / LINES) * Math.PI), 2);
        cx.beginPath();
        for (let x = 0; x <= W; x += 4) {
          const y =
            yBase +
            amp * Math.sin(freq * (x / W) * Math.PI * 2 + phase) +
            20 * Math.sin(freq * 2.3 * (x / W) * Math.PI * 2 + phase * 1.7);
          x === 0 ? cx.moveTo(x, y) : cx.lineTo(x, y);
        }
        const hue = 220 + l * 1.5;
        cx.strokeStyle = `hsla(${hue},80%,65%,${alpha})`;
        cx.lineWidth = 0.8;
        cx.stroke();
      }
      // center glow
      const cg = cx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.6);
      cg.addColorStop(0, "rgba(80,100,255,0.12)");
      cg.addColorStop(1, "rgba(0,0,0,0)");
      cx.fillStyle = cg;
      cx.fillRect(0, 0, W, H);
    }

    // ── TUNNEL MODE ──
    function drawTunnel(cx: CanvasRenderingContext2D) {
      const t = (frame % LOOP) / LOOP;
      const cx2 = W / 2;
      const cy2 = H / 2;
      const RINGS = 30;
      const SPOKES = 16;

      for (let r = RINGS; r >= 0; r--) {
        const tOff = (r / RINGS + t) % 1;
        const radius = Math.pow(tOff, 0.7) * Math.min(W, H) * 0.85;
        if (radius < 2) continue;
        const alpha = tOff * 0.6;
        const isMajor = r % 5 === 0;
        cx.beginPath();
        cx.arc(cx2, cy2, radius, 0, Math.PI * 2);
        cx.strokeStyle = isMajor
          ? `rgba(100,160,255,${alpha * 1.3})`
          : `rgba(60,100,200,${alpha * 0.5})`;
        cx.lineWidth = isMajor ? 1.2 : 0.4;
        cx.stroke();
      }
      for (let s = 0; s < SPOKES; s++) {
        const angle = (s / SPOKES) * Math.PI * 2 + t * Math.PI * 0.5;
        const innerR = 30;
        const outerR = Math.min(W, H) * 0.85;
        const sg = cx.createLinearGradient(
          cx2 + innerR * Math.cos(angle),
          cy2 + innerR * Math.sin(angle),
          cx2 + outerR * Math.cos(angle),
          cy2 + outerR * Math.sin(angle)
        );
        sg.addColorStop(0, "rgba(120,170,255,0)");
        sg.addColorStop(0.3, "rgba(100,150,255,0.35)");
        sg.addColorStop(1, "rgba(60,100,200,0)");
        cx.beginPath();
        cx.moveTo(cx2 + innerR * Math.cos(angle), cy2 + innerR * Math.sin(angle));
        cx.lineTo(cx2 + outerR * Math.cos(angle), cy2 + outerR * Math.sin(angle));
        cx.strokeStyle = sg;
        cx.lineWidth = 0.6;
        cx.stroke();
      }
      // core glow
      const core = cx.createRadialGradient(cx2, cy2, 0, cx2, cy2, 120);
      core.addColorStop(0, "rgba(140,180,255,0.4)");
      core.addColorStop(0.4, "rgba(80,120,255,0.12)");
      core.addColorStop(1, "rgba(0,0,0,0)");
      cx.fillStyle = core;
      cx.fillRect(0, 0, W, H);
    }

    // ── scan line ──
    function drawScan(cx: CanvasRenderingContext2D) {
      const sy = ((frame % LOOP) / LOOP) * (H + 300) - 150;
      const sg = cx.createLinearGradient(0, sy - 100, 0, sy + 100);
      sg.addColorStop(0, "rgba(120,160,255,0)");
      sg.addColorStop(0.35, "rgba(120,160,255,0.04)");
      sg.addColorStop(0.5, "rgba(160,200,255,0.13)");
      sg.addColorStop(0.65, "rgba(120,160,255,0.04)");
      sg.addColorStop(1, "rgba(120,160,255,0)");
      cx.fillStyle = sg;
      cx.fillRect(0, sy - 100, W, 200);
    }

    // ── vignette ──
    function drawVig(cx: CanvasRenderingContext2D) {
      const vg = cx.createRadialGradient(
        W / 2,
        H / 2,
        H * 0.15,
        W / 2,
        H / 2,
        W * 0.85
      );
      vg.addColorStop(0, "rgba(0,0,12,0)");
      vg.addColorStop(1, "rgba(0,0,12,0.88)");
      cx.fillStyle = vg;
      cx.fillRect(0, 0, W, H);
    }

    // ── RENDER ──
    function render() {
      if (!ctx) return;
      ctx.fillStyle = "#03030f";
      ctx.fillRect(0, 0, W, H);

      const activeVibe = vibeRef.current;
      const prevVibe = prevVibeRef.current;
      const tFrame = transitionFrameRef.current;
      const transitionDuration = 45; // ~0.75s transition at 60fps

      if (tFrame > 0) {
        const progress = tFrame / transitionDuration;
        // Cubic ease in-out
        const eased = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        // Draw previous mode fading out
        ctx.save();
        ctx.globalAlpha = 1 - eased;
        if (prevVibe === "grid") drawGrid(ctx);
        else if (prevVibe === "wave") drawWave(ctx);
        else if (prevVibe === "tunnel") drawTunnel(ctx);
        else if (prevVibe === "rain") drawRain(ctx);
        ctx.restore();

        // Draw current (new) mode fading in
        ctx.save();
        ctx.globalAlpha = eased;
        if (activeVibe === "grid") drawGrid(ctx);
        else if (activeVibe === "wave") drawWave(ctx);
        else if (activeVibe === "tunnel") drawTunnel(ctx);
        else if (activeVibe === "rain") drawRain(ctx);
        ctx.restore();

        transitionFrameRef.current += 1;
        if (transitionFrameRef.current > transitionDuration) {
          transitionFrameRef.current = 0;
          prevVibeRef.current = activeVibe;
        }
      } else {
        ctx.save();
        ctx.globalAlpha = 1;
        if (activeVibe === "grid") drawGrid(ctx);
        else if (activeVibe === "wave") drawWave(ctx);
        else if (activeVibe === "tunnel") drawTunnel(ctx);
        else if (activeVibe === "rain") drawRain(ctx);
        ctx.restore();
      }

      drawPts(ctx);
      drawScan(ctx);
      drawVig(ctx);

      frame++;
    }

    let rafId: number;
    function loop() {
      render();
      rafId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full object-cover pointer-events-none opacity-85 transition-opacity duration-1000"
    />
  );
}
