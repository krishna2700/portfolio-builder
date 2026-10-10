"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Row = {
  id: string;
  slug: string;
  name: string;
  ownerEmail: string;
  themeName: string;
  published: boolean;
  createdAt: string;
};

export default function AdminPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    fetch("/api/admin/portfolios")
      .then((r) => r.json())
      .then((d) => setRows(d.portfolios ?? []));
  };

  useEffect(load, []);

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm(`Delete the portfolio at /${slug}? This can't be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/portfolios/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Couldn't delete");
        return;
      }
      toast.success(`Deleted /${slug}`);
      setRows((r) => r?.filter((row) => row.id !== id) ?? null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="text-xl font-semibold mb-1">All portfolios</h1>
        <p className="text-[13.5px] text-[var(--fg-muted)] mb-8">
          {rows ? `${rows.length} portfolio${rows.length === 1 ? "" : "s"}` : "Loading…"}
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
              {rows?.map((row) => (
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
                      disabled={deletingId === row.id}
                      onClick={() => handleDelete(row.id, row.slug)}
                    >
                      {deletingId === row.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
              {rows?.length === 0 && (
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
    </main>
  );
}
