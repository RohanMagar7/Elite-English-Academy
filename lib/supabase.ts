// import { createClient } from "@supabase/supabase-js";

// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,

//   process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

// );

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

console.log("Supabase URL:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey);