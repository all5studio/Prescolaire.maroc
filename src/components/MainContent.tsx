import { useSiteData } from '@/lib/SiteDataContext';
import AdSlot from './AdSlot';
import HeroSlider from './HeroSlider';
import NewsTicker from './NewsTicker';
import PostsSlider from './PostsSlider';
import FeaturedSection from './FeaturedSection';
import CategorySection from './CategorySection';
import CategoriesList from './CategoriesList';
import AboutBox from './AboutBox';
import NewsletterBox from './NewsletterBox';
import SocialLinks from './SocialLinks';
import ScrollToTop from './ScrollToTop';

export default function MainContent() {
  const { categories } = useSiteData();

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <AdSlot variant="leaderboard" />

      <div className="mb-6">
        <NewsTicker />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-8">
          <HeroSlider />
        </div>
        <aside className="lg:col-span-4 space-y-5">
          <AboutBox />
          <AdSlot variant="rectangle" className="my-0" />
        </aside>
      </div>

      <PostsSlider />

      <AdSlot variant="in-article" />

      <FeaturedSection />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {categories.map(cat => (
            <CategorySection key={cat.id} categorySlug={cat.slug} />
          ))}
        </div>

        <aside className="lg:col-span-4 space-y-5">
          <CategoriesList />
          <NewsletterBox />
          <AdSlot variant="rectangle" className="my-0" />
          <SocialLinks />
          <AdSlot variant="skyscraper" className="my-0" />
        </aside>
      </div>

      <AdSlot variant="leaderboard" />
      <AdSlot variant="mobile" />

      <ScrollToTop />
    </main>
  );
}
