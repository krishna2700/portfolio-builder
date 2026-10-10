"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type PortfolioRow = {
  id: string;
  userId: string;
  slug: string;
  name: string;
  ownerEmail: string;
  themeName: string;
  published: boolean;
  createdAt: string;
};

type UserRow = {
  id: string;
  email: string;
  createdAt: string;
  portfolioSlug: string | null;
};

export default function AdminPage() {
  const [portfolios, setPortfolios] = useState<PortfolioRow[] | null>(null);
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [deletingPortfolioId, setDeletingPortfolioId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const load = () => {
    fetch("/api/admin/portfolios")
      .then((r) => r.json())
      .then((d) => setPortfolios(d.portfolios ?? []));
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []));
  };

  useEffect(load, []);

  const handleDeletePortfolio = async (id: string, slug: string) => {
    if (!confirm(`Delete the portfolio at /${slug}? This can't be undone.`)) return;
    setDeletingPortfolioId(id);
    try {
      const res = await fetch(`/api/admin/portfolios/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Couldn't delete");
        return;
      }
      toast.success(`Deleted /${slug}`);
      load();
    } finally {
      setDeletingPortfolioId(null);
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!confirm(`Delete the account ${email}? This also deletes their portfolio, if any. This can't be undone.`)) return;
    setDeletingUserId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Couldn't delete");
        return;
      }
      toast.success(`Deleted account ${email}`);
      load();
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-[1100px] mx-auto space-y-12">
        <div>
          <h1 className="text-xl font-semibold mb-1">All portfolios</h1>
          <p className="text-[13.5px] text-[var(--fg-muted)] mb-6">
            {portfolios ? `${portfolios.length} portfolio${portfolios.length === 1 ? "" : "s"}` : "Loading…"}
          </p>

          <div className="card overflow-hidden">
            <table className="w-full text-[13.5px]">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-[var(--fg-subtle)]">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Link</th>
                  <th className="p-4 font-medium">Owner</th>
                  <th className="p-4 font-medium">Theme</th>
                  <th className="p-4 font-medium">Created</th>
                  <th className="p-4 font-medium" />
                </tr>
              </thead>
              <tbody>
                {portfolios?.map((row) => (
                  <tr key={row.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="p-4">{row.name || "—"}</td>
                    <td className="p-4">
                      <a href={`/${row.slug}`} target="_blank" rel="noopener noreferrer" className="font-mono text-[var(--accent)]">
                        /{row.slug} ↗
                      </a>
                    </td>
                    <td className="p-4 text-[var(--fg-muted)]">{row.ownerEmail}</td>
                    <td className="p-4 text-[var(--fg-muted)]">{row.themeName}</td>
                    <td className="p-4 text-[var(--fg-subtle)]">{new Date(row.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button
                        className="btn-ghost !py-1.5 !px-3 !text-[12.5px] !border-red-500/40 text-red-400"
                        disabled={deletingPortfolioId === row.id}
                        onClick={() => handleDeletePortfolio(row.id, row.slug)}
                      >
                        {deletingPortfolioId === row.id ? "Deleting…" : "Delete portfolio"}
                      </button>
                    </td>
                  </tr>
                ))}
                {portfolios?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[var(--fg-subtle)]">
                      No portfolios yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h1 className="text-xl font-semibold mb-1">All accounts</h1>
          <p className="text-[13.5px] text-[var(--fg-muted)] mb-6">
            {users ? `${users.length} account${users.length === 1 ? "" : "s"}` : "Loading…"} — deleting an account
            also deletes its portfolio.
          </p>

          <div className="card overflow-hidden">
            <table className="w-full text-[13.5px]">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-[var(--fg-subtle)]">
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Portfolio</th>
                  <th className="p-4 font-medium">Created</th>
                  <th className="p-4 font-medium" />
                </tr>
              </thead>
              <tbody>
                {users?.map((u) => (
                  <tr key={u.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="p-4">{u.email}</td>
                    <td className="p-4 text-[var(--fg-muted)]">
                      {u.portfolioSlug ? (
                        <a href={`/${u.portfolioSlug}`} target="_blank" rel="noopener noreferrer" className="font-mono text-[var(--accent)]">
                          /{u.portfolioSlug} ↗
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-4 text-[var(--fg-subtle)]">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button
                        className="btn-ghost !py-1.5 !px-3 !text-[12.5px] !border-red-500/40 text-red-400"
                        disabled={deletingUserId === u.id}
                        onClick={() => handleDeleteUser(u.id, u.email)}
                      >
                        {deletingUserId === u.id ? "Deleting…" : "Delete account"}
                      </button>
                    </td>
                  </tr>
                ))}
                {users?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[var(--fg-subtle)]">
                      No accounts yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
