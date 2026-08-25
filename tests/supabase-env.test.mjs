import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const envModuleUrl = new URL("../lib/supabase/env.ts", import.meta.url);

async function loadEnvModule() {
  try {
    return await import(envModuleUrl.href);
  } catch (error) {
    assert.fail(`Supabase environment module must be importable: ${error.message}`);
  }
}

test("public Supabase configuration fails closed when a value is missing", async () => {
  const { getSupabasePublicEnv } = await loadEnvModule();

  assert.throws(
    () => getSupabasePublicEnv({ NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co" }),
    /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
  );
});

test("service Supabase configuration never falls back to a tracked secret", async () => {
  const { getSupabaseServiceEnv } = await loadEnvModule();

  assert.throws(
    () => getSupabaseServiceEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "publishable-test-key",
    }),
    /SUPABASE_SERVICE_ROLE_KEY/,
  );
});

test("tracked Supabase clients contain no hardcoded project keys or fallback operators", async () => {
  const paths = [
    "lib/supabase/admin.ts",
    "lib/supabase/client.ts",
    "lib/supabase/server.ts",
    "lib/supabase/queries.ts",
    "proxy.ts",
    "app/auth/callback/route.ts",
    "scripts/seed-admins.mjs",
    "tests/supabase-security.test.mjs",
  ];

  const sources = await Promise.all(
    paths.map(async (path) => [path, await readFile(new URL(`../${path}`, import.meta.url), "utf8")]),
  );

  for (const [path, source] of sources) {
    assert.doesNotMatch(source, /sb_(?:secret|publishable)_[A-Za-z0-9_-]+/, `${path} contains a tracked key`);
    assert.doesNotMatch(source, /process\.env\.(?:NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)\s*\|\|/, `${path} contains an environment fallback`);
    assert.doesNotMatch(source, /password\s*:\s*["'][^"']+["']/, `${path} contains a tracked password`);
  }
});
