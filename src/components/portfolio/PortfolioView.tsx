import type { ThemeDefinition } from "@/lib/themes";
import type { PortfolioContent } from "@/lib/content";
import { buildGoogleFontsHref } from "@/lib/googleFonts";
import { AnimatedField } from "@/components/animations";
import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Experience from "./Experience";
import Projects from "./Projects";
import Skills from "./Skills";
import Contact from "./Contact";
import Footer from "./Footer";

export default function PortfolioView({
  theme,
  content,
  photoUrl,
  resumeUrl,
}: {
  theme: ThemeDefinition;
  content: PortfolioContent;
  photoUrl?: string | null;
  resumeUrl?: string | null;
}) {
  const c = theme.colors;
  const vars = {
    "--bg": c.bg,
    "--bg-elev": c.bgElev,
    "--bg-elev-2": c.bgElev2,
    "--fg": c.fg,
    "--fg-muted": c.fgMuted,
    "--fg-subtle": c.fgSubtle,
    "--border": c.border,
    "--border-strong": c.borderStrong,
    "--accent": c.accent,
    "--accent-2": c.accent2,
    "--accent-text": c.accentText,
    "--font-serif": `"${theme.fontSerif}", serif`,
    "--font-sans": `"${theme.fontSans}", sans-serif`,
  } as React.CSSProperties;

  return (
    <div
      style={vars}
      className="relative min-h-screen bg-[var(--bg)] text-[var(--fg)] font-[var(--font-sans)] antialiased"
    >
      <link rel="stylesheet" href={buildGoogleFontsHref([theme.fontSerif, theme.fontSans])} />
      <Navbar name={content.hero.name} />
      <main>
        <section id="hero" className="relative pt-32 md:pt-40 pb-20 md:pb-28 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <AnimatedField animation={theme.animation} accent={c.accent} accent2={c.accent2} />
          </div>
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, var(--bg) 100%)`,
            }}
          />
          <Hero content={content} photoUrl={photoUrl} resumeUrl={resumeUrl} />
        </section>
        <About content={content} />
        <Experience experience={content.experience} />
        <Projects projects={content.projects} />
        <Skills skillTiers={content.skillTiers} />
        <Contact about={content.about} />
      </main>
      <Footer content={content} resumeUrl={resumeUrl} />
    </div>
  );
}
