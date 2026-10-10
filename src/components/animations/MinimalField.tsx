import type { FieldProps } from "./types";
import { hexToRgbString } from "@/lib/color";

/** Barely-there ambient glow — no canvas, pure CSS, for quiet/editorial themes. */
export default function MinimalField({ accent }: FieldProps) {
  const A1 = hexToRgbString(accent);
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(55% 45% at 50% 0%, rgba(${A1},0.07) 0%, transparent 70%)`,
      }}
    />
  );
}
