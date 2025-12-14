"use server";

import { getSupabaseClient } from "@/lib/supabaseClient";

export default async function NCRPage() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("ncr")
    .select("*");

  if (error) {
    return (
      <pre style={{ color: "red" }}>
        {error.message}
      </pre>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1>NCR List</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
