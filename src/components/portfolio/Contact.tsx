"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { PortfolioContent } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Contact({ about }: { about: PortfolioContent["about"] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  if (!about.email) return null;

  return (
    <section id="contact" ref={ref} className="py-24 md:py-32">
      <div className="max-w-[1120px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
        >
          <h2 className="font-[var(--font-serif)] text-[clamp(1.8rem,5vw,3.2rem)] leading-[1.1] max-w-2xl mb-8">
            Let&rsquo;s build something worth shipping.
          </h2>
          <a
            href={`mailto:${about.email}`}
            className="inline-flex items-center gap-3 px-6 py-4 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elev)] text-[15px] font-mono"
          >
            {about.email} ↗
          </a>
          {about.location && (
            <p className="mt-6 text-[13px] text-[var(--fg-subtle)]">{about.location}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
