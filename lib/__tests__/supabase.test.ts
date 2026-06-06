import { describe, it, expect, beforeEach } from "vitest";
import { isSupabaseConfigured } from "@/lib/supabase";

describe("isSupabaseConfigured", () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });
  it("false when env missing", () => {
    expect(isSupabaseConfigured()).toBe(false);
  });
  it("true when both env present", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://x.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
    expect(isSupabaseConfigured()).toBe(true);
  });
});
