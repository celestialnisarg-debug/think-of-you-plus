"use client";
import { useRef, useState } from "react";
import Postcard from "@/components/Postcard";
import ControlPanel from "@/components/editor/ControlPanel";
import { defaultCard, type CardState, type StickerPlacement } from "@/lib/card";
import { makeSlug } from "@/lib/slug";
import { isSupabaseConfigured } from "@/lib/supabase";
import { saveCard, uploadPhoto } from "@/lib/postcards";
import { exportNodeToPng } from "@/lib/exportPng";

export default function CreatePage() {
  const [card, setCard] = useState<CardState>(defaultCard());
  const [flipped, setFlipped] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const set = (patch: Partial<CardState>) => setCard((c) => ({ ...c, ...patch }));

  const onFile = (f: File) => { setPendingFile(f); set({ photoUrl: URL.createObjectURL(f) }); };
  const onRemovePhoto = () => { setPendingFile(null); set({ photoUrl: null }); };

  const onAddSticker = (type: string) => {
    const s: StickerPlacement = { id: makeSlug(), type, x: 40, y: 40, rotation: 0, scale: 1,
      z: (card.stickers.at(-1)?.z ?? 0) + 1 };
    set({ stickers: [...card.stickers, s] });
    setSelected(s.id);
  };
  const onChangeSticker = (id: string, patch: Partial<StickerPlacement>) =>
    set({ stickers: card.stickers.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  const onDeleteSelected = () => {
    if (!selected) return;
    set({ stickers: card.stickers.filter((s) => s.id !== selected) });
    setSelected(null);
  };

  const onShare = async () => {
    setBusy(true);
    try {
      if (isSupabaseConfigured()) {
        let photoUrl = card.photoUrl;
        if (pendingFile) photoUrl = await uploadPhoto(pendingFile);
        const slug = await saveCard({ ...card, photoUrl });
        const url = `${window.location.origin}/c/${slug}`;
        setShareUrl(url);
        if (navigator.share) await navigator.share({ title: "A postcard for you", url }).catch(() => {});
      } else if (cardRef.current) {
        await exportNodeToPng(cardRef.current);
      }
    } finally { setBusy(false); }
  };

  return (
    <main className="mx-auto grid max-w-6xl gap-8 p-4 md:grid-cols-2 md:p-8">
      <div className="flex flex-col items-center gap-4">
        <Postcard card={card} flipped={flipped} onFlip={() => setFlipped((f) => !f)}
          editable selectedSticker={selected} onSelectSticker={setSelected}
          onChangeSticker={onChangeSticker} cardRef={cardRef} />
        <div className="flex gap-3">
          <button onClick={() => setFlipped((f) => !f)} className="rounded-full border px-4 py-2 text-sm">Click to flip</button>
          <button onClick={onShare} disabled={busy}
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {busy ? "Sharing…" : "Share"}
          </button>
        </div>
        {shareUrl && (
          <div className="w-full rounded-lg bg-emerald-50 p-3 text-center text-sm">
            <p className="mb-1 font-medium">Your link is ready</p>
            <button className="underline" onClick={() => navigator.clipboard.writeText(shareUrl)}>{shareUrl} (copy)</button>
          </div>
        )}
      </div>
      <ControlPanel card={card} set={set} onFile={onFile} onRemovePhoto={onRemovePhoto}
        onAddSticker={onAddSticker} onDeleteSelected={onDeleteSelected} selected={selected} />
    </main>
  );
}
