import { useState, useEffect, useMemo } from 'react';
import { Search, X, FileText } from 'lucide-react';
import { useSiteData } from '@/lib/SiteDataContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
  const { posts } = useSiteData();
  const [q, setQ] = useState('');

  useEffect(() => {
    if (!open) setQ('');
  }, [open]);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const query = q.trim().toLowerCase();
    return posts.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.excerpt.toLowerCase().includes(query) ||
      (p.category?.name || '').toLowerCase().includes(query)
    ).slice(0, 6);
  }, [q, posts]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-2xl transition-transform duration-300 ${open ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-3xl mx-auto p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100">ابحث في الموقع</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-gray-700" aria-label="إغلاق">
              <X size={20} />
            </button>
          </div>
          <div className="relative mb-4">
            <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              autoFocus={open}
              type="search"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="ابحث عن مقال، مستند، نشاط تربوي..."
              className="w-full pr-11 pl-4 py-3 rounded-xl border border-neutral-300 dark:border-gray-600 bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>

          {q.trim() && (
            <div className="max-h-80 overflow-y-auto">
              {results.length > 0 ? (
                <ul className="space-y-2">
                  {results.map(p => (
                    <li key={p.id}>
                      <a href={`#/post/${p.id}`} onClick={onClose} className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-700 transition-colors">
                        <img src={p.image} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" loading="lazy" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">{p.title}</h4>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">{p.category?.name || ''}</p>
                        </div>
                        <FileText size={16} className="text-neutral-400 flex-shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 py-8">
                  لا توجد نتائج مطابقة لـ "{q}"
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
