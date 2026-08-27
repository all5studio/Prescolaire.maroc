import { useSiteData } from '@/lib/SiteDataContext';
import {
  Newspaper, Trophy, BookOpen, BookOpenCheck, Palette, Gamepad2,
  FileText, Video, FolderOpen, Lightbulb, ArrowLeft, type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Newspaper, Trophy, BookOpen, BookOpenCheck, Palette, Gamepad2,
  FileText, Video, FolderOpen, Lightbulb,
};

export default function CategoriesList() {
  const { categories, posts } = useSiteData();

  return (
    <div className="card p-5">
      <h3 className="font-bold text-base text-primary-700 dark:text-primary-300 mb-4 border-r-4 border-secondary-600 pr-3">
        الأقسام
      </h3>
      <ul className="space-y-1">
        {categories.map(cat => {
          const Icon = iconMap[cat.icon] || FileText;
          const count = posts.filter(p => p.category?.slug === cat.slug).length;
          return (
            <li key={cat.id}>
              <a
                href={`#cat-${cat.slug}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-700 dark:text-neutral-200 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.color}`}>
                  <Icon size={16} />
                </span>
                <span className="flex-1 font-medium">{cat.name}</span>
                <span className="text-xs text-neutral-400 bg-neutral-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{count}</span>
                <ArrowLeft size={14} className="text-neutral-300 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
