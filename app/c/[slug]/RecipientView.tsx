"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Postcard from "@/components/Postcard";
import Envelope from "@/components/Envelope";
import Confetti from "@/components/Confetti";
import type { CardState } from "@/lib/card";

export default function RecipientView({ card }: { card: CardState }) {
  const [opened, setOpened] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <main className="grid min-h-[calc(100vh-8rem)] place-items-center px-5 py-12">
      {!opened ? (
        <Envelope card={card} onOpened={() => setOpened(true)} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 16 }}
          className="flex flex-col items-center gap-6"
        >
          <Confetti />
          <div className="w-full max-w-[540px]">
            <Postcard card={card} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setFlipped((f) => !f)}
              className="rounded-xl border border-stone-300 px-5 py-2.5 font-sans text-sm text-stone-700 transition hover:bg-stone-100"
            >
              {flipped ? "See the photo" : "Read the message"}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              }}
              className="rounded-xl border border-stone-300 px-5 py-2.5 font-sans text-sm text-stone-700 transition hover:bg-stone-100"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
            <Link
              href="/create"
              className="rounded-xl bg-stone-800 px-5 py-2.5 font-sans text-sm font-medium text-white transition hover:bg-stone-900"
            >
              Create your own
            </Link>
          </div>
        </motion.div>
      )}
    </main>
  );
}
