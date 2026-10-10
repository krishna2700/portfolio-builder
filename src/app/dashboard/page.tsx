"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { PortfolioContent } from "@/lib/content";
import type { ThemeDefinition } from "@/lib/themes";

type ThemeRow = ThemeDefinition & { id: string };
type Portfolio = {
  slug: string;
  themeId: string;
  content: PortfolioContent;
  photoUrl: string | null;
  resumeUrl: string | null;
  published: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/portfolio/me").then((r) => r.json()),
      fetch("/api/themes").then((r) => r.json()),
    ])
      .then(([mine, allThemes]) => {
        if (!mine.portfolio) {
          router.push("/onboarding");
          return;
        }
        setPortfolio(mine.portfolio);
        setThemes(allThemes.themes ?? []);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const handleSave = async () => {
    if (!portfolio) return;
    setSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: portfolio.slug,
          themeId: portfolio.themeId,
          content: portfolio.content,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Couldn't save");
        return;
      }
      toast.success("Saved");
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const copyLink = () => {
    if (!portfolio) return;
    const url = `${window.location.origin}/${portfolio.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center text-[var(--fg-muted)]">Loading…</main>;
  }
  if (!portfolio) return null;

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-xl font-semibold">Your portfolio</h1>
          <button className="btn-ghost" onClick={handleLogout}>
            Log out
          </button>
        </div>

        <div className="card p-6 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[12.5px] text-[var(--fg-subtle)] mb-1">Public link</div>
            <div className="font-mono text-[15px]">yoursite.com/{portfolio.slug}</div>
          </div>
          <div className="flex gap-3">
            <button className="btn-ghost" onClick={copyLink}>
              Copy link
            </button>
            <a href={`/${portfolio.slug}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
              View live ↗
            </a>
          </div>
        </div>

        <div className="card p-6 mb-6 space-y-4">
          <h2 className="text-[15px] font-semibold mb-2">Edit content</h2>
          <Field
            label="Full name"
            value={portfolio.content.hero.name}
            onChange={(v) => setPortfolio({ ...portfolio, content: { ...portfolio.content, hero: { ...portfolio.content.hero, name: v } } })}
          />
          <Field
            label="Title / headline"
            value={portfolio.content.hero.title}
            onChange={(v) => setPortfolio({ ...portfolio, content: { ...portfolio.content, hero: { ...portfolio.content.hero, title: v } } })}
          />
          <Field
            label="Tagline"
            multiline
            value={portfolio.content.hero.tagline}
            onChange={(v) => setPortfolio({ ...portfolio, content: { ...portfolio.content, hero: { ...portfolio.content.hero, tagline: v } } })}
          />
          <Field
            label="Bio"
            multiline
            value={portfolio.content.about.bio}
            onChange={(v) => setPortfolio({ ...portfolio, content: { ...portfolio.content, about: { ...portfolio.content.about, bio: v } } })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Email"
              value={portfolio.content.about.email}
              onChange={(v) => setPortfolio({ ...portfolio, content: { ...portfolio.content, about: { ...portfolio.content.about, email: v } } })}
            />
            <Field
              label="Location"
              value={portfolio.content.about.location}
              onChange={(v) => setPortfolio({ ...portfolio, content: { ...portfolio.content, about: { ...portfolio.content.about, location: v } } })}
            />
          </div>
        </div>

        <div className="card p-6 mb-6">
          <h2 className="text-[15px] font-semibold mb-4">Theme</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setPortfolio({ ...portfolio, themeId: t.id })}
                className={`text-left rounded-xl overflow-hidden border-2 transition-colors ${
                  portfolio.themeId === t.id ? "border-[var(--accent)]" : "border-[var(--border)]"
                }`}
              >
                <div className="h-12" style={{ background: `linear-gradient(135deg, ${t.colors.bg}, ${t.colors.bgElev2})` }} />
                <div className="p-2 bg-[var(--bg-elev)] text-[11.5px]">{t.name}</div>
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary w-full" disabled={saving} onClick={handleSave}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {multiline ? (
        <textarea className="input" rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}
