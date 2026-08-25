import type { Database, Tables, TablesInsert, TablesUpdate } from "@/types/database";

const entryInsert = {
  slug: "los-angeles-oct-23",
  title: "Los Angeles / Oct 23",
  content: { version: 1, blocks: [] },
  entry_type: "photo_dump",
} satisfies TablesInsert<"journal_entries">;

const mediaUpdate = {
  alt_text: "JayDubb backstage beneath blue venue lights",
  sort_order: 1,
} satisfies TablesUpdate<"journal_media">;

const status: Database["public"]["Enums"]["journal_status"] = "scheduled";
const mediaKind: Tables<"journal_media">["kind"] = "image";

void entryInsert;
void mediaUpdate;
void status;
void mediaKind;
