import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Clock, ArrowLeft } from 'lucide-react';
import { useSiteData } from '@/lib/SiteDataContext';

export default function FeaturedSection() {
  const { posts } = useSiteData();
  const featuredPosts = posts.filter(p => p.featured);
  const [idx, setIdx] = useState(0);
  const visible = 3;
  const maxIdx = Math.max(0, featuredPosts.length - visible);

  const prev = () => setIdx(i => Math.max(0, i - 1));
  const next = () => setIdx(i => Math.min(maxIdx, i + 1));

  if (featuredPosts.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title">المقالات المميزة</h2>
        <div className="flex gap-2">
          <button onClick={prev} disabled={idx === 0} className="w-8 h-8 rounded-full border border-neutral-300 dark:border-gray-600 flex items-center justify-center hover:bg-primary-700 hover:text-white hover:border-primary-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed" aria-label="السابق">
            <ChevronRight size={16} />
          </button>
          <button onClick={next} disabled={idx >= maxIdx} className="w-8 h-8 rounded-full border border-neutral-300 dark:border-gray-600 flex items-center justify-center hover:bg-primary-700 hover:text-white hover:border-primary-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed" aria-label="التالي">
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="flex gap-4 transition-transform duration-500" style={{ transform: `translateX(${idx * (100 / visible)}%)` }}>
          {featuredPosts.map(post => (
            <a key={post.id} href={`#/post/${post.id}`} className="card flex-none group block" style={{ width: `calc(${100 / visible}% - 11px)` }}>
              <div className="relative overflow-hidden" style={{ height: 200 }}>
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                <span className="absolute top-3 right-3 tag bg-secondary-600 text-white">مميز</span>
              </div>
              <div className="p-4">
                <span className="text-xs text-primary-700 dark:text-primary-300 font-semibold mb-2 block">{post.category?.name || ''}</span>
                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2 mb-2 leading-relaxed group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.read_time} د</span>
                    <span className="flex items-center gap-1"><Eye size={12} /> {post.views.toLocaleString('ar-MA')}</span>
                  </div>
                  <ArrowLeft size={16} className="text-primary-700 dark:text-primary-300 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
