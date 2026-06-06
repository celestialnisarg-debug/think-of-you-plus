"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Postcard from "@/components/Postcard";
import ControlPanel from "@/components/editor/ControlPanel";
import { defaultCard, type CardState } from "@/lib/card";
import { isSupabaseConfigured } from "@/lib/supabase";
import { saveCard, uploadPhoto } from "@/lib/postcards";
import { exportNodeToPng } from "@/lib/exportPng";

export default function CreatePage() {
  const [card, setCard] = useState<CardState>(defaultCard());
  const [flipped, setFlipped] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<CardState>) => setCard((c) => ({ ...c, ...patch }));

  const applyFile = (f: File) => {
    setPendingFile(f);
    set({ photoUrl: URL.createObjectURL(f) });
  };

  const ready = card.toName.trim() && card.fromName.trim() && card.message.trim();

  const onShare = async () => {
    if (!ready) return;
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
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto grid max-w-6xl items-start gap-10 px-5 py-10 md:grid-cols-2 md:px-8">
      {/* controls */}
      <ControlPanel card={card} set={set} />

      {/* preview */}
      <div className="md:sticky md:top-10 flex flex-col items-center">
        <h2 className="mb-6 font-serif-display text-3xl text-stone-800">Design your postcard</h2>

        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) applyFile(f);
          }}
        />

        <Postcard
          card={card}
          flipped={flipped}
          onFlip={() => setFlipped((f) => !f)}
          editable
          onPhotoClick={() => fileInput.current?.click()}
          onPhotoDrop={applyFile}
          cardRef={cardRef}
        />

        <button
          onClick={() => setFlipped((f) => !f)}
          className="mt-4 flex items-center gap-1.5 font-sans text-sm text-stone-500 transition hover:text-stone-800"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Click to flip
        </button>

        <motion.button
          onClick={onShare}
          disabled={!ready || busy}
          whileTap={ready ? { scale: 0.97 } : undefined}
          className={`mt-7 w-full max-w-[540px] rounded-xl py-3.5 font-sans text-base font-medium transition ${
            ready
              ? "bg-stone-800 text-white shadow-lg hover:bg-stone-900"
              : "cursor-not-allowed bg-stone-200 text-stone-400"
          }`}
        >
          {busy ? "Sharing…" : "Share"}
        </motion.button>

        {shareUrl && (
          <div className="mt-4 w-full max-w-[540px] rounded-xl border border-stone-200 bg-white/70 p-4 text-center">
            <p className="mb-2 font-sans text-sm font-medium text-stone-700">Your postcard is ready to send 💌</p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 truncate rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 font-sans text-xs text-stone-600"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1600);
                }}
                className="rounded-lg bg-stone-800 px-3 py-2 font-sans text-xs font-medium text-white"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
