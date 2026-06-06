import { describe, it, expect } from "vitest";
import { FLOWERS, getFlower } from "@/lib/flowers";
import { STAMPS, getStamp } from "@/lib/stamps";

describe("flowers", () => {
  it("has the five flower options", () => {
    expect(FLOWERS.map((f) => f.id)).toEqual(["f1", "f2", "f3", "f4", "f5"]);
  });
  it("every flower has a label and a public png src", () => {
    for (const f of FLOWERS) {
      expect(f.label).toBeTruthy();
      expect(f.src).toMatch(/^\/flowers\/f\d\.png$/);
    }
  });
  it("getFlower falls back to the first flower for unknown id", () => {
    expect(getFlower("nope").id).toBe("f1");
  });
});

describe("stamps", () => {
  it("has the seven stamp options", () => {
    expect(STAMPS.map((s) => s.id)).toEqual(["s2", "s3", "s5", "s6", "s7", "s8", "s9"]);
  });
  it("every stamp has a label and a public png src", () => {
    for (const s of STAMPS) {
      expect(s.label).toBeTruthy();
      expect(s.src).toMatch(/^\/stamps\/s\d\.png$/);
    }
  });
  it("getStamp falls back to the first stamp for unknown id", () => {
    expect(getStamp("nope").id).toBe("s2");
  });
});
