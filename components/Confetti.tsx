"use client";
import { motion } from "framer-motion";
const COLORS = ["#7bb274", "#e98aa8", "#f6c453", "#a78bfa", "#e11d48"];
export default function Confetti({ count = 28 }: { count?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.span key={i}
          className="absolute top-0 h-2 w-2 rounded-sm"
          style={{ left: `${(i / count) * 100}%`, background: COLORS[i % COLORS.length] }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: "100vh", opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{ duration: 2.4 + (i % 5) * 0.3, delay: (i % 7) * 0.1, ease: "easeIn" }} />
      ))}
    </div>
  );
}
