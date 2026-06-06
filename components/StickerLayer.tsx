"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { getStickerSvg } from "@/lib/stickers";
import type { StickerPlacement } from "@/lib/card";

type Props = {
  stickers: StickerPlacement[];
  editable?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onChange?: (id: string, patch: Partial<StickerPlacement>) => void;
};

export default function StickerLayer({ stickers, editable, selectedId, onSelect, onChange }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      {stickers.map((s) => (
        <motion.div
          key={s.id}
          className={`absolute -translate-x-1/2 -translate-y-1/2 ${
            editable ? "pointer-events-auto cursor-grab active:cursor-grabbing" : ""
          } ${selectedId === s.id ? "outline outline-2 outline-dashed outline-sky-400/70" : ""}`}
          style={{ left: `${s.x}%`, top: `${s.y}%`, zIndex: s.z, width: 64, height: 64 }}
          drag={editable}
          dragMomentum={false}
          onPointerDown={() => editable && onSelect?.(s.id)}
          onDragEnd={(_, info) => {
            if (!editable || !onChange || !layerRef.current) return;
            const rect = layerRef.current.getBoundingClientRect();
            const x = ((info.point.x - rect.left) / rect.width) * 100;
            const y = ((info.point.y - rect.top) / rect.height) * 100;
            onChange(s.id, {
              x: Math.max(0, Math.min(100, x)),
              y: Math.max(0, Math.min(100, y)),
            });
          }}
          animate={{ rotate: s.rotation, scale: s.scale }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          dangerouslySetInnerHTML={{ __html: getStickerSvg(s.type) }}
        />
      ))}
    </div>
  );
}
