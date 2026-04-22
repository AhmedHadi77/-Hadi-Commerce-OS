const getEnv = (key: string) => process.env[key] ?? "";
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
  supabaseUrl: isValidHttpUrl(rawSupabaseUrl) ? rawSupabaseUrl : "",
  supabaseAnonKey: rawSupabaseKey
};

export const isSupabaseConfigured =
  Boolean(env.supabaseUrl) && Boolean(env.supabaseAnonKey);
