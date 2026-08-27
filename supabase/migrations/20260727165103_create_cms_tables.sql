/*
# CMS tables for Préscolaire Maroc site

This migration creates the full content-management schema so the site's
articles, categories, hero slides, news ticker, pages, and site-wide
settings can be edited from in-app admin dashboards instead of hardcoded
mock data.

## 1. New Tables

- `categories`  — site sections (أخبار, مباريات, المستوى الأول, …).
  Columns: id, name, slug (unique), icon (lucide name), color (tailwind
  classes), sort_order, created_at, updated_at.
- `posts` — articles. Columns: id, title, excerpt, content, category_id
  (FK → categories), image, date, author, read_time, views, featured,
  tags (text[]), created_at, updated_at.
- `hero_slides` — top slider. Columns: id, title, excerpt, category,
  category_slug, image, date, badge, badge_color, sort_order,
  created_at, updated_at.
- `news_ticker_items` — scrolling ticker. Columns: id, text, sort_order,
  created_at, updated_at.
- `pages` — standalone pages (about, contact, privacy, terms, …).
  Columns: id, title, slug (unique), content, created_at, updated_at.
- `site_settings` — single-row table holding site title, tagline, logo
  letter, about text, social links, contact info, and color palette.
  Columns: id (fixed = 1), site_title, site_tagline, logo_letter,
  about_title, about_text, social_facebook, social_twitter,
  social_youtube, social_instagram, social_telegram, contact_email,
  contact_phone, primary_color, secondary_color, updated_at.

## 2. Security

The site is a single-tenant public site with NO sign-in screen on the
public side, so all tables use `TO anon, authenticated` policies allowing
open CRUD. The admin dashboards run in the same anon-key browser context.
This is intentional shared/public data.

## 3. Notes

- All tables are idempotent (IF NOT EXISTS).
- Policies are dropped before recreate to stay re-runnable.
- Seed data mirrors the existing mockData.ts so the site looks identical
  after migration.
*/

-- ---------- categories ----------
CREATE TABLE IF NOT EXISTS categories (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  icon        text NOT NULL DEFAULT 'FileText',
  color       text NOT NULL DEFAULT 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_categories" ON categories;
CREATE POLICY "anon_insert_categories" ON categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_categories" ON categories;
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_categories" ON categories;
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE
  TO anon, authenticated USING (true);

-- ---------- posts ----------
CREATE TABLE IF NOT EXISTS posts (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title        text NOT NULL,
  excerpt      text NOT NULL,
  content      text NOT NULL DEFAULT '',
  category_id  bigint REFERENCES categories(id) ON DELETE SET NULL,
  image        text NOT NULL DEFAULT '',
  date         date NOT NULL DEFAULT CURRENT_DATE,
  author       text NOT NULL DEFAULT 'فريق التحرير',
  read_time    integer NOT NULL DEFAULT 5,
  views        integer NOT NULL DEFAULT 0,
  featured     boolean NOT NULL DEFAULT false,
  tags         text[] NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_posts" ON posts;
CREATE POLICY "anon_select_posts" ON posts FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_posts" ON posts;
CREATE POLICY "anon_insert_posts" ON posts FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_posts" ON posts;
CREATE POLICY "anon_update_posts" ON posts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_posts" ON posts;
CREATE POLICY "anon_delete_posts" ON posts FOR DELETE
  TO anon, authenticated USING (true);

-- ---------- hero_slides ----------
CREATE TABLE IF NOT EXISTS hero_slides (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title          text NOT NULL,
  excerpt        text NOT NULL,
  category       text NOT NULL,
  category_slug  text NOT NULL,
  image          text NOT NULL,
  date           date NOT NULL DEFAULT CURRENT_DATE,
  badge          text NOT NULL DEFAULT '',
  badge_color    text NOT NULL DEFAULT 'bg-primary-700',
  sort_order     integer NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_hero_slides" ON hero_slides;
CREATE POLICY "anon_select_hero_slides" ON hero_slides FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_hero_slides" ON hero_slides;
CREATE POLICY "anon_insert_hero_slides" ON hero_slides FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_hero_slides" ON hero_slides;
CREATE POLICY "anon_update_hero_slides" ON hero_slides FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_hero_slides" ON hero_slides;
CREATE POLICY "anon_delete_hero_slides" ON hero_slides FOR DELETE
  TO anon, authenticated USING (true);

-- ---------- news_ticker_items ----------
CREATE TABLE IF NOT EXISTS news_ticker_items (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  text        text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE news_ticker_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_news_ticker_items" ON news_ticker_items;
CREATE POLICY "anon_select_news_ticker_items" ON news_ticker_items FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_news_ticker_items" ON news_ticker_items;
CREATE POLICY "anon_insert_news_ticker_items" ON news_ticker_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_news_ticker_items" ON news_ticker_items;
CREATE POLICY "anon_update_news_ticker_items" ON news_ticker_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_news_ticker_items" ON news_ticker_items;
CREATE POLICY "anon_delete_news_ticker_items" ON news_ticker_items FOR DELETE
  TO anon, authenticated USING (true);

-- ---------- pages ----------
CREATE TABLE IF NOT EXISTS pages (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       text NOT NULL,
  slug        text UNIQUE NOT NULL,
  content     text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_pages" ON pages;
CREATE POLICY "anon_select_pages" ON pages FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_pages" ON pages;
CREATE POLICY "anon_insert_pages" ON pages FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_pages" ON pages;
CREATE POLICY "anon_update_pages" ON pages FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_pages" ON pages;
CREATE POLICY "anon_delete_pages" ON pages FOR DELETE
  TO anon, authenticated USING (true);

-- ---------- site_settings ----------
CREATE TABLE IF NOT EXISTS site_settings (
  id                integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_title        text NOT NULL DEFAULT 'Préscolaire Maroc',
  site_tagline      text NOT NULL DEFAULT 'التعليم الأولي بالمغرب',
  logo_letter       text NOT NULL DEFAULT 'P',
  about_title       text NOT NULL DEFAULT 'من نحن',
  about_text        text NOT NULL DEFAULT '',
  social_facebook   text NOT NULL DEFAULT '',
  social_twitter    text NOT NULL DEFAULT '',
  social_youtube    text NOT NULL DEFAULT '',
  social_instagram  text NOT NULL DEFAULT '',
  social_telegram   text NOT NULL DEFAULT '',
  contact_email     text NOT NULL DEFAULT '',
  contact_phone     text NOT NULL DEFAULT '',
  primary_color     text NOT NULL DEFAULT '#1e3a6e',
  secondary_color   text NOT NULL DEFAULT '#e41a98',
  updated_at        timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_site_settings" ON site_settings;
CREATE POLICY "anon_select_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_site_settings" ON site_settings;
CREATE POLICY "anon_insert_site_settings" ON site_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_site_settings" ON site_settings;
CREATE POLICY "anon_update_site_settings" ON site_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_site_settings" ON site_settings;
CREATE POLICY "anon_delete_site_settings" ON site_settings FOR DELETE
  TO anon, authenticated USING (true);

-- ---------- updated_at triggers ----------
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_categories_touch ON categories;
CREATE TRIGGER trg_categories_touch BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_posts_touch ON posts;
CREATE TRIGGER trg_posts_touch BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_hero_slides_touch ON hero_slides;
CREATE TRIGGER trg_hero_slides_touch BEFORE UPDATE ON hero_slides
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_news_ticker_touch ON news_ticker_items;
CREATE TRIGGER trg_news_ticker_touch BEFORE UPDATE ON news_ticker_items
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_pages_touch ON pages;
CREATE TRIGGER trg_pages_touch BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_site_settings_touch ON site_settings;
CREATE TRIGGER trg_site_settings_touch BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ---------- seed: categories ----------
INSERT INTO categories (name, slug, icon, color, sort_order) VALUES
  ('أخبار ومستجدات',        'news',        'Newspaper',     'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', 1),
  ('مباريات التعليم الأولي', 'competitions', 'Trophy',        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', 2),
  ('المستوى الأول',           'level-1',     'BookOpen',      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', 3),
  ('المستوى الثاني',          'level-2',     'BookOpenCheck', 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300', 4),
  ('أنشطة تربوية',           'activities',  'Palette',       'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300', 5),
  ('ألعاب تربوية',           'games',       'Gamepad2',      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', 6),
  ('مستندات',                'documents',   'FileText',      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', 7),
  ('مقاطع تربوية',           'videos',      'Video',         'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', 8),
  ('وثائق إدارية',           'admin-docs',  'FolderOpen',    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300', 9),
  ('نصائح وإرشادات',         'tips',        'Lightbulb',     'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', 10)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order;

-- ---------- seed: posts ----------
INSERT INTO posts (title, excerpt, content, category_id, image, date, author, read_time, views, featured, tags) VALUES
  ('مستجدات الدخول المدرسي 2026 للتعليم الأولي', 'كل ما يجب معرفته عن الدخول المدرسي 2026 في مجال التعليم الأولي العمومي والخاص بالمغرب.', '', (SELECT id FROM categories WHERE slug='news'), 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', '2026-01-18', 'فريق التحرير', 5, 1240, true, ARRAY['دخول مدرسي','2026']),
  ('توجيهات إطار العمل الوطني للتعليم الأولي', 'ملخص لأهم توجيهات إطار العمل الوطني المحدّث الخاص بالتعليم الأولي بالمغرب.', '', (SELECT id FROM categories WHERE slug='news'), 'https://images.pexels.com/photos/8613103/pexels-photo-8613103.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', '2025-12-28', 'فريق التحرير', 4, 892, false, ARRAY['إطار عمل','توجيهات']),
  ('شروط الترشح لمباريات التعليم الأولي 2026', 'دليل شامل بشروط ومتطلبات الترشح لمباريات التعليم الأولي للموسم الدراسي القادم.', '', (SELECT id FROM categories WHERE slug='competitions'), 'https://images.pexels.com/photos/8613164/pexels-photo-8613164.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', '2026-01-10', 'فريق التحرير', 6, 3450, true, ARRAY['مباريات','ترشح']),
  ('نماذج اختبارات مباريات التعليم الأولي السابقة', 'مجموعة من نماذج الاختبارات السابقة لمساعدتك على التحضير الجيد لمباريات التعليم الأولي.', '', (SELECT id FROM categories WHERE slug='competitions'), 'https://images.pexels.com/photos/8613325/pexels-photo-8613325.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', '2025-11-05', 'فريق التحرير', 8, 5120, false, ARRAY['نماذج','اختبارات']),
  ('خطط دروس المستوى الأول – الفصل الأول', 'مجموعة متكاملة من خطط الدروس الجاهزة للمستوى الأول في التعليم الأولي، موزعة على مجالات التعلم.', '', (SELECT id FROM categories WHERE slug='level-1'), 'https://images.pexels.com/photos/8422069/pexels-photo-8422069.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', '2025-10-15', 'المربية سمية', 7, 2680, true, ARRAY['خطط دروس','المستوى الأول']),
  ('بطاقات الحروف والأرقام للمستوى الأول', 'بطاقات ملونة وجذابة لتعليم الحروف العربية والأرقام لأطفال المستوى الأول.', '', (SELECT id FROM categories WHERE slug='level-1'), 'https://images.pexels.com/photos/8422100/pexels-photo-8422100.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', '2025-09-22', 'المربية ليلى', 3, 4310, false, ARRAY['بطاقات','حروف','أرقام']),
  ('برنامج المستوى الثاني – أنشطة التهيؤ للكتابة', 'سلسلة من الأنشطة التربوية المصممة لتقوية مهارات التهيؤ للكتابة لدى أطفال المستوى الثاني.', '', (SELECT id FROM categories WHERE slug='level-2'), 'https://images.pexels.com/photos/8612927/pexels-photo-8612927.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', '2025-10-08', 'المربية نور', 6, 1890, true, ARRAY['كتابة','المستوى الثاني']),
  ('قصص مصوّرة للمستوى الثاني', 'مجموعة من القصص المصوّرة المناسبة لتنمية الخيال وتطوير مهارات الاستماع والتعبير لأطفال المستوى الثاني.', '', (SELECT id FROM categories WHERE slug='level-2'), 'https://images.pexels.com/photos/8612897/pexels-photo-8612897.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', '2025-09-18', 'المربية أمل', 4, 2150, false, ARRAY['قصص','مصورة']),
  ('أنشطة الفن والرسم لتنمية الإبداع', 'مقترحات لأنشطة فنية وإبداعية تساعد على تطوير مهارات الطفل الحسية والحركية الدقيقة في مرحلة التعليم الأولي.', '', (SELECT id FROM categories WHERE slug='activities'), 'https://images.pexels.com/photos/8613012/pexels-photo-8613012.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', '2025-11-28', 'فريق التحرير', 5, 3200, true, ARRAY['فن','رسم','إبداع']),
  ('أنشطة تنمية الوعي الصوتي والفونولوجي', 'ألعاب وأنشطة تربوية هادفة لتنمية الوعي الصوتي والفونولوجي لدى أطفال التعليم الأولي تمهيداً للقراءة.', '', (SELECT id FROM categories WHERE slug='activities'), 'https://images.pexels.com/photos/8612954/pexels-photo-8612954.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', '2025-10-30', 'المربية سمية', 6, 1780, false, ARRAY['وعي صوتي','قراءة']),
  ('ألعاب تربوية لتنمية الذكاء الرياضي المنطقي', 'مجموعة من الألعاب التربوية المصممة لتحفيز التفكير المنطقي وحل المشكلات لدى الأطفال.', '', (SELECT id FROM categories WHERE slug='games'), 'https://images.pexels.com/photos/8612903/pexels-photo-8612903.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', '2025-12-05', 'فريق التحرير', 5, 2890, true, ARRAY['ألعاب','ذكاء','منطق']),
  ('لعبة الدومينو التربوي – حروف وأرقام', 'نموذج جاهز للطباعة للعبة الدومينو التربوي الخاص بالحروف والأرقام العربية للأطفال.', '', (SELECT id FROM categories WHERE slug='games'), 'https://images.pexels.com/photos/8613065/pexels-photo-8613065.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', '2025-11-14', 'المربية ليلى', 3, 4520, false, ARRAY['دومينو','طباعة']),
  ('الدليل العملي للمربية في التعليم الأولي', 'دليل عملي شامل يرشد المربية خلال جميع مراحل الموسم الدراسي في مجال التعليم الأولي.', '', (SELECT id FROM categories WHERE slug='documents'), 'https://images.pexels.com/photos/8613208/pexels-photo-8613208.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', '2025-09-10', 'فريق التحرير', 10, 5670, true, ARRAY['دليل','مربية']),
  ('نماذج بطاقات التقييم التكويني للتعليم الأولي', 'نماذج جاهزة لبطاقات التقييم التكويني وفق المرجعية الرسمية للتعليم الأولي بالمغرب.', '', (SELECT id FROM categories WHERE slug='documents'), 'https://images.pexels.com/photos/8613240/pexels-photo-8613240.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', '2025-10-22', 'فريق التحرير', 4, 3890, false, ARRAY['تقييم','نماذج']),
  ('10 نصائح لتهيئة بيئة التعلم في قسم التعليم الأولي', 'نصائح عملية لتجهيز فضاء القسم وتهيئة بيئة تعلم محفزة وآمنة لأطفال التعليم الأولي.', '', (SELECT id FROM categories WHERE slug='tips'), 'https://images.pexels.com/photos/8613275/pexels-photo-8613275.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', '2025-12-18', 'فريق التحرير', 7, 2140, true, ARRAY['بيئة تعلم','نصائح']),
  ('كيف تتعاملين مع الطفل الخجول في القسم؟', 'إرشادات تربوية للمربية حول كيفية التعامل مع الطفل الخجول وتشجيعه على الانخراط في الأنشطة.', '', (SELECT id FROM categories WHERE slug='tips'), 'https://images.pexels.com/photos/8612871/pexels-photo-8612871.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', '2025-11-07', 'المربية نور', 5, 1560, false, ARRAY['طفل','خجل','إرشادات'])
ON CONFLICT DO NOTHING;

-- ---------- seed: hero_slides ----------
INSERT INTO hero_slides (title, excerpt, category, category_slug, image, date, badge, badge_color, sort_order) VALUES
  ('مباريات التعليم الأولي 2026 – فتح باب الترشح', 'أعلنت وزارة التربية الوطنية عن فتح باب الترشح لمباريات التعليم الأولي للموسم الدراسي 2026-2027، وذلك ابتداء من الخامس عشر من يناير.', 'مباريات التعليم الأولي', 'competitions', 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', '2026-01-15', 'عاجل', 'bg-red-500', 1),
  ('برنامج الارتقاء بالتعليم الأولي على الصعيد الوطني 2025–2030', 'تطلق وزارة التربية الوطنية برنامجاً شاملاً للارتقاء بجودة التعليم الأولي العمومي وتوسيع شبكته عبر المملكة المغربية.', 'أخبار ومستجدات', 'news', 'https://images.pexels.com/photos/8613103/pexels-photo-8613103.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', '2025-12-10', 'مستجد', 'bg-primary-700', 2),
  ('الدليل البيداغوجي الجديد للتعليم الأولي – إصدار 2026', 'صدر الدليل البيداغوجي المحدّث للتعليم الأولي متضمناً أحدث التوجيهات التربوية والمقاربات الحديثة في تعليم الأطفال.', 'أخبار ومستجدات', 'news', 'https://images.pexels.com/photos/8613164/pexels-photo-8613164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', '2025-11-20', 'جديد', 'bg-green-600', 3),
  ('نتائج مباريات التوظيف في التعليم الأولي – الموسم 2025', 'أعلنت الأكاديميات الجهوية للتربية والتكوين عن نتائج مباريات توظيف مربيات التعليم الأولي للموسم 2024-2025.', 'مباريات التعليم الأولي', 'competitions', 'https://images.pexels.com/photos/8613325/pexels-photo-8613325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', '2025-10-05', 'نتائج', 'bg-amber-500', 4)
ON CONFLICT DO NOTHING;

-- ---------- seed: news_ticker_items ----------
INSERT INTO news_ticker_items (text, sort_order) VALUES
  ('فتح باب الترشح لمباريات التعليم الأولي 2026 ابتداء من 15 يناير', 1),
  ('إصدار الدليل البيداغوجي الجديد للتعليم الأولي', 2),
  ('الإعلان عن نتائج مباريات التوظيف في التعليم الأولي – الموسم 2025', 3),
  ('تنظيم ملتقى وطني حول جودة التعليم الأولي بالرباط', 4),
  ('توزيع المناهج الدراسية الجديدة على أقسام التعليم الأولي العمومي', 5)
ON CONFLICT DO NOTHING;

-- ---------- seed: pages ----------
INSERT INTO pages (title, slug, content) VALUES
  ('من نحن', 'about', 'منصة التعليم الأولي بالمغرب — فضاء تربوي لتجمع المربيات والأطر التربوية ومستجدات التعليم الأولي.'),
  ('سياسة الخصوصية', 'privacy', 'نلتزم بحماية بيانات زوارنا وعدم مشاركتها مع أي طرف ثالث.'),
  ('شروط الاستخدام', 'terms', 'باستخدامك لهذا الموقع فإنك توافق على شروط الاستخدام المحددة هنا.')
ON CONFLICT (slug) DO NOTHING;

-- ---------- seed: site_settings ----------
INSERT INTO site_settings (id, about_text) VALUES (1, 'منصة "Préscolaire Maroc" فضاء تربوي وطني يجمع مربيات وأطر التعليم الأولي بالمغرب، ويوفر أخباراً ومستجدات وموارد بيداغوجية متجددة.')
ON CONFLICT (id) DO UPDATE SET about_text = EXCLUDED.about_text;
