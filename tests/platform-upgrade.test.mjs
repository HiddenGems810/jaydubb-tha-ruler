import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = async (path) => {
  try {
    return await readFile(new URL(path, import.meta.url), "utf8");
  } catch {
    return "";
  }
};

test("the homepage exposes one tour and two EPK discovery paths", async () => {
  const home = await source("../app/page.tsx");

  assert.equal(home.match(/<ShowsSection shows=\{shows\} \/>/g)?.length, 1);
  assert.match(home, /href="\/epk"[\s\S]{0,160}View EPK/i);
  assert.match(home, /href="\/epk"[\s\S]{0,160}>\s*EPK\s*</i);
});

test("the EPK uses verified content, downloads, and the canonical artist identity", async () => {
  const epk = await source("../app/epk/page.tsx");

  assert.match(epk, /Electronic Press Kit/i);
  assert.match(epk, /Short Bio/i);
  assert.match(epk, /Extended Bio/i);
  assert.match(epk, /Westword/i);
  assert.match(epk, /303 Magazine/i);
  assert.match(epk, /VoyageDenver/i);
  assert.match(epk, /download/);
  assert.match(epk, /https:\/\/jaydubbtharuler\.com\/#artist/);
  assert.match(epk, /youtube-nocookie\.com/);
  assert.doesNotMatch(epk, /[—–]/);
});

test("the fan dock uses observers and the four required destinations", async () => {
  const dock = await source("../components/fan-action-dock.tsx");
  const css = await source("../app/globals.css");

  assert.match(dock, /new IntersectionObserver/);
  assert.doesNotMatch(dock, /addEventListener\(["']scroll/);
  assert.match(dock, /LISTEN/);
  assert.match(dock, /\/#shows/);
  assert.match(dock, /https:\/\/www\.the7even\.co\//);
  assert.match(dock, /\/#contact/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
});
