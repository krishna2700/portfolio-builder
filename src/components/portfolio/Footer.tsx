import type { PortfolioContent } from "@/lib/content";

export default function Footer({
  content,
  resumeUrl,
}: {
  content: PortfolioContent;
  resumeUrl?: string | null;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--border)] py-10">
      <div className="max-w-[1120px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[13px] text-[var(--fg-subtle)]">
          © {year} {content.hero.name}
        </span>
        <div className="flex items-center gap-5 text-[13px] text-[var(--fg-muted)]">
          {content.about.github && (
            <a href={content.about.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          )}
          {content.about.linkedin && (
            <a href={content.about.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          )}
          {resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
              Résumé
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
