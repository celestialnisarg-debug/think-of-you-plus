import { describe, it, expect } from "vitest";
import { THEMES, getTheme } from "@/lib/themes";

describe("themes", () => {
  it("includes the five planned themes", () => {
    const ids = THEMES.map((t) => t.id);
    expect(ids).toEqual(["vintage", "minimal", "botanical", "festive", "night"]);
  });
  it("every theme has required visual fields", () => {
    for (const t of THEMES) {
      expect(t.name).toBeTruthy();
      expect(t.surface).toBeTruthy();
      expect(t.ink).toMatch(/^#/);
      expect(t.accent).toMatch(/^#/);
      expect(t.defaultTitleColor).toMatch(/^#/);
      expect(t.titleFont).toBeTruthy();
    }
  });
  it("getTheme falls back to vintage for unknown id", () => {
    expect(getTheme("nope").id).toBe("vintage");
  });
});
