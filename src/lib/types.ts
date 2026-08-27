export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  sort_order: number;
}

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category_id: number | null;
  image: string;
  date: string;
  author: string;
  read_time: number;
  views: number;
  featured: boolean;
  tags: string[];
  download_url?: string | null;
}

export interface PostWithCategory extends Post {
  category?: Category | null;
}

export interface HeroSlide {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  category_slug: string;
  image: string;
  date: string;
  badge: string;
  badge_color: string;
  sort_order: number;
}

export interface NewsTickerItem {
  id: number;
  text: string;
  sort_order: number;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
}

export interface AdSlot {
  id: number;
  slot_key: string;
  adsense_slot: string;
  enabled: boolean;
  fallback_text: string;
}

export interface FooterLink {
  id: number;
  label: string;
  url: string;
  sort_order: number;
}

export interface SiteSettings {
  id: number;
  site_title: string;
  site_tagline: string;
  logo_letter: string;
  logo_image: string;
  about_title: string;
  about_text: string;
  social_facebook: string;
  social_twitter: string;
  social_youtube: string;
  social_instagram: string;
  social_telegram: string;
  contact_email: string;
  contact_phone: string;
  primary_color: string;
  secondary_color: string;
  adsense_client: string;
  // granular element colors
  topbar_bg: string;
  topbar_text: string;
  header_bg: string;
  header_text: string;
  nav_link_color: string;
  nav_link_hover: string;
  ticker_bg: string;
  ticker_text: string;
  footer_bg: string;
  footer_text: string;
  card_bg: string;
  card_border: string;
  heading_color: string;
  body_text_color: string;
  link_color: string;
  button_bg: string;
  button_text: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  site_title: 'Préscolaire Maroc',
  site_tagline: 'التعليم الأولي بالمغرب',
  logo_letter: 'P',
  logo_image: '',
  about_title: 'من نحن',
  about_text: 'منصة "Préscolaire Maroc" فضاء تربوي وطني يجمع مربيات وأطر التعليم الأولي بالمغرب، ويوفر أخباراً ومستجدات وموارد بيداغوجية متجددة.',
  social_facebook: '',
  social_twitter: '',
  social_youtube: '',
  social_instagram: '',
  social_telegram: '',
  contact_email: '',
  contact_phone: '',
  primary_color: '#1e3a6e',
  secondary_color: '#e41a98',
  adsense_client: '',
  topbar_bg: '#1e3a6e',
  topbar_text: '#ffffff',
  header_bg: '#ffffff',
  header_text: '#0f172a',
  nav_link_color: '#334155',
  nav_link_hover: '#1e3a6e',
  ticker_bg: '#e41a98',
  ticker_text: '#ffffff',
  footer_bg: '#1e3a6e',
  footer_text: '#ffffff',
  card_bg: '#ffffff',
  card_border: '#e5e7eb',
  heading_color: '#111827',
  body_text_color: '#3f3f46',
  link_color: '#1e3a6e',
  button_bg: '#1e3a6e',
  button_text: '#ffffff',
};

// Map of granular color keys → CSS custom property name injected on :root
export const COLOR_TOKENS: { key: keyof SiteSettings; cssVar: string; label: string; group: string }[] = [
  { key: 'topbar_bg',       cssVar: '--c-topbar-bg',       label: 'خلفية الشريط العلوي',     group: 'الشريط العلوي' },
  { key: 'topbar_text',     cssVar: '--c-topbar-text',     label: 'نص الشريط العلوي',         group: 'الشريط العلوي' },
  { key: 'header_bg',       cssVar: '--c-header-bg',       label: 'خلفية الترويسة',           group: 'الترويسة' },
  { key: 'header_text',     cssVar: '--c-header-text',     label: 'نص الترويسة',              group: 'الترويسة' },
  { key: 'nav_link_color',  cssVar: '--c-nav-link',        label: 'لون روابط القائمة',        group: 'الترويسة' },
  { key: 'nav_link_hover',  cssVar: '--c-nav-link-hover',  label: 'لون روابط القائمة عند المرور', group: 'الترويسة' },
  { key: 'ticker_bg',       cssVar: '--c-ticker-bg',       label: 'خلفية الشريط الإخباري',    group: 'الشريط الإخباري' },
  { key: 'ticker_text',     cssVar: '--c-ticker-text',     label: 'نص الشريط الإخباري',      group: 'الشريط الإخباري' },
  { key: 'footer_bg',       cssVar: '--c-footer-bg',       label: 'خلفية التذييل',            group: 'التذييل' },
  { key: 'footer_text',     cssVar: '--c-footer-text',     label: 'نص التذييل',               group: 'التذييل' },
  { key: 'card_bg',         cssVar: '--c-card-bg',         label: 'خلفية البطاقات',           group: 'البطاقات والمحتوى' },
  { key: 'card_border',     cssVar: '--c-card-border',     label: 'حدود البطاقات',            group: 'البطاقات والمحتوى' },
  { key: 'heading_color',   cssVar: '--c-heading',         label: 'لون العناوين',             group: 'البطاقات والمحتوى' },
  { key: 'body_text_color', cssVar: '--c-body-text',       label: 'لون النص الأساسي',        group: 'البطاقات والمحتوى' },
  { key: 'link_color',      cssVar: '--c-link',            label: 'لون الروابط',              group: 'البطاقات والمحتوى' },
  { key: 'button_bg',       cssVar: '--c-button-bg',       label: 'خلفية الأزرار',            group: 'الأزرار' },
  { key: 'button_text',     cssVar: '--c-button-text',     label: 'نص الأزرار',               group: 'الأزرار' },
];
