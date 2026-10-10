"use client";
import { useEffect, useRef } from "react";
import { hexToRgbString } from "@/lib/color";
import type { FieldProps } from "./types";

const CHARS = "01アイウエオカキクケコ$#%&+=";

/** Stylized falling-character rain, restrained opacity so text stays legible. */
export default function MatrixField({ accent, accent2 }: FieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const A1 = hexToRgbString(accent);
    const A2 = hexToRgbString(accent2);
    const FONT = 14;

    type Column = { y: number; speed: number; chars: string[] };
    let columns: Column[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const count = Math.floor(canvas.offsetWidth / FONT);
      columns = Array.from({ length: count }, () => ({
        y: Math.random() * -canvas.offsetHeight,
        speed: 1.5 + Math.random() * 2.5,
        chars: Array.from({ length: 24 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
      }));
    };

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      ctx.font = `${FONT}px monospace`;
      ctx.textBaseline = "top";

      columns.forEach((col, i) => {
        col.y += col.speed;
        if (col.y > H + col.chars.length * FONT) {
          col.y = -Math.random() * H;
          col.chars = col.chars.map(() => CHARS[Math.floor(Math.random() * CHARS.length)]);
        }
        const x = i * FONT;
        col.chars.forEach((ch, j) => {
          const y = col.y - j * FONT;
          if (y < -FONT || y > H) return;
          const fade = 1 - j / col.chars.length;
          const isHead = j === 0;
          ctx.fillStyle = isHead ? `rgba(${A2},${0.5 * fade})` : `rgba(${A1},${0.22 * fade})`;
          ctx.fillText(ch, x, y);
        });
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
      style={{ opacity: 0.5 }}
    />
  );
}
