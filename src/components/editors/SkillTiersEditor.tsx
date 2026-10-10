"use client";
import type { PortfolioContent } from "@/lib/content";

type SkillTier = PortfolioContent["skillTiers"][number];

export default function SkillTiersEditor({
  value,
  onChange,
}: {
  value: SkillTier[];
  onChange: (v: SkillTier[]) => void;
}) {
  const update = (i: number, patch: Partial<SkillTier>) => {
    onChange(value.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, { label: "", items: [] }]);

  return (
    <div className="space-y-4">
      {value.map((t, i) => (
        <div key={i} className="p-4 rounded-xl border border-[var(--border)] space-y-3">
          <label className="block">
            <span className="label">Tier label</span>
            <input className="input" value={t.label} onChange={(e) => update(i, { label: e.target.value })} />
          </label>
          <label className="block">
            <span className="label">Skills (comma-separated)</span>
            <textarea
              className="input"
              rows={2}
              value={t.items.join(", ")}
              onChange={(e) => update(i, { items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
            />
          </label>
          <button type="button" className="btn-ghost !py-1.5 !px-3 !text-[12.5px]" onClick={() => remove(i)}>
            Remove tier
          </button>
        </div>
      ))}
      <button type="button" className="btn-ghost" onClick={add}>
        + Add tier
      </button>
    </div>
  );
}
