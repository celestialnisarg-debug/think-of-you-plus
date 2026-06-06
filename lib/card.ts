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
