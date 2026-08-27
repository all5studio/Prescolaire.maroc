import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Category, Post, PostWithCategory, HeroSlide, NewsTickerItem, Page, SiteSettings,
  AdSlot, FooterLink, DEFAULT_SETTINGS,
} from '@/lib/types';

interface SiteData {
  categories: Category[];
  posts: PostWithCategory[];
  heroSlides: HeroSlide[];
  newsTicker: NewsTickerItem[];
  pages: Page[];
  adSlots: AdSlot[];
  footerLinks: FooterLink[];
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const SiteDataContext = createContext<SiteData | null>(null);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<PostWithCategory[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [newsTicker, setNewsTicker] = useState<NewsTickerItem[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => setReloadKey(k => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [cats, psts, hero, ticker, pgs, ads, flinks, stg] = await Promise.all([
          supabase.from('categories').select('*').order('sort_order', { ascending: true }),
          supabase.from('posts').select('*, category:categories(*)').order('date', { ascending: false }),
          supabase.from('hero_slides').select('*').order('sort_order', { ascending: true }),
          supabase.from('news_ticker_items').select('*').order('sort_order', { ascending: true }),
          supabase.from('pages').select('*').order('title', { ascending: true }),
          supabase.from('ad_slots').select('*').order('slot_key', { ascending: true }),
          supabase.from('footer_links').select('*').order('sort_order', { ascending: true }),
          supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
        ]);

        if (cats.error) throw cats.error;
        if (psts.error) throw psts.error;
        if (hero.error) throw hero.error;
        if (ticker.error) throw ticker.error;
        if (pgs.error) throw pgs.error;
        if (ads.error) throw ads.error;
        if (flinks.error) throw flinks.error;
        if (stg.error) throw stg.error;

        if (cancelled) return;

        setCategories((cats.data as Category[]) || []);
        setPosts((psts.data as PostWithCategory[]) || []);
        setHeroSlides((hero.data as HeroSlide[]) || []);
        setNewsTicker((ticker.data as NewsTickerItem[]) || []);
        setPages((pgs.data as Page[]) || []);
        setAdSlots((ads.data as AdSlot[]) || []);
        setFooterLinks((flinks.data as FooterLink[]) || []);
        setSettings(stg.data ? (stg.data as SiteSettings) : DEFAULT_SETTINGS);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'فشل تحميل البيانات');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [reloadKey]);

  return (
    <SiteDataContext.Provider value={{
      categories, posts, heroSlides, newsTicker, pages, adSlots, footerLinks, settings,
      loading, error, refresh,
    }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error('useSiteData must be used within SiteDataProvider');
  return ctx;
}

// Helper: posts filtered by category slug
export function usePostsByCategory(slug: string): PostWithCategory[] {
  const { posts } = useSiteData();
  return posts.filter(p => p.category?.slug === slug || (p as unknown as { category_slug?: string }).category_slug === slug);
}

// Helper: featured posts
export function useFeaturedPosts(): PostWithCategory[] {
  const { posts } = useSiteData();
  return posts.filter(p => p.featured);
}

// Helper: recent posts (first N)
export function useRecentPosts(n = 8): PostWithCategory[] {
  const { posts } = useSiteData();
  return posts.slice(0, n);
}

// Re-export Post for convenience
export type { Post };
