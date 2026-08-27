import { useSiteData } from '@/lib/SiteDataContext';
import { AdminCard, AdminHeader } from './ui';
import { FileText, FolderTree, Image, Radio, FileCode, Eye, TrendingUp } from 'lucide-react';

interface Props {
  onNavigate: (key: string) => void;
}

export default function AdminDashboard({ onNavigate }: Props) {
  const { posts, categories, heroSlides, newsTicker, pages } = useSiteData();

  const stats = [
    { label: 'المقالات', count: posts.length, icon: FileText, key: 'posts', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    { label: 'التصنيفات', count: categories.length, icon: FolderTree, key: 'categories', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
    { label: 'الشرائح الرئيسية', count: heroSlides.length, icon: Image, key: 'hero', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    { label: 'أخبار الشريط', count: newsTicker.length, icon: Radio, key: 'ticker', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
    { label: 'الصفحات', count: pages.length, icon: FileCode, key: 'pages', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
  ];

  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
  const featuredCount = posts.filter(p => p.featured).length;

  return (
    <div>
      <AdminHeader title="لوحة القيادة" desc="نظرة عامة على محتوى موقعك" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <button
              key={s.key}
              onClick={() => onNavigate(s.key)}
              className="text-right"
            >
              <AdminCard className="p-4 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                  <Icon size={20} />
                </div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{s.count}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{s.label}</div>
              </AdminCard>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <AdminCard className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex items-center justify-center">
              <Eye size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalViews.toLocaleString('ar-MA')}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">إجمالي المشاهدات</div>
            </div>
          </div>
        </AdminCard>
        <AdminCard className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{featuredCount}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">مقالات مميزة</div>
            </div>
          </div>
        </AdminCard>
      </div>

      <AdminHeader title="آخر المقالات" />
      <AdminCard className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-gray-700/50 text-neutral-500 dark:text-neutral-400 text-xs">
            <tr>
              <th className="text-right p-3 font-medium">العنوان</th>
              <th className="text-right p-3 font-medium hidden sm:table-cell">التصنيف</th>
              <th className="text-right p-3 font-medium">التاريخ</th>
              <th className="text-right p-3 font-medium">المشاهدات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-gray-700">
            {posts.slice(0, 6).map(p => (
              <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-gray-700/50">
                <td className="p-3 font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1">{p.title}</td>
                <td className="p-3 text-neutral-600 dark:text-neutral-400 hidden sm:table-cell">{p.category?.name || '—'}</td>
                <td className="p-3 text-neutral-500 dark:text-neutral-400 text-xs">{new Date(p.date).toLocaleDateString('ar-MA')}</td>
                <td className="p-3 text-neutral-600 dark:text-neutral-300">{(p.views || 0).toLocaleString('ar-MA')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </div>
  );
}
