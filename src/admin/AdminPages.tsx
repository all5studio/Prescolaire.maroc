import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSiteData } from '@/lib/SiteDataContext';
import { Page } from '@/lib/types';
import {
  AdminCard, AdminHeader, AdminField, AdminTextarea, AdminButton, EmptyState, SaveBar,
} from './ui';
import { Plus, Pencil, Trash2, ArrowRight, FileCode } from 'lucide-react';

interface Props {
  editingId: number | null;
  onEdit: (id: number | null) => void;
}

export default function AdminPages({ editingId, onEdit }: Props) {
  const { pages, refresh } = useSiteData();
  const [saving, setSaving] = useState(false);

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟')) return;
    const { error } = await supabase.from('pages').delete().eq('id', id);
    if (error) { alert('فشل الحذف: ' + error.message); return; }
    refresh();
  };

  if (editingId !== null) {
    const editing = editingId !== 0 ? pages.find(p => p.id === editingId) : null;
    return (
      <PageEditor
        page={editing || null}
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
        title="الصفحات"
        desc="الصفحات الثابتة مثل: من نحن، سياسة الخصوصية، شروط الاستخدام"
        action={<AdminButton onClick={() => onEdit(0)}><span className="flex items-center gap-2"><Plus size={16} /> صفحة جديدة</span></AdminButton>}
      />

      {pages.length === 0 ? (
        <AdminCard className="p-6"><EmptyState icon={<FileCode size={40} />} text="لا توجد صفحات بعد." /></AdminCard>
      ) : (
        <AdminCard className="overflow-hidden">
          <div className="divide-y divide-neutral-100 dark:divide-gray-700">
            {pages.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-gray-700/50">
                <div className="min-w-0">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{p.title}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">/{p.slug}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => onEdit(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-gray-600 transition-colors" aria-label="تعديل">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" aria-label="حذف">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}
    </div>
  );
}

function PageEditor({ page, saving, setSaving, onDone, onCancel }: {
  page: Page | null;
  saving: boolean;
  setSaving: (v: boolean) => void;
  onDone: () => void;
  onCancel: () => void;
}) {
  const isNew = page === null;
  const [title, setTitle] = useState(page?.title || '');
  const [slug, setSlug] = useState(page?.slug || '');
  const [content, setContent] = useState(page?.content || '');

  const save = async () => {
    if (!title.trim() || !slug.trim()) { alert('العنوان والرابط مطلوبان'); return; }
    setSaving(true);
    const payload = {
      title: title.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      content,
    };
    let error;
    if (isNew) {
      ({ error } = await supabase.from('pages').insert(payload));
    } else {
      ({ error } = await supabase.from('pages').update(payload).eq('id', page!.id));
    }
    setSaving(false);
    if (error) { alert('فشل الحفظ: ' + error.message); return; }
    onDone();
  };

  return (
    <div>
      <AdminHeader
        title={isNew ? 'صفحة جديدة' : 'تعديل الصفحة'}
        action={<AdminButton variant="ghost" onClick={onCancel}><span className="flex items-center gap-2"><ArrowRight size={16} /> رجوع</span></AdminButton>}
      />
      <AdminCard className="p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminField label="عنوان الصفحة" value={title} onChange={setTitle} required />
          <AdminField label="الرابط (slug)" value={slug} onChange={setSlug} required dir="ltr" placeholder="about" />
        </div>
        <AdminTextarea label="المحتوى" value={content} onChange={setContent} rows={12} placeholder="محتوى الصفحة..." />
        <SaveBar saving={saving} onSave={save} onCancel={onCancel} />
      </AdminCard>
    </div>
  );
}
