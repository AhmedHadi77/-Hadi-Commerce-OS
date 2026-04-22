const getEnv = (key: string) => process.env[key] ?? "";
const fallbackSupabaseUrl = "https://vebyrturqidibzfetulx.supabase.co";
const fallbackSupabasePublishableKey = "sb_publishable_2Ewh6lO875wvJuzl7tc0Pg_zBL9_kcs";
const isValidHttpUrl = (value: string) => {
  try {
    const candidate = new URL(value);
    return candidate.protocol === "http:" || candidate.protocol === "https:";
  } catch {
    return false;
  }
};

const rawSupabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL") || getEnv("SUPABASE_URL");
const rawSupabaseKey =
  getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ||
  getEnv("SUPABASE_ANON_KEY") ||
  getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
  getEnv("SUPABASE_PUBLISHABLE_KEY");

export const env = {
  supabaseUrl: isValidHttpUrl(rawSupabaseUrl) ? rawSupabaseUrl : fallbackSupabaseUrl,
  supabaseAnonKey: rawSupabaseKey || fallbackSupabasePublishableKey
};

export const isSupabaseConfigured =
  Boolean(env.supabaseUrl) && Boolean(env.supabaseAnonKey);
