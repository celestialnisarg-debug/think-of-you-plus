import { notFound } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getCard } from "@/lib/postcards";
import RecipientView from "./RecipientView";

export default async function Page({ params }: { params: { slug: string } }) {
  if (!isSupabaseConfigured()) notFound();
  const card = await getCard(params.slug);
  if (!card) notFound();
  return <RecipientView card={card} />;
}
