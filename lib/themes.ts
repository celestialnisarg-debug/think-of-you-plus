export type Theme = {
  id: string;
  name: string;
  surface: string;
  ink: string;
  accent: string;
  defaultTitleColor: string;
  titleFont: string;
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
