import assert from "node:assert/strict";

async function request(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", Date.now().toString());
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost" + path, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} }
  );
}

async function verify() {
  console.log("--- Checking /journal ---");
  const rJournal = await request("/journal");
  console.log("Status:", rJournal.status);
  assert.equal(rJournal.status, 200);
  const htmlJournal = await rJournal.text();
  console.log("Contains Shake It Bae:", htmlJournal.includes("Shake It Bae: A Different Gear"));
  console.log("Contains release notes:", htmlJournal.includes("Release notes"));
  console.log("Contains excerpt:", htmlJournal.includes("record built for movement"));
  assert.ok(htmlJournal.includes("Shake It Bae: A Different Gear"), "Journal archive must contain title");
  assert.ok(htmlJournal.includes("Release notes"), "Journal archive must show Release notes badge");

  console.log("\n--- Checking /journal/shake-it-bae-a-different-gear ---");
  const rArticle = await request("/journal/shake-it-bae-a-different-gear");
  console.log("Status:", rArticle.status);
  assert.equal(rArticle.status, 200);
  const htmlArticle = await rArticle.text();
  console.log("Contains title:", htmlArticle.includes("Shake It Bae: A Different Gear, Same Standard"));
  console.log("Contains Heading 2 - Range Without:", htmlArticle.includes("Range Without the Identity Crisis"));
  console.log("Contains Heading 2 - JayDubb + LLzMusik:", htmlArticle.includes("JayDubb + LLzMusik, Again"));
  console.log("Contains Heading 2 - Built for the Room:", htmlArticle.includes("Built for the Room"));
  console.log("Contains Heading 2 - Another Piece:", htmlArticle.includes("Another Piece of the Catalog"));
  console.log("Contains Apple Music link:", htmlArticle.includes("https://music.apple.com/us/album/shake-it-bae-feat-llzmusik-single/1877512143"));
  console.log("Contains Release Page link:", htmlArticle.includes("https://jaydubbtharuler.com/releases/shake-it-bae"));
  console.log("Contains JSON-LD BlogPosting:", htmlArticle.includes("BlogPosting"));

  assert.ok(htmlArticle.includes("Range Without the Identity Crisis"), "Must contain section 1 heading");
  assert.ok(htmlArticle.includes("JayDubb + LLzMusik, Again"), "Must contain section 2 heading");
  assert.ok(htmlArticle.includes("Built for the Room"), "Must contain section 3 heading");
  assert.ok(htmlArticle.includes("Another Piece of the Catalog"), "Must contain section 4 heading");
  assert.ok(htmlArticle.includes("https://music.apple.com/us/album/shake-it-bae-feat-llzmusik-single/1877512143"), "Must contain Apple Music link");
  assert.ok(htmlArticle.includes("https://jaydubbtharuler.com/releases/shake-it-bae"), "Must contain Release page link");
  assert.ok(htmlArticle.includes("BlogPosting"), "Must contain BlogPosting schema");

  console.log("\n--- Checking Homepage / ---");
  const rHome = await request("/");
  console.log("Status:", rHome.status);
  assert.equal(rHome.status, 200);
  const htmlHome = await rHome.text();
  console.log("Contains Latest Journal section:", htmlHome.includes("Latest from the archive"));
  console.log("Contains Shake It Bae in Journal section:", htmlHome.includes("Shake It Bae: A Different Gear, Same Standard"));
  assert.ok(htmlHome.includes("Latest from the archive"), "Homepage must show latest journal section");
  assert.ok(htmlHome.includes("Shake It Bae: A Different Gear, Same Standard"), "Homepage must feature Shake It Bae");

  console.log("\n--- Checking /sitemap.xml ---");
  const rSitemap = await request("/sitemap.xml");
  console.log("Status:", rSitemap.status);
  assert.equal(rSitemap.status, 200);
  const xmlSitemap = await rSitemap.text();
  console.log("Contains journal article slug in sitemap:", xmlSitemap.includes("journal/shake-it-bae-a-different-gear"));
  assert.ok(xmlSitemap.includes("journal/shake-it-bae-a-different-gear"), "Sitemap must include journal article");

  console.log("\n--- Checking /journal/rss.xml ---");
  const rRss = await request("/journal/rss.xml");
  console.log("Status:", rRss.status);
  assert.equal(rRss.status, 200);
  const xmlRss = await rRss.text();
  console.log("Contains journal article in RSS:", xmlRss.includes("Shake It Bae: A Different Gear, Same Standard"));
  assert.ok(xmlRss.includes("Shake It Bae: A Different Gear, Same Standard"), "RSS must include journal article");

  console.log("\n--- Checking Media Route ---");
  const rMedia = await request("/journal/media/8a2f3e1b-9c4d-4e5f-a6b7-c8d9e0f1a2b3");
  console.log("Status:", rMedia.status);
  console.log("Location header:", rMedia.headers.get("location"));
  assert.ok([302, 307].includes(rMedia.status), "Media route must return 307 redirect");
  assert.ok(rMedia.headers.get("location"), "Media route must redirect to signed or static image URL");

  console.log("\n>>> ALL VERIFICATION CHECKS PASSED SUCCESSFULLY! <<<");
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
