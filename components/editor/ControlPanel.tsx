"use client";
import type { CardState } from "@/lib/card";
import { TITLE_COLORS } from "@/lib/card";
import { STAMPS } from "@/lib/stamps";
import { FLOWERS } from "@/lib/flowers";

const MAX_NAME = 25;
const MAX_TITLE = 25;
const MAX_MESSAGE = 180;

function Label({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 font-sans text-sm font-semibold text-stone-700">{children}</h3>;
}

function Counter({ value, max }: { value: number; max: number }) {
  return (
    <div className="mt-1 text-right font-sans text-xs text-stone-400">
      {value}/{max}
    </div>
  );
}

const underline =
  "w-full border-b border-stone-300 bg-transparent py-1.5 font-serif-display text-lg text-stone-800 placeholder:font-sans placeholder:text-sm placeholder:text-stone-400 focus:border-stone-500 focus:outline-none";

export default function ControlPanel({
  card,
  set,
}: {
  card: CardState;
  set: (patch: Partial<CardState>) => void;
}) {
  return (
    <div className="space-y-7">
      <section>
        <Label>To:</Label>
        <input
          value={card.toName}
          maxLength={MAX_NAME}
          placeholder="Who are you thinking of?"
          onChange={(e) => set({ toName: e.target.value })}
          className={underline}
        />
        <Counter value={card.toName.length} max={MAX_NAME} />
      </section>

      <section>
        <Label>From:</Label>
        <input
          value={card.fromName}
          maxLength={MAX_NAME}
          placeholder="Write your name"
          onChange={(e) => set({ fromName: e.target.value })}
          className={underline}
        />
        <Counter value={card.fromName.length} max={MAX_NAME} />
      </section>

      <section>
        <Label>Pick your stamp:</Label>
        <div className="flex flex-wrap gap-2.5">
          {STAMPS.map((s) => (
            <button
              key={s.id}
              title={s.label}
              onClick={() => set({ stamp: s.id })}
              className={`overflow-hidden rounded-md border-2 bg-white/60 p-0.5 transition ${
                card.stamp === s.id
                  ? "border-stone-500 ring-1 ring-stone-400"
                  : "border-transparent hover:border-stone-300"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} alt={s.label} className="h-14 w-auto" />
            </button>
          ))}
        </div>
      </section>

      <section>
        <Label>Write your message:</Label>
        <textarea
          value={card.message}
          maxLength={MAX_MESSAGE}
          rows={4}
          placeholder="Write something from your heart..."
          onChange={(e) => set({ message: e.target.value })}
          className="w-full resize-none rounded-lg border border-stone-300 bg-white/50 px-3 py-2 font-serif-display text-base text-stone-800 placeholder:font-sans placeholder:text-sm placeholder:text-stone-400 focus:border-stone-500 focus:outline-none"
        />
        <Counter value={card.message.length} max={MAX_MESSAGE} />
      </section>

      <section>
        <Label>Pick your flower:</Label>
        <div className="flex flex-wrap items-end gap-3">
          {FLOWERS.map((f) => (
            <button
              key={f.id}
              title={f.label}
              onClick={() => set({ flower: f.id })}
              className={`grid h-16 w-12 place-items-center rounded-md border-2 transition ${
                card.flower === f.id
                  ? "border-stone-500 ring-1 ring-stone-400"
                  : "border-transparent hover:border-stone-300"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.src} alt={f.label} className="max-h-14 w-auto" />
            </button>
          ))}
        </div>
      </section>

      <section>
        <Label>Add a title (optional):</Label>
        <input
          value={card.title}
          maxLength={MAX_TITLE}
          placeholder="(e.g. Happy Birthday)"
          onChange={(e) => set({ title: e.target.value })}
          className={underline}
        />
        <Counter value={card.title.length} max={MAX_TITLE} />
      </section>

      <section>
        <Label>Pick a title color:</Label>
        <div className="flex gap-3">
          {TITLE_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => set({ titleColor: c })}
              aria-label={c === "#ffffff" ? "White" : "Black"}
              className={`h-7 w-7 rounded-full border transition ${
                card.titleColor === c
                  ? "ring-2 ring-stone-500 ring-offset-2"
                  : "border-stone-300 hover:border-stone-400"
              }`}
              style={{ background: c }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
