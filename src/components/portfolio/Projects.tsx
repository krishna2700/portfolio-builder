"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { PortfolioContent } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Projects({ projects }: { projects: PortfolioContent["projects"] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  if (!projects.length) return null;

  return (
    <section id="work" ref={ref} className="py-24 md:py-32">
      <div className="max-w-[1120px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex items-baseline justify-between mb-16 pb-6 border-b border-[var(--border)]"
        >
          <h2 className="font-[var(--font-serif)] text-2xl md:text-3xl">Work</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <motion.div
              key={`${p.title}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: i * 0.07 }}
              className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)]"
            >
              <h3 className="font-[var(--font-serif)] text-xl mb-2">{p.title}</h3>
              <p className="text-[14px] leading-[1.6] text-[var(--fg-muted)] mb-4">{p.description}</p>
              {p.tech.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono border border-[var(--border)] text-[var(--fg-muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-4">
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--accent)]">
                    GitHub ↗
                  </a>
                )}
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--accent)]">
                    Live ↗
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
