import { useSiteData } from '@/lib/SiteDataContext';
import { Radio } from 'lucide-react';

export default function NewsTicker() {
  const { newsTicker } = useSiteData();
  const items = newsTicker.length > 0 ? [...newsTicker, ...newsTicker] : [];

  if (items.length === 0) return null;

  return (
    <div className="py-2 overflow-hidden" style={{ backgroundColor: 'var(--c-ticker-bg)', color: 'var(--c-ticker-text)' }}>
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs font-bold bg-white/20 px-3 py-1 rounded-full flex-shrink-0">
          <Radio size={14} className="animate-pulse" /> عاجل
        </span>
        <div className="ticker-wrap flex-1">
          <div className="ticker-content">
            {items.map((item, i) => (
              <span key={i} className="inline-block text-sm mx-6">
                • {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
