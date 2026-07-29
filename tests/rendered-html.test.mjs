import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the JayDubb artist hub", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /JayDubb Tha Ruler \| Official Website/i);
  assert.match(html, /Colorado-rooted\. Catalog-built\./i);
  assert.match(html, /Shake It Bae/i);
  assert.match(html, /booking@jaydubbtharuler\.com/i);
  assert.match(html, /application\/ld\+json/i);
  assert.doesNotMatch(html, /\/_vinext\/image/);
  assert.doesNotMatch(html, /https:\/\/localhost/i);
  assert.doesNotMatch(html, /[A-Z]:\//);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});
