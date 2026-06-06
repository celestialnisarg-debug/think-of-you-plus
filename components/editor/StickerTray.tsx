"use client";
import { STICKERS } from "@/lib/stickers";
export default function StickerTray({ onAdd }: { onAdd: (type: string) => void }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {STICKERS.map((s) => (
        <button key={s.id} title={s.label} onClick={() => onAdd(s.id)}
          className="aspect-square rounded-lg border border-black/10 p-1 hover:bg-black/5"
          dangerouslySetInnerHTML={{ __html: s.svg }} />
      ))}
    </div>
  );
}
