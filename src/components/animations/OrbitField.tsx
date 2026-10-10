"use client";
import { useEffect, useRef } from "react";
import { hexToRgbString } from "@/lib/color";
import type { FieldProps } from "./types";

/** Concentric rings with orbiting satellite dots, slow and elegant. */
export default function OrbitField({ accent, accent2 }: FieldProps) {
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

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const rings = [0.18, 0.28, 0.4, 0.54].map((r, i) => ({
      radiusFrac: r,
      speed: 0.08 + i * 0.03,
      dir: i % 2 === 0 ? 1 : -1,
      satellites: 1 + (i % 2),
    }));

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      t += 0.006;

      const cx = W * 0.82;
      const cy = H * 0.38;
      const baseR = Math.min(W, H) * 0.55;

      rings.forEach((ring, idx) => {
        const r = baseR * ring.radiusFrac;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${A1},${0.08 - idx * 0.012})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        for (let s = 0; s < ring.satellites; s++) {
          const angle = t * ring.speed * ring.dir + (s * Math.PI * 2) / ring.satellites;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          const glow = Math.sin(t * 2 + idx) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(x, y, 2.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${idx % 2 === 0 ? A1 : A2},${0.5 + glow * 0.4})`;
          ctx.shadowColor = `rgba(${idx % 2 === 0 ? A1 : A2},0.8)`;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

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
      style={{ opacity: 0.9 }}
    />
  );
}
