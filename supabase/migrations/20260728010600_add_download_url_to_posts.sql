/*
# Add download_url column to posts

1. Modified Tables
- `posts`: adds `download_url` (text, nullable) — an optional direct
  download link shown at the end of an article behind a timed
  interstitial page with ad slots.

2. Security
- No policy changes. The column inherits existing post RLS policies.
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='download_url') THEN
    ALTER TABLE posts ADD COLUMN download_url text;
  END IF;
END $$;
