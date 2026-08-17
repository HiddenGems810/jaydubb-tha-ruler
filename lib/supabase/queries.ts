import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type Show = Database["public"]["Tables"]["shows"]["Row"];
export type Release = Database["public"]["Tables"]["releases"]["Row"];
export type Track = Database["public"]["Tables"]["tracks"]["Row"];
export type MediaItem = Database["public"]["Tables"]["media_items"]["Row"];
export type PressItem = Database["public"]["Tables"]["press_items"]["Row"];
export type SocialLink = Database["public"]["Tables"]["social_links"]["Row"];
export type VipMember = Database["public"]["Tables"]["vip_members"]["Row"];
export type BookingInquiry = Database["public"]["Tables"]["booking_inquiries"]["Row"];

function getPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bmhuposxkvkeupzkweyc.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_fZxuUQX1jCQh-KhdlJlwQw_YWukGMB0";

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function getUpcomingShows(): Promise<Show[]> {
  try {
    const supabase = getPublicClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("shows")
      .select("*")
      .eq("is_published", true)
      .gte("event_date", now)
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Error fetching upcoming shows:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("Failed to connect to Supabase for shows:", err);
    return [];
  }
}

export async function getAllPublishedShows(): Promise<Show[]> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from("shows")
      .select("*")
      .eq("is_published", true)
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Error fetching shows:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("Failed to connect for shows:", err);
    return [];
  }
}

export async function getPublishedReleases(): Promise<Release[]> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from("releases")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching releases:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("Failed to connect for releases:", err);
    return [];
  }
}

export async function getPublishedReleaseBySlug(slug: string): Promise<{
  release: Release | null;
  tracks: Track[];
}> {
  try {
    const supabase = getPublicClient();
    const { data: release, error: releaseError } = await supabase
      .from("releases")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (releaseError || !release) {
      return { release: null, tracks: [] };
    }

    const { data: tracks } = await supabase
      .from("tracks")
      .select("*")
      .eq("release_id", release.id)
      .eq("is_published", true)
      .order("track_number", { ascending: true });

    return { release, tracks: tracks ?? [] };
  } catch (err) {
    console.error(`Failed to connect for release ${slug}:`, err);
    return { release: null, tracks: [] };
  }
}

export async function getActiveSocialLinks(): Promise<SocialLink[]> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching social links:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("Failed to connect for social links:", err);
    return [];
  }
}

export async function getPublishedPress(): Promise<PressItem[]> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from("press_items")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching press items:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("Failed to connect for press items:", err);
    return [];
  }
}

export async function getPublishedMedia(): Promise<MediaItem[]> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from("media_items")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching media items:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("Failed to connect for media items:", err);
    return [];
  }
}
