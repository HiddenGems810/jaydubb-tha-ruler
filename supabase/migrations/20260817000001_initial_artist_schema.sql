-- JayDubb Tha Ruler Artist Platform & CMS Hub Schema
-- Production Migration: 20260817000001_initial_artist_schema.sql

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Custom Enums
DO $$ BEGIN
  CREATE TYPE member_status AS ENUM ('active', 'unsubscribed', 'bounced');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE show_status AS ENUM ('scheduled', 'sold_out', 'postponed', 'cancelled', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE release_type AS ENUM ('single', 'ep', 'album', 'mixtape');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE inquiry_status AS ENUM ('new', 'in_review', 'responded', 'booked', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE media_type AS ENUM ('image', 'video_embed', 'audio');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Generic updated_at Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Admin Users Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger for admin_users updated_at
DROP TRIGGER IF EXISTS tr_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER tr_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. Helper Function: is_admin() for RLS Evaluation
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  );
$$;

-- 6. VIP Members Table (Fan Club Acquisition)
CREATE TABLE IF NOT EXISTS public.vip_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  status member_status NOT NULL DEFAULT 'active',
  source TEXT NOT NULL DEFAULT 'website_vip_section',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  consent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vip_members_email ON public.vip_members(email);
CREATE INDEX IF NOT EXISTS idx_vip_members_status ON public.vip_members(status);
CREATE INDEX IF NOT EXISTS idx_vip_members_created ON public.vip_members(created_at DESC);

DROP TRIGGER IF EXISTS tr_vip_members_updated_at ON public.vip_members;
CREATE TRIGGER tr_vip_members_updated_at
  BEFORE UPDATE ON public.vip_members
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 7. Upcoming & Past Shows Table
CREATE TABLE IF NOT EXISTS public.shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  state_region TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'USA',
  timezone TEXT NOT NULL DEFAULT 'America/Denver',
  event_date TIMESTAMPTZ NOT NULL,
  doors_time TIMESTAMPTZ,
  ticket_url TEXT,
  poster_url TEXT,
  supporting_text TEXT,
  status show_status NOT NULL DEFAULT 'scheduled',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shows_event_date ON public.shows(event_date ASC);
CREATE INDEX IF NOT EXISTS idx_shows_published ON public.shows(is_published, status);
CREATE INDEX IF NOT EXISTS idx_shows_featured ON public.shows(is_featured);

DROP TRIGGER IF EXISTS tr_shows_updated_at ON public.shows;
CREATE TRIGGER tr_shows_updated_at
  BEFORE UPDATE ON public.shows
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. Discography Releases Table
CREATE TABLE IF NOT EXISTS public.releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  release_type release_type NOT NULL DEFAULT 'single',
  release_date DATE NOT NULL,
  artwork_url TEXT NOT NULL,
  description TEXT,
  spotify_url TEXT,
  apple_music_url TEXT,
  youtube_url TEXT,
  audiomack_url TEXT,
  amazon_music_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_releases_slug ON public.releases(slug);
CREATE INDEX IF NOT EXISTS idx_releases_published ON public.releases(is_published, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_releases_date ON public.releases(release_date DESC);

DROP TRIGGER IF EXISTS tr_releases_updated_at ON public.releases;
CREATE TRIGGER tr_releases_updated_at
  BEFORE UPDATE ON public.releases
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. Release Tracks Table
CREATE TABLE IF NOT EXISTS public.tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id UUID NOT NULL REFERENCES public.releases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  track_number INT NOT NULL DEFAULT 1,
  duration_seconds INT,
  audio_preview_url TEXT,
  is_explicit BOOLEAN NOT NULL DEFAULT true,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tracks_release_id ON public.tracks(release_id, track_number ASC);

DROP TRIGGER IF EXISTS tr_tracks_updated_at ON public.tracks;
CREATE TRIGGER tr_tracks_updated_at
  BEFORE UPDATE ON public.tracks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. Media Items Gallery Table
CREATE TABLE IF NOT EXISTS public.media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_type media_type NOT NULL DEFAULT 'image',
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT NOT NULL,
  caption TEXT,
  credit TEXT,
  category TEXT NOT NULL DEFAULT 'live',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_published ON public.media_items(is_published, display_order ASC);

DROP TRIGGER IF EXISTS tr_media_items_updated_at ON public.media_items;
CREATE TRIGGER tr_media_items_updated_at
  BEFORE UPDATE ON public.media_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 11. Press Coverage Items Table
CREATE TABLE IF NOT EXISTS public.press_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet TEXT NOT NULL,
  title TEXT NOT NULL,
  article_url TEXT NOT NULL,
  published_date DATE NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_press_published ON public.press_items(is_published, display_order ASC);

DROP TRIGGER IF EXISTS tr_press_items_updated_at ON public.press_items;
CREATE TRIGGER tr_press_items_updated_at
  BEFORE UPDATE ON public.press_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 12. Social Channels & Destinations Table
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_social_links_active ON public.social_links(is_active, display_order ASC);

DROP TRIGGER IF EXISTS tr_social_links_updated_at ON public.social_links;
CREATE TRIGGER tr_social_links_updated_at
  BEFORE UPDATE ON public.social_links
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 13. Booking & Business Inquiries Table
CREATE TABLE IF NOT EXISTS public.booking_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  inquiry_type TEXT NOT NULL DEFAULT 'booking',
  event_date DATE,
  location TEXT,
  budget_range TEXT,
  message TEXT NOT NULL,
  status inquiry_status NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.booking_inquiries(status, created_at DESC);

DROP TRIGGER IF EXISTS tr_booking_inquiries_updated_at ON public.booking_inquiries;
CREATE TRIGGER tr_booking_inquiries_updated_at
  BEFORE UPDATE ON public.booking_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 14. Site Configuration & Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_site_settings_public ON public.site_settings(is_public);

DROP TRIGGER IF EXISTS tr_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER tr_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- 15. ROW LEVEL SECURITY (RLS) POLICIES - DENY BY DEFAULT
-- =========================================================================

-- Enable RLS on ALL tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 15.1 Admin Users Table Policies
CREATE POLICY "admin_users_select_admin" ON public.admin_users
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "admin_users_write_admin" ON public.admin_users
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 15.2 VIP Members Table Policies (Admin Only - Public Insert via Server Action/API)
CREATE POLICY "vip_members_admin_all" ON public.vip_members
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 15.3 Shows Table Policies
CREATE POLICY "shows_public_select" ON public.shows
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "shows_admin_all" ON public.shows
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 15.4 Releases Table Policies
CREATE POLICY "releases_public_select" ON public.releases
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "releases_admin_all" ON public.releases
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 15.5 Tracks Table Policies
CREATE POLICY "tracks_public_select" ON public.tracks
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "tracks_admin_all" ON public.tracks
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 15.6 Media Items Table Policies
CREATE POLICY "media_items_public_select" ON public.media_items
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "media_items_admin_all" ON public.media_items
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 15.7 Press Items Table Policies
CREATE POLICY "press_items_public_select" ON public.press_items
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "press_items_admin_all" ON public.press_items
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 15.8 Social Links Table Policies
CREATE POLICY "social_links_public_select" ON public.social_links
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "social_links_admin_all" ON public.social_links
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 15.9 Booking Inquiries Table Policies (Admin Only - Public Insert via Server Action/API)
CREATE POLICY "booking_inquiries_admin_all" ON public.booking_inquiries
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 15.10 Site Settings Table Policies
CREATE POLICY "site_settings_public_select" ON public.site_settings
  FOR SELECT TO anon, authenticated
  USING (is_public = true);

CREATE POLICY "site_settings_admin_all" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =========================================================================
-- 16. SUPABASE STORAGE BUCKETS CONFIGURATION & POLICIES
-- =========================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('show-posters', 'show-posters', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('release-artwork', 'release-artwork', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('press-media', 'press-media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('artist-media', 'artist-media', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
CREATE POLICY "storage_public_read_show_posters" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'show-posters');

CREATE POLICY "storage_public_read_release_artwork" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'release-artwork');

CREATE POLICY "storage_public_read_press_media" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'press-media');

CREATE POLICY "storage_public_read_artist_media" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'artist-media');

CREATE POLICY "storage_admin_write_all" ON storage.objects
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =========================================================================
-- 17. INITIAL SEED DATA (VERIFIED ARTIST CATALOG & SOCIALS)
-- =========================================================================

-- Social Links Seed
INSERT INTO public.social_links (platform, display_name, url, display_order, is_active)
VALUES
  ('spotify', 'Spotify', 'https://open.spotify.com/artist/7IlXxo9gPXLZz2oWpTwS4l', 1, true),
  ('apple_music', 'Apple Music', 'https://music.apple.com/us/artist/jaydubbtharuler/1439373897', 2, true),
  ('youtube', 'YouTube', 'https://www.youtube.com/@jaydubbtharuler', 3, true),
  ('instagram', 'Instagram', 'https://www.instagram.com/jaydubbtharuler/', 4, true),
  ('facebook', 'Facebook', 'https://www.facebook.com/JayDubbThaRuler', 5, true),
  ('x', 'X', 'https://x.com/JayDubbThaRuler', 6, true)
ON CONFLICT (platform) DO UPDATE SET 
  url = EXCLUDED.url,
  display_order = EXCLUDED.display_order,
  is_active = true;

-- Verified Releases Seed
INSERT INTO public.releases (slug, title, release_type, release_date, artwork_url, description, spotify_url, apple_music_url, youtube_url, is_featured, is_published, display_order)
VALUES
  (
    'aquarium-floors',
    'Aquarium Floors',
    'single',
    '2024-03-01',
    '/images/jay-dubb/profile-moody.jpg',
    'Official lead single featuring JayDubb Tha Ruler cinematic video direction and storytelling.',
    'https://open.spotify.com/artist/7IlXxo9gPXLZz2oWpTwS4l',
    'https://music.apple.com/us/artist/jaydubbtharuler/1439373897',
    'https://www.youtube.com/watch?v=i5QQmQqv6og',
    true,
    true,
    1
  ),
  (
    'shake-it-bae',
    'Shake It Bae',
    'single',
    '2023-09-15',
    '/images/jay-dubb/city-shirt.jpg',
    'High energy club and live performance anthem.',
    'https://open.spotify.com/artist/7IlXxo9gPXLZz2oWpTwS4l',
    'https://music.apple.com/us/artist/jaydubbtharuler/1439373897',
    'https://www.youtube.com/@jaydubbtharuler',
    false,
    true,
    2
  ),
  (
    'dont-forget-the-bag',
    'Don''t Forget the Bag',
    'single',
    '2023-04-20',
    '/images/jay-dubb/stage-mic.jpg',
    'Motivational street record showcasing lyricism and discipline.',
    'https://open.spotify.com/artist/7IlXxo9gPXLZz2oWpTwS4l',
    'https://music.apple.com/us/artist/jaydubbtharuler/1439373897',
    'https://www.youtube.com/@jaydubbtharuler',
    false,
    true,
    3
  ),
  (
    'off-brand',
    'Off Brand',
    'single',
    '2022-11-10',
    '/images/jay-dubb/cover-wide.jpg',
    'Westside Boogie collaboration and landmark independent record.',
    'https://open.spotify.com/artist/7IlXxo9gPXLZz2oWpTwS4l',
    'https://music.apple.com/us/artist/jaydubbtharuler/1439373897',
    'https://www.youtube.com/@jaydubbtharuler',
    false,
    true,
    4
  )
ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  release_type = EXCLUDED.release_type,
  artwork_url = EXCLUDED.artwork_url,
  description = EXCLUDED.description,
  is_published = true;

-- Site Settings Seed
INSERT INTO public.site_settings (key, value, description, is_public)
VALUES
  ('artist_profile', '{"artist_name": "JayDubb Tha Ruler", "real_name": "Justin Wallace", "origin": "Colorado Springs, CO", "label": "The 7 / KSTG ENT", "booking_email": "booking@jaydubbtharuler.com"}'::jsonb, 'General artist identity information', true),
  ('vip_settings', '{"signup_enabled": true, "welcome_message": "Welcome to The 7 VIP Fan Club. You will receive first access to upcoming tour dates, unreleased music previews, and exclusive merch drops."}'::jsonb, 'VIP fan acquisition configuration', true)
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  is_public = EXCLUDED.is_public;
