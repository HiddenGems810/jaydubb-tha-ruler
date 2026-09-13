import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
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
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /JayDubb Tha Ruler/i);
  assert.match(html, /Colorado-rooted\. Catalog-built\./i);
  assert.match(html, /Shake It Bae/i);
  assert.match(html, /booking@jaydubbtharuler\.com/i);
  assert.match(html, /application\/ld\+json/i);
  assert.match(html, /Join The 7 VIP Fan Club/i);
  assert.match(html, /Website Designed &amp; Developed by/i);
  assert.match(html, /gerquiaabner\.com/i);
  assert.doesNotMatch(html, /\/_vinext\/image/);
  assert.doesNotMatch(html, /https:\/\/localhost/i);
  assert.doesNotMatch(html, /[A-Z]:\//);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders the professional EPK", async () => {
  const response = await render("/epk");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Electronic Press Kit/i);
  assert.match(html, /Short Bio/i);
  assert.match(html, /Extended Bio/i);
  assert.match(html, /booking@jaydubbtharuler\.com/i);
  assert.match(html, /https:\/\/jaydubbtharuler\.com\/#artist/);
  assert.match(html, /jaydubb-blue-hands\.jpg/);
});

test("server-renders the Aquarium Floors release page", async () => {
  const response = await render("/releases/aquarium-floors");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Aquarium Floors/i);
  assert.match(html, /VideoObject/i);
  assert.match(html, /MusicRecording/i);
  assert.match(html, /BreadcrumbList/i);
});

test("server-renders the Shake It Bae release page", async () => {
  const response = await render("/releases/shake-it-bae");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Shake It Bae/i);
  assert.match(html, /LLzMusik/i);
  assert.match(html, /MusicRecording/i);
});

test("server-renders the Don't Forget the Bag release page", async () => {
  const response = await render("/releases/dont-forget-the-bag");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Don't Forget the Bag/i);
  assert.match(html, /MusicAlbum/i);
});

test("server-renders the Off Brand release page", async () => {
  const response = await render("/releases/off-brand");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Off Brand/i);
  assert.match(html, /WESTSIDE BOOGIE/i);
  assert.match(html, /MusicRecording/i);
});
