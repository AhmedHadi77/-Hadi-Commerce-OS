const getEnv = (key: string) => process.env[key] ?? "";

export const env = {
  supabaseUrl: getEnv("NEXT_PUBLIC_SUPABASE_URL") || getEnv("SUPABASE_URL"),
  supabaseAnonKey:
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") || getEnv("SUPABASE_ANON_KEY")
};

export const isSupabaseConfigured =
  Boolean(env.supabaseUrl) && Boolean(env.supabaseAnonKey);
