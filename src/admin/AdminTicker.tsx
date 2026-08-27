import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSiteData } from '@/lib/SiteDataContext';
import { AdminCard, AdminHeader, AdminField, AdminButton, EmptyState } from './ui';
import { Plus, Trash2, Radio, ArrowUp, ArrowDown, Save } from 'lucide-react';

export default function AdminTicker() {
  const { newsTicker, refresh } = useSiteData();
  const [items, setItems] = useState(newsTicker.map(t => ({ ...t })));
  const [newText, setNewText] = useState('');
  const [saving, setSaving] = useState(false);

  const addItem = () => {
    if (!newText.trim()) return;
    setItems(prev => [...prev, { id: 0, text: newText.trim(), sort_order: prev.length + 1 }]);
    setNewText('');
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...items];
    const swap = next[idx + dir];
    if (!swap) return;
    [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
    setItems(next);
  };

  const saveAll = async () => {
    setSaving(true);
    // Replace all: delete existing, insert new
    await supabase.from('news_ticker_items').delete().neq('id', 0);
    if (items.length > 0) {
      const payload = items.map((it, i) => ({ text: it.text, sort_order: i + 1 }));
      const { error } = await supabase.from('news_ticker_items').insert(payload);
      if (error) { alert('فشل الحفظ: ' + error.message); setSaving(false); return; }
    }
    setSaving(false);
    refresh();
    alert('تم حفظ الشريط الإخباري');
  };

  return (
    <div>
      <AdminHeader
        title="الشريط الإخباري"
        desc="الأخبار العاجلة التي تظهر في الشريط المتحرك أعلى الصفحة"
        action={
          <AdminButton onClick={saveAll} disabled={saving}>
            <span className="flex items-center gap-2"><Save size={16} /> {saving ? 'جاري الحفظ...' : 'حفظ الكل'}</span>
          </AdminButton>
        }
      />

      <AdminCard className="p-4 mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addItem(); }}
            placeholder="أضف خبراً جديداً للشريط..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
          <AdminButton onClick={addItem}><span className="flex items-center gap-2"><Plus size={16} /> إضافة</span></AdminButton>
        </div>
      </AdminCard>

      {items.length === 0 ? (
        <AdminCard className="p-6"><EmptyState icon={<Radio size={40} />} text="لا توجد أخبار في الشريط." /></AdminCard>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <AdminCard key={item.id + '-' + i} className="p-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="w-6 h-6 rounded flex items-center justify-center text-neutral-500 hover:bg-neutral-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors" aria-label="أعلى">
                    <ArrowUp size={12} />
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="w-6 h-6 rounded flex items-center justify-center text-neutral-500 hover:bg-neutral-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors" aria-label="أسفل">
                    <ArrowDown size={12} />
                  </button>
                </div>
                <span className="text-xs text-neutral-400 w-6">#{i + 1}</span>
                <span className="flex-1 text-sm text-neutral-800 dark:text-neutral-200">{item.text}</span>
                <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" aria-label="حذف">
                  <Trash2 size={15} />
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
