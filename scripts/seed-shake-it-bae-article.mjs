import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const supabaseUrl = required("NEXT_PUBLIC_SUPABASE_URL");
const anonKey = required("NEXT_PUBLIC_SUPABASE_ANON_KEY");

const supabase = createClient(supabaseUrl, anonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function main() {
  console.log("=== Authenticating as Admin User ===");
  const authRes = await supabase.auth.signInWithPassword({
    email: "info.tagdesigns@gmail.com",
    password: "Fashion101Shay7895@@",
  });

  if (authRes.error) {
    throw new Error(`Admin authentication failed: ${authRes.error.message}`);
  }
  const userId = authRes.data.user.id;
  console.log(`Authenticated as admin: ${authRes.data.user.email} (ID: ${userId})`);

  const entrySlug = "shake-it-bae-a-different-gear";
  console.log(`\nChecking for existing journal entry with slug: ${entrySlug}...`);

  const { data: existingEntry, error: checkError } = await supabase
    .from("journal_entries")
    .select("id, slug, cover_media_id, og_media_id")
    .eq("slug", entrySlug)
    .maybeSingle();

  if (checkError) {
    throw new Error(`Error checking existing entry: ${checkError.message}`);
  }

  const entryId = existingEntry?.id ?? crypto.randomUUID();
  console.log(`Using entry ID: ${entryId} (Existing: ${Boolean(existingEntry)})`);

  // Fixed media IDs for repeatability
  const coverMediaId = "8a2f3e1b-9c4d-4e5f-a6b7-c8d9e0f1a2b3";
  const profileMediaId = "7b1e2d3c-8f4a-4b5c-9d0e-f1a2b3c4d5e6";

  const coverPath = `${entryId}/blue-hands.jpg`;
  const profilePath = `${entryId}/blue-profile.jpg`;

  console.log("\n=== Uploading media to Supabase Storage 'journal-media' bucket ===");
  const blueHandsBuffer = fs.readFileSync(path.join(process.cwd(), "public", "images", "jay-dubb", "blue-hands.jpg"));
  const blueProfileBuffer = fs.readFileSync(path.join(process.cwd(), "public", "images", "jay-dubb", "blue-profile.jpg"));

  const upload1 = await supabase.storage.from("journal-media").upload(coverPath, blueHandsBuffer, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (upload1.error) {
    console.warn(`Storage upload warning for ${coverPath}:`, upload1.error.message);
  } else {
    console.log(`Successfully uploaded: ${coverPath}`);
  }

  const upload2 = await supabase.storage.from("journal-media").upload(profilePath, blueProfileBuffer, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (upload2.error) {
    console.warn(`Storage upload warning for ${profilePath}:`, upload2.error.message);
  } else {
    console.log(`Successfully uploaded: ${profilePath}`);
  }

  const articleBlocks = [
    {
      id: "p-1",
      type: "paragraph",
      text: "There is a difference between changing your sound and proving you have range.",
    },
    {
      id: "p-2",
      type: "paragraph",
      text: "“Shake It Bae” lives in that difference.",
    },
    {
      id: "p-3",
      type: "paragraph",
      text: "Released March 7, 2026, the new single brings JayDubb Tha Ruler back together with LLzMusik for a three-minute record designed to move differently from some of the heavier moments across his catalog.",
    },
    {
      id: "p-4",
      type: "paragraph",
      text: "The energy is immediate. The record leans into bounce, rhythm and a more nightlife-ready atmosphere, but the shift does not require JayDubb to abandon the voice that built everything before it.",
    },
    {
      id: "p-5",
      type: "paragraph",
      text: "That is the point.",
    },
    {
      id: "h-1",
      type: "heading",
      level: 2,
      text: "Range Without the Identity Crisis",
    },
    {
      id: "p-6",
      type: "paragraph",
      text: "Versatility gets thrown around so often in music that the word can lose its meaning.",
    },
    {
      id: "p-7",
      type: "paragraph",
      text: "Doing several different things is easy.",
    },
    {
      id: "p-8",
      type: "paragraph",
      text: "Doing several different things while still sounding unmistakably like yourself is harder.",
    },
    {
      id: "p-9",
      type: "paragraph",
      text: "Across JayDubb’s catalog, records have moved between introspection, street narrative, collaboration-heavy cuts and more atmospheric moments. “Shake It Bae” pushes further toward pure movement and accessibility.",
    },
    {
      id: "p-10",
      type: "paragraph",
      text: "But the foundation remains intact.",
    },
    {
      id: "p-11",
      type: "paragraph",
      text: "The delivery still carries intention. The writing still has personality. The record knows exactly what kind of energy it wants to create and gets there without pretending JayDubb suddenly became somebody else.",
    },
    {
      id: "p-12",
      type: "paragraph",
      text: "Range matters most when the identity survives the switch.",
    },
    {
      id: "img-editorial",
      type: "image",
      mediaId: profileMediaId,
      mode: "wide",
    },
    {
      id: "h-2",
      type: "heading",
      level: 2,
      text: "JayDubb + LLzMusik, Again",
    },
    {
      id: "p-13",
      type: "paragraph",
      text: "“Shake It Bae” is not the first time JayDubb and LLzMusik have crossed paths on a record.",
    },
    {
      id: "p-14",
      type: "paragraph",
      text: "LLzMusik previously appeared on “No Leaks,” the opening song from JayDubb’s 2025 album Don’t Forget the Bag.",
    },
    {
      id: "p-15",
      type: "paragraph",
      text: "That makes this less of a random feature and more of a continuation.",
    },
    {
      id: "p-16",
      type: "paragraph",
      text: "Different record. Different purpose. Familiar chemistry.",
    },
    {
      id: "p-17",
      type: "paragraph",
      text: "Where “No Leaks” helped open an album built around focus, pressure and independent momentum, “Shake It Bae” lets the collaboration breathe in another direction entirely.",
    },
    {
      id: "p-18",
      type: "paragraph",
      text: "That evolution matters.",
    },
    {
      id: "p-19",
      type: "paragraph",
      text: "A catalog becomes more interesting when collaborations can grow instead of simply repeat themselves.",
    },
    {
      id: "h-3",
      type: "heading",
      level: 2,
      text: "Built for the Room",
    },
    {
      id: "p-20",
      type: "paragraph",
      text: "Some records ask for headphones.",
    },
    {
      id: "p-21",
      type: "paragraph",
      text: "Some ask for a stage.",
    },
    {
      id: "p-22",
      type: "paragraph",
      text: "Some are built for the exact second the room stops standing still.",
    },
    {
      id: "p-23",
      type: "paragraph",
      text: "“Shake It Bae” clearly understands its assignment.",
    },
    {
      id: "p-24",
      type: "paragraph",
      text: "There is no need to overcomplicate the record. Its strength is that it gets to the point quickly, establishes the mood and stays there.",
    },
    {
      id: "p-25",
      type: "paragraph",
      text: "For an artist whose catalog has often emphasized substance, independence and intent, there is something valuable about making a record that simply gives people permission to move.",
    },
    {
      id: "p-26",
      type: "paragraph",
      text: "Not every song has to carry the weight of the world.",
    },
    {
      id: "p-27",
      type: "paragraph",
      text: "Sometimes the right move is knowing how to control the room.",
    },
    {
      id: "h-4",
      type: "heading",
      level: 2,
      text: "Another Piece of the Catalog",
    },
    {
      id: "p-28",
      type: "paragraph",
      text: "Since The Year of the 7 in 2018, the story has never really been about chasing one sound.",
    },
    {
      id: "p-29",
      type: "paragraph",
      text: "It has been about building.",
    },
    {
      id: "p-30",
      type: "paragraph",
      text: "Project by project. Single by single. Collaboration by collaboration.",
    },
    {
      id: "p-31",
      type: "paragraph",
      text: "That continued through Get Back to It, “Did It My Way,” Don’t Forget the Bag, and the records surrounding them.",
    },
    {
      id: "p-32",
      type: "paragraph",
      text: "“Shake It Bae” adds another lane without erasing the ones that came before it.",
    },
    {
      id: "p-33",
      type: "paragraph",
      text: "And that may be the most important part of the release.",
    },
    {
      id: "p-34",
      type: "paragraph",
      text: "The goal is not to prove JayDubb can make one kind of record extremely well.",
    },
    {
      id: "p-35",
      type: "paragraph",
      text: "The goal is to build a catalog broad enough that years from now, no single track can completely explain the artist behind it.",
    },
    {
      id: "p-36",
      type: "paragraph",
      text: "“Shake It Bae” moves that mission forward.",
    },
    {
      id: "p-37",
      type: "paragraph",
      text: "Different gear.",
    },
    {
      id: "p-38",
      type: "paragraph",
      text: "Same standard.",
    },
    {
      id: "p-39",
      type: "paragraph",
      text: "JayDubb Tha Ruler featuring LLzMusik — “Shake It Bae” is available now.",
    },
    {
      id: "link-apple-music",
      type: "link",
      url: "https://music.apple.com/us/album/shake-it-bae-feat-llzmusik-single/1877512143",
      label: "Listen on Apple Music",
    },
    {
      id: "link-release-page",
      type: "link",
      url: "https://jaydubbtharuler.com/releases/shake-it-bae",
      label: "Explore the official release page",
    },
  ];

  const contentDoc = {
    version: 1,
    blocks: articleBlocks,
  };

  console.log("\n=== Step 1: Insert or update base journal_entries ===");
  const baseEntryData = {
    id: entryId,
    slug: entrySlug,
    title: "Shake It Bae: A Different Gear, Same Standard",
    excerpt: "JayDubb Tha Ruler links back up with LLzMusik for “Shake It Bae,” a record built for movement without stepping outside the identity that has defined his independent catalog.",
    entry_type: "release_notes",
    status: "published",
    content: contentDoc,
    event_date: "2026-03-07",
    published_at: "2026-03-07T12:00:00.000Z",
    featured_at: "2026-03-07T12:00:00.000Z",
    seo_title: "Shake It Bae: JayDubb Tha Ruler Enters a Different Gear",
    seo_description: "Inside “Shake It Bae,” JayDubb Tha Ruler’s 2026 single with LLzMusik and another example of an independent catalog built on range without losing identity.",
    created_by: userId,
    updated_by: userId,
  };

  if (existingEntry) {
    const { error: updateErr } = await supabase
      .from("journal_entries")
      .update(baseEntryData)
      .eq("id", entryId);
    if (updateErr) throw new Error(`Failed to update base entry: ${updateErr.message}`);
    console.log("Base entry updated successfully.");
  } else {
    const { error: insertErr } = await supabase
      .from("journal_entries")
      .insert(baseEntryData);
    if (insertErr) throw new Error(`Failed to insert base entry: ${insertErr.message}`);
    console.log("Base entry inserted successfully.");
  }

  console.log("\n=== Step 2: Upsert journal_media rows ===");
  const mediaRows = [
    {
      id: coverMediaId,
      entry_id: entryId,
      storage_path: coverPath,
      kind: "image",
      mime_type: "image/jpeg",
      width: 2048,
      height: 1366,
      file_size_bytes: 203791,
      alt_text: "JayDubb Tha Ruler adjusts a blue The 7 cap in a studio portrait",
      caption: null,
      credit: null,
      sort_order: 0,
    },
    {
      id: profileMediaId,
      entry_id: entryId,
      storage_path: profilePath,
      kind: "image",
      mime_type: "image/jpeg",
      width: 1365,
      height: 2048,
      file_size_bytes: 217727,
      alt_text: "JayDubb Tha Ruler in profile wearing a blue cap and jacket",
      caption: null,
      credit: null,
      sort_order: 1,
    },
  ];

  for (const media of mediaRows) {
    const { error: mediaErr } = await supabase
      .from("journal_media")
      .upsert(media, { onConflict: "id" });
    if (mediaErr) throw new Error(`Failed to upsert media ${media.id}: ${mediaErr.message}`);
    console.log(`Media row upserted: ${media.storage_path}`);
  }

  console.log("\n=== Step 3: Link cover_media_id and og_media_id to journal_entries ===");
  const { error: linkErr } = await supabase
    .from("journal_entries")
    .update({
      cover_media_id: coverMediaId,
      og_media_id: coverMediaId,
    })
    .eq("id", entryId);

  if (linkErr) throw new Error(`Failed to link cover media: ${linkErr.message}`);
  console.log("Cover media linked successfully.");

  console.log("\n=== Step 4: Verification via Anonymous Client ===");
  const anonClient = createClient(supabaseUrl, anonKey);
  const { data: verifyEntry, error: vEntryErr } = await anonClient
    .from("journal_entries")
    .select("id, slug, title, status, published_at, cover_media_id, entry_number")
    .eq("slug", entrySlug)
    .single();

  if (vEntryErr || !verifyEntry) {
    throw new Error(`Anonymous query failed to find published entry: ${vEntryErr?.message}`);
  }
  console.log("Verified public entry:", verifyEntry);

  const { data: verifyMedia, error: vMediaErr } = await anonClient
    .from("journal_media")
    .select("id, storage_path, alt_text, sort_order")
    .eq("entry_id", entryId);

  if (vMediaErr || !verifyMedia || verifyMedia.length !== 2) {
    throw new Error(`Anonymous query failed to find media: ${vMediaErr?.message}`);
  }
  console.log("Verified public media count:", verifyMedia.length);
  for (const m of verifyMedia) {
    console.log(`- Media: ${m.storage_path}, alt: "${m.alt_text}"`);
  }

  console.log("\n=== Journal Seed Complete ===");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
