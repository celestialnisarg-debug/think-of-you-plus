import { getSupabase } from "@/lib/supabase";
import { makeSlug } from "@/lib/slug";
import type { CardState } from "@/lib/card";
import { defaultCard } from "@/lib/card";

const TABLE = "postcards";

function rowToCard(row: any): CardState {
  const d = defaultCard();
  return {
    title: row.title ?? d.title,
    titleColor: row.title_color ?? d.titleColor,
    toName: row.to_name ?? d.toName,
    fromName: row.from_name ?? d.fromName,
    message: row.message ?? d.message,
    photoUrl: row.photo_url ?? null,
    stamp: row.stamp ?? d.stamp,
    flower: row.flower ?? d.flower,
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
    slug,
    title: card.title,
    title_color: card.titleColor,
    to_name: card.toName,
    from_name: card.fromName,
    message: card.message,
    photo_url: card.photoUrl,
    stamp: card.stamp,
    flower: card.flower,
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
