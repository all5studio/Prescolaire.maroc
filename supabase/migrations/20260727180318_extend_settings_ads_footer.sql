/*
# Extend site settings + add ad slots and footer links

1. Modified Tables
- `site_settings`: adds columns for
  - logo_image (URL of a custom logo image; empty = fall back to letter)
  - adsense_client (AdSense publisher ID, e.g. ca-pub-XXXXXXXXX)
  - granular color controls for every structural element from top to
    bottom: top bar, header, nav links, news ticker, footer, cards,
    headings, body text, links, and primary buttons.
  All new columns have defaults matching the current light-mode design
  so the site looks identical until the admin changes a value.

2. New Tables
- `ad_slots`: stores AdSense configuration per ad placement
  (leaderboard, in-article, rectangle, skyscraper, mobile). Each row
  has a unique slot_key, the AdSense slot ID, an enabled flag, and
  fallback placeholder text shown when the ad is not configured.
- `footer_links`: editable list of quick links rendered in the site
  footer. Each row has a label, URL, and sort_order.

3. Security
- RLS enabled on both new tables with anon+authenticated CRUD
  (single-tenant public site, same pattern as existing tables).
*/

-- ---------- site_settings: add new columns ----------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='logo_image') THEN
    ALTER TABLE site_settings ADD COLUMN logo_image text NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='adsense_client') THEN
    ALTER TABLE site_settings ADD COLUMN adsense_client text NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='topbar_bg') THEN
    ALTER TABLE site_settings ADD COLUMN topbar_bg text NOT NULL DEFAULT '#1e3a6e';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='topbar_text') THEN
    ALTER TABLE site_settings ADD COLUMN topbar_text text NOT NULL DEFAULT '#ffffff';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='header_bg') THEN
    ALTER TABLE site_settings ADD COLUMN header_bg text NOT NULL DEFAULT '#ffffff';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='header_text') THEN
    ALTER TABLE site_settings ADD COLUMN header_text text NOT NULL DEFAULT '#0f172a';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='nav_link_color') THEN
    ALTER TABLE site_settings ADD COLUMN nav_link_color text NOT NULL DEFAULT '#334155';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='nav_link_hover') THEN
    ALTER TABLE site_settings ADD COLUMN nav_link_hover text NOT NULL DEFAULT '#1e3a6e';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='ticker_bg') THEN
    ALTER TABLE site_settings ADD COLUMN ticker_bg text NOT NULL DEFAULT '#e41a98';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='ticker_text') THEN
    ALTER TABLE site_settings ADD COLUMN ticker_text text NOT NULL DEFAULT '#ffffff';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='footer_bg') THEN
    ALTER TABLE site_settings ADD COLUMN footer_bg text NOT NULL DEFAULT '#1e3a6e';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='footer_text') THEN
    ALTER TABLE site_settings ADD COLUMN footer_text text NOT NULL DEFAULT '#ffffff';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='card_bg') THEN
    ALTER TABLE site_settings ADD COLUMN card_bg text NOT NULL DEFAULT '#ffffff';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='card_border') THEN
    ALTER TABLE site_settings ADD COLUMN card_border text NOT NULL DEFAULT '#e5e7eb';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='heading_color') THEN
    ALTER TABLE site_settings ADD COLUMN heading_color text NOT NULL DEFAULT '#111827';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='body_text_color') THEN
    ALTER TABLE site_settings ADD COLUMN body_text_color text NOT NULL DEFAULT '#3f3f46';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='link_color') THEN
    ALTER TABLE site_settings ADD COLUMN link_color text NOT NULL DEFAULT '#1e3a6e';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='button_bg') THEN
    ALTER TABLE site_settings ADD COLUMN button_bg text NOT NULL DEFAULT '#1e3a6e';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='button_text') THEN
    ALTER TABLE site_settings ADD COLUMN button_text text NOT NULL DEFAULT '#ffffff';
  END IF;
END $$;

-- ---------- ad_slots ----------
CREATE TABLE IF NOT EXISTS ad_slots (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slot_key       text UNIQUE NOT NULL,
  adsense_slot   text NOT NULL DEFAULT '',
  enabled        boolean NOT NULL DEFAULT false,
  fallback_text  text NOT NULL DEFAULT '',
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE ad_slots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_ad_slots" ON ad_slots;
CREATE POLICY "anon_select_ad_slots" ON ad_slots FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_ad_slots" ON ad_slots;
CREATE POLICY "anon_insert_ad_slots" ON ad_slots FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_ad_slots" ON ad_slots;
CREATE POLICY "anon_update_ad_slots" ON ad_slots FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_ad_slots" ON ad_slots;
CREATE POLICY "anon_delete_ad_slots" ON ad_slots FOR DELETE
  TO anon, authenticated USING (true);

-- ---------- footer_links ----------
CREATE TABLE IF NOT EXISTS footer_links (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  label       text NOT NULL,
  url         text NOT NULL DEFAULT '#',
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_footer_links" ON footer_links;
CREATE POLICY "anon_select_footer_links" ON footer_links FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_footer_links" ON footer_links;
CREATE POLICY "anon_insert_footer_links" ON footer_links FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_footer_links" ON footer_links;
CREATE POLICY "anon_update_footer_links" ON footer_links FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_footer_links" ON footer_links;
CREATE POLICY "anon_delete_footer_links" ON footer_links FOR DELETE
  TO anon, authenticated USING (true);

-- ---------- triggers for new tables ----------
DROP TRIGGER IF EXISTS trg_ad_slots_touch ON ad_slots;
CREATE TRIGGER trg_ad_slots_touch BEFORE UPDATE ON ad_slots
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_footer_links_touch ON footer_links;
CREATE TRIGGER trg_footer_links_touch BEFORE UPDATE ON footer_links
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ---------- seed: ad_slots ----------
INSERT INTO ad_slots (slot_key, adsense_slot, enabled, fallback_text) VALUES
  ('leaderboard', '', false, 'مساحة إعلانية – 728×90'),
  ('in-article',  '', false, 'إعلان – داخل المقال'),
  ('rectangle',  '', false, 'إعلان – 300×250'),
  ('skyscraper', '', false, 'إعلان – 300×600'),
  ('mobile',     '', false, 'إعلان – 320×100')
ON CONFLICT (slot_key) DO NOTHING;

-- ---------- seed: footer_links ----------
INSERT INTO footer_links (label, url, sort_order) VALUES
  ('القائمة الرئيسية', '#', 1),
  ('من نحن', '#page-about', 2),
  ('تواصل معنا', '#page-contact', 3)
ON CONFLICT DO NOTHING;
