"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { PortfolioContent } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;

export default function About({ content }: { content: PortfolioContent }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { about } = content;

  const links = [
    about.email && { k: "Email", v: about.email, href: `mailto:${about.email}` },
    about.github && { k: "GitHub", v: about.github.replace(/^https?:\/\/(www\.)?github\.com\//, ""), href: about.github },
    about.linkedin && { k: "LinkedIn", v: about.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, ""), href: about.linkedin },
  ].filter(Boolean) as { k: string; v: string; href: string }[];

  if (!about.bio && !about.bio2 && links.length === 0) return null;

  return (
    <section id="about" ref={ref} className="py-24 md:py-32">
      <div className="max-w-[1120px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex items-baseline justify-between mb-16 pb-6 border-b border-[var(--border)]"
        >
          <h2 className="font-[var(--font-serif)] text-2xl md:text-3xl">About</h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="lg:col-span-7 space-y-5 text-[15.5px] leading-[1.7] text-[var(--fg-muted)] max-w-[60ch]"
          >
            {about.bio && <p>{about.bio}</p>}
            {about.bio2 && <p>{about.bio2}</p>}
          </motion.div>

          {links.length > 0 && (
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
              className="lg:col-span-5 lg:pl-10 lg:border-l lg:border-[var(--border)]"
            >
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.k}>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="group flex items-baseline justify-between gap-4 py-2 border-b border-[var(--border)]"
                    >
                      <span className="text-[14px] text-[var(--fg-muted)]">{l.k}</span>
                      <span className="text-[14px] group-hover:text-[var(--accent)] transition-colors">{l.v}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.aside>
          )}
        </div>
      </div>
    </section>
  );
}
