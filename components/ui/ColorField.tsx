"use client";
export default function ColorField({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span>{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
        className="h-8 w-12 cursor-pointer rounded border border-black/10 bg-transparent" />
    </label>
  );
}
