"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Postcard from "@/components/Postcard";
import { defaultCard } from "@/lib/card";

export default function Home() {
  const [flipped, setFlipped] = useState(false);
  const sample = { ...defaultCard(), toName: "You", fromName: "Me",
    message: "Sending a little something to brighten your day." };
  return (
    <main className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 p-6 md:grid-cols-2">
      <div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-4xl font-bold leading-tight sm:text-5xl">Share the love with someone special.</motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 max-w-md text-lg opacity-70">Design a heartfelt postcard — pick a theme, add a photo and stickers, and send a link they can open and keep.</motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Link href="/create" className="mt-8 inline-block rounded-full bg-emerald-600 px-7 py-3 text-base font-semibold text-white shadow-lg transition hover:scale-105">Create a postcard</Link>
        </motion.div>
      </div>
      <motion.div whileHover={{ rotate: -1 }} onClick={() => setFlipped((f) => !f)} className="cursor-pointer">
        <Postcard card={sample} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
        <p className="mt-3 text-center text-sm opacity-60">Click the card to flip it</p>
      </motion.div>
    </main>
  );
}
