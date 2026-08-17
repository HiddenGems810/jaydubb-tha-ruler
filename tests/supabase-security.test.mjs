import test from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

// Load environment from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bmhuposxkvkeupzkweyc.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_fZxuUQX1jCQh-KhdlJlwQw_YWukGMB0";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "sb_secret_4eNRwctPWNlfKWBEPlyvlw_WWNF5y11";

const anonClient = createClient(supabaseUrl, anonKey);
const adminClient = createClient(supabaseUrl, serviceKey);

test("RLS: Anon client CANNOT read vip_members table", async () => {
  const { data } = await anonClient.from("vip_members").select("*");
  assert.equal(data?.length ?? 0, 0, "Public anon should receive 0 vip_members records");
});

test("RLS: Anon client CANNOT read booking_inquiries table", async () => {
  const { data } = await anonClient.from("booking_inquiries").select("*");
  assert.equal(data?.length ?? 0, 0, "Public anon should receive 0 booking_inquiries records");
});

test("RLS: Anon client CANNOT read admin_users table", async () => {
  const { data } = await anonClient.from("admin_users").select("*");
  assert.equal(data?.length ?? 0, 0, "Public anon should receive 0 admin_users records");
});

test("RLS: Anon client CAN read published shows", async () => {
  const { data, error } = await anonClient.from("shows").select("*").eq("is_published", true);
  assert.equal(error, null, "Should not return error on published shows");
  assert.ok(Array.isArray(data), "Should return an array");
});

test("RLS: Anon client CAN read published releases", async () => {
  const { data, error } = await anonClient.from("releases").select("*").eq("is_published", true);
  assert.equal(error, null, "Should not return error on published releases");
  assert.ok((data?.length ?? 0) >= 1, "Should have seeded releases accessible to public");
});

test("RLS: Anon client CAN read active social links", async () => {
  const { data, error } = await anonClient.from("social_links").select("*").eq("is_active", true);
  assert.equal(error, null, "Should not return error on social links");
  assert.ok((data?.length ?? 0) >= 1, "Should have seeded social links accessible to public");
});

test("Service Role: Admin client can manage vip_members and shows", async () => {
  const testEmail = `test_fan_${Date.now()}@example.com`;
  
  // Insert fan record via admin client
  const { data: inserted, error: insertError } = await adminClient.from("vip_members").insert({
    email: testEmail,
    first_name: "Test",
    source: "automated_test",
  }).select().single();

  assert.equal(insertError, null, "Admin should successfully insert vip member");
  assert.ok(inserted?.id, "Inserted fan should have UUID");

  // Clean up
  const { error: deleteError } = await adminClient.from("vip_members").delete().eq("id", inserted.id);
  assert.equal(deleteError, null, "Admin should successfully delete test member");
});
