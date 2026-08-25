import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("public-facing site copy avoids em dashes", async () => {
  const files = [
    "../app/layout.tsx",
    "../app/page.tsx",
    "../app/releases/aquarium-floors/page.tsx",
    "../app/releases/dont-forget-the-bag/page.tsx",
    "../app/releases/off-brand/page.tsx",
    "../app/releases/shake-it-bae/page.tsx",
  ];

  const content = await Promise.all(files.map(source));
  content.forEach((file) => assert.doesNotMatch(file, /[—–]/));
});

test("the homepage uses observer-driven reveals without a scroll listener", async () => {
  const scrollExperience = await source("../components/scroll-experience.tsx");

  assert.match(scrollExperience, /new IntersectionObserver/);
  assert.doesNotMatch(scrollExperience, /window\.addEventListener\("scroll"/);
  assert.doesNotMatch(scrollExperience, /requestAnimationFrame/);
});
