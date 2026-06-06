"use client";
import { useRef, useState } from "react";
export default function PhotoUpload({ onFile, hasPhoto, onRemove }: {
  onFile: (file: File) => void; hasPhoto: boolean; onRemove: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
      className={`rounded-lg border-2 border-dashed p-4 text-center text-sm transition ${drag ? "border-sky-400 bg-sky-50" : "border-black/15"}`}
    >
      <input ref={ref} type="file" accept="image/*" hidden
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      <button className="underline" onClick={() => ref.current?.click()}>Click to upload a photo</button>
      <span className="opacity-60">, or drag and drop</span>
      {hasPhoto && <button onClick={onRemove} className="mt-2 block w-full text-xs text-red-600">Remove photo</button>}
    </div>
  );
}
