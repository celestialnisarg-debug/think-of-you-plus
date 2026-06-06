import { getSupabase } from "@/lib/supabase";
import { makeSlug } from "@/lib/slug";
import type { CardState } from "@/lib/card";

const TABLE = "postcards";

function rowToCard(row: any): CardState {
  return {
    theme: row.theme, title: row.title, titleColor: row.title_color,
    titleFont: row.title_font, message: row.message, toName: row.to_name,
    fromName: row.from_name, photoUrl: row.photo_url, bg: row.bg,
    stickers: row.stickers ?? [],
  };
}

export async function uploadPhoto(file: File): Promise<string> {
  const sb = getSupabase();
  const path = `${makeSlug()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
  const { error } = await sb.storage.from("postcard-photos").upload(path, file, { upsert: false });
  if (error) throw error;
  return sb.storage.from("postcard-photos").getPublicUrl(path).data.publicUrl;
}

export async function saveCard(card: CardState): Promise<string> {
  const sb = getSupabase();
  const slug = makeSlug();
  const { error } = await sb.from(TABLE).insert({
    slug, theme: card.theme, title: card.title, title_color: card.titleColor,
    title_font: card.titleFont, message: card.message, to_name: card.toName,
    from_name: card.fromName, photo_url: card.photoUrl, bg: card.bg, stickers: card.stickers,
  });
  if (error) throw error;
  return slug;
}

export async function getCard(slug: string): Promise<CardState | null> {
  const sb = getSupabase();
  const { data, error } = await sb.from(TABLE).select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? rowToCard(data) : null;
}
