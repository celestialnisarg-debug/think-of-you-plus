"use client";
import type { CardState } from "@/lib/card";
import { FONTS } from "@/lib/fonts";
import ThemePicker from "./ThemePicker";
import PhotoUpload from "./PhotoUpload";
import StickerTray from "./StickerTray";
import ColorField from "@/components/ui/ColorField";

const MAX_TITLE = 40;

export default function ControlPanel({ card, set, onFile, onRemovePhoto, onAddSticker, onDeleteSelected, selected }: {
  card: CardState;
  set: (patch: Partial<CardState>) => void;
  onFile: (f: File) => void;
  onRemovePhoto: () => void;
  onAddSticker: (type: string) => void;
  onDeleteSelected: () => void;
  selected: string | null;
}) {
  return (
    <div className="space-y-5">
      <section><h3 className="mb-2 text-sm font-semibold">Theme</h3>
        <ThemePicker value={card.theme} onChange={(theme) => set({ theme })} /></section>

      <section><h3 className="mb-2 text-sm font-semibold">Photo</h3>
        <PhotoUpload onFile={onFile} hasPhoto={!!card.photoUrl} onRemove={onRemovePhoto} /></section>

      <section><h3 className="mb-2 text-sm font-semibold">Title</h3>
        <input value={card.title} maxLength={MAX_TITLE}
          onChange={(e) => set({ title: e.target.value })}
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm" />
        <div className="mt-1 text-right text-xs opacity-60">{card.title.length}/{MAX_TITLE}</div>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <ColorField label="Color" value={card.titleColor} onChange={(titleColor) => set({ titleColor })} />
          <select value={card.titleFont} onChange={(e) => set({ titleFont: e.target.value })}
            className="rounded-lg border border-black/15 px-2 py-1 text-sm">
            {FONTS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <label className="text-sm">To<input value={card.toName} onChange={(e) => set({ toName: e.target.value })}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm" /></label>
        <label className="text-sm">From<input value={card.fromName} onChange={(e) => set({ fromName: e.target.value })}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm" /></label>
      </section>

      <section><h3 className="mb-2 text-sm font-semibold">Message</h3>
        <textarea value={card.message} rows={4} onChange={(e) => set({ message: e.target.value })}
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm" /></section>

      <section><h3 className="mb-2 text-sm font-semibold">Stickers</h3>
        <StickerTray onAdd={onAddSticker} />
        {selected && <button onClick={onDeleteSelected} className="mt-2 text-xs text-red-600">Delete selected sticker</button>}
      </section>
    </div>
  );
}
