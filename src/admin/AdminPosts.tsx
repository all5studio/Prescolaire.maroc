import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSiteData } from '@/lib/SiteDataContext';
import { Post } from '@/lib/types';
import {
  AdminCard, AdminHeader, AdminField, AdminTextarea, AdminSelect, AdminButton, AdminToggle, EmptyState, SaveBar,
} from './ui';
import { Plus, Pencil, Trash2, Eye, Star, ArrowRight, FileText } from 'lucide-react';

interface Props {
  editingId: number | null;
  onEdit: (id: number | null) => void;
}

export default function AdminPosts({ editingId, onEdit }: Props) {
  const { posts, categories, refresh } = useSiteData();
  const [saving, setSaving] = useState(false);

  const editing = editingId !== null ? posts.find(p => p.id === editingId) : null;

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) { alert('فشل الحذف: ' + error.message); return; }
    refresh();
  };

  // Editor view
  if (editingId !== null) {
    return (
      <PostEditor
        post={editing || null}
        categories={categories}
        saving={saving}
        setSaving={setSaving}
        onDone={() => { refresh(); onEdit(null); }}
        onCancel={() => onEdit(null)}
      />
    );
  }

  // List view
  return (
    <div>
      <AdminHeader
        title="المقالات"
        desc="إدارة مقالات وموارد الموقع"
        action={
          <AdminButton onClick={() => onEdit(0)}>
            <span className="flex items-center gap-2"><Plus size={16} /> مقال جديد</span>
          </AdminButton>
        }
      />

      {posts.length === 0 ? (
        <AdminCard className="p-6">
          <EmptyState icon={<FileText size={40} />} text="لا توجد مقالات بعد. ابدأ بإضافة أول مقال." />
        </AdminCard>
      ) : (
        <AdminCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-gray-700/50 text-neutral-500 dark:text-neutral-400 text-xs">
                <tr>
                  <th className="text-right p-3 font-medium">المقال</th>
                  <th className="text-right p-3 font-medium hidden md:table-cell">التصنيف</th>
                  <th className="text-right p-3 font-medium hidden sm:table-cell">التاريخ</th>
                  <th className="text-right p-3 font-medium">المشاهدات</th>
                  <th className="text-right p-3 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-gray-700">
                {posts.map(p => (
                  <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-gray-700/50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" loading="lazy" />
                        <div className="min-w-0">
                          <div className="font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1 flex items-center gap-1.5">
                            {p.featured && <Star size={14} className="text-secondary-500 fill-current flex-shrink-0" />}
                            {p.title}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">{p.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-neutral-600 dark:text-neutral-400 hidden md:table-cell">{p.category?.name || '—'}</td>
                    <td className="p-3 text-neutral-500 dark:text-neutral-400 text-xs hidden sm:table-cell">{new Date(p.date).toLocaleDateString('ar-MA')}</td>
                    <td className="p-3 text-neutral-600 dark:text-neutral-300">{(p.views || 0).toLocaleString('ar-MA')}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => onEdit(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-gray-600 transition-colors" aria-label="تعديل">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" aria-label="حذف">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}
    </div>
  );
}

function PostEditor({ post, categories, saving, setSaving, onDone, onCancel }: {
  post: Post | null;
  categories: ReturnType<typeof useSiteData>['categories'];
  saving: boolean;
  setSaving: (v: boolean) => void;
  onDone: () => void;
  onCancel: () => void;
}) {
  const isNew = post === null;
  const [title, setTitle] = useState(post?.title || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [categoryId, setCategoryId] = useState<string>(post?.category_id ? String(post.category_id) : (categories[0]?.id ? String(categories[0].id) : ''));
  const [image, setImage] = useState(post?.image || '');
  const [date, setDate] = useState(post?.date || new Date().toISOString().slice(0, 10));
  const [author, setAuthor] = useState(post?.author || 'فريق التحرير');
  const [readTime, setReadTime] = useState(String(post?.read_time ?? 5));
  const [views, setViews] = useState(String(post?.views ?? 0));
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [tagsStr, setTagsStr] = useState((post?.tags || []).join('، '));
  const [downloadUrl, setDownloadUrl] = useState(post?.download_url || '');

  const save = async () => {
    if (!title.trim() || !excerpt.trim()) { alert('الرجاء ملء العنوان والملخص'); return; }
    setSaving(true);
    const payload = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content,
      category_id: categoryId ? Number(categoryId) : null,
      image: image || 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1',
      date,
      author: author.trim() || 'فريق التحرير',
      read_time: Number(readTime) || 5,
      views: Number(views) || 0,
      featured,
      tags: tagsStr.split(/[،,]/).map(t => t.trim()).filter(Boolean),
      download_url: downloadUrl.trim() || null,
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from('posts').insert(payload));
    } else {
      ({ error } = await supabase.from('posts').update(payload).eq('id', post!.id));
    }
    setSaving(false);
    if (error) { alert('فشل الحفظ: ' + error.message); return; }
    onDone();
  };

  return (
    <div>
      <AdminHeader
        title={isNew ? 'مقال جديد' : 'تعديل المقال'}
        action={<AdminButton variant="ghost" onClick={onCancel}><span className="flex items-center gap-2"><ArrowRight size={16} /> رجوع للقائمة</span></AdminButton>}
      />

      <AdminCard className="p-5 space-y-4">
        <AdminField label="عنوان المقال" value={title} onChange={setTitle} placeholder="أدخل عنوان المقال" required />
        <AdminTextarea label="الملخص" value={excerpt} onChange={setExcerpt} placeholder="ملخص قصير يظهر في القوائم" required rows={2} />
        <AdminTextarea label="المحتوى الكامل" value={content} onChange={setContent} placeholder="محتوى المقال الكامل" rows={10} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminSelect
            label="التصنيف"
            value={categoryId}
            onChange={setCategoryId}
            options={categories.map(c => ({ value: c.id, label: c.name }))}
          />
          <AdminField label="رابط الصورة" value={image} onChange={setImage} placeholder="https://..." dir="ltr" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminField label="التاريخ" type="date" value={date} onChange={setDate} />
          <AdminField label="الكاتب" value={author} onChange={setAuthor} />
          <AdminField label="مدة القراءة (دقيقة)" type="number" value={readTime} onChange={setReadTime} />
          <AdminField label="المشاهدات" type="number" value={views} onChange={setViews} />
        </div>

        <AdminField label="الوسوم (افصل بينها بفاصلة)" value={tagsStr} onChange={setTagsStr} placeholder="مثال: تعليم، أطفال، 2026" />
        <AdminField label="رابط التحميل (اختياري)" value={downloadUrl} onChange={setDownloadUrl} placeholder="https://example.com/file.pdf" dir="ltr" />
        <AdminToggle label="مقال مميز" checked={featured} onChange={setFeatured} />

        {image && (
          <div>
            <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">معاينة الصورة</span>
            <img src={image} alt="" className="w-full max-w-xs h-32 rounded-lg object-cover border border-neutral-200 dark:border-gray-700" />
          </div>
        )}

        <SaveBar saving={saving} onSave={save} onCancel={onCancel} />
      </AdminCard>
    </div>
  );
}
