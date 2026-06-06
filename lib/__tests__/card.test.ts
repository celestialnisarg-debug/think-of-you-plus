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
