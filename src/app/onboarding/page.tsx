"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { normalizeSlug } from "@/lib/slug";
import type { PortfolioContent } from "@/lib/content";
import { EMPTY_CONTENT } from "@/lib/content";
import type { ThemeDefinition } from "@/lib/themes";
import PortfolioView from "@/components/portfolio/PortfolioView";

type ThemeRow = ThemeDefinition & { id: string };

const STEPS = ["Pick a name", "Upload resume", "Review details", "Pick a theme", "Publish"] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 1: slug
  const [slugInput, setSlugInput] = useState("");
  const [slugStatus, setSlugStatus] = useState<{ checking: boolean; available: boolean | null; reason?: string }>({
    checking: false,
    available: null,
  });

  // Step 2: files
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);

  // Parsed / editable content
  const [content, setContent] = useState<PortfolioContent>(EMPTY_CONTENT);
  const [resumeUrl, setResumeUrl] = useState<string | undefined>();
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();

  // Step 4: themes
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  const [publishing, setPublishing] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/themes")
      .then((r) => r.json())
      .then((d) => setThemes(d.themes ?? []));
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const slug = normalizeSlug(slugInput);
    if (!slug) {
      setSlugStatus({ checking: false, available: null });
      return;
    }
    setSlugStatus({ checking: true, available: null });
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/portfolio/check-slug?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        setSlugStatus({ checking: false, available: data.available, reason: data.reason });
      } catch {
        setSlugStatus({ checking: false, available: null });
      }
    }, 400);
  }, [slugInput]);

  const slug = normalizeSlug(slugInput);

  const handleParse = async () => {
    if (!resumeFile) {
      toast.error("Upload a resume PDF first");
      return;
    }
    setParsing(true);
    try {
      const form = new FormData();
      form.append("resume", resumeFile);
      if (photoFile) form.append("photo", photoFile);
      const res = await fetch("/api/resume/parse", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Couldn't parse resume");
        return;
      }
      setContent(data.content);
      setResumeUrl(data.resumeUrl);
      setPhotoUrl(data.photoUrl);
      toast.success("Resume parsed — review the details");
      setStep(2);
    } catch {
      toast.error("Network error");
    } finally {
      setParsing(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedThemeId) {
      toast.error("Pick a theme first");
      return;
    }
    setPublishing(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, themeId: selectedThemeId, content, photoUrl, resumeUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Couldn't publish portfolio");
        return;
      }
      toast.success("Your portfolio is live!");
      router.push(`/dashboard`);
      router.refresh();
    } catch {
      toast.error("Network error");
    } finally {
      setPublishing(false);
    }
  };

  const selectedTheme = themes.find((t) => t.id === selectedThemeId);

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-[720px] mx-auto">
        <StepIndicator step={step} />

        {step === 0 && (
          <Card title="Pick your portfolio name" subtitle="This becomes your public link.">
            <div className="flex items-center gap-0 rounded-xl border border-[var(--border-strong)] overflow-hidden bg-[var(--bg)]">
              <span className="pl-4 pr-1 text-[14px] text-[var(--fg-subtle)] font-mono whitespace-nowrap">
                yoursite.com/
              </span>
              <input
                className="flex-1 bg-transparent py-3 pr-4 text-[14.5px] outline-none"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
                placeholder="your-name"
                autoFocus
              />
            </div>
            <div className="mt-2 min-h-[20px] text-[13px]">
              {slugStatus.checking && <span className="text-[var(--fg-subtle)]">Checking…</span>}
              {!slugStatus.checking && slugStatus.available === true && (
                <span className="text-[var(--accent)]">✓ {slug} is available</span>
              )}
              {!slugStatus.checking && slugStatus.available === false && (
                <span className="text-red-400">{slugStatus.reason}</span>
              )}
            </div>
            <button
              className="btn-primary w-full mt-6"
              disabled={!slugStatus.available}
              onClick={() => setStep(1)}
            >
              Continue
            </button>
          </Card>
        )}

        {step === 1 && (
          <Card title="Upload your resume" subtitle="We'll extract your details automatically with AI.">
            <div className="space-y-4">
              <FileDrop
                label="Resume (PDF, required)"
                accept="application/pdf"
                onSelect={setResumeFile}
                fileName={resumeFile?.name}
              />
              <FileDrop
                label="Profile photo (optional)"
                accept="image/*"
                onSelect={(f) => {
                  setPhotoFile(f);
                  setPhotoPreview(f ? URL.createObjectURL(f) : null);
                }}
                fileName={photoFile?.name}
                preview={photoPreview}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-ghost" onClick={() => setStep(0)}>
                Back
              </button>
              <button className="btn-primary flex-1" disabled={parsing} onClick={handleParse}>
                {parsing ? "Reading your resume…" : "Continue"}
              </button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card title="Review your details" subtitle="Fix anything the AI got wrong — you can edit more later too.">
            <div className="space-y-4">
              <Field label="Full name" value={content.hero.name} onChange={(v) => setContent((c) => ({ ...c, hero: { ...c.hero, name: v } }))} />
              <Field label="Title / headline" value={content.hero.title} onChange={(v) => setContent((c) => ({ ...c, hero: { ...c.hero, title: v } }))} />
              <Field label="Tagline" multiline value={content.hero.tagline} onChange={(v) => setContent((c) => ({ ...c, hero: { ...c.hero, tagline: v } }))} />
              <Field label="Bio" multiline value={content.about.bio} onChange={(v) => setContent((c) => ({ ...c, about: { ...c.about, bio: v } }))} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Email" value={content.about.email} onChange={(v) => setContent((c) => ({ ...c, about: { ...c.about, email: v } }))} />
                <Field label="Location" value={content.about.location} onChange={(v) => setContent((c) => ({ ...c, about: { ...c.about, location: v } }))} />
                <Field label="GitHub URL" value={content.about.github} onChange={(v) => setContent((c) => ({ ...c, about: { ...c.about, github: v } }))} />
                <Field label="LinkedIn URL" value={content.about.linkedin} onChange={(v) => setContent((c) => ({ ...c, about: { ...c.about, linkedin: v } }))} />
              </div>
              <p className="text-[12.5px] text-[var(--fg-subtle)]">
                Found {content.experience.length} experience entries, {content.projects.length} projects, and{" "}
                {content.skillTiers.reduce((n, t) => n + t.items.length, 0)} skills. You can fine-tune these from
                your dashboard after publishing.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-ghost" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn-primary flex-1" onClick={() => setStep(3)}>
                Continue
              </button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card title="Pick a theme" subtitle={`${themes.length} themes to choose from.`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedThemeId(t.id)}
                  className={`text-left rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedThemeId === t.id ? "border-[var(--accent)]" : "border-[var(--border)]"
                  }`}
                >
                  <div
                    className="h-16"
                    style={{
                      background: `linear-gradient(135deg, ${t.colors.bg}, ${t.colors.bgElev2})`,
                    }}
                  >
                    <div className="h-full flex items-center justify-center gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ background: t.colors.accent }} />
                      <span className="w-3 h-3 rounded-full" style={{ background: t.colors.accent2 }} />
                    </div>
                  </div>
                  <div className="p-2.5 bg-[var(--bg-elev)]">
                    <div className="text-[12.5px] font-medium">{t.name}</div>
                    <div className="text-[10.5px] text-[var(--fg-subtle)] capitalize">{t.animation}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-ghost" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="btn-primary flex-1" disabled={!selectedThemeId} onClick={() => setStep(4)}>
                Continue
              </button>
            </div>
          </Card>
        )}

        {step === 4 && selectedTheme && (
          <div>
            <Card title="Preview &amp; publish" subtitle={`/${slug} — ${selectedTheme.name}`}>
              <div className="flex gap-3">
                <button className="btn-ghost" onClick={() => setStep(3)}>
                  Back
                </button>
                <button className="btn-primary flex-1" disabled={publishing} onClick={handlePublish}>
                  {publishing ? "Publishing…" : "Publish my portfolio"}
                </button>
              </div>
            </Card>
            <div className="mt-6 rounded-2xl overflow-hidden border border-[var(--border-strong)]">
              <div className="scale-[0.85] origin-top" style={{ width: "117.6%" }}>
                <PortfolioView theme={selectedTheme} content={content} photoUrl={photoUrl} resumeUrl={resumeUrl} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-10 justify-center">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono ${
              i <= step ? "bg-[var(--accent)] text-[var(--accent-text)]" : "bg-[var(--bg-elev)] text-[var(--fg-subtle)]"
            }`}
          >
            {i + 1}
          </div>
          {i < STEPS.length - 1 && <div className="w-6 h-px bg-[var(--border-strong)]" />}
        </div>
      ))}
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="card p-8">
      <h1 className="text-xl font-semibold mb-1">{title}</h1>
      {subtitle && <p className="text-[13.5px] text-[var(--fg-muted)] mb-6">{subtitle}</p>}
      {children}
    </div>
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

function FileDrop({
  label,
  accept,
  onSelect,
  fileName,
  preview,
}: {
  label: string;
  accept: string;
  onSelect: (f: File | null) => void;
  fileName?: string;
  preview?: string | null;
}) {
  return (
    <label className="block cursor-pointer">
      <span className="label">{label}</span>
      <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-[var(--border-strong)] hover:border-[var(--accent)] transition-colors">
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="w-12 h-12 rounded-full object-cover" />
        )}
        <span className="text-[13.5px] text-[var(--fg-muted)] truncate">
          {fileName || "Click to choose a file"}
        </span>
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
        />
      </div>
    </label>
  );
}
