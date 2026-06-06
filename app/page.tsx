"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Postcard from "@/components/Postcard";
import { defaultCard } from "@/lib/card";

export default function Home() {
  const [flipped, setFlipped] = useState(true);
  const sample = {
    ...defaultCard(),
    toName: "You",
    fromName: "Me",
    message: "Just a little something to let you know I'm thinking of you today.",
    stamp: "s2",
    flower: "f1",
  };

  return (
    <main className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-14 md:grid-cols-2 md:py-20">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-serif-display text-5xl leading-[1.05] text-stone-800 sm:text-6xl"
        >
          Share the love with someone special.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mt-5 max-w-md font-sans text-lg leading-relaxed text-stone-500"
        >
          Design a heartfelt postcard, seal it in an envelope, and send a link they
          can open and keep forever.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
        >
          <Link
            href="/create"
            className="mt-9 inline-block rounded-xl bg-stone-800 px-8 py-3.5 font-sans text-base font-medium text-white shadow-lg transition hover:scale-[1.03] hover:bg-stone-900"
          >
            Create a postcard
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, rotate: 1.5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.15, type: "spring", stiffness: 70 }}
        className="flex flex-col items-center"
      >
        <div className="w-full max-w-[540px] cursor-pointer" onClick={() => setFlipped((f) => !f)}>
          <Postcard card={sample} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
        </div>
        <p className="mt-3 font-sans text-sm text-stone-400">Click the card to flip it</p>
      </motion.div>
    </main>
  );
}
