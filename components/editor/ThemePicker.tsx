"use client";
import { THEMES } from "@/lib/themes";
export default function ThemePicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {THEMES.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`rounded-lg border p-2 text-xs transition ${value === t.id ? "ring-2 ring-sky-400 border-transparent" : "border-black/10 hover:border-black/30"}`}>
          <span className="block h-8 rounded mb-1" style={{ background: t.surface }} />
          {t.name}
        </button>
      ))}
    </div>
  );
}
