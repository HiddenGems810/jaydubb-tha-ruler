import assert from "node:assert/strict";
import test from "node:test";

async function request(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("journal-test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("Journal archive renders an intentional empty state before content is published", async () => {
  const response = await request("/journal");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /THE[\s\S]*JOURNAL/i);
  assert.match(html, /first page is being written/i);
  assert.match(html, /Skip to Journal/i);
  assert.match(html, /application\/rss\+xml/i);
});

test("unknown Journal entries return a real 404", async () => {
  const response = await request("/journal/definitely-not-a-real-entry");
  assert.equal(response.status, 404);
  assert.match(await response.text(), /This page left the archive/i);
});

test("Journal RSS is valid XML even before entries exist", async () => {
  const response = await request("/journal/rss.xml");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /application\/rss\+xml/i);
  assert.match(await response.text(), /<rss version="2\.0">/i);
});

test("dynamic sitemap preserves releases and adds the Journal", async () => {
  const response = await request("/sitemap.xml");
  assert.equal(response.status, 200);
  const xml = await response.text();
  assert.match(xml, /jaydubbtharuler\.com\/journal/);
  assert.match(xml, /releases\/shake-it-bae/);
});
