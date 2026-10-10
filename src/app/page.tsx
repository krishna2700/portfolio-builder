import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <span className="text-[12px] font-mono uppercase tracking-[0.14em] text-[var(--fg-subtle)] mb-6">
        Portfolio Builder
      </span>
      <h1 className="text-[clamp(2.2rem,6vw,4.2rem)] font-semibold leading-[1.05] max-w-3xl mb-6">
        Upload your resume. <br />
        Get a portfolio at <span className="text-[var(--accent)]">your</span> link.
      </h1>
      <p className="text-[16px] text-[var(--fg-muted)] max-w-xl mb-10">
        Sign up, upload a PDF resume, pick from a dozen themes, and your portfolio goes live at{" "}
        <code className="text-[14px]">yoursite.com/your-name</code> in a few minutes.
      </p>
      <div className="flex gap-4">
        <Link href="/signup" className="btn-primary">
          Create your portfolio
        </Link>
        <Link href="/login" className="btn-ghost">
          Log in
        </Link>
      </div>
    </main>
  );
}
