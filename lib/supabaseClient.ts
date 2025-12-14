import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase env vars. Check .env.local");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// مؤقتاً عشان أي استيراد قديم ما يكسر المشروع
export const supabase = getSupabaseClient();
