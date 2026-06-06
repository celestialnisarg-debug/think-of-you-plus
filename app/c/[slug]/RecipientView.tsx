"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Postcard from "@/components/Postcard";
import Confetti from "@/components/Confetti";
import type { CardState } from "@/lib/card";

export default function RecipientView({ card }: { card: CardState }) {
  const [flipped, setFlipped] = useState(false);
  const [opened, setOpened] = useState(false);
  return (
    <main className="grid min-h-screen place-items-center bg-neutral-50 p-4">
      {opened && <Confetti />}
      <motion.div initial={{ scale: 0.85, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
        onAnimationComplete={() => setOpened(true)} className="flex flex-col items-center gap-5">
        <Postcard card={card} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
        <div className="flex gap-3">
          <button onClick={() => setFlipped((f) => !f)} className="rounded-full border px-4 py-2 text-sm">Read the back</button>
          <button onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="rounded-full border px-4 py-2 text-sm">Copy link</button>
          <Link href="/create" className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white">Create your own</Link>
        </div>
      </motion.div>
    </main>
  );
}
