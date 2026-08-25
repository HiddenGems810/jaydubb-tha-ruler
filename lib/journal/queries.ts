import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type JournalEntryRow = Tables<"journal_entries">;
export type JournalMediaRow = Tables<"journal_media">;
export type JournalEntryWithMedia = JournalEntryRow & { media: JournalMediaRow[] };

const publicEntryColumns = "id,entry_number,slug,title,excerpt,entry_type,content,event_date,location,published_at,featured_at,cover_media_id,og_media_id,seo_title,seo_description,created_at,updated_at";
const adminEntryColumns = "id,entry_number,slug,title,excerpt,entry_type,content,event_date,location,published_at,featured_at,cover_media_id,og_media_id,seo_title,seo_description,created_at,updated_at,status,created_by,updated_by";
const mediaColumns = "id,entry_id,storage_path,kind,mime_type,width,height,file_size_bytes,blur_data_url,alt_text,caption,credit,sort_order,created_at,updated_at";

function isMissingJournalSchema(error: { code?: string; message?: string } | null) {
  return Boolean(error && (
    error.code === "42P01" ||
    error.code === "PGRST205"
  ));
}

async function attachMedia(entries: JournalEntryRow[]) {
  if (entries.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("journal_media")
    .select(mediaColumns)
    .in("entry_id", entries.map((entry) => entry.id))
    .order("sort_order", { ascending: true });

  if (error) throw error;
  const byEntry = new Map<string, JournalMediaRow[]>();
  for (const media of data ?? []) {
    const list = byEntry.get(media.entry_id) ?? [];
    list.push(media as JournalMediaRow);
    byEntry.set(media.entry_id, list);
  }
  return entries.map((entry) => ({ ...entry, media: byEntry.get(entry.id) ?? [] }));
}

export async function getJournalIndexPage(limit = 48): Promise<JournalEntryWithMedia[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("journal_entries")
    .select(publicEntryColumns)
    .order("published_at", { ascending: false })
    .order("entry_number", { ascending: false })
    .limit(Math.min(Math.max(limit, 1), 100));

  if (isMissingJournalSchema(error)) return [];
  if (error) throw error;
  return attachMedia((data ?? []) as unknown as JournalEntryRow[]);
}

export const getPublishedJournalEntryBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("journal_entries")
    .select(publicEntryColumns)
    .eq("slug", slug)
    .maybeSingle();

  if (isMissingJournalSchema(error) || !data) return null;
  if (error) throw error;
  const [entry] = await attachMedia([data as unknown as JournalEntryRow]);
  return entry ?? null;
});

export async function getAdjacentPublishedEntries(entry: JournalEntryRow) {
  const supabase = await createClient();
  const [newerResult, olderResult] = await Promise.all([
    supabase.from("journal_entries").select("slug,title,published_at,entry_number")
      .gt("published_at", entry.published_at ?? "")
      .order("published_at", { ascending: true }).limit(1).maybeSingle(),
    supabase.from("journal_entries").select("slug,title,published_at,entry_number")
      .lt("published_at", entry.published_at ?? "")
      .order("published_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (newerResult.error || olderResult.error) {
    throw newerResult.error ?? olderResult.error;
  }
  return { newer: newerResult.data, older: olderResult.data };
}

export async function getLatestJournalEntry() {
  const entries = await getJournalIndexPage(1);
  return entries[0] ?? null;
}

export async function getJournalSitemapEntries() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("journal_entries")
    .select("slug,updated_at,published_at").order("published_at", { ascending: false });
  if (isMissingJournalSchema(error)) return [];
  if (error) throw error;
  return data ?? [];
}

export async function getJournalRssEntries() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("journal_entries")
    .select("slug,title,excerpt,published_at,updated_at")
    .order("published_at", { ascending: false }).limit(50);
  if (isMissingJournalSchema(error)) return [];
  if (error) throw error;
  return data ?? [];
}

export async function getAdminJournalEntries() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("journal_entries")
    .select(adminEntryColumns).order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as JournalEntryRow[];
}

export async function getAdminJournalEntryById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("journal_entries")
    .select(adminEntryColumns).eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const [entry] = await attachMedia([data as unknown as JournalEntryRow]);
  return entry ?? null;
}
