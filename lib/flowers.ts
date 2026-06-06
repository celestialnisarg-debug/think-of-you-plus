export type Flower = { id: string; label: string; src: string };

export const FLOWERS: Flower[] = [
  { id: "f1", label: "Blue Iris", src: "/flowers/f1.png" },
  { id: "f2", label: "Golden Wallflower", src: "/flowers/f2.png" },
  { id: "f3", label: "Pink Lily", src: "/flowers/f3.png" },
  { id: "f4", label: "Purple Calla", src: "/flowers/f4.png" },
  { id: "f5", label: "Orange Lily", src: "/flowers/f5.png" },
];

export function getFlower(id: string): Flower {
  return FLOWERS.find((f) => f.id === id) ?? FLOWERS[0];
}
