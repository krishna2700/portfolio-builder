"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Invalid credentials");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-8">
        <h1 className="text-xl font-semibold mb-1">Admin login</h1>
        <p className="text-[13.5px] text-[var(--fg-muted)] mb-6">Manage all portfolios on this instance.</p>
        <div className="space-y-4">
          <label className="block">
            <span className="label">Email</span>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="block">
            <span className="label">Password</span>
            <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
    </main>
  );
}
