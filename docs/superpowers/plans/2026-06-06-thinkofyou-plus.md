# ThinkOfYou+ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-theme digital postcard creator with draggable stickers and real shareable links, deployed on Vercel.

**Architecture:** Next.js 14 App Router app. A pure-data theme/sticker layer drives a reusable `<Postcard>` renderer used identically by the editor (`/create`), the recipient view (`/c/[slug]`), and the landing sample. Card state is a single typed object; sharing serializes it to a Supabase row (photo to Storage) and returns a slug URL. When Supabase env is absent, sharing falls back to client-side PNG export so the app is never broken.

**Tech Stack:** Next.js 14 (TypeScript), Tailwind CSS, Framer Motion, Supabase (Postgres + Storage), html-to-image (PNG export), nanoid (slugs), Vitest (unit tests).

---

## File Structure

```
app/
  layout.tsx                 # root layout, fonts, global providers
  page.tsx                   # landing
  create/page.tsx            # editor (client)
  c/[slug]/page.tsx          # recipient view (server fetch + client render)
  c/[slug]/not-found.tsx     # bad slug state
components/
  Postcard.tsx               # the reusable card renderer (front/back/flip)
  StickerLayer.tsx           # renders + (optionally) drags stickers
  editor/ControlPanel.tsx    # all editor controls
  editor/PhotoUpload.tsx     # upload / drag-drop
  editor/StickerTray.tsx     # pick stickers to add
  editor/ThemePicker.tsx
  ui/ColorField.tsx
  Confetti.tsx               # recipient open burst
lib/
  themes.ts                  # theme catalog (data)
  stickers.ts                # sticker catalog (data + svg map)
  fonts.ts                   # font catalog
  card.ts                    # CardState type, defaults, (de)serialize
  slug.ts                    # slug generation
  supabase.ts                # client + isConfigured()
  exportPng.ts               # PNG fallback
lib/__tests__/               # vitest specs
supabase/migrations/         # SQL migration for postcards table + bucket
```

---

## Task 1: Scaffold project

**Files:**
- Create: `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `.gitignore`, `.env.local.example`, `vitest.config.ts`

- [ ] **Step 1: Initialize Next.js + deps**

Run:
```bash
cd "D:/Claude work"
npx create-next-app@14 . --ts --tailwind --app --eslint --src-dir=false --import-alias "@/*" --no-turbopack --use-npm --yes
npm install framer-motion @supabase/supabase-js nanoid html-to-image
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```
Expected: project files created, dependencies installed. If `create-next-app` refuses due to existing files, keep `docs/`, `.git/` and answer to overwrite none — instead generate into a temp dir and move files in. (Existing `docs/` and `CLAUDE.md` must be preserved.)

- [ ] **Step 2: Add test script + vitest config**

In `package.json` `scripts` add: `"test": "vitest run"`, `"test:watch": "vitest"`.

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", globals: true, setupFiles: [] },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

- [ ] **Step 3: Verify build tooling**

Run: `npm run test -- --passWithNoTests`
Expected: PASS (no tests yet).

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Create `.env.local.example`**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js + Tailwind + test tooling"
```

---

## Task 2: Card state model

**Files:**
- Create: `lib/card.ts`
- Test: `lib/__tests__/card.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { defaultCard, serializeCard, deserializeCard, type CardState } from "@/lib/card";

describe("card state", () => {
  it("defaultCard has a vintage theme and empty stickers", () => {
    expect(defaultCard().theme).toBe("vintage");
    expect(defaultCard().stickers).toEqual([]);
  });

  it("serialize then deserialize is a round trip", () => {
    const card: CardState = {
      ...defaultCard(),
      title: "Thank You",
      titleColor: "#2f6b3f",
      message: "You are appreciated.",
      toName: "Sam",
      fromName: "Alex",
      stickers: [{ id: "s1", type: "flower", x: 10, y: 20, rotation: 15, scale: 1.2, z: 1 }],
    };
    const round = deserializeCard(serializeCard(card));
    expect(round).toEqual(card);
  });

  it("deserialize fills missing optional fields with defaults", () => {
    const partial = JSON.stringify({ title: "Hi" });
    const card = deserializeCard(partial);
    expect(card.title).toBe("Hi");
    expect(card.theme).toBe("vintage");
    expect(card.stickers).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- card`
Expected: FAIL ("Cannot find module '@/lib/card'").

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/card.ts
export type StickerPlacement = {
  id: string;
  type: string;
  x: number;       // % of card width (0-100)
  y: number;       // % of card height (0-100)
  rotation: number; // degrees
  scale: number;
  z: number;
};

export type CardState = {
  theme: string;
  title: string;
  titleColor: string;
  titleFont: string;
  message: string;
  toName: string;
  fromName: string;
  photoUrl: string | null;
  bg: string | null;
  stickers: StickerPlacement[];
};

export function defaultCard(): CardState {
  return {
    theme: "vintage",
    title: "Thank You for Everything!",
    titleColor: "#2f6b3f",
    titleFont: "serif-display",
    message: "Just thinking of you today.",
    toName: "",
    fromName: "",
    photoUrl: null,
    bg: null,
    stickers: [],
  };
}

export function serializeCard(card: CardState): string {
  return JSON.stringify(card);
}

export function deserializeCard(raw: string): CardState {
  const parsed = JSON.parse(raw) as Partial<CardState>;
  return { ...defaultCard(), ...parsed, stickers: parsed.stickers ?? [] };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- card`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/card.ts lib/__tests__/card.test.ts
git commit -m "feat: card state model with serialization"
```

---

## Task 3: Slug generation

**Files:**
- Create: `lib/slug.ts`
- Test: `lib/__tests__/slug.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { makeSlug } from "@/lib/slug";

describe("makeSlug", () => {
  it("is 8 url-safe chars", () => {
    const s = makeSlug();
    expect(s).toMatch(/^[0-9a-zA-Z_-]{8}$/);
  });
  it("is reasonably unique across many calls", () => {
    const set = new Set(Array.from({ length: 1000 }, () => makeSlug()));
    expect(set.size).toBe(1000);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- slug`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/slug.ts
import { customAlphabet } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
const nano = customAlphabet(alphabet, 8);

export function makeSlug(): string {
  return nano();
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- slug`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/slug.ts lib/__tests__/slug.test.ts
git commit -m "feat: slug generation"
```

---

## Task 4: Theme catalog

**Files:**
- Create: `lib/themes.ts`, `lib/fonts.ts`
- Test: `lib/__tests__/themes.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { THEMES, getTheme } from "@/lib/themes";

describe("themes", () => {
  it("includes the five planned themes", () => {
    const ids = THEMES.map((t) => t.id);
    expect(ids).toEqual(["vintage", "minimal", "botanical", "festive", "night"]);
  });
  it("every theme has required visual fields", () => {
    for (const t of THEMES) {
      expect(t.name).toBeTruthy();
      expect(t.surface).toBeTruthy();      // CSS background for the card
      expect(t.ink).toMatch(/^#/);          // default text color
      expect(t.accent).toMatch(/^#/);
      expect(t.defaultTitleColor).toMatch(/^#/);
      expect(t.titleFont).toBeTruthy();
    }
  });
  it("getTheme falls back to vintage for unknown id", () => {
    expect(getTheme("nope").id).toBe("vintage");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- themes`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/fonts.ts
export type FontDef = { id: string; name: string; stack: string };
export const FONTS: FontDef[] = [
  { id: "serif-display", name: "Playful Serif", stack: "'Playfair Display', Georgia, serif" },
  { id: "script", name: "Handwritten", stack: "'Caveat', 'Segoe Script', cursive" },
  { id: "sans", name: "Clean Sans", stack: "'Inter', system-ui, sans-serif" },
  { id: "mono", name: "Typewriter", stack: "'Special Elite', 'Courier New', monospace" },
];
export function getFontStack(id: string): string {
  return (FONTS.find((f) => f.id === id) ?? FONTS[0]).stack;
}
```

```ts
// lib/themes.ts
export type Theme = {
  id: string;
  name: string;
  surface: string;   // CSS background for card front/back
  ink: string;       // default text color
  accent: string;    // stamp / divider color
  defaultTitleColor: string;
  titleFont: string; // font id from lib/fonts
  stamp: "leaf" | "flower" | "star" | "heart" | "moon";
};

export const THEMES: Theme[] = [
  {
    id: "vintage", name: "Vintage",
    surface: "radial-gradient(120% 120% at 0% 0%, #f7f0dd 0%, #efe3c4 60%, #e7d6ab 100%)",
    ink: "#4a3f2e", accent: "#2f6b3f",
    defaultTitleColor: "#2f6b3f", titleFont: "serif-display", stamp: "leaf",
  },
  {
    id: "minimal", name: "Modern Minimal",
    surface: "linear-gradient(180deg, #ffffff 0%, #f4f4f5 100%)",
    ink: "#18181b", accent: "#71717a",
    defaultTitleColor: "#18181b", titleFont: "sans", stamp: "star",
  },
  {
    id: "botanical", name: "Botanical",
    surface: "linear-gradient(160deg, #eef5ec 0%, #dcecd9 50%, #d7e8d0 100%)",
    ink: "#2c3a2e", accent: "#5a8a4c",
    defaultTitleColor: "#3a6b39", titleFont: "script", stamp: "flower",
  },
  {
    id: "festive", name: "Festive",
    surface: "linear-gradient(160deg, #fff1f2 0%, #ffe4e6 50%, #fde2c4 100%)",
    ink: "#7c2d12", accent: "#e11d48",
    defaultTitleColor: "#e11d48", titleFont: "serif-display", stamp: "heart",
  },
  {
    id: "night", name: "Night",
    surface: "radial-gradient(120% 120% at 80% 0%, #1e293b 0%, #0f172a 60%, #020617 100%)",
    ink: "#e2e8f0", accent: "#a78bfa",
    defaultTitleColor: "#c4b5fd", titleFont: "serif-display", stamp: "moon",
  },
];

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- themes`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/themes.ts lib/fonts.ts lib/__tests__/themes.test.ts
git commit -m "feat: theme and font catalogs"
```

---

## Task 5: Sticker catalog

**Files:**
- Create: `lib/stickers.ts`, `components/StickerLayer.tsx`
- Test: `lib/__tests__/stickers.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { STICKERS, getStickerSvg } from "@/lib/stickers";

describe("stickers", () => {
  it("has at least 8 stickers across categories", () => {
    expect(STICKERS.length).toBeGreaterThanOrEqual(8);
  });
  it("each sticker has id, label, category", () => {
    for (const s of STICKERS) {
      expect(s.id).toBeTruthy();
      expect(s.label).toBeTruthy();
      expect(["flower", "star", "heart", "stamp", "washi"]).toContain(s.category);
    }
  });
  it("getStickerSvg returns an svg string for a known id", () => {
    expect(getStickerSvg(STICKERS[0].id)).toContain("<svg");
  });
  it("getStickerSvg returns empty string for unknown id", () => {
    expect(getStickerSvg("nope")).toBe("");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- stickers`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/stickers.ts
export type StickerCategory = "flower" | "star" | "heart" | "stamp" | "washi";
export type StickerDef = { id: string; label: string; category: StickerCategory; svg: string };

const flower = (c: string) =>
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${
    [0, 72, 144, 216, 288].map((a) =>
      `<ellipse cx="50" cy="28" rx="13" ry="22" fill="${c}" transform="rotate(${a} 50 50)"/>`).join("")
  }<circle cx="50" cy="50" r="11" fill="#f6c453"/></svg>`;

const star = (c: string) =>
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 6l11 30 32 1-25 20 9 31-27-18-27 18 9-31-25-20 32-1z" fill="${c}"/></svg>`;

const heart = (c: string) =>
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 86C20 64 8 46 8 30 8 16 19 8 31 8c8 0 15 4 19 11 4-7 11-11 19-11 12 0 23 8 23 22 0 16-12 34-42 56z" fill="${c}"/></svg>`;

const stamp = (c: string) =>
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="14" width="72" height="72" rx="4" fill="#fff" stroke="${c}" stroke-width="3" stroke-dasharray="4 4"/><circle cx="50" cy="46" r="18" fill="${c}" opacity="0.85"/><text x="50" y="80" font-size="12" text-anchor="middle" fill="${c}">POST</text></svg>`;

const washi = (c: string) =>
  `<svg viewBox="0 0 140 40" xmlns="http://www.w3.org/2000/svg"><rect width="140" height="40" fill="${c}" opacity="0.7"/><g fill="#ffffff" opacity="0.5">${
    Array.from({ length: 10 }, (_, i) => `<circle cx="${8 + i * 14}" cy="20" r="4"/>`).join("")
  }</g></svg>`;

export const STICKERS: StickerDef[] = [
  { id: "flower-green", label: "Green Flower", category: "flower", svg: flower("#7bb274") },
  { id: "flower-pink", label: "Pink Flower", category: "flower", svg: flower("#e98aa8") },
  { id: "star-gold", label: "Gold Star", category: "star", svg: star("#f6c453") },
  { id: "star-violet", label: "Violet Star", category: "star", svg: star("#a78bfa") },
  { id: "heart-red", label: "Red Heart", category: "heart", svg: heart("#e11d48") },
  { id: "heart-cream", label: "Cream Heart", category: "heart", svg: heart("#f4a4a4") },
  { id: "stamp-green", label: "Green Stamp", category: "stamp", svg: stamp("#2f6b3f") },
  { id: "stamp-blue", label: "Blue Stamp", category: "stamp", svg: stamp("#3b6fb3") },
  { id: "washi-sage", label: "Sage Tape", category: "washi", svg: washi("#9bbf8a") },
  { id: "washi-rose", label: "Rose Tape", category: "washi", svg: washi("#e7a6b8") },
];

export function getStickerSvg(id: string): string {
  return STICKERS.find((s) => s.id === id)?.svg ?? "";
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- stickers`
Expected: PASS.

- [ ] **Step 5: Build the StickerLayer component**

```tsx
// components/StickerLayer.tsx
"use client";
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
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stickers.map((s) => (
        <motion.div
          key={s.id}
          className={`absolute ${editable ? "pointer-events-auto cursor-grab active:cursor-grabbing" : ""} ${
            selectedId === s.id ? "outline outline-2 outline-dashed outline-sky-400/70" : ""
          }`}
          style={{ left: `${s.x}%`, top: `${s.y}%`, zIndex: s.z, width: 64 }}
          drag={editable}
          dragMomentum={false}
          onPointerDown={() => editable && onSelect?.(s.id)}
          onDragEnd={(_, info) => {
            if (!editable || !onChange) return;
            const parent = (info as any).point; // converted by caller; see ControlPanel note
            onChange(s.id, {});
          }}
          animate={{ rotate: s.rotation, scale: s.scale }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          dangerouslySetInnerHTML={{ __html: getStickerSvg(s.type) }}
        />
      ))}
    </div>
  );
}
```

Note for implementer: precise drag-to-percentage conversion is handled in the editor (Task 8) where the card bounding rect is known; `StickerLayer` positions by percentage and reports drag via `onChange`. Keep this component free of editor-only math.

- [ ] **Step 6: Commit**

```bash
git add lib/stickers.ts components/StickerLayer.tsx lib/__tests__/stickers.test.ts
git commit -m "feat: sticker catalog + sticker layer"
```

---

## Task 6: Postcard renderer

**Files:**
- Create: `components/Postcard.tsx`
- Modify: `app/globals.css` (add font imports, texture/3d helpers)

- [ ] **Step 1: Add fonts + helpers to globals.css**

Append:
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Caveat:wght@500;700&family=Inter:wght@400;600&family=Special+Elite&display=swap');

.card-3d { perspective: 1600px; }
.card-face { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.paper-noise {
  background-image: radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px);
  background-size: 4px 4px;
}
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}
```

- [ ] **Step 2: Build the Postcard component**

```tsx
// components/Postcard.tsx
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
```

- [ ] **Step 3: Manual verification with preview**

Temporarily render `<Postcard card={defaultCard()} flipped={false}/>` on `app/page.tsx`, run `npm run dev`, and use the preview tools to confirm the card renders and flips. Then revert the temporary landing change.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/Postcard.tsx app/globals.css
git commit -m "feat: reusable Postcard renderer with flip"
```

---

## Task 7: Supabase client + persistence layer

**Files:**
- Create: `lib/supabase.ts`, `lib/postcards.ts`
- Test: `lib/__tests__/supabase.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { isSupabaseConfigured } from "@/lib/supabase";

describe("isSupabaseConfigured", () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });
  it("false when env missing", () => {
    expect(isSupabaseConfigured()).toBe(false);
  });
  it("true when both env present", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://x.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
    expect(isSupabaseConfigured()).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- supabase`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/supabase.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

let client: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}
```

```ts
// lib/postcards.ts
import { getSupabase } from "@/lib/supabase";
import { makeSlug } from "@/lib/slug";
import type { CardState } from "@/lib/card";

const TABLE = "postcards";

function rowToCard(row: any): CardState {
  return {
    theme: row.theme, title: row.title, titleColor: row.title_color,
    titleFont: row.title_font, message: row.message, toName: row.to_name,
    fromName: row.from_name, photoUrl: row.photo_url, bg: row.bg,
    stickers: row.stickers ?? [],
  };
}

export async function uploadPhoto(file: File): Promise<string> {
  const sb = getSupabase();
  const path = `${makeSlug()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
  const { error } = await sb.storage.from("postcard-photos").upload(path, file, { upsert: false });
  if (error) throw error;
  return sb.storage.from("postcard-photos").getPublicUrl(path).data.publicUrl;
}

export async function saveCard(card: CardState): Promise<string> {
  const sb = getSupabase();
  const slug = makeSlug();
  const { error } = await sb.from(TABLE).insert({
    slug, theme: card.theme, title: card.title, title_color: card.titleColor,
    title_font: card.titleFont, message: card.message, to_name: card.toName,
    from_name: card.fromName, photo_url: card.photoUrl, bg: card.bg, stickers: card.stickers,
  });
  if (error) throw error;
  return slug;
}

export async function getCard(slug: string): Promise<CardState | null> {
  const sb = getSupabase();
  const { data, error } = await sb.from(TABLE).select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? rowToCard(data) : null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- supabase`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/supabase.ts lib/postcards.ts lib/__tests__/supabase.test.ts
git commit -m "feat: supabase client + postcard persistence"
```

---

## Task 8: PNG export fallback

**Files:**
- Create: `lib/exportPng.ts`

- [ ] **Step 1: Implement export helper**

```ts
// lib/exportPng.ts
import { toPng } from "html-to-image";

export async function exportNodeToPng(node: HTMLElement, filename = "postcard.png"): Promise<void> {
  const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `npm run build`
Expected: build succeeds (no usage yet is fine; it will be imported in Task 9).

- [ ] **Step 3: Commit**

```bash
git add lib/exportPng.ts
git commit -m "feat: png export fallback"
```

---

## Task 9: Editor controls + page

**Files:**
- Create: `components/ui/ColorField.tsx`, `components/editor/ThemePicker.tsx`, `components/editor/PhotoUpload.tsx`, `components/editor/StickerTray.tsx`, `components/editor/ControlPanel.tsx`, `app/create/page.tsx`

- [ ] **Step 1: ColorField**

```tsx
// components/ui/ColorField.tsx
"use client";
export default function ColorField({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span>{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
        className="h-8 w-12 cursor-pointer rounded border border-black/10 bg-transparent" />
    </label>
  );
}
```

- [ ] **Step 2: ThemePicker**

```tsx
// components/editor/ThemePicker.tsx
"use client";
import { THEMES } from "@/lib/themes";
export default function ThemePicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {THEMES.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`rounded-lg border p-2 text-xs transition ${value === t.id ? "ring-2 ring-sky-400 border-transparent" : "border-black/10 hover:border-black/30"}`}>
          <span className="block h-8 rounded mb-1" style={{ background: t.surface }} />
          {t.name}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: PhotoUpload**

```tsx
// components/editor/PhotoUpload.tsx
"use client";
import { useRef, useState } from "react";
export default function PhotoUpload({ onFile, hasPhoto, onRemove }: {
  onFile: (file: File) => void; hasPhoto: boolean; onRemove: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
      className={`rounded-lg border-2 border-dashed p-4 text-center text-sm transition ${drag ? "border-sky-400 bg-sky-50" : "border-black/15"}`}
    >
      <input ref={ref} type="file" accept="image/*" hidden
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      <button className="underline" onClick={() => ref.current?.click()}>Click to upload a photo</button>
      <span className="opacity-60">, or drag and drop</span>
      {hasPhoto && <button onClick={onRemove} className="mt-2 block w-full text-xs text-red-600">Remove photo</button>}
    </div>
  );
}
```

- [ ] **Step 4: StickerTray**

```tsx
// components/editor/StickerTray.tsx
"use client";
import { STICKERS } from "@/lib/stickers";
export default function StickerTray({ onAdd }: { onAdd: (type: string) => void }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {STICKERS.map((s) => (
        <button key={s.id} title={s.label} onClick={() => onAdd(s.id)}
          className="aspect-square rounded-lg border border-black/10 p-1 hover:bg-black/5"
          dangerouslySetInnerHTML={{ __html: s.svg }} />
      ))}
    </div>
  );
}
```

- [ ] **Step 5: ControlPanel**

```tsx
// components/editor/ControlPanel.tsx
"use client";
import type { CardState } from "@/lib/card";
import { FONTS } from "@/lib/fonts";
import ThemePicker from "./ThemePicker";
import PhotoUpload from "./PhotoUpload";
import StickerTray from "./StickerTray";
import ColorField from "@/components/ui/ColorField";

const MAX_TITLE = 40;

export default function ControlPanel({ card, set, onFile, onRemovePhoto, onAddSticker, onDeleteSelected, selected }: {
  card: CardState;
  set: (patch: Partial<CardState>) => void;
  onFile: (f: File) => void;
  onRemovePhoto: () => void;
  onAddSticker: (type: string) => void;
  onDeleteSelected: () => void;
  selected: string | null;
}) {
  return (
    <div className="space-y-5">
      <section><h3 className="mb-2 text-sm font-semibold">Theme</h3>
        <ThemePicker value={card.theme} onChange={(theme) => set({ theme })} /></section>

      <section><h3 className="mb-2 text-sm font-semibold">Photo</h3>
        <PhotoUpload onFile={onFile} hasPhoto={!!card.photoUrl} onRemove={onRemovePhoto} /></section>

      <section><h3 className="mb-2 text-sm font-semibold">Title</h3>
        <input value={card.title} maxLength={MAX_TITLE}
          onChange={(e) => set({ title: e.target.value })}
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm" />
        <div className="mt-1 text-right text-xs opacity-60">{card.title.length}/{MAX_TITLE}</div>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <ColorField label="Color" value={card.titleColor} onChange={(titleColor) => set({ titleColor })} />
          <select value={card.titleFont} onChange={(e) => set({ titleFont: e.target.value })}
            className="rounded-lg border border-black/15 px-2 py-1 text-sm">
            {FONTS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <label className="text-sm">To<input value={card.toName} onChange={(e) => set({ toName: e.target.value })}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm" /></label>
        <label className="text-sm">From<input value={card.fromName} onChange={(e) => set({ fromName: e.target.value })}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm" /></label>
      </section>

      <section><h3 className="mb-2 text-sm font-semibold">Message</h3>
        <textarea value={card.message} rows={4} onChange={(e) => set({ message: e.target.value })}
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm" /></section>

      <section><h3 className="mb-2 text-sm font-semibold">Stickers</h3>
        <StickerTray onAdd={onAddSticker} />
        {selected && <button onClick={onDeleteSelected} className="mt-2 text-xs text-red-600">Delete selected sticker</button>}
      </section>
    </div>
  );
}
```

- [ ] **Step 6: Editor page (state owner)**

```tsx
// app/create/page.tsx
"use client";
import { useRef, useState } from "react";
import Postcard from "@/components/Postcard";
import ControlPanel from "@/components/editor/ControlPanel";
import { defaultCard, type CardState, type StickerPlacement } from "@/lib/card";
import { makeSlug } from "@/lib/slug";
import { isSupabaseConfigured } from "@/lib/supabase";
import { saveCard, uploadPhoto } from "@/lib/postcards";
import { exportNodeToPng } from "@/lib/exportPng";

export default function CreatePage() {
  const [card, setCard] = useState<CardState>(defaultCard());
  const [flipped, setFlipped] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const set = (patch: Partial<CardState>) => setCard((c) => ({ ...c, ...patch }));

  const onFile = (f: File) => { setPendingFile(f); set({ photoUrl: URL.createObjectURL(f) }); };
  const onRemovePhoto = () => { setPendingFile(null); set({ photoUrl: null }); };

  const onAddSticker = (type: string) => {
    const s: StickerPlacement = { id: makeSlug(), type, x: 40, y: 40, rotation: 0, scale: 1,
      z: (card.stickers.at(-1)?.z ?? 0) + 1 };
    set({ stickers: [...card.stickers, s] });
    setSelected(s.id);
  };
  const onChangeSticker = (id: string, patch: Partial<StickerPlacement>) =>
    set({ stickers: card.stickers.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  const onDeleteSelected = () => {
    if (!selected) return;
    set({ stickers: card.stickers.filter((s) => s.id !== selected) });
    setSelected(null);
  };

  const onShare = async () => {
    setBusy(true);
    try {
      if (isSupabaseConfigured()) {
        let photoUrl = card.photoUrl;
        if (pendingFile) photoUrl = await uploadPhoto(pendingFile);
        const slug = await saveCard({ ...card, photoUrl });
        const url = `${window.location.origin}/c/${slug}`;
        setShareUrl(url);
        if (navigator.share) await navigator.share({ title: "A postcard for you", url }).catch(() => {});
      } else if (cardRef.current) {
        await exportNodeToPng(cardRef.current);
      }
    } finally { setBusy(false); }
  };

  return (
    <main className="mx-auto grid max-w-6xl gap-8 p-4 md:grid-cols-2 md:p-8">
      <div className="flex flex-col items-center gap-4">
        <Postcard card={card} flipped={flipped} onFlip={() => setFlipped((f) => !f)}
          editable selectedSticker={selected} onSelectSticker={setSelected}
          onChangeSticker={onChangeSticker} cardRef={cardRef} />
        <div className="flex gap-3">
          <button onClick={() => setFlipped((f) => !f)} className="rounded-full border px-4 py-2 text-sm">Click to flip</button>
          <button onClick={onShare} disabled={busy}
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {busy ? "Sharing…" : "Share"}
          </button>
        </div>
        {shareUrl && (
          <div className="w-full rounded-lg bg-emerald-50 p-3 text-center text-sm">
            <p className="mb-1 font-medium">Your link is ready</p>
            <button className="underline" onClick={() => navigator.clipboard.writeText(shareUrl)}>{shareUrl} (copy)</button>
          </div>
        )}
      </div>
      <ControlPanel card={card} set={set} onFile={onFile} onRemovePhoto={onRemovePhoto}
        onAddSticker={onAddSticker} onDeleteSelected={onDeleteSelected} selected={selected} />
    </main>
  );
}
```

Implementer note on sticker dragging: in `StickerLayer`, compute new `x/y` percentages in `onDragEnd` from `info.offset` relative to the card rect (pass the card rect via a ref or `getBoundingClientRect()` on the sticker's parent). Update via `onChange(id, { x, y })`. Keep math in the editor-aware path; verify by dragging a sticker in the preview and confirming it persists on flip.

- [ ] **Step 7: Verify editor in browser**

Run `npm run dev`; use preview tools: change theme, type a title (watch counter + live color), add a sticker, drag it, flip the card. Confirm no console errors. With no Supabase env, click Share → PNG downloads.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 8: Commit**

```bash
git add components/ui components/editor app/create
git commit -m "feat: postcard editor with live preview, stickers, share/PNG"
```

---

## Task 10: Recipient view + confetti

**Files:**
- Create: `components/Confetti.tsx`, `app/c/[slug]/page.tsx`, `app/c/[slug]/not-found.tsx`

- [ ] **Step 1: Confetti component**

```tsx
// components/Confetti.tsx
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
```

- [ ] **Step 2: not-found state**

```tsx
// app/c/[slug]/not-found.tsx
import Link from "next/link";
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-8 text-center">
      <div>
        <h1 className="text-2xl font-semibold">Postcard not found</h1>
        <p className="mt-2 opacity-70">This link may be wrong or expired.</p>
        <Link href="/create" className="mt-4 inline-block rounded-full bg-emerald-600 px-5 py-2 text-white">Create your own</Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Recipient page**

```tsx
// app/c/[slug]/page.tsx
import { notFound } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getCard } from "@/lib/postcards";
import RecipientView from "./RecipientView";

export default async function Page({ params }: { params: { slug: string } }) {
  if (!isSupabaseConfigured()) notFound();
  const card = await getCard(params.slug);
  if (!card) notFound();
  return <RecipientView card={card} />;
}
```

```tsx
// app/c/[slug]/RecipientView.tsx
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
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add components/Confetti.tsx "app/c/[slug]"
git commit -m "feat: recipient view with entrance animation + confetti"
```

---

## Task 11: Landing page

**Files:**
- Modify: `app/page.tsx`, `app/layout.tsx`

- [ ] **Step 1: Landing page**

```tsx
// app/page.tsx
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
```

- [ ] **Step 2: Metadata + footer in layout**

In `app/layout.tsx` set `metadata = { title: "ThinkOfYou+", description: "Design & send heartfelt digital postcards." }` and add a footer with attribution: "Inspired by think-of-you by @iryna_lupan · rebuilt with more customization."

- [ ] **Step 3: Verify in browser**

Run `npm run dev`; preview the landing, confirm hero animates in, sample card flips on click, CTA navigates to `/create`. Capture a screenshot.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/layout.tsx
git commit -m "feat: animated landing page"
```

---

## Task 12: Provision Supabase backend

**Files:**
- Create: `supabase/migrations/0001_postcards.sql`

- [ ] **Step 1: Write migration SQL**

```sql
-- supabase/migrations/0001_postcards.sql
create extension if not exists pgcrypto;

create table if not exists public.postcards (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  theme text not null default 'vintage',
  title text not null default '',
  title_color text not null default '#2f6b3f',
  title_font text not null default 'serif-display',
  message text not null default '',
  to_name text not null default '',
  from_name text not null default '',
  photo_url text,
  bg text,
  stickers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.postcards enable row level security;

create policy "public insert" on public.postcards for insert to anon with check (true);
create policy "public select" on public.postcards for select to anon using (true);
```

- [ ] **Step 2: Provision via Supabase MCP**

Use the Supabase MCP tools (load via ToolSearch `select:...`):
1. `list_organizations` → pick an org.
2. `get_cost` then `confirm_cost` for a new project (free tier, $0), then `create_project`.
3. `apply_migration` with the SQL above (name `0001_postcards`).
4. Create the public Storage bucket `postcard-photos` (via `execute_sql`: `insert into storage.buckets (id, name, public) values ('postcard-photos','postcard-photos', true) on conflict do nothing;`) and add storage policies allowing anon `insert` and public `select` on that bucket.
5. `get_project_url` + `get_publishable_keys` → write values into `.env.local`.

- [ ] **Step 3: Smoke test end-to-end**

Run `npm run dev`. In the editor, add a photo + title + sticker, click Share, confirm a `/c/<slug>` link is produced, open it, confirm the card renders with the photo and confetti.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0001_postcards.sql .env.local.example
git commit -m "feat: supabase migration for postcards + storage"
```

(Do NOT commit `.env.local` — it is gitignored.)

---

## Task 13: Deploy to Vercel

**Files:**
- Create: `README.md`, `vercel.json` (only if needed)

- [ ] **Step 1: Write README**

Document: what the app is, local dev (`npm install`, copy `.env.local.example` → `.env.local`, `npm run dev`), the two env vars, and the deploy steps.

- [ ] **Step 2: Final full check**

Run: `npm run lint && npm run test && npm run build`
Expected: all pass.

- [ ] **Step 3: Deploy**

Use the Vercel MCP `deploy_to_vercel` (load via ToolSearch). Set the two env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project. Confirm the production URL renders the landing, editor, and a created `/c/[slug]` link.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: README + deploy"
```

---

## Self-Review Notes

- **Spec coverage:** landing (T11), editor + all controls (T9), recipient view (T10), themes (T4), stickers (T5), data model + persistence (T7, T12), share flow (T9), PNG fallback (T8), animations (T6/T10/T11), graceful fallback (T9/T10), deploy (T13). All spec sections mapped.
- **Type consistency:** `CardState`/`StickerPlacement` defined in T2 and used unchanged in T5–T11; `saveCard`/`getCard`/`uploadPhoto` defined in T7 and consumed in T9–T10; `getTheme`/`getFontStack`/`getStickerSvg` defined T4–T5 and used in T6.
