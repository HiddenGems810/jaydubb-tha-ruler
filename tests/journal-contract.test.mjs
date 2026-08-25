import assert from "node:assert/strict";
import test from "node:test";

const contractModuleUrl = new URL("../lib/journal/contracts.ts", import.meta.url);

async function loadContracts() {
  try {
    return await import(contractModuleUrl.href);
  } catch (error) {
    assert.fail(`Journal contracts must be importable: ${error.message}`);
  }
}

test("normalizes Journal slugs deterministically", async () => {
  const { normalizeJournalSlug } = await loadContracts();

  assert.equal(normalizeJournalSlug(" Los Angeles / OCT 23 "), "los-angeles-oct-23");
  assert.equal(normalizeJournalSlug("JayDubb’s Studio — Night 01"), "jaydubbs-studio-night-01");
  assert.equal(normalizeJournalSlug("---"), "");
});

test("parses a valid mixed Journal document", async () => {
  const { parseJournalContent } = await loadContracts();
  const mediaId = "11111111-1111-4111-8111-111111111111";

  const content = parseJournalContent({
    version: 1,
    blocks: [
      { id: "intro", type: "heading", level: 2, text: "Night one" },
      { id: "body", type: "paragraph", text: "The room moved **with us**." },
      { id: "image", type: "image", mediaId, mode: "wide" },
      { id: "link", type: "link", label: "Watch", url: "https://www.youtube.com/watch?v=abc" },
    ],
  });

  assert.equal(content.version, 1);
  assert.equal(content.blocks.length, 4);
  assert.deepEqual(content.blocks[2], { id: "image", type: "image", mediaId, mode: "wide" });
});

test("rejects unknown blocks and duplicate block IDs", async () => {
  const { parseJournalContent } = await loadContracts();

  assert.throws(
    () => parseJournalContent({ version: 1, blocks: [{ id: "x", type: "html", html: "<script />" }] }),
    /unsupported block type/i,
  );
  assert.throws(
    () => parseJournalContent({
      version: 1,
      blocks: [
        { id: "same", type: "paragraph", text: "one" },
        { id: "same", type: "paragraph", text: "two" },
      ],
    }),
    /duplicate block id/i,
  );
});

test("rejects unsafe links, unsupported videos, and invalid media IDs", async () => {
  const { parseJournalContent } = await loadContracts();

  assert.throws(
    () => parseJournalContent({
      version: 1,
      blocks: [{ id: "bad-link", type: "link", label: "Run", url: "javascript:alert(1)" }],
    }),
    /https/i,
  );
  assert.throws(
    () => parseJournalContent({
      version: 1,
      blocks: [{ id: "bad-video", type: "video_embed", url: "https://example.com/video" }],
    }),
    /youtube or vimeo/i,
  );
  assert.throws(
    () => parseJournalContent({
      version: 1,
      blocks: [{ id: "bad-image", type: "image", mediaId: "not-a-uuid", mode: "column" }],
    }),
    /media id/i,
  );
});

test("rejects malformed galleries and heading levels", async () => {
  const { parseJournalContent } = await loadContracts();
  const mediaId = "22222222-2222-4222-8222-222222222222";

  assert.throws(
    () => parseJournalContent({
      version: 1,
      blocks: [{ id: "gallery", type: "gallery", mediaIds: [mediaId, mediaId], layout: "contact" }],
    }),
    /duplicate media id/i,
  );
  assert.throws(
    () => parseJournalContent({
      version: 1,
      blocks: [{ id: "heading", type: "heading", level: 1, text: "Wrong hierarchy" }],
    }),
    /heading level/i,
  );
});

test("extracts plain text for metadata without media noise", async () => {
  const { journalContentToPlainText, parseJournalContent } = await loadContracts();
  const content = parseJournalContent({
    version: 1,
    blocks: [
      { id: "h", type: "heading", level: 2, text: "Release night" },
      { id: "p", type: "paragraph", text: "Built **in public**." },
      { id: "q", type: "quote", text: "Keep going.", attribution: "JayDubb" },
      { id: "l", type: "link", label: "Watch the film", url: "https://youtube.com/watch?v=abc" },
    ],
  });

  assert.equal(
    journalContentToPlainText(content),
    "Release night Built in public. Keep going. JayDubb Watch the film",
  );
});

test("tokenizes the safe inline-mark subset without producing HTML", async () => {
  const { parseInlineText } = await loadContracts();

  assert.deepEqual(
    parseInlineText("Built **in public**, _on purpose_. [Watch](https://youtube.com/watch?v=abc)"),
    [
      { type: "text", value: "Built " },
      { type: "strong", value: "in public" },
      { type: "text", value: ", " },
      { type: "em", value: "on purpose" },
      { type: "text", value: ". " },
      { type: "link", value: "Watch", url: "https://youtube.com/watch?v=abc" },
    ],
  );

  assert.deepEqual(
    parseInlineText("[Unsafe](javascript:alert(1))"),
    [{ type: "text", value: "[Unsafe](javascript:alert(1))" }],
  );
});

test("converts supported video URLs to privacy-conscious embed URLs", async () => {
  const { toVideoEmbedUrl } = await loadContracts();

  assert.equal(
    toVideoEmbedUrl("https://www.youtube.com/watch?v=i5QQmQqv6og"),
    "https://www.youtube-nocookie.com/embed/i5QQmQqv6og",
  );
  assert.equal(
    toVideoEmbedUrl("https://vimeo.com/123456789"),
    "https://player.vimeo.com/video/123456789",
  );
});
