import { useEffect } from 'react';
import { useSiteData } from '@/lib/SiteDataContext';
import { useHashRoute } from '@/lib/useHashRoute';
import AdSlot from './AdSlot';
import SocialLinks from './SocialLinks';
import ScrollToTop from './ScrollToTop';
import { Calendar, Eye, Clock, ArrowRight, User, Tag, Download } from 'lucide-react';
import type { PostWithCategory } from '@/lib/types';

interface Props {
  postId: number;
}

export default function PostDetail({ postId }: Props) {
  const { posts, categories } = useSiteData();
  const [, navigate] = useHashRoute();
  const post = posts.find(p => p.id === postId);

  useEffect(() => { window.scrollTo(0, 0); }, [postId]);

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">المقال غير موجود.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-primary-700 dark:text-primary-300 hover:underline">
          العودة للرئيسية
        </button>
      </main>
    );
  }

  const related = posts
    .filter(p => p.id !== post.id && p.category?.slug === post.category?.slug)
    .slice(0, 3);
  const cat = post.category || categories.find(c => c.id === post.category_id);

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors mb-6"
      >
        <ArrowRight size={16} /> العودة للرئيسية
      </button>

      {/* Header */}
      <div className="mb-6">
        {cat && (
          <a
            href={`#cat-${cat.slug}`}
            className={`tag ${cat.color} inline-block mb-4`}
          >
            {cat.name}
          </a>
        )}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4 text-neutral-900 dark:text-neutral-100">
          {post.title}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg leading-relaxed mb-4">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1.5"><User size={15} /> {post.author}</span>
          <span className="flex items-center gap-1.5"><Calendar size={15} /> {new Date(post.date).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="flex items-center gap-1.5"><Clock size={15} /> {post.read_time} دقائق قراءة</span>
          <span className="flex items-center gap-1.5"><Eye size={15} /> {post.views.toLocaleString('ar-MA')} مشاهدة</span>
        </div>
      </div>

      {/* Cover image */}
      <div className="rounded-2xl overflow-hidden shadow-lg mb-6" style={{ maxHeight: 480 }}>
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
      </div>

      <AdSlot variant="in-article" />

      {/* Content */}
      <article className="prose prose-lg max-w-none dark:prose-invert">
        {post.content ? (
          <div className="text-neutral-800 dark:text-neutral-200 leading-loose text-lg space-y-4 whitespace-pre-wrap">
            {post.content}
          </div>
        ) : (
          <div className="text-neutral-800 dark:text-neutral-200 leading-loose text-lg space-y-4">
            <p>{post.excerpt}</p>
            <p className="text-neutral-500 dark:text-neutral-400">
              المحتوى الكامل لهذا المقال لم يُضاف بعد. يمكنك إضافته من لوحة القيادة عبر تعديل المقال.
            </p>
          </div>
        )}
      </article>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-neutral-200 dark:border-gray-700">
          <Tag size={16} className="text-neutral-400" />
          {post.tags.map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-gray-700 text-sm text-neutral-600 dark:text-neutral-300">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Social share */}
      <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-gray-700">
        <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3">شارك المقال</h3>
        <SocialLinks compact />
      </div>

      {/* Download button */}
      {post.download_url && (
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/10 border border-primary-200 dark:border-primary-700/30 text-center">
          <h3 className="text-lg font-bold text-primary-800 dark:text-primary-200 mb-2">لتحميل هذا المحتوى</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">اضغط على الزر أدناه للانتقال إلى صفحة التحميل</p>
          <a
            href={`#/download/${post.id}`}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-bold text-base transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <Download size={20} />
            اضغط هنا للتحميل
          </a>
        </div>
      )}

      <AdSlot variant="leaderboard" />

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="section-title mb-5">مقالات ذات صلة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((rp: PostWithCategory) => (
              <a
                key={rp.id}
                href={`#/post/${rp.id}`}
                className="card group cursor-pointer"
              >
                <div className="relative overflow-hidden" style={{ height: 160 }}>
                  <img
                    src={rp.image}
                    alt={rp.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-relaxed group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                    {rp.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    <span className="flex items-center gap-1"><Clock size={11} /> {rp.read_time} د</span>
                    <span className="flex items-center gap-1"><Eye size={11} /> {rp.views.toLocaleString('ar-MA')}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <ScrollToTop />
    </main>
  );
}
