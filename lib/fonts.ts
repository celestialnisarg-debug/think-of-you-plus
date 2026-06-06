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
