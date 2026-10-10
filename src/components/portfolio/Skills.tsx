"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { PortfolioContent } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Skills({ skillTiers }: { skillTiers: PortfolioContent["skillTiers"] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  if (!skillTiers.length) return null;

  return (
    <section id="skills" ref={ref} className="py-24 md:py-32 bg-[var(--bg-elev)]/40">
      <div className="max-w-[1120px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex items-baseline justify-between mb-16 pb-6 border-b border-[var(--border)]"
        >
          <h2 className="font-[var(--font-serif)] text-2xl md:text-3xl">Stack &amp; tools</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {skillTiers.map((tier, i) => (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: i * 0.08 }}
            >
              <h3 className="font-[var(--font-serif)] text-lg mb-4">{tier.label}</h3>
              <div className="flex flex-wrap gap-2">
                {tier.items.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded-md text-[12px] font-mono border border-[var(--border)] text-[var(--fg-muted)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
