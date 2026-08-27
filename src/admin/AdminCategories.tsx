import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSiteData } from '@/lib/SiteDataContext';
import { Category } from '@/lib/types';
import {
  AdminCard, AdminHeader, AdminField, AdminButton, AdminToggle, EmptyState, SaveBar,
} from './ui';
import {
  Plus, Pencil, Trash2, ArrowRight, FolderTree,
  Newspaper, Trophy, BookOpen, BookOpenCheck, Palette, Gamepad2,
  FileText, Video, FolderOpen, Lightbulb, type LucideIcon,
} from 'lucide-react';

const ICON_OPTIONS = [
  'Newspaper', 'Trophy', 'BookOpen', 'BookOpenCheck', 'Palette', 'Gamepad2',
  'FileText', 'Video', 'FolderOpen', 'Lightbulb',
];

const COLOR_OPTIONS = [
  { label: 'أزرق', value: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { label: 'كهرماني', value: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  { label: 'أخضر', value: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  { label: 'تركوازي', value: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
  { label: 'وردي', value: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
  { label: 'بنفسجي', value: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  { label: 'برتقالي', value: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  { label: 'أحمر', value: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  { label: 'نيلي', value: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
  { label: 'أصفر', value: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
];

const iconMap: Record<string, LucideIcon> = {
  Newspaper, Trophy, BookOpen, BookOpenCheck, Palette, Gamepad2,
  FileText, Video, FolderOpen, Lightbulb,
};

interface Props {
  editingId: number | null;
  onEdit: (id: number | null) => void;
}

export default function AdminCategories({ editingId, onEdit }: Props) {
  const { categories, posts, refresh } = useSiteData();
  const [saving, setSaving] = useState(false);

  const handleDelete = async (id: number) => {
    const count = posts.filter(p => p.category_id === id).length;
    if (count > 0) { alert(`لا يمكن حذف هذا التصنيف لأنه يحتوي على ${count} مقال. انقل المقالات أولاً.`); return; }
    if (!confirm('هل أنت متأكد من حذف هذا التصنيف؟')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { alert('فشل الحذف: ' + error.message); return; }
    refresh();
  };

  if (editingId !== null) {
    const editing = editingId !== 0 ? categories.find(c => c.id === editingId) : null;
    return (
      <CategoryEditor
        category={editing || null}
        saving={saving}
        setSaving={setSaving}
        onDone={() => { refresh(); onEdit(null); }}
        onCancel={() => onEdit(null)}
      />
    );
  }

  return (
    <div>
      <AdminHeader
        title="التصنيفات"
        desc="إدارة أقسام الموقع"
        action={<AdminButton onClick={() => onEdit(0)}><span className="flex items-center gap-2"><Plus size={16} /> تصنيف جديد</span></AdminButton>}
      />

      {categories.length === 0 ? (
        <AdminCard className="p-6"><EmptyState icon={<FolderTree size={40} />} text="لا توجد تصنيفات بعد." /></AdminCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => {
            const Icon = iconMap[cat.icon] || FileText;
            const count = posts.filter(p => p.category_id === cat.id).length;
            return (
              <AdminCard key={cat.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cat.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => onEdit(cat.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-gray-600 transition-colors" aria-label="تعديل">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" aria-label="حذف">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">{cat.name}</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">/{cat.slug} · {count} مقال</p>
              </AdminCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CategoryEditor({ category, saving, setSaving, onDone, onCancel }: {
  category: Category | null;
  saving: boolean;
  setSaving: (v: boolean) => void;
  onDone: () => void;
  onCancel: () => void;
}) {
  const isNew = category === null;
  const [name, setName] = useState(category?.name || '');
  const [slug, setSlug] = useState(category?.slug || '');
  const [icon, setIcon] = useState(category?.icon || 'FileText');
  const [color, setColor] = useState(category?.color || COLOR_OPTIONS[0].value);
  const [sortOrder, setSortOrder] = useState(String(category?.sort_order ?? 0));

  const save = async () => {
    if (!name.trim() || !slug.trim()) { alert('الاسم والرابط مطلوبان'); return; }
    setSaving(true);
    const payload = {
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      icon,
      color,
      sort_order: Number(sortOrder) || 0,
    };
    let error;
    if (isNew) {
      ({ error } = await supabase.from('categories').insert(payload));
    } else {
      ({ error } = await supabase.from('categories').update(payload).eq('id', category!.id));
    }
    setSaving(false);
    if (error) { alert('فشل الحفظ: ' + error.message); return; }
    onDone();
  };

  return (
    <div>
      <AdminHeader
        title={isNew ? 'تصنيف جديد' : 'تعديل التصنيف'}
        action={<AdminButton variant="ghost" onClick={onCancel}><span className="flex items-center gap-2"><ArrowRight size={16} /> رجوع</span></AdminButton>}
      />
      <AdminCard className="p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminField label="اسم التصنيف" value={name} onChange={setName} placeholder="مثال: أخبار ومستجدات" required />
          <AdminField label="الرابط (slug)" value={slug} onChange={setSlug} placeholder="news" required dir="ltr" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">الأيقونة</label>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {ICON_OPTIONS.map(ic => {
              const Icon = iconMap[ic] || FileText;
              const active = icon === ic;
              return (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${active ? 'bg-primary-700 text-white shadow-md scale-105' : 'bg-neutral-100 dark:bg-gray-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-gray-600'}`}
                  aria-label={ic}
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">اللون</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {COLOR_OPTIONS.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${c.value} ${color === c.value ? 'border-primary-700 dark:border-primary-400 ring-2 ring-primary-300' : 'border-transparent'}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <AdminField label="ترتيب العرض" type="number" value={sortOrder} onChange={setSortOrder} />

        <SaveBar saving={saving} onSave={save} onCancel={onCancel} />
      </AdminCard>
    </div>
  );
}
