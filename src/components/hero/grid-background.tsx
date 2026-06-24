"use client";

import { useEffect, useRef } from "react";

export function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1920;
    const H = 1080;
    canvas.width = W;
    canvas.height = H;

    const mode = "grid"; // Run "grid" mode as background
    let t = 0;
    const LOOP = 720;

    const PALETTE = {
      bg: "#050508",
      gridBase: "rgba(60,70,110,",
      gridAcc: "rgba(100,120,200,",
      glowCol: "rgba(80,100,180,",
      particle: "rgba(140,160,255,",
      scan: "rgba(120,140,220,",
      vignette: "rgba(0,0,8,",
    };

    // Particles setup
    const PCOUNT = 80;
    const particles = Array.from({ length: PCOUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random() * 0.8 + 0.1,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.3 - 0.05,
      r: Math.random() * 1.4 + 0.4,
      phase: Math.random() * Math.PI * 2,
      blink: Math.random() > 0.6,
    }));

    function drawGrid(tVal: number) {
      if (!ctx) return;
      const SPEED = tVal / LOOP;
      const vp = { x: W / 2, y: H * 0.42 };
      const COLS = 24;
      const ROWS = 20;
      const GW = W * 1.6;
      const GH = H * 1.2;
      const HORIZON = H * 0.42;
      const FLOOR = H + 60;
      const offset = (SPEED % 1) * (GH / ROWS);

      ctx.save();

      // Horizontal lines
      for (let r = 0; r <= ROWS + 2; r++) {
        const yBase = HORIZON + (r / ROWS) * (FLOOR - HORIZON) - offset;
        if (yBase < HORIZON || yBase > FLOOR + 10) continue;
        const prog = (yBase - HORIZON) / (FLOOR - HORIZON);
        const alpha = Math.pow(prog, 1.2) * 0.55;
        const isAcc = r % 4 === 0;
        ctx.beginPath();
        const xL = vp.x - (GW / 2) * prog;
        const xR = vp.x + (GW / 2) * prog;
        ctx.moveTo(xL, yBase);
        ctx.lineTo(xR, yBase);
        ctx.strokeStyle = isAcc
          ? PALETTE.gridAcc + (alpha * 1.4).toFixed(3) + ")"
          : PALETTE.gridBase + alpha.toFixed(3) + ")";
        ctx.lineWidth = isAcc ? 0.8 : 0.4;
        ctx.stroke();
      }

      // Vertical perspective lines
      for (let c = 0; c <= COLS; c++) {
        const frac = c / COLS;
        const xTop = vp.x + (frac - 0.5) * GW * 0.05;
        const xBot = vp.x + (frac - 0.5) * GW;
        const isAcc = c % 6 === 0;
        const alpha = isAcc ? 0.45 : 0.22;
        ctx.beginPath();
        ctx.moveTo(xTop, HORIZON);
        ctx.lineTo(xBot, FLOOR + 60);
        ctx.strokeStyle = isAcc
          ? PALETTE.gridAcc + alpha + ")"
          : PALETTE.gridBase + alpha + ")";
        ctx.lineWidth = isAcc ? 0.7 : 0.3;
        ctx.stroke();
      }

      ctx.restore();
    }

    function drawHex(tVal: number) {
      if (!ctx) return;
      const SPEED = tVal / LOOP;
      const SIZE = 58;
      const COLS = 36;
      const ROWS = 18;
      const driftX = Math.sin(SPEED * Math.PI * 2) * 12;
      const driftY = (SPEED % 1) * SIZE * 2.1;
      
      ctx.save();
      for (let r = -1; r < ROWS + 2; r++) {
        for (let c = -1; c < COLS + 2; c++) {
          const ox = r % 2 === 0 ? 0 : (SIZE * Math.sqrt(3)) / 2;
          const cx2 = c * SIZE * Math.sqrt(3) + ox + driftX - SIZE * 2;
          const cy2 = r * SIZE * 1.5 + (driftY % (SIZE * 3)) - SIZE;
          const distC = Math.abs(cx2 - W / 2) / W;
          const distR = Math.abs(cy2 - H / 2) / H;
          const dist = Math.sqrt(distC * distC + distR * distR);
          const alpha = Math.max(0, 0.35 - dist * 0.9);
          if (alpha < 0.01) continue;

          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i - Math.PI / 6;
            const px = cx2 + (SIZE - 2) * Math.cos(a);
            const py = cy2 + (SIZE - 2) * Math.sin(a);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.strokeStyle = PALETTE.gridAcc + alpha.toFixed(3) + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    function drawDots(tVal: number) {
      if (!ctx) return;
      const SPEED = tVal / LOOP;
      const COLS = 48;
      const ROWS = 27;
      const CW = W / COLS;
      const CH = H / ROWS;
      const driftX = (SPEED % 1) * CW;
      const driftY = (SPEED % 1) * CH;

      ctx.save();
      for (let r = -1; r < ROWS + 2; r++) {
        for (let c = -1; c < COLS + 2; c++) {
          const px = c * CW + driftX;
          const py = r * CH + driftY;
          const distX = Math.abs(px - W / 2) / (W / 2);
          const distY = Math.abs(py - H / 2) / (H / 2);
          const dist = Math.sqrt(distX * distX + distY * distY);
          const pulse = 0.5 + 0.5 * Math.sin(SPEED * Math.PI * 2 - dist * 4);
          const alpha = pulse * Math.max(0, 0.5 - dist * 0.35);
          if (alpha < 0.01) continue;

          const r2 = 1.2 + pulse * 0.8;
          ctx.beginPath();
          ctx.arc(px, py, r2, 0, Math.PI * 2);
          ctx.fillStyle = PALETTE.gridAcc + alpha.toFixed(3) + ")";
          ctx.fill();
        }
      }
      ctx.restore();
    }

    function drawParticles(tVal: number) {
      if (!ctx) return;
      const speed = tVal / LOOP;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy * (0.6 + p.z * 0.4);
        if (p.y < -10) {
          p.y = H + 10;
          p.x = Math.random() * W;
        }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;

        const bAlpha = p.blink
          ? 0.3 + 0.7 * Math.abs(Math.sin(speed * Math.PI * 4 + p.phase))
          : 0.4 + 0.5 * p.z;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.z, 0, Math.PI * 2);
        ctx.fillStyle = PALETTE.particle + (bAlpha * p.z).toFixed(3) + ")";
        ctx.fill();
      });
    }

    function drawScan(tVal: number) {
      if (!ctx) return;
      const yS = ((tVal / LOOP) % 1) * (H + 200) - 100;
      const grad = ctx.createLinearGradient(0, yS - 80, 0, yS + 80);
      grad.addColorStop(0, PALETTE.scan + "0)");
      grad.addColorStop(0.4, PALETTE.scan + "0.03)");
      grad.addColorStop(0.5, PALETTE.scan + "0.08)");
      grad.addColorStop(0.6, PALETTE.scan + "0.03)");
      grad.addColorStop(1, PALETTE.scan + "0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, yS - 80, W, 160);
    }

    function drawGlow(tVal: number) {
      if (!ctx) return;
      const pulse = 0.85 + 0.15 * Math.sin((tVal / LOOP) * Math.PI * 2);
      const r = W * 0.35 * pulse;
      const cx2 = W / 2, cy2 = H * 0.42;
      const grad = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, r);
      grad.addColorStop(0, PALETTE.glowCol + "0.09)");
      grad.addColorStop(0.5, PALETTE.glowCol + "0.04)");
      grad.addColorStop(1, PALETTE.glowCol + "0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    function drawVignette() {
      if (!ctx) return;
      const grad = ctx.createRadialGradient(
        W / 2,
        H / 2,
        H * 0.2,
        W / 2,
        H / 2,
        W * 0.8
      );
      grad.addColorStop(0, PALETTE.vignette + "0)");
      grad.addColorStop(1, PALETTE.vignette + "0.75)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    function drawNoise() {
      if (!ctx) return;
      ctx.save();
      ctx.globalAlpha = 0.022;
      for (let i = 0; i < 1200; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        const s = Math.random() * 1.5;
        ctx.fillStyle = `rgba(255,255,255,${Math.random()})`;
        ctx.fillRect(x, y, s, s);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function render() {
      if (!ctx) return;
      ctx.fillStyle = PALETTE.bg;
      ctx.fillRect(0, 0, W, H);

      drawGlow(t);
      if (mode === "grid") drawGrid(t);
      else if (mode === "hex") drawHex(t);
      else if (mode === "dots") drawDots(t);

      drawParticles(t);
      drawScan(t);
      drawNoise();
      drawVignette();

      t = (t + 1) % LOOP;
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
      className="absolute inset-0 h-full w-full object-cover pointer-events-none opacity-85"
    />
  );
}
