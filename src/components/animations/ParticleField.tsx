"use client";
import { useEffect, useRef } from "react";
import { hexToRgbString } from "@/lib/color";
import type { FieldProps } from "./types";

/** Slow-drifting glowing embers, rising and fading — warm/ambient feel. */
export default function ParticleField({ accent, accent2 }: FieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const A1 = hexToRgbString(accent);
    const A2 = hexToRgbString(accent2);

    type Ember = { x: number; y: number; r: number; speed: number; drift: number; hue: string; life: number; maxLife: number };
    const embers: Ember[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const area = canvas.offsetWidth * canvas.offsetHeight;
      const count = Math.min(50, Math.max(20, Math.floor(area / 22000)));
      embers.length = 0;
      for (let i = 0; i < count; i++) embers.push(spawnEmber(canvas));
    };

    function spawnEmber(c: HTMLCanvasElement): Ember {
      return {
        x: Math.random() * c.offsetWidth,
        y: c.offsetHeight + Math.random() * 100,
        r: 1 + Math.random() * 2.2,
        speed: 0.15 + Math.random() * 0.35,
        drift: (Math.random() - 0.5) * 0.3,
        hue: Math.random() > 0.6 ? A2 : A1,
        life: 0,
        maxLife: 400 + Math.random() * 400,
      };
    }

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      for (const e of embers) {
        e.y -= e.speed;
        e.x += e.drift;
        e.life += 1;
        const lifeFrac = e.life / e.maxLife;
        const alpha = Math.sin(lifeFrac * Math.PI) * 0.75;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${e.hue},${alpha})`;
        ctx.shadowColor = `rgba(${e.hue},${alpha})`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (e.life >= e.maxLife || e.y < -20) {
          Object.assign(e, spawnEmber(canvas));
        }
      }
      void W; void H;
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
