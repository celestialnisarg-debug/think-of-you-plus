"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Postcard from "@/components/Postcard";
import Confetti from "@/components/Confetti";
import type { CardState } from "@/lib/card";

export default function RecipientView({ card }: { card: CardState }) {
  const [opened, setOpened] = useState(false);
  const [flipped, setFlipped] = useState(false);

  return (
    <main className="flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center px-4 py-8">
      <AnimatePresence mode="popLayout" initial={false}>
        {!opened ? (
          <motion.button
            key="envelope"
            onClick={() => setOpened(true)}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            whileHover={{ scale: 1.03 }}
            className="flex w-full max-w-[440px] flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              className="w-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/envelope/closed.png"
                alt="A sealed envelope"
                className="h-auto w-full drop-shadow-[0_24px_40px_-22px_rgba(70,52,24,0.55)]"
              />
            </motion.div>
            <span className="mt-6 font-sans text-sm text-stone-500">
              You have a postcard — tap to open
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="reading"
            initial={{ opacity: 0, y: 26, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 70, damping: 16 }}
            className="flex w-full max-w-[560px] flex-col items-center"
          >
            <Confetti />
            <div className="w-full">
              <Postcard card={card} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
            </div>

            <button
              onClick={() => setFlipped((f) => !f)}
              className="mt-5 flex items-center gap-1.5 font-sans text-sm text-stone-500 transition hover:text-stone-800"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {flipped ? "See the photo" : "Read the message"}
            </button>

            <Link
              href="/create"
              className="mt-12 font-sans text-sm text-stone-400 underline-offset-4 transition-colors hover:text-stone-800 hover:underline"
            >
              create your own
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
