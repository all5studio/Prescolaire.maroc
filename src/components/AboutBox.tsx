import { useSiteData } from '@/lib/SiteDataContext';

export default function AboutBox() {
  const { settings, posts, categories } = useSiteData();

  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold text-xl shadow-md">
          {settings.logo_letter || 'P'}
        </div>
        <div>
          <h3 className="font-bold text-base text-primary-700 dark:text-primary-300">{settings.site_title}</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{settings.site_tagline}</p>
        </div>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
        {settings.about_text}
      </p>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-neutral-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="text-xl font-bold text-primary-700 dark:text-primary-300">+{posts.length}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">مورد</div>
        </div>
        <div className="bg-neutral-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="text-xl font-bold text-primary-700 dark:text-primary-300">+50k</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">زائر</div>
        </div>
        <div className="bg-neutral-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="text-xl font-bold text-primary-700 dark:text-primary-300">{categories.length}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">أقسام</div>
        </div>
      </div>
    </div>
  );
}
