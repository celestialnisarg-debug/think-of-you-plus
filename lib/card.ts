export const TITLE_COLORS = ["#ffffff", "#1a1a1a"] as const;

export type CardState = {
  title: string;
  titleColor: string;
  toName: string;
  fromName: string;
  message: string;
  photoUrl: string | null;
  stamp: string;
  flower: string;
};

export function defaultCard(): CardState {
  return {
    title: "",
    titleColor: "#ffffff",
    toName: "",
    fromName: "",
    message: "",
    photoUrl: null,
    stamp: "s2",
    flower: "f1",
  };
}

export function serializeCard(card: CardState): string {
  return JSON.stringify(card);
}

export function deserializeCard(raw: string): CardState {
  const parsed = JSON.parse(raw) as Partial<CardState>;
  return { ...defaultCard(), ...parsed };
}
