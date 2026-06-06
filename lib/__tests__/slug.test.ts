import { describe, it, expect } from "vitest";
import { makeSlug } from "@/lib/slug";

describe("makeSlug", () => {
  it("is 8 url-safe chars", () => {
    const s = makeSlug();
    expect(s).toMatch(/^[0-9a-zA-Z_-]{8}$/);
  });
  it("is reasonably unique across many calls", () => {
    const set = new Set(Array.from({ length: 1000 }, () => makeSlug()));
    expect(set.size).toBe(1000);
  });
});
