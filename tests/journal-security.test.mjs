import assert from "node:assert/strict";
import test from "node:test";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_TEST_URL;
const anonKey = process.env.SUPABASE_TEST_ANON_KEY;
const serviceKey = process.env.SUPABASE_TEST_SERVICE_ROLE_KEY;
const enabled = Boolean(url && anonKey && serviceKey);

test("anonymous users cannot see draft Journal entries", { skip: !enabled }, async () => {
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const anon = createClient(url, anonKey, { auth: { persistSession: false } });
  const slug = `security-fixture-${Date.now()}`;
  const { data: fixture, error: createError } = await admin.from("journal_entries").insert({ title: "Security fixture", slug, status: "draft" }).select("id").single();
  assert.equal(createError, null);
  try {
    const { data, error } = await anon.from("journal_entries").select("id").eq("id", fixture.id);
    assert.equal(error, null);
    assert.deepEqual(data, []);
  } finally {
    await admin.from("journal_entries").delete().eq("id", fixture.id);
  }
});

test("anonymous users cannot list private Journal storage objects", { skip: !enabled }, async () => {
  const anon = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data, error } = await anon.storage.from("journal-media").list();
  assert.equal(error, null);
  assert.deepEqual(data, []);
});

test("public Journal visibility follows publication state for entries and media", { skip: !enabled }, async () => {
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const anon = createClient(url, anonKey, { auth: { persistSession: false } });
  const token = Date.now();
  const { data: entries, error: entryError } = await admin.from("journal_entries").insert([
    { title: "Published fixture", slug: `published-fixture-${token}`, status: "published", published_at: new Date(Date.now() - 60_000).toISOString() },
    { title: "Scheduled fixture", slug: `scheduled-fixture-${token}`, status: "scheduled", published_at: new Date(Date.now() + 3_600_000).toISOString() },
    { title: "Draft media fixture", slug: `draft-media-fixture-${token}`, status: "draft" },
  ]).select("id,slug,status");
  assert.equal(entryError, null);
  const published = entries.find((entry) => entry.status === "published");
  const draft = entries.find((entry) => entry.status === "draft");
  const mediaId = crypto.randomUUID();
  const { error: mediaError } = await admin.from("journal_media").insert({ id: mediaId, entry_id: draft.id, storage_path: `${draft.id}/${mediaId}.webp`, mime_type: "image/webp", alt_text: "Private fixture" });
  assert.equal(mediaError, null);
  try {
    const { data: visible, error } = await anon.from("journal_entries").select("slug").in("id", entries.map((entry) => entry.id));
    assert.equal(error, null);
    assert.deepEqual(visible.map((entry) => entry.slug), [published.slug]);
    const { data: hiddenMedia, error: hiddenMediaError } = await anon.from("journal_media").select("id").eq("id", mediaId);
    assert.equal(hiddenMediaError, null);
    assert.deepEqual(hiddenMedia, []);
  } finally {
    await admin.from("journal_entries").delete().in("id", entries.map((entry) => entry.id));
  }
});

test("Journal database enforces unique slugs and a single featured publication", { skip: !enabled }, async () => {
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const slug = `invariant-fixture-${Date.now()}`;
  const publishedAt = new Date(Date.now() - 60_000).toISOString();
  const { data: first, error: firstError } = await admin.from("journal_entries").insert({ title: "First invariant fixture", slug, status: "published", published_at: publishedAt, featured_at: publishedAt }).select("id").single();
  assert.equal(firstError, null);
  try {
    const { error: slugError } = await admin.from("journal_entries").insert({ title: "Duplicate slug", slug });
    assert.equal(slugError?.code, "23505");
    const { error: featureError } = await admin.from("journal_entries").insert({ title: "Second featured fixture", slug: `${slug}-second`, status: "published", published_at: publishedAt, featured_at: publishedAt });
    assert.equal(featureError?.code, "23505");
  } finally {
    await admin.from("journal_entries").delete().eq("id", first.id);
    await admin.from("journal_entries").delete().eq("slug", `${slug}-second`);
  }
});

test("Journal database rejects blank public alt text and cross-entry cover media", { skip: !enabled }, async () => {
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const token = Date.now();
  const { data: entries, error } = await admin.from("journal_entries").insert([
    { title: "Published alt fixture", slug: `published-alt-${token}`, status: "published", published_at: new Date(Date.now() - 60_000).toISOString() },
    { title: "Cover owner fixture", slug: `cover-owner-${token}`, status: "draft" },
    { title: "Cover target fixture", slug: `cover-target-${token}`, status: "draft" },
  ]).select("id,slug,status");
  assert.equal(error, null);
  const published = entries.find((entry) => entry.status === "published");
  const owner = entries.find((entry) => entry.slug.startsWith("cover-owner"));
  const target = entries.find((entry) => entry.slug.startsWith("cover-target"));
  const blankMediaId = crypto.randomUUID();
  const ownerMediaId = crypto.randomUUID();
  try {
    const { error: altError } = await admin.from("journal_media").insert({ id: blankMediaId, entry_id: published.id, storage_path: `${published.id}/${blankMediaId}.webp`, mime_type: "image/webp" });
    assert.equal(altError?.code, "23514");
    const { error: ownerMediaError } = await admin.from("journal_media").insert({ id: ownerMediaId, entry_id: owner.id, storage_path: `${owner.id}/${ownerMediaId}.webp`, mime_type: "image/webp", alt_text: "Owner fixture" });
    assert.equal(ownerMediaError, null);
    const { error: coverError } = await admin.from("journal_entries").update({ cover_media_id: ownerMediaId }).eq("id", target.id);
    assert.equal(coverError?.code, "23514");
  } finally {
    await admin.from("journal_entries").delete().in("id", entries.map((entry) => entry.id));
  }
});
