"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Postcard from "@/components/Postcard";
import type { CardState } from "@/lib/card";

/**
 * A single seamless cream envelope that opens in three taps:
 *  stage 0 — sealed (flap down, wax seal)
 *  stage 1 — flap lifts, the postcard peeks out
 *  stage 2 — the postcard slides fully out; onOpened() fires
 */
export default function Envelope({
  card,
  onOpened,
}: {
  card: CardState;
  onOpened: () => void;
}) {
  const [stage, setStage] = useState(0);

  const advance = () => {
    if (stage === 0) setStage(1);
    else if (stage === 1) {
      setStage(2);
      setTimeout(onOpened, 900);
    }
  };

  const flapOpen = stage >= 1;
  const envelopeGone = stage >= 2;

  return (
    <div className="flex flex-col items-center">
      <div
        className="card-3d relative w-full max-w-[520px] cursor-pointer select-none"
        style={{ aspectRatio: "3 / 2", overflow: "visible" }}
        onClick={advance}
      >
        {/* back wall of the envelope */}
        <motion.div
          className="absolute inset-0 rounded-[12px]"
          style={{
            background: "linear-gradient(160deg, #efe4cb 0%, #e7d8b9 100%)",
            boxShadow: "0 22px 50px -20px rgba(70,52,24,0.55)",
          }}
          animate={{ opacity: envelopeGone ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* the postcard, tucked inside */}
        <motion.div
          className="absolute left-1/2 w-[92%] -translate-x-1/2"
          style={{ bottom: "6%", zIndex: 20 }}
          initial={false}
          animate={{
            y: stage === 0 ? "16%" : stage === 1 ? "-26%" : "-118%",
            scale: stage === 2 ? 1.04 : 1,
          }}
          transition={{ type: "spring", stiffness: 90, damping: 18, delay: stage === 1 ? 0.18 : 0 }}
        >
          <Postcard card={card} flipped={false} />
        </motion.div>

        {/* front pocket — sits in front of the card, with a V-dip so the card peeks from the center */}
        <motion.div
          className="absolute inset-0 rounded-[12px]"
          style={{
            zIndex: 30,
            background: "linear-gradient(160deg, #f4ead2 0%, #ecdcbd 100%)",
            clipPath: "polygon(0% 28%, 50% 58%, 100% 28%, 100% 100%, 0% 100%)",
            boxShadow: "inset 0 6px 14px -8px rgba(70,52,24,0.4)",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
          animate={{ opacity: envelopeGone ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        />
        {/* subtle side-flap seams on the pocket */}
        <motion.div
          className="absolute inset-0"
          style={{ zIndex: 31 }}
          animate={{ opacity: envelopeGone ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom right, transparent calc(50% - 0.5px), rgba(120,95,50,0.18) 50%, transparent calc(50% + 0.5px))",
              clipPath: "polygon(0% 28%, 50% 58%, 0% 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom left, transparent calc(50% - 0.5px), rgba(120,95,50,0.18) 50%, transparent calc(50% + 0.5px))",
              clipPath: "polygon(100% 28%, 50% 58%, 100% 100%)",
            }}
          />
        </motion.div>

        {/* the flap */}
        <motion.div
          className="absolute inset-x-0 top-0"
          style={{
            height: "72%",
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            zIndex: flapOpen ? 5 : 40,
            clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
            background: "linear-gradient(160deg, #f6eed8 0%, #ecddbe 100%)",
            boxShadow: flapOpen ? "none" : "0 6px 10px -8px rgba(70,52,24,0.45)",
            backfaceVisibility: "hidden",
          }}
          animate={{ rotateX: flapOpen ? -178 : 0, opacity: envelopeGone ? 0 : 1 }}
          transition={{ rotateX: { duration: 0.7, ease: "easeInOut" }, opacity: { duration: 0.4 } }}
        />

        {/* wax seal — rides on the flap tip while closed */}
        <motion.div
          className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2"
          style={{ zIndex: 45 }}
          animate={{ opacity: flapOpen ? 0 : 1, scale: flapOpen ? 0.7 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="grid h-12 w-12 place-items-center rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 30%, #9c5b46, #7a3b2c 70%)",
              boxShadow: "inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.35), 0 3px 6px rgba(0,0,0,0.3)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="opacity-70">
              <path
                d="M12 4c1.6 2 1.6 4 0 6-1.6-2-1.6-4 0-6zM12 14c1.6 2 1.6 4 0 6-1.6-2-1.6-4 0-6zM4 12c2-1.6 4-1.6 6 0-2 1.6-4 1.6-6 0zM14 12c2-1.6 4-1.6 6 0-2 1.6-4 1.6-6 0z"
                fill="#5e2c20"
              />
            </svg>
          </div>
        </motion.div>
      </div>

      {!envelopeGone && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 font-sans text-sm text-stone-500"
        >
          {stage === 0 ? "You have a postcard — tap the envelope to open" : "Tap again to take it out"}
        </motion.p>
      )}
    </div>
  );
}
