import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Eye, Clock } from 'lucide-react';
import { useSiteData } from '@/lib/SiteDataContext';

export default function PostsSlider() {
  const { posts } = useSiteData();
  const recentSliderPosts = posts.slice(0, 8);
  const [offset, setOffset] = useState(0);
  const visibleCount = 4;
  const maxOffset = Math.max(0, recentSliderPosts.length - visibleCount);
  const trackRef = useRef<HTMLDivElement>(null);

  const prev = () => setOffset(o => Math.max(0, o - 1));
  const next = () => setOffset(o => Math.min(maxOffset, o + 1));

  if (recentSliderPosts.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title">أحدث المشاركات</h2>
        <div className="flex gap-2">
          <button
            onClick={prev}
            disabled={offset === 0}
            className="w-8 h-8 rounded-full border border-neutral-300 dark:border-gray-600 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-primary-700 hover:text-white hover:border-primary-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="السابق"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={next}
            disabled={offset >= maxOffset}
            className="w-8 h-8 rounded-full border border-neutral-300 dark:border-gray-600 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-primary-700 hover:text-white hover:border-primary-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="التالي"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={trackRef}>
        <div
          className="flex gap-4 transition-transform duration-500"
          style={{ transform: `translateX(${offset * (100 / visibleCount)}%)` }}
        >
          {recentSliderPosts.map(post => (
            <a
              key={post.id}
              href={`#/post/${post.id}`}
              className="card flex-none group block"
              style={{ width: `calc(${100 / visibleCount}% - 12px)`, minWidth: 200 }}
            >
              <div className="relative overflow-hidden" style={{ height: 150 }}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <span className="absolute top-2 right-2 tag bg-primary-700 text-white text-xs">
                  {post.category?.name || ''}
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 mb-2 leading-relaxed group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1"><Clock size={12} /> {post.read_time} د</span>
                  <span className="flex items-center gap-1"><Eye size={12} /> {post.views.toLocaleString('ar-MA')}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
