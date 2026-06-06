"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { getTheme } from "@/lib/themes";
import { getFontStack } from "@/lib/fonts";
import StickerLayer from "@/components/StickerLayer";
import type { CardState, StickerPlacement } from "@/lib/card";

type Props = {
  card: CardState;
  flipped: boolean;
  onFlip?: () => void;
  editable?: boolean;
  selectedSticker?: string | null;
  onSelectSticker?: (id: string) => void;
  onChangeSticker?: (id: string, patch: Partial<StickerPlacement>) => void;
  cardRef?: React.Ref<HTMLDivElement>;
};

export default function Postcard(props: Props) {
  const { card, flipped, onFlip, editable, cardRef } = props;
  const theme = getTheme(card.theme);
  const titleFont = getFontStack(card.titleFont);
  const surface = card.bg ?? theme.surface;

  return (
    <div className="card-3d w-full max-w-[560px] aspect-[7/5]">
      <motion.div
        ref={cardRef}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        {/* FRONT */}
        <div
          className="card-face paper-noise absolute inset-0 rounded-xl shadow-2xl overflow-hidden border border-black/5"
          style={{ background: surface, color: theme.ink }}
          onClick={onFlip}
        >
          <div className="relative h-full w-full p-4 flex flex-col">
            <div className="relative flex-1 rounded-lg overflow-hidden bg-black/5">
              {card.photoUrl ? (
                <Image src={card.photoUrl} alt="" fill className="object-cover" unoptimized />
              ) : (
                <div className="h-full w-full grid place-items-center text-sm opacity-60">
                  {editable ? "Add a photo" : ""}
                </div>
              )}
            </div>
            <h2
              className="mt-3 text-center text-2xl sm:text-3xl leading-tight"
              style={{ fontFamily: titleFont, color: card.titleColor }}
            >
              {card.title}
            </h2>
            <StickerLayer
              stickers={props.card.stickers}
              editable={editable}
              selectedId={props.selectedSticker}
              onSelect={props.onSelectSticker}
              onChange={props.onChangeSticker}
            />
          </div>
        </div>

        {/* BACK */}
        <div
          className="card-face paper-noise absolute inset-0 rounded-xl shadow-2xl overflow-hidden border border-black/5"
          style={{ background: surface, color: theme.ink, transform: "rotateY(180deg)" }}
          onClick={onFlip}
        >
          <div className="grid h-full grid-cols-[1fr_auto_1fr] gap-4 p-6">
            <div className="flex flex-col">
              <p className="text-xs uppercase tracking-widest opacity-60">to</p>
              <p className="mt-1 text-lg" style={{ fontFamily: titleFont }}>{card.toName || "—"}</p>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{card.message}</p>
              <p className="mt-auto text-xs uppercase tracking-widest opacity-60">from</p>
              <p className="text-lg" style={{ fontFamily: titleFont }}>{card.fromName || "—"}</p>
            </div>
            <div className="w-px self-stretch" style={{ background: theme.accent, opacity: 0.4 }} />
            <div className="relative">
              <div
                className="ml-auto h-20 w-16 rounded-sm grid place-items-center text-white"
                style={{ background: theme.accent }}
              >★</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
