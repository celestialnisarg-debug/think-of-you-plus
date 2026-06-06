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
