"use client";
import dynamic from "next/dynamic";
import type { AnimationKey } from "@/lib/themes";
import type { FieldProps } from "./types";
import MinimalField from "./MinimalField";

const GridField = dynamic(() => import("./GridField"), { ssr: false });
const NeuralField = dynamic(() => import("./NeuralField"), { ssr: false });
const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });
const OrbitField = dynamic(() => import("./OrbitField"), { ssr: false });
const MatrixField = dynamic(() => import("./MatrixField"), { ssr: false });

export const ANIMATION_COMPONENTS: Record<AnimationKey, React.ComponentType<FieldProps>> = {
  grid: GridField,
  neural: NeuralField,
  particles: ParticleField,
  orbit: OrbitField,
  matrix: MatrixField,
  minimal: MinimalField,
};

export function AnimatedField({
  animation,
  accent,
  accent2,
}: { animation: AnimationKey } & FieldProps) {
  const Field = ANIMATION_COMPONENTS[animation] ?? MinimalField;
  return <Field accent={accent} accent2={accent2} />;
}
