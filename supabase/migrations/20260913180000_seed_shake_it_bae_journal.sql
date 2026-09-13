-- Seed Journal Entry: "Shake It Bae: A Different Gear, Same Standard"
-- Migration: 20260913180000_seed_shake_it_bae_journal.sql

DO $$
DECLARE
  v_entry_id uuid := '00ff19d0-2929-4c07-8082-c41987de23bf';
  v_cover_media_id uuid := '8a2f3e1b-9c4d-4e5f-a6b7-c8d9e0f1a2b3';
  v_profile_media_id uuid := '7b1e2d3c-8f4a-4b5c-9d0e-f1a2b3c4d5e6';
  v_admin_id uuid;
BEGIN
  -- Get super_admin user id if available
  SELECT id INTO v_admin_id FROM public.admin_users ORDER BY created_at ASC LIMIT 1;

  -- 1. Insert or update base entry without cover media (to satisfy trigger validation)
  INSERT INTO public.journal_entries (
    id,
    slug,
    title,
    excerpt,
    entry_type,
    status,
    content,
    event_date,
    published_at,
    featured_at,
    seo_title,
    seo_description,
    created_by,
    updated_by
  ) VALUES (
    v_entry_id,
    'shake-it-bae-a-different-gear',
    'Shake It Bae: A Different Gear, Same Standard',
    'JayDubb Tha Ruler links back up with LLzMusik for “Shake It Bae,” a record built for movement without stepping outside the identity that has defined his independent catalog.',
    'release_notes',
    'published',
    jsonb_build_object(
      'version', 1,
      'blocks', jsonb_build_array(
        jsonb_build_object('id', 'p-1', 'type', 'paragraph', 'text', 'There is a difference between changing your sound and proving you have range.'),
        jsonb_build_object('id', 'p-2', 'type', 'paragraph', 'text', '“Shake It Bae” lives in that difference.'),
        jsonb_build_object('id', 'p-3', 'type', 'paragraph', 'text', 'Released March 7, 2026, the new single brings JayDubb Tha Ruler back together with LLzMusik for a three-minute record designed to move differently from some of the heavier moments across his catalog.'),
        jsonb_build_object('id', 'p-4', 'type', 'paragraph', 'text', 'The energy is immediate. The record leans into bounce, rhythm and a more nightlife-ready atmosphere, but the shift does not require JayDubb to abandon the voice that built everything before it.'),
        jsonb_build_object('id', 'p-5', 'type', 'paragraph', 'text', 'That is the point.'),
        jsonb_build_object('id', 'h-1', 'type', 'heading', 'level', 2, 'text', 'Range Without the Identity Crisis'),
        jsonb_build_object('id', 'p-6', 'type', 'paragraph', 'text', 'Versatility gets thrown around so often in music that the word can lose its meaning.'),
        jsonb_build_object('id', 'p-7', 'type', 'paragraph', 'text', 'Doing several different things is easy.'),
        jsonb_build_object('id', 'p-8', 'type', 'paragraph', 'text', 'Doing several different things while still sounding unmistakably like yourself is harder.'),
        jsonb_build_object('id', 'p-9', 'type', 'paragraph', 'text', 'Across JayDubb’s catalog, records have moved between introspection, street narrative, collaboration-heavy cuts and more atmospheric moments. “Shake It Bae” pushes further toward pure movement and accessibility.'),
        jsonb_build_object('id', 'p-10', 'type', 'paragraph', 'text', 'But the foundation remains intact.'),
        jsonb_build_object('id', 'p-11', 'type', 'paragraph', 'text', 'The delivery still carries intention. The writing still has personality. The record knows exactly what kind of energy it wants to create and gets there without pretending JayDubb suddenly became somebody else.'),
        jsonb_build_object('id', 'p-12', 'type', 'paragraph', 'text', 'Range matters most when the identity survives the switch.'),
        jsonb_build_object('id', 'img-editorial', 'type', 'image', 'mediaId', v_profile_media_id::text, 'mode', 'wide'),
        jsonb_build_object('id', 'h-2', 'type', 'heading', 'level', 2, 'text', 'JayDubb + LLzMusik, Again'),
        jsonb_build_object('id', 'p-13', 'type', 'paragraph', 'text', '“Shake It Bae” is not the first time JayDubb and LLzMusik have crossed paths on a record.'),
        jsonb_build_object('id', 'p-14', 'type', 'paragraph', 'text', 'LLzMusik previously appeared on “No Leaks,” the opening song from JayDubb’s 2025 album Don’t Forget the Bag.'),
        jsonb_build_object('id', 'p-15', 'type', 'paragraph', 'text', 'That makes this less of a random feature and more of a continuation.'),
        jsonb_build_object('id', 'p-16', 'type', 'paragraph', 'text', 'Different record. Different purpose. Familiar chemistry.'),
        jsonb_build_object('id', 'p-17', 'type', 'paragraph', 'text', 'Where “No Leaks” helped open an album built around focus, pressure and independent momentum, “Shake It Bae” lets the collaboration breathe in another direction entirely.'),
        jsonb_build_object('id', 'p-18', 'type', 'paragraph', 'text', 'That evolution matters.'),
        jsonb_build_object('id', 'p-19', 'type', 'paragraph', 'text', 'A catalog becomes more interesting when collaborations can grow instead of simply repeat themselves.'),
        jsonb_build_object('id', 'h-3', 'type', 'heading', 'level', 2, 'text', 'Built for the Room'),
        jsonb_build_object('id', 'p-20', 'type', 'paragraph', 'text', 'Some records ask for headphones.'),
        jsonb_build_object('id', 'p-21', 'type', 'paragraph', 'text', 'Some ask for a stage.'),
        jsonb_build_object('id', 'p-22', 'type', 'paragraph', 'text', 'Some are built for the exact second the room stops standing still.'),
        jsonb_build_object('id', 'p-23', 'type', 'paragraph', 'text', '“Shake It Bae” clearly understands its assignment.'),
        jsonb_build_object('id', 'p-24', 'type', 'paragraph', 'text', 'There is no need to overcomplicate the record. Its strength is that it gets to the point quickly, establishes the mood and stays there.'),
        jsonb_build_object('id', 'p-25', 'type', 'paragraph', 'text', 'For an artist whose catalog has often emphasized substance, independence and intent, there is something valuable about making a record that simply gives people permission to move.'),
        jsonb_build_object('id', 'p-26', 'type', 'paragraph', 'text', 'Not every song has to carry the weight of the world.'),
        jsonb_build_object('id', 'p-27', 'type', 'paragraph', 'text', 'Sometimes the right move is knowing how to control the room.'),
        jsonb_build_object('id', 'h-4', 'type', 'heading', 'level', 2, 'text', 'Another Piece of the Catalog'),
        jsonb_build_object('id', 'p-28', 'type', 'paragraph', 'text', 'Since The Year of the 7 in 2018, the story has never really been about chasing one sound.'),
        jsonb_build_object('id', 'p-29', 'type', 'paragraph', 'text', 'It has been about building.'),
        jsonb_build_object('id', 'p-30', 'type', 'paragraph', 'text', 'Project by project. Single by single. Collaboration by collaboration.'),
        jsonb_build_object('id', 'p-31', 'type', 'paragraph', 'text', 'That continued through Get Back to It, “Did It My Way,” Don’t Forget the Bag, and the records surrounding them.'),
        jsonb_build_object('id', 'p-32', 'type', 'paragraph', 'text', '“Shake It Bae” adds another lane without erasing the ones that came before it.'),
        jsonb_build_object('id', 'p-33', 'type', 'paragraph', 'text', 'And that may be the most important part of the release.'),
        jsonb_build_object('id', 'p-34', 'type', 'paragraph', 'text', 'The goal is not to prove JayDubb can make one kind of record extremely well.'),
        jsonb_build_object('id', 'p-35', 'type', 'paragraph', 'text', 'The goal is to build a catalog broad enough that years from now, no single track can completely explain the artist behind it.'),
        jsonb_build_object('id', 'p-36', 'type', 'paragraph', 'text', '“Shake It Bae” moves that mission forward.'),
        jsonb_build_object('id', 'p-37', 'type', 'paragraph', 'text', 'Different gear.'),
        jsonb_build_object('id', 'p-38', 'type', 'paragraph', 'text', 'Same standard.'),
        jsonb_build_object('id', 'p-39', 'type', 'paragraph', 'text', 'JayDubb Tha Ruler featuring LLzMusik — “Shake It Bae” is available now.'),
        jsonb_build_object('id', 'link-apple-music', 'type', 'link', 'url', 'https://music.apple.com/us/album/shake-it-bae-feat-llzmusik-single/1877512143', 'label', 'Listen on Apple Music'),
        jsonb_build_object('id', 'link-release-page', 'type', 'link', 'url', 'https://jaydubbtharuler.com/releases/shake-it-bae', 'label', 'Explore the official release page')
      )
    ),
    '2026-03-07',
    '2026-03-07T12:00:00Z',
    '2026-03-07T12:00:00Z',
    'Shake It Bae: JayDubb Tha Ruler Enters a Different Gear',
    'Inside “Shake It Bae,” JayDubb Tha Ruler’s 2026 single with LLzMusik and another example of an independent catalog built on range without losing identity.',
    v_admin_id,
    v_admin_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    excerpt = EXCLUDED.excerpt,
    entry_type = EXCLUDED.entry_type,
    status = EXCLUDED.status,
    content = EXCLUDED.content,
    event_date = EXCLUDED.event_date,
    published_at = EXCLUDED.published_at,
    featured_at = EXCLUDED.featured_at,
    seo_title = EXCLUDED.seo_title,
    seo_description = EXCLUDED.seo_description;

  -- 2. Insert or update journal_media
  INSERT INTO public.journal_media (
    id,
    entry_id,
    storage_path,
    kind,
    mime_type,
    width,
    height,
    file_size_bytes,
    alt_text,
    sort_order
  ) VALUES
    (
      v_cover_media_id,
      v_entry_id,
      v_entry_id || '/blue-hands.jpg',
      'image',
      'image/jpeg',
      2048,
      1366,
      203791,
      'JayDubb Tha Ruler adjusts a blue The 7 cap in a studio portrait',
      0
    ),
    (
      v_profile_media_id,
      v_entry_id,
      v_entry_id || '/blue-profile.jpg',
      'image',
      'image/jpeg',
      1365,
      2048,
      217727,
      'JayDubb Tha Ruler in profile wearing a blue cap and jacket',
      1
    )
  ON CONFLICT (id) DO UPDATE SET
    storage_path = EXCLUDED.storage_path,
    mime_type = EXCLUDED.mime_type,
    width = EXCLUDED.width,
    height = EXCLUDED.height,
    file_size_bytes = EXCLUDED.file_size_bytes,
    alt_text = EXCLUDED.alt_text,
    sort_order = EXCLUDED.sort_order;

  -- 3. Link cover_media_id and og_media_id
  UPDATE public.journal_entries
  SET
    cover_media_id = v_cover_media_id,
    og_media_id = v_cover_media_id
  WHERE id = v_entry_id;

END $$;
