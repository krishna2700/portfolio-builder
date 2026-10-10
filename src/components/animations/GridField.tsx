"use client";
import { useEffect, useRef } from "react";
import { hexToRgbString } from "@/lib/color";
import type { FieldProps } from "./types";

/** Pulsing dot grid with occasional data-flow lines. */
export default function GridField({ accent }: FieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const GRID = 48;
    const ACCENT = hexToRgbString(accent);
    const DOT = "255,255,255";

    type Particle = { progress: number; speed: number; col: number; row: number; dir: "h" | "v" };
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const spawn = () => {
      const cols = Math.floor(canvas.offsetWidth / GRID);
      const rows = Math.floor(canvas.offsetHeight / GRID);
      particles.push({
        progress: 0,
        speed: 0.003 + Math.random() * 0.004,
        col: Math.floor(Math.random() * cols),
        row: Math.floor(Math.random() * rows),
        dir: Math.random() > 0.5 ? "h" : "v",
      });
    };

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      t += 0.008;
      const cols = Math.floor(W / GRID);
      const rows = Math.floor(H / GRID);

      for (let c = 0; c <= cols; c++) {
        for (let r = 0; r <= rows; r++) {
          const dist = Math.sqrt((c - cols / 2) ** 2 + (r - rows / 2) ** 2);
          const wave = Math.sin(dist * 0.4 - t * 1.5) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(c * GRID, r * GRID, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${DOT},${0.04 + wave * 0.06})`;
          ctx.fill();
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed;
        if (p.progress >= 1) { particles.splice(i, 1); continue; }
        const alpha = Math.sin(p.progress * Math.PI) * 0.8;
        if (p.dir === "h") {
          const y = p.row * GRID;
          const x2 = p.progress * W;
          ctx.beginPath();
          ctx.arc(x2, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ACCENT},${alpha})`;
          ctx.fill();
        } else {
          const x = p.col * GRID;
          const y2 = p.progress * H;
          ctx.beginPath();
          ctx.arc(x, y2, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ACCENT},${alpha})`;
          ctx.fill();
        }
      }

      if (Math.random() < 0.015 && particles.length < 6) spawn();
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
  }, [accent]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}
