import { useSiteData } from '@/lib/SiteDataContext';
import { Calendar, Eye, ArrowLeft } from 'lucide-react';

interface Props {
  categorySlug: string;
}

export default function CategorySection({ categorySlug }: Props) {
  const { categories, posts } = useSiteData();
  const category = categories.find(c => c.slug === categorySlug);
  const sectionPosts = posts.filter(p => p.category?.slug === categorySlug);

  if (!category || sectionPosts.length === 0) return null;
  const [first, ...rest] = sectionPosts;

  return (
    <section id={`cat-${category.slug}`} className="mb-10 scroll-mt-20">
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title">{category.name}</h2>
        <a href="#" className="text-sm text-primary-700 dark:text-primary-300 hover:underline flex items-center gap-1">
          عرض الكل <ArrowLeft size={14} />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Large first card */}
        <a href={`#/post/${first.id}`} className="card md:col-span-2 group cursor-pointer block">
          <div className="md:flex">
            <div className="relative overflow-hidden md:w-1/2" style={{ minHeight: 220 }}>
              <img src={first.image} alt={first.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" style={{ height: '100%', minHeight: 220 }} />
            </div>
            <div className="p-5 md:w-1/2 flex flex-col justify-center">
              <span className={`tag ${category.color} self-start mb-3`}>{category.name}</span>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-2 leading-relaxed group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                {first.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-4">{first.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mt-auto">
                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(first.date).toLocaleDateString('ar-MA')}</span>
                <span className="flex items-center gap-1"><Eye size={12} /> {first.views.toLocaleString('ar-MA')}</span>
              </div>
            </div>
          </div>
        </a>

        {/* Small cards */}
        <div className="flex flex-col gap-4">
          {rest.slice(0, 2).map(post => (
            <a key={post.id} href={`#/post/${post.id}`} className="card group cursor-pointer flex">
              <div className="relative overflow-hidden flex-shrink-0" style={{ width: 120 }}>
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" style={{ height: '100%' }} />
              </div>
              <div className="p-3 flex-1 flex flex-col justify-center">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 mb-2 leading-relaxed group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(post.date).toLocaleDateString('ar-MA')}</span>
                  <span className="flex items-center gap-1"><Eye size={11} /> {post.views.toLocaleString('ar-MA')}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
