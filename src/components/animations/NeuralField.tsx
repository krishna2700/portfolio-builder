"use client";
import { useEffect, useRef } from "react";
import { hexToRgbString } from "@/lib/color";
import type { FieldProps } from "./types";

/** Drifting nodes connected by proximity, with signal pulses along edges. */
export default function NeuralField({ accent, accent2 }: FieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const A1 = hexToRgbString(accent);
    const A2 = hexToRgbString(accent2);
    const LINK_DIST = 150;

    type Node = { x: number; y: number; vx: number; vy: number; r: number; hue: string; phase: number };
    type Pulse = { from: number; to: number; progress: number; speed: number };
    const nodes: Node[] = [];
    const pulses: Pulse[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const area = canvas.offsetWidth * canvas.offsetHeight;
      const count = Math.min(46, Math.max(18, Math.floor(area / 26000)));
      nodes.length = 0;
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          r: 1.2 + Math.random() * 1.4,
          hue: Math.random() > 0.72 ? A2 : A1,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const spawnPulse = () => {
      if (nodes.length < 2 || pulses.length >= 4) return;
      const from = Math.floor(Math.random() * nodes.length);
      let to = Math.floor(Math.random() * nodes.length);
      let guard = 0;
      while (to === from && guard++ < 5) to = Math.floor(Math.random() * nodes.length);
      const a = nodes[from];
      const b = nodes[to];
      if (Math.hypot(a.x - b.x, a.y - b.y) > LINK_DIST) return;
      pulses.push({ from, to, progress: 0, speed: 0.012 + Math.random() * 0.01 });
    };

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      t += 0.012;

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = W + 20;
        if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20;
        if (n.y > H + 20) n.y = -20;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > LINK_DIST) continue;
          const alpha = (1 - dist / LINK_DIST) * 0.16;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${A1},${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        const fire = Math.sin(t * 1.4 + n.phase) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + fire * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.hue},${0.25 + fire * 0.45})`;
        ctx.fill();
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed;
        if (p.progress >= 1) { pulses.splice(i, 1); continue; }
        const a = nodes[p.from], b = nodes[p.to];
        if (!a || !b) { pulses.splice(i, 1); continue; }
        const x = a.x + (b.x - a.x) * p.progress;
        const y = a.y + (b.y - a.y) * p.progress;
        const alpha = Math.sin(p.progress * Math.PI);
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${A2},${alpha})`;
        ctx.shadowColor = `rgba(${A2},${alpha})`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (Math.random() < 0.02) spawnPulse();
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [accent, accent2]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
}
