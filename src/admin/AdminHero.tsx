import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSiteData } from '@/lib/SiteDataContext';
import { HeroSlide } from '@/lib/types';
import {
  AdminCard, AdminHeader, AdminField, AdminTextarea, AdminSelect, AdminButton, EmptyState, SaveBar,
} from './ui';
import { Plus, Pencil, Trash2, ArrowRight, Image, ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  editingId: number | null;
  onEdit: (id: number | null) => void;
}

const BADGE_COLORS = [
  { label: 'أحمر (عاجل)', value: 'bg-red-500' },
  { label: 'أساسي', value: 'bg-primary-700' },
  { label: 'أخضر (جديد)', value: 'bg-green-600' },
  { label: 'كهرماني (نتائج)', value: 'bg-amber-500' },
  { label: 'وردي', value: 'bg-pink-500' },
];

export default function AdminHero({ editingId, onEdit }: Props) {
  const { heroSlides, categories, refresh } = useSiteData();
  const [saving, setSaving] = useState(false);

  const move = async (slide: HeroSlide, dir: -1 | 1) => {
    const sorted = [...heroSlides].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex(s => s.id === slide.id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from('hero_slides').update({ sort_order: swap.sort_order }).eq('id', slide.id),
      supabase.from('hero_slides').update({ sort_order: slide.sort_order }).eq('id', swap.id),
    ]);
    refresh();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشريحة؟')) return;
    const { error } = await supabase.from('hero_slides').delete().eq('id', id);
    if (error) { alert('فشل الحذف: ' + error.message); return; }
    refresh();
  };

  if (editingId !== null) {
    const editing = editingId !== 0 ? heroSlides.find(s => s.id === editingId) : null;
    return (
      <HeroEditor
        slide={editing || null}
        categories={categories}
        saving={saving}
        setSaving={setSaving}
        onDone={() => { refresh(); onEdit(null); }}
        onCancel={() => onEdit(null)}
      />
    );
  }

  const sorted = [...heroSlides].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <AdminHeader
        title="الشرائح الرئيسية"
        desc="السلايدر العلوي في الصفحة الرئيسية"
        action={<AdminButton onClick={() => onEdit(0)}><span className="flex items-center gap-2"><Plus size={16} /> شريحة جديدة</span></AdminButton>}
      />

      {sorted.length === 0 ? (
        <AdminCard className="p-6"><EmptyState icon={<Image size={40} />} text="لا توجد شرائح بعد." /></AdminCard>
      ) : (
        <div className="space-y-3">
          {sorted.map((s, i) => (
            <AdminCard key={s.id} className="p-4">
              <div className="flex items-center gap-4">
                <img src={s.image} alt="" className="w-20 h-14 rounded-lg object-cover flex-shrink-0" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`tag text-white ${s.badge_color}`}>{s.badge}</span>
                    <span className="text-xs text-neutral-400">#{s.sort_order}</span>
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">{s.title}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">{s.excerpt}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => move(s, -1)} disabled={i === 0} className="w-7 h-7 rounded flex items-center justify-center text-neutral-500 hover:bg-neutral-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors" aria-label="أعلى">
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => move(s, 1)} disabled={i === sorted.length - 1} className="w-7 h-7 rounded flex items-center justify-center text-neutral-500 hover:bg-neutral-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors" aria-label="أسفل">
                    <ArrowDown size={14} />
                  </button>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => onEdit(s.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-gray-600 transition-colors" aria-label="تعديل">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" aria-label="حذف">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}

function HeroEditor({ slide, categories, saving, setSaving, onDone, onCancel }: {
  slide: HeroSlide | null;
  categories: ReturnType<typeof useSiteData>['categories'];
  saving: boolean;
  setSaving: (v: boolean) => void;
  onDone: () => void;
  onCancel: () => void;
}) {
  const isNew = slide === null;
  const [title, setTitle] = useState(slide?.title || '');
  const [excerpt, setExcerpt] = useState(slide?.excerpt || '');
  const [category, setCategory] = useState(slide?.category || (categories[0]?.name || ''));
  const [categorySlug, setCategorySlug] = useState(slide?.category_slug || (categories[0]?.slug || ''));
  const [image, setImage] = useState(slide?.image || '');
  const [date, setDate] = useState(slide?.date || new Date().toISOString().slice(0, 10));
  const [badge, setBadge] = useState(slide?.badge || 'جديد');
  const [badgeColor, setBadgeColor] = useState(slide?.badge_color || 'bg-primary-700');
  const [sortOrder, setSortOrder] = useState(String(slide?.sort_order ?? 1));

  const onCategoryChange = (slug: string) => {
    setCategorySlug(slug);
    const cat = categories.find(c => c.slug === slug);
    if (cat) setCategory(cat.name);
  };

  const save = async () => {
    if (!title.trim() || !excerpt.trim()) { alert('العنوان والملخص مطلوبان'); return; }
    setSaving(true);
    const payload = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      category,
      category_slug: categorySlug,
      image: image || 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      date,
      badge: badge.trim(),
      badge_color: badgeColor,
      sort_order: Number(sortOrder) || 1,
    };
    let error;
    if (isNew) {
      ({ error } = await supabase.from('hero_slides').insert(payload));
    } else {
      ({ error } = await supabase.from('hero_slides').update(payload).eq('id', slide!.id));
    }
    setSaving(false);
    if (error) { alert('فشل الحفظ: ' + error.message); return; }
    onDone();
  };

  return (
    <div>
      <AdminHeader
        title={isNew ? 'شريحة جديدة' : 'تعديل الشريحة'}
        action={<AdminButton variant="ghost" onClick={onCancel}><span className="flex items-center gap-2"><ArrowRight size={16} /> رجوع</span></AdminButton>}
      />
      <AdminCard className="p-5 space-y-4">
        <AdminField label="العنوان" value={title} onChange={setTitle} required />
        <AdminTextarea label="الملخص" value={excerpt} onChange={setExcerpt} required rows={3} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminSelect
            label="التصنيف المرتبط"
            value={categorySlug}
            onChange={onCategoryChange}
            options={categories.map(c => ({ value: c.slug, label: c.name }))}
          />
          <AdminField label="رابط الصورة" value={image} onChange={setImage} dir="ltr" placeholder="https://..." />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <AdminField label="التاريخ" type="date" value={date} onChange={setDate} />
          <AdminField label="نص الشارة" value={badge} onChange={setBadge} placeholder="عاجل / جديد..." />
          <AdminField label="ترتيب العرض" type="number" value={sortOrder} onChange={setSortOrder} />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">لون الشارة</label>
          <div className="flex flex-wrap gap-2">
            {BADGE_COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => setBadgeColor(c.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium text-white transition-all ${c.value} ${badgeColor === c.value ? 'ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-gray-800' : ''}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {image && (
          <div>
            <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">معاينة</span>
            <img src={image} alt="" className="w-full max-w-md h-32 rounded-lg object-cover border border-neutral-200 dark:border-gray-700" />
          </div>
        )}

        <SaveBar saving={saving} onSave={save} onCancel={onCancel} />
      </AdminCard>
    </div>
  );
}
