import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role key to bypass Row Level Security (RLS)
// This client should ONLY be used on the server side (API routes)
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
