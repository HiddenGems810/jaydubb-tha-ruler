import test from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_TEST_URL;
const anonKey = process.env.SUPABASE_TEST_ANON_KEY;
const serviceKey = process.env.SUPABASE_TEST_SERVICE_ROLE_KEY;
const hasTestProject = Boolean(supabaseUrl && anonKey && serviceKey);
const integrationTest = hasTestProject ? test : test.skip;

const anonClient = hasTestProject ? createClient(supabaseUrl, anonKey) : null;
const adminClient = hasTestProject ? createClient(supabaseUrl, serviceKey) : null;

integrationTest("RLS: Anon client CANNOT read vip_members table", async () => {
  const { data } = await anonClient.from("vip_members").select("*");
  assert.equal(data?.length ?? 0, 0, "Public anon should receive 0 vip_members records");
});

integrationTest("RLS: Anon client CANNOT read booking_inquiries table", async () => {
  const { data } = await anonClient.from("booking_inquiries").select("*");
  assert.equal(data?.length ?? 0, 0, "Public anon should receive 0 booking_inquiries records");
});

integrationTest("RLS: Anon client CANNOT read admin_users table", async () => {
  const { data } = await anonClient.from("admin_users").select("*");
  assert.equal(data?.length ?? 0, 0, "Public anon should receive 0 admin_users records");
});

integrationTest("RLS: Anon client CAN read published shows", async () => {
  const { data, error } = await anonClient.from("shows").select("*").eq("is_published", true);
  assert.equal(error, null, "Should not return error on published shows");
  assert.ok(Array.isArray(data), "Should return an array");
});

integrationTest("RLS: Anon client CAN read published releases", async () => {
  const { data, error } = await anonClient.from("releases").select("*").eq("is_published", true);
  assert.equal(error, null, "Should not return error on published releases");
  assert.ok((data?.length ?? 0) >= 1, "Should have seeded releases accessible to public");
});

integrationTest("RLS: Anon client CAN read active social links", async () => {
  const { data, error } = await anonClient.from("social_links").select("*").eq("is_active", true);
  assert.equal(error, null, "Should not return error on social links");
  assert.ok((data?.length ?? 0) >= 1, "Should have seeded social links accessible to public");
});

integrationTest("Service Role: Admin client can manage vip_members and shows", async () => {
  const testEmail = `test_fan_${Date.now()}@example.com`;
  let insertedId = null;

  try {
    const { data: inserted, error: insertError } = await adminClient.from("vip_members").insert({
      email: testEmail,
      first_name: "Test",
      source: "automated_test",
    }).select().single();

    assert.equal(insertError, null, "Admin should successfully insert vip member");
    assert.ok(inserted?.id, "Inserted fan should have UUID");
    insertedId = inserted.id;
  } finally {
    if (insertedId) {
      const { error: deleteError } = await adminClient.from("vip_members").delete().eq("id", insertedId);
      assert.equal(deleteError, null, "Admin should successfully delete test member");
    }
  }
});
