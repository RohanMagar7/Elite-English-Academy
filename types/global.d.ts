import { SupabaseClient } from "@supabase/supabase-js";

declare global {
    var __supabase: SupabaseClient | undefined;
}

export { };