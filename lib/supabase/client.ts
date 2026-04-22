import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

import { env, isSupabaseConfigured } from "@/lib/env";
import type { PlatformUser, Role } from "@/lib/types";

let browserClient: SupabaseClient | null = null;

interface SupabaseUserRow {
  id: string;
  email: string;
  role: Role;
  full_name: string | null;
  avatar_url: string | null;
  region: string | null;
  phone: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  preferred_language: string | null;
  marketing_opt_in: boolean | null;
  delivery_notes: string | null;
  created_at: string | null;
}

export const getSupabaseClient = () => {
  if (!isSupabaseConfigured) {
    return null;
  }

  if (!browserClient) {
    try {
      browserClient = createClient(env.supabaseUrl, env.supabaseAnonKey);
    } catch {
      return null;
    }
  }

  return browserClient;
};

export const fetchSupabaseUserRow = async (userId: string) => {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  const { data } = await client
    .from("users")
    .select(
      "id, email, role, full_name, avatar_url, region, phone, address_line_1, address_line_2, city, state, postal_code, country, preferred_language, marketing_opt_in, delivery_notes, created_at"
    )
    .eq("id", userId)
    .maybeSingle();

  return (data as SupabaseUserRow | null) ?? null;
};

export const inferUserRole = async (user: User): Promise<Role> => {
  const row = await fetchSupabaseUserRow(user.id);
  if (!row) {
    return user.email?.includes("admin") ? "admin" : "user";
  }

  return row.role ?? (user.email?.includes("admin") ? "admin" : "user");
};

export const mapSupabaseUser = async (user: User): Promise<PlatformUser> => {
  const profile = await fetchSupabaseUserRow(user.id);
  const role = profile?.role ?? (await inferUserRole(user));

  return {
    id: user.id,
    email: profile?.email ?? user.email ?? "unknown@hadi.app",
    fullName:
      profile?.full_name ??
      (user.user_metadata.full_name as string | undefined) ??
      (user.email?.split("@")[0] ?? "Hadi User"),
    role,
    avatar:
      profile?.avatar_url ??
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80",
    joinedAt: profile?.created_at ?? user.created_at ?? new Date().toISOString(),
    totalOrders: 0,
    totalSpent: 0,
    status: "active",
    region: profile?.region ?? "Online",
    phone: profile?.phone ?? "",
    addressLine1: profile?.address_line_1 ?? "",
    addressLine2: profile?.address_line_2 ?? "",
    city: profile?.city ?? "",
    state: profile?.state ?? "",
    postalCode: profile?.postal_code ?? "",
    country: profile?.country ?? "",
    preferredLanguage: profile?.preferred_language ?? "English",
    marketingOptIn: profile?.marketing_opt_in ?? false,
    deliveryNotes: profile?.delivery_notes ?? ""
  };
};
