"use client";
import type { PortfolioContent } from "@/lib/content";

type Project = PortfolioContent["projects"][number];

const EMPTY: Project = { title: "", description: "", tech: [], github: "", live: "" };

export default function ProjectsEditor({
  value,
  onChange,
}: {
  value: Project[];
  onChange: (v: Project[]) => void;
}) {
  const update = (i: number, patch: Partial<Project>) => {
    onChange(value.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, { ...EMPTY }]);

  return (
    <div className="space-y-4">
      {value.map((p, i) => (
        <div key={i} className="p-4 rounded-xl border border-[var(--border)] space-y-3">
          <label className="block">
            <span className="label">Title</span>
            <input className="input" value={p.title} onChange={(e) => update(i, { title: e.target.value })} />
          </label>
          <label className="block">
            <span className="label">Description</span>
            <textarea
              className="input"
              rows={2}
              value={p.description}
              onChange={(e) => update(i, { description: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="label">Tech (comma-separated)</span>
            <input
              className="input"
              value={p.tech.join(", ")}
              onChange={(e) => update(i, { tech: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="label">GitHub URL</span>
              <input className="input" value={p.github} onChange={(e) => update(i, { github: e.target.value })} />
            </label>
            <label className="block">
              <span className="label">Live URL</span>
              <input className="input" value={p.live} onChange={(e) => update(i, { live: e.target.value })} />
            </label>
          </div>
          <button type="button" className="btn-ghost !py-1.5 !px-3 !text-[12.5px]" onClick={() => remove(i)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn-ghost" onClick={add}>
        + Add project
      </button>
    </div>
  );
}
