"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { PortfolioContent } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Experience({ experience }: { experience: PortfolioContent["experience"] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  if (!experience.length) return null;

  return (
    <section id="experience" ref={ref} className="py-24 md:py-32 bg-[var(--bg-elev)]/40">
      <div className="max-w-[1120px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex items-baseline justify-between mb-16 pb-6 border-b border-[var(--border)]"
        >
          <h2 className="font-[var(--font-serif)] text-2xl md:text-3xl">Experience</h2>
        </motion.div>

        <div className="space-y-0">
          {experience.map((e, i) => (
            <motion.div
              key={`${e.company}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: i * 0.08 }}
              className="py-8 border-b border-[var(--border)] first:pt-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
                <h3 className="font-[var(--font-serif)] text-xl">
                  {e.role}
                  {e.company && <span className="text-[var(--fg-muted)]"> · {e.company}</span>}
                </h3>
                <span className="font-mono text-[12px] text-[var(--fg-subtle)] whitespace-nowrap">
                  {e.startDate} {e.startDate && e.endDate ? "→" : ""} {e.current ? "Present" : e.endDate}
                </span>
              </div>
              {e.location && (
                <p className="text-[13px] text-[var(--fg-subtle)] mb-4">{e.location}</p>
              )}
              {e.description.length > 0 && (
                <ul className="space-y-2">
                  {e.description.map((d, j) => (
                    <li key={j} className="flex gap-3 text-[14.5px] leading-[1.6] text-[var(--fg-muted)]">
                      <span className="text-[var(--accent)] mt-0.5">·</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
