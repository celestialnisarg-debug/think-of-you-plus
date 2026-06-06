export type Stamp = { id: string; label: string; src: string };

export const STAMPS: Stamp[] = [
  { id: "s2", label: "Cornflower", src: "/stamps/s2.png" },
  { id: "s3", label: "Wildflower", src: "/stamps/s3.png" },
  { id: "s5", label: "Magnolia", src: "/stamps/s5.png" },
  { id: "s6", label: "Botanical", src: "/stamps/s6.png" },
  { id: "s7", label: "Peony", src: "/stamps/s7.png" },
  { id: "s8", label: "Blossom", src: "/stamps/s8.png" },
  { id: "s9", label: "Garden", src: "/stamps/s9.png" },
];

export function getStamp(id: string): Stamp {
  return STAMPS.find((s) => s.id === id) ?? STAMPS[0];
}
