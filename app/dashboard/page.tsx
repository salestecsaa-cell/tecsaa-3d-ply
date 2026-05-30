import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let properties = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    properties = data || [];
  } catch {
    // Supabase not configured yet
  }

  return <DashboardClient initialProperties={properties} />;
}
