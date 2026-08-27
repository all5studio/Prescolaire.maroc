import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useSiteData } from '@/lib/SiteDataContext';
import { AdminCard, AdminHeader, AdminField, AdminButton, EmptyState } from './ui';
import { Link2, Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { FooterLink } from '@/lib/types';

export default function AdminFooterLinks() {
  const { footerLinks, refresh } = useSiteData();
  const [links, setLinks] = useState<FooterLink[]>(footerLinks);
  const [editing, setEditing] = useState<FooterLink | null>(null);

  useEffect(() => { setLinks(footerLinks); }, [footerLinks]);

  const save = async () => {
    if (!editing) return;
    if (!editing.label.trim()) { alert('الاسم مطلوب'); return; }
    if (editing.id) {
      const { error } = await supabase.from('footer_links').update({
        label: editing.label, url: editing.url, sort_order: editing.sort_order,
      }).eq('id', editing.id);
      if (error) { alert('فشل الحفظ: ' + error.message); return; }
    } else {
      const { error } = await supabase.from('footer_links').insert({
        label: editing.label, url: editing.url, sort_order: editing.sort_order,
      });
      if (error) { alert('فشل الإضافة: ' + error.message); return; }
    }
    setEditing(null);
    refresh();
  };

  const remove = async (id: number) => {
    if (!confirm('حذف هذا الرابط؟')) return;
    const { error } = await supabase.from('footer_links').delete().eq('id', id);
    if (error) { alert('فشل الحذف: ' + error.message); return; }
    refresh();
  };

  const move = async (link: FooterLink, dir: -1 | 1) => {
    const sorted = [...links].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex(l => l.id === link.id);
    const target = sorted[idx + dir];
    if (!target) return;
    await Promise.all([
      supabase.from('footer_links').update({ sort_order: target.sort_order }).eq('id', link.id),
      supabase.from('footer_links').update({ sort_order: link.sort_order }).eq('id', target.id),
    ]);
    refresh();
  };

  return (
    <div>
      <AdminHeader
        title="روابط التذييل"
        desc="إدارة القائمة التي تظهر أسفل الموقع"
        action={
          <AdminButton onClick={() => setEditing({ id: 0, label: '', url: '#', sort_order: links.length + 1 })}>
            <Plus size={16} className="inline ml-1" /> رابط جديد
          </AdminButton>
        }
      />

      <AdminCard className="overflow-hidden">
        {links.length === 0 ? (
          <EmptyState icon={<Link2 size={32} />} text="لا توجد روابط بعد" />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-gray-700/50 text-neutral-500 dark:text-neutral-400">
              <tr>
                <th className="text-right p-3 font-medium">الاسم</th>
                <th className="text-right p-3 font-medium hidden sm:table-cell">الرابط</th>
                <th className="text-right p-3 font-medium">الترتيب</th>
                <th className="text-right p-3 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {[...links].sort((a, b) => a.sort_order - b.sort_order).map((link, i, arr) => (
                <tr key={link.id} className="border-t border-neutral-200 dark:border-gray-700">
                  <td className="p-3 font-medium text-neutral-800 dark:text-neutral-200">{link.label}</td>
                  <td className="p-3 text-neutral-500 dark:text-neutral-400 hidden sm:table-cell" dir="ltr">{link.url}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => move(link, -1)} disabled={i === 0} className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-gray-700 disabled:opacity-30"><ArrowUp size={14} /></button>
                      <button onClick={() => move(link, 1)} disabled={i === arr.length - 1} className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-gray-700 disabled:opacity-30"><ArrowDown size={14} /></button>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => setEditing({ ...link })} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"><Pencil size={15} /></button>
                      <button onClick={() => remove(link.id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminCard>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <AdminCard className="relative w-full max-w-md p-5">
            <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-neutral-100">
              {editing.id ? 'تعديل رابط' : 'رابط جديد'}
            </h3>
            <div className="space-y-4">
              <AdminField label="الاسم" value={editing.label} onChange={v => setEditing({ ...editing, label: v })} required />
              <AdminField label="الرابط" value={editing.url} onChange={v => setEditing({ ...editing, url: v })} dir="ltr" placeholder="#page-about" />
              <AdminField label="الترتيب" type="number" value={String(editing.sort_order)} onChange={v => setEditing({ ...editing, sort_order: Number(v) })} />
            </div>
            <div className="flex justify-end gap-3 pt-5">
              <AdminButton variant="ghost" onClick={() => setEditing(null)}>إلغاء</AdminButton>
              <AdminButton onClick={save}>حفظ</AdminButton>
            </div>
          </AdminCard>
        </div>
      )}
    </div>
  );
}
