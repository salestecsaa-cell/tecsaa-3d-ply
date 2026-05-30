import { createServerClient } from "@/lib/supabase-server";
import ExploreClient from "./ExploreClient";

export const revalidate = 60; // revalidate every minute

export default async function ExplorePage() {
  let properties = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(60);
    properties = data || [];
  } catch {
    // Supabase not configured yet — show empty state
  }

  return <ExploreClient initialProperties={properties} />;
}
