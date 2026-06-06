"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { getStamp } from "@/lib/stamps";
import { getFlower } from "@/lib/flowers";
import type { CardState } from "@/lib/card";

type Props = {
  card: CardState;
  flipped: boolean;
  onFlip?: () => void;
  editable?: boolean;
  onPhotoClick?: () => void;
  onPhotoDrop?: (file: File) => void;
  cardRef?: React.Ref<HTMLDivElement>;
};

/**
 * All inner sizes use container-query width units (cqw) so the postcard's
 * contents scale proportionally with the card — identical look on mobile and desktop.
 */
export default function Postcard({
  card,
  flipped,
  onFlip,
  editable,
  onPhotoClick,
  onPhotoDrop,
  cardRef,
}: Props) {
  const stamp = getStamp(card.stamp);
  const flower = getFlower(card.flower);
  const [drag, setDrag] = useState(false);

  return (
    <div
      className="card-3d w-full max-w-[540px] aspect-[3/2]"
      style={{ containerType: "inline-size" }}
    >
      <motion.div
        ref={cardRef}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 110, damping: 18 }}
      >
        {/* ---------- FRONT: photo + optional title ---------- */}
        <div
          className="card-face paper-cream absolute inset-0 overflow-hidden rounded-[10px] border border-black/10 shadow-[0_18px_45px_-18px_rgba(60,45,20,0.5)]"
          onClick={() => (editable ? onPhotoClick?.() : onFlip?.())}
          onDragOver={
            editable
              ? (e) => {
                  e.preventDefault();
                  setDrag(true);
                }
              : undefined
          }
          onDragLeave={editable ? () => setDrag(false) : undefined}
          onDrop={
            editable
              ? (e) => {
                  e.preventDefault();
                  setDrag(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) onPhotoDrop?.(f);
                }
              : undefined
          }
        >
          {card.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.photoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div
              className={`flex h-full w-full flex-col items-center justify-center gap-[1.5cqw] border-2 border-dashed text-center transition ${
                drag ? "border-stone-400 bg-stone-100/60" : "border-stone-300/70"
              }`}
            >
              {editable ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" className="h-[6cqw] w-[6cqw] text-stone-400">
                    <path d="M12 16V4m0 0L7 9m5-5l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <p className="font-sans text-[3cqw] font-medium text-stone-500">Click to upload a photo,</p>
                  <p className="font-sans text-[2.6cqw] text-stone-400">or drag and drop</p>
                </>
              ) : null}
            </div>
          )}

          {card.title ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-[4cqw]">
              <h3
                className="font-serif-display text-center text-[7cqw] font-semibold leading-tight"
                style={{
                  color: card.titleColor,
                  textShadow:
                    card.titleColor.toLowerCase() === "#ffffff"
                      ? "0 2px 12px rgba(0,0,0,0.45)"
                      : "0 1px 6px rgba(255,255,255,0.4)",
                }}
              >
                {card.title}
              </h3>
            </div>
          ) : null}
        </div>

        {/* ---------- BACK: the postcard ---------- */}
        <div
          className="card-face paper-cream absolute inset-0 overflow-hidden rounded-[10px] border border-black/10 shadow-[0_18px_45px_-18px_rgba(60,45,20,0.5)]"
          style={{ transform: "rotateY(180deg)" }}
          onClick={() => onFlip?.()}
        >
          <div className="relative h-full w-full px-[4.6cqw] py-[3.8cqw] text-[#4b3f2c]">
            {/* header */}
            <p className="text-center font-serif-display text-[2.8cqw] tracking-[0.42em] text-[#8a754d]">
              POSTCARD
            </p>

            {/* stamp */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={stamp.src}
              alt=""
              className="absolute right-[3.8cqw] top-[3cqw] h-[13cqw] w-auto -rotate-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)]"
            />

            {/* flower */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={flower.src}
              alt=""
              className="pointer-events-none absolute -bottom-[1cqw] left-[2cqw] h-[56%] w-auto opacity-95"
            />

            {/* two columns */}
            <div className="mt-[3.8cqw] grid h-[calc(100%-8.5cqw)] grid-cols-[1fr_auto_1fr] gap-[3.8cqw]">
              {/* left: to */}
              <div className="relative flex flex-col pt-[1cqw]">
                <span className="mb-[2.3cqw] font-serif-display text-[3.3cqw] italic text-[#8a754d]">to</span>
                <div className="ruled-line flex h-[5.4cqw] items-end pb-[0.6cqw]">
                  <span className="font-serif-display text-[3.7cqw] leading-none">{card.toName}</span>
                </div>
              </div>

              {/* divider */}
              <div className="w-px self-stretch bg-[#8a754d]/35" />

              {/* right: message + from (pushed down to clear the stamp) */}
              <div className="relative flex flex-col pt-[9cqw]">
                <p className="whitespace-pre-wrap font-serif-display text-[3cqw] italic leading-snug text-[#4b3f2c] [overflow-wrap:anywhere]">
                  {card.message}
                </p>
                <div className="relative z-10 mt-auto text-right">
                  <span className="font-serif-display text-[3.3cqw] italic text-[#8a754d]">from:&nbsp;</span>
                  <span className="font-serif-display text-[3.7cqw]">{card.fromName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
