import { describe, it, expect } from "vitest";
import { defaultCard, serializeCard, deserializeCard, type CardState } from "@/lib/card";

describe("card state", () => {
  it("defaultCard starts empty with default stamp and flower", () => {
    const c = defaultCard();
    expect(c.title).toBe("");
    expect(c.stamp).toBe("s2");
    expect(c.flower).toBe("f1");
    expect(c.titleColor).toBe("#ffffff");
  });

  it("serialize then deserialize is a round trip", () => {
    const card: CardState = {
      ...defaultCard(),
      title: "Happy Birthday",
      titleColor: "#1a1a1a",
      message: "Thinking of you today.",
      toName: "Sam",
      fromName: "Alex",
      stamp: "s7",
      flower: "f3",
    };
    const round = deserializeCard(serializeCard(card));
    expect(round).toEqual(card);
  });

  it("deserialize fills missing fields with defaults", () => {
    const partial = JSON.stringify({ toName: "Jo" });
    const card = deserializeCard(partial);
    expect(card.toName).toBe("Jo");
    expect(card.stamp).toBe("s2");
    expect(card.flower).toBe("f1");
  });
});
