"use client";
import type { PortfolioContent } from "@/lib/content";

type Experience = PortfolioContent["experience"][number];

const EMPTY: Experience = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  location: "",
  current: false,
  description: [],
};

export default function ExperienceEditor({
  value,
  onChange,
}: {
  value: Experience[];
  onChange: (v: Experience[]) => void;
}) {
  const update = (i: number, patch: Partial<Experience>) => {
    onChange(value.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, { ...EMPTY }]);

  return (
    <div className="space-y-4">
      {value.map((e, i) => (
        <div key={i} className="p-4 rounded-xl border border-[var(--border)] space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <MiniField label="Company" value={e.company} onChange={(v) => update(i, { company: v })} />
            <MiniField label="Role" value={e.role} onChange={(v) => update(i, { role: v })} />
            <MiniField label="Start date" value={e.startDate} onChange={(v) => update(i, { startDate: v })} />
            <MiniField label="End date" value={e.endDate} onChange={(v) => update(i, { endDate: v })} disabled={e.current} />
            <MiniField label="Location" value={e.location} onChange={(v) => update(i, { location: v })} />
            <label className="flex items-center gap-2 mt-6 text-[13px] text-[var(--fg-muted)]">
              <input
                type="checkbox"
                checked={e.current}
                onChange={(ev) => update(i, { current: ev.target.checked })}
              />
              Current role
            </label>
          </div>
          <label className="block">
            <span className="label">Bullet points (one per line)</span>
            <textarea
              className="input"
              rows={4}
              value={e.description.join("\n")}
              onChange={(ev) => update(i, { description: ev.target.value.split("\n").filter(Boolean) })}
            />
          </label>
          <button type="button" className="btn-ghost !py-1.5 !px-3 !text-[12.5px]" onClick={() => remove(i)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn-ghost" onClick={add}>
        + Add experience
      </button>
    </div>
  );
}

function MiniField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input className="input" value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
