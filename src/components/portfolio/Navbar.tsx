"use client";
import { useEffect, useState } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-[var(--bg)]/75 backdrop-blur-xl border-b border-[var(--border)]" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1120px] mx-auto px-6 flex items-center justify-between h-16">
        <a href="#hero" className="flex items-center gap-2.5">
          <span className="font-mono text-[13px] tracking-[0.1em]">{initials || "·"}</span>
          <span className="hidden sm:inline-block w-px h-3.5 bg-[var(--border-strong)]" />
          <span className="hidden sm:inline-block text-[13px] text-[var(--fg-muted)]">{name}</span>
        </a>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium bg-[var(--fg)] text-[var(--bg)]"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}
