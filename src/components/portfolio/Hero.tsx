"use client";
import { motion } from "framer-motion";
import type { PortfolioContent } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero({
  content,
  photoUrl,
  resumeUrl,
}: {
  content: PortfolioContent;
  photoUrl?: string | null;
  resumeUrl?: string | null;
}) {
  const { hero, about } = content;
  const [first, ...rest] = (hero.name || "Your Name").split(" ");
  const last = rest.join(" ");

  return (
    <div className="relative z-10 max-w-[1120px] mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-14"
      >
        {about.location && (
          <span className="text-[12px] text-[var(--fg-muted)]">Based in {about.location.split(",")[0]}</span>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-end">
        <div className="max-w-3xl">
          <div className="font-[var(--font-serif)] text-[clamp(2.6rem,8vw,6.5rem)] leading-[0.98] tracking-[-0.02em]">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.1 }}
              className="inline-block"
            >
              {first}
            </motion.span>
            {last && (
              <>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease, delay: 0.22 }}
                  className="inline-block italic text-[var(--fg-muted)]"
                >
                  {last}.
                </motion.span>
              </>
            )}
          </div>

          {hero.title && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.35 }}
              className="mt-6 text-[15px] font-mono uppercase tracking-[0.1em] text-[var(--accent)]"
            >
              {hero.title}
              {hero.subtitle ? ` · ${hero.subtitle}` : ""}
            </motion.p>
          )}

          {hero.tagline && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.45 }}
              className="mt-6 max-w-xl text-[16px] md:text-[18px] leading-[1.6] text-[var(--fg-muted)]"
            >
              {hero.tagline}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.55 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#work"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-[14px] font-medium bg-[var(--fg)] text-[var(--bg)]"
            >
              Selected work →
            </a>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-[14px] font-medium border border-[var(--border-strong)]"
              >
                Résumé ↓
              </a>
            )}
          </motion.div>
        </div>

        {photoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease, delay: 0.2 }}
            className="self-end mx-auto lg:mx-0"
          >
            <div className="relative w-[240px] sm:w-[280px] aspect-[4/5] rounded-2xl overflow-hidden border border-[var(--border-strong)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl} alt={hero.name} className="w-full h-full object-cover" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
