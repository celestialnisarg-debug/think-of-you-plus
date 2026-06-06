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
