import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("Journal entry leads use a compact editorial reading frame", async () => {
  const stylesheet = await source("../app/journal/journal.css");

  assert.match(
    stylesheet,
    /\.journal-entry-header \{[^}]*width:\s*min\(100%,\s*96rem\);[^}]*min-height:\s*min\(68svh,\s*48rem\);/s,
  );
  assert.match(
    stylesheet,
    /\.journal-entry-header h1 \{[^}]*max-width:\s*14ch;[^}]*letter-spacing:\s*\.025em;/s,
  );
});

test("Journal post content uses a plain attribution separator", async () => {
  const entryBody = await source("../components/journal/journal-entry.tsx");

  assert.doesNotMatch(entryBody, /—/);
  assert.match(entryBody, /<cite>- \{block\.attribution\}<\/cite>/);
});

test("Journal authoring starts with a named setup stage instead of section numbers", async () => {
  const editor = await source("../components/admin/journal/journal-editor.tsx");

  assert.match(editor, /className=\{`journal-editor \$\{entryId \? "is-editing" : "is-new"}`\}/);
  assert.match(editor, /className="journal-editor-kicker">Entry setup<\/p>/);
  assert.doesNotMatch(editor, /<span>01<\/span>/);
  assert.doesNotMatch(editor, /<span>04<\/span>/);
});

test("Journal authoring keeps named stages throughout the editorial workflow", async () => {
  const [blocks, media] = await Promise.all([
    source("../components/admin/journal/block-editor.tsx"),
    source("../components/admin/journal/media-manager.tsx"),
  ]);

  assert.doesNotMatch(blocks, /<span>02<\/span>/);
  assert.doesNotMatch(media, /<span>03<\/span>/);
  assert.match(blocks, /className="journal-editor-kicker">Story structure<\/p>/);
  assert.match(media, /className="journal-editor-kicker">Visual assets<\/p>/);
});
