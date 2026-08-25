import { JOURNAL_ENTRY_TYPES, JOURNAL_STATUSES, normalizeJournalSlug, parseJournalContent } from "@/lib/journal/contracts";
import type { TablesInsert, TablesUpdate } from "@/types/database";

function optionalString(value: unknown, max: number) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || value.trim().length > max) throw new Error(`Value must be ${max} characters or fewer`);
  return value.trim();
}

export function parseJournalEntryPayload(value: unknown, partial?: false): TablesInsert<"journal_entries">;
export function parseJournalEntryPayload(value: unknown, partial: true): TablesUpdate<"journal_entries">;
export function parseJournalEntryPayload(value: unknown, partial = false): TablesInsert<"journal_entries"> | TablesUpdate<"journal_entries"> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid Journal entry payload");
  const source = value as Record<string, unknown>;
  const result: TablesUpdate<"journal_entries"> = {};

  if (!partial || "title" in source) {
    if (typeof source.title !== "string" || !source.title.trim() || source.title.trim().length > 180) throw new Error("Title is required and must be 180 characters or fewer");
    result.title = source.title.trim();
  }
  if (!partial || "slug" in source) {
    const slug = normalizeJournalSlug(String(source.slug || source.title || ""));
    if (!slug) throw new Error("A valid slug is required");
    result.slug = slug;
  }
  if ("excerpt" in source) result.excerpt = optionalString(source.excerpt, 500);
  if ("location" in source) result.location = optionalString(source.location, 160);
  if ("seo_title" in source) result.seo_title = optionalString(source.seo_title, 70);
  if ("seo_description" in source) result.seo_description = optionalString(source.seo_description, 180);
  if ("event_date" in source) result.event_date = optionalString(source.event_date, 10);
  if ("published_at" in source) result.published_at = optionalString(source.published_at, 40);
  if ("cover_media_id" in source) result.cover_media_id = optionalString(source.cover_media_id, 36);
  if ("og_media_id" in source) result.og_media_id = optionalString(source.og_media_id, 36);
  if ("entry_type" in source) {
    if (!JOURNAL_ENTRY_TYPES.includes(source.entry_type as never)) throw new Error("Invalid entry type");
    result.entry_type = source.entry_type as TablesUpdate<"journal_entries">["entry_type"];
  }
  if ("status" in source) {
    if (!JOURNAL_STATUSES.includes(source.status as never)) throw new Error("Invalid Journal status");
    result.status = source.status as TablesUpdate<"journal_entries">["status"];
  }
  if ("content" in source) result.content = parseJournalContent(source.content);
  else if (!partial) result.content = { version: 1, blocks: [] };
  return result as TablesInsert<"journal_entries"> | TablesUpdate<"journal_entries">;
}

export function apiError(error: unknown, fallback = "Unable to complete request") {
  const message = error instanceof Error ? error.message : fallback;
  return Response.json({ error: message }, { status: 400 });
}
