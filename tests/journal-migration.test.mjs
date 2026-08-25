import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

async function journalMigration() {
  const directory = new URL("../supabase/migrations/", import.meta.url);
  const files = await readdir(directory);
  const filename = files.find((file) => file.endsWith("_journal_journey.sql"));
  assert.ok(filename, "journal_journey migration must exist");
  return readFile(new URL(filename, directory), "utf8");
}

async function adminHelperGrantMigration() {
  const directory = new URL("../supabase/migrations/", import.meta.url);
  const files = await readdir(directory);
  const filename = files.find((file) => file.endsWith("_secure_is_admin_function.sql"));
  assert.ok(filename, "is_admin permission migration must exist");
  return readFile(new URL(filename, directory), "utf8");
}

test("Journal migration creates constrained entry and media tables", async () => {
  const sql = await journalMigration();

  assert.match(sql, /create type\s+public\.journal_entry_type/i);
  assert.match(sql, /create type\s+public\.journal_status/i);
  assert.match(sql, /create type\s+public\.journal_media_kind/i);
  assert.match(sql, /create table\s+public\.journal_entries/i);
  assert.match(sql, /entry_number\s+bigint\s+generated/i);
  assert.match(sql, /slug\s+text\s+not null\s+unique/i);
  assert.match(sql, /content\s+jsonb\s+not null/i);
  assert.match(sql, /create table\s+public\.journal_media/i);
  assert.match(sql, /unique\s*\(entry_id,\s*sort_order\)/i);
  assert.match(sql, /journal_entries_one_featured/i);
  assert.match(sql, /cover media must belong to the same Journal entry/i);
  assert.match(sql, /function public\.validate_journal_media_alt/i);
});

test("Journal migration enables RLS and grants only required Data API privileges", async () => {
  const sql = await journalMigration();

  assert.match(sql, /alter table\s+public\.journal_entries\s+enable row level security/i);
  assert.match(sql, /alter table\s+public\.journal_media\s+enable row level security/i);
  assert.match(sql, /status\s+in\s*\(\s*'published'\s*,\s*'scheduled'\s*\).*published_at\s*<=\s*now\(\)/is);
  assert.match(sql, /journal_media_public_select.*exists\s*\(.*journal_entries/is);
  assert.match(sql, /revoke all on table public\.journal_entries, public\.journal_media from anon, authenticated/i);
  assert.match(sql, /grant select on table public\.journal_entries, public\.journal_media to anon/i);
  assert.match(sql, /grant select, insert, update, delete on table public\.journal_entries, public\.journal_media to authenticated/i);
  assert.match(sql, /grant all on table public\.journal_entries, public\.journal_media to service_role/i);
  assert.match(sql, /public\.site_settings\s+to anon/i);
  assert.match(sql, /public\.site_settings\s+to service_role/i);
});

test("Journal storage remains private and writable only by admins", async () => {
  const sql = await journalMigration();

  assert.match(sql, /'journal-media'\s*,\s*'journal-media'\s*,\s*false/i);
  assert.doesNotMatch(sql, /'journal-media'\s*,\s*'journal-media'\s*,\s*true/i);
  assert.match(sql, /journal_media_storage_admin_insert.*bucket_id\s*=\s*'journal-media'.*is_admin\(\)/is);
  assert.match(sql, /journal_media_storage_admin_update/is);
  assert.match(sql, /journal_media_storage_admin_delete/is);
  assert.doesNotMatch(sql, /journal_media_storage_public/i);
});

test("Journal mutation helpers are invoker-secured and explicitly permissioned", async () => {
  const sql = await journalMigration();

  assert.match(sql, /function\s+public\.set_featured_journal_entry/i);
  assert.match(sql, /function\s+public\.reorder_journal_media/i);
  assert.match(sql, /security invoker/i);
  assert.doesNotMatch(sql, /security definer/i);
  assert.match(sql, /revoke all on function public\.set_featured_journal_entry/i);
  assert.match(sql, /grant execute on function public\.set_featured_journal_entry.*to authenticated/i);
});

test("admin helper is not executable by anonymous callers", async () => {
  const sql = await adminHelperGrantMigration();

  assert.match(sql, /revoke execute on function public\.is_admin\(\) from anon/i);
  assert.match(sql, /grant execute on function public\.is_admin\(\) to authenticated/i);
});
