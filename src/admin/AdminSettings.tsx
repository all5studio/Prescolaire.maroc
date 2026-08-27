import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useSiteData } from '@/lib/SiteDataContext';
import { AdminCard, AdminHeader, AdminField, AdminTextarea, AdminButton, SaveBar } from './ui';
import { Save, Palette, Type, Share2, Mail, Image as ImageIcon } from 'lucide-react';
import { COLOR_TOKENS, type SiteSettings } from '@/lib/types';

export default function AdminSettings() {
  const { settings, refresh } = useSiteData();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(settings); }, [settings]);

  const update = (key: keyof SiteSettings, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('site_settings').upsert({ ...form, id: 1 });
    setSaving(false);
    if (error) { alert('فشل الحفظ: ' + error.message); return; }
    refresh();
    alert('تم حفظ الإعدادات. قد تحتاج لتحديث الصفحة لرؤية الألوان الجديدة.');
  };

  // Group color tokens by group label
  const groups = Array.from(new Set(COLOR_TOKENS.map(t => t.group)));

  return (
    <div>
      <AdminHeader title="إعدادات الموقع" desc="العلامة التجارية، الألوان، من نحن، التواصل والشبكات الاجتماعية" />

      {/* Branding */}
      <AdminCard className="p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Type size={18} className="text-primary-700 dark:text-primary-300" />
          <h2 className="font-bold text-neutral-900 dark:text-neutral-100">العلامة التجارية</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdminField label="اسم الموقع" value={form.site_title} onChange={v => update('site_title', v)} required />
          <AdminField label="الشعار النصي" value={form.site_tagline} onChange={v => update('site_tagline', v)} />
          <AdminField label="حرف الشعار (احتياطي)" value={form.logo_letter} onChange={v => update('logo_letter', v)} maxLength={2} />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            رابط صورة اللوغو
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={form.logo_image}
              onChange={e => update('logo_image', e.target.value)}
              dir="ltr"
              placeholder="https://example.com/logo.png"
              className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="w-12 h-12 rounded-lg border border-neutral-200 dark:border-gray-700 flex items-center justify-center overflow-hidden bg-neutral-50 dark:bg-gray-700">
              {form.logo_image ? (
                <img src={form.logo_image} alt="logo" className="w-full h-full object-contain" />
              ) : (
                <ImageIcon size={18} className="text-neutral-400" />
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            ضع رابط صورة اللوغو. إذا تركته فارغاً، سيظهر حرف الشعار بدلاً منه.
          </p>
        </div>
      </AdminCard>

      {/* Primary / Secondary palette */}
      <AdminCard className="p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={18} className="text-primary-700 dark:text-primary-300" />
          <h2 className="font-bold text-neutral-900 dark:text-neutral-100">الألوان الأساسية</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorField label="اللون الأساسي" value={form.primary_color} onChange={v => update('primary_color', v)} />
          <ColorField label="اللون الثانوي" value={form.secondary_color} onChange={v => update('secondary_color', v)} />
        </div>
        <div className="mt-4 p-3 rounded-lg bg-neutral-50 dark:bg-gray-700/50 text-xs text-neutral-500 dark:text-neutral-400">
          يتولد تلقائياً تدرّج كامل من كل لون ويُطبّق على كامل الموقع (الأزرار، الروابط، الشارات...).
        </div>
      </AdminCard>

      {/* Granular element colors */}
      <AdminCard className="p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={18} className="text-primary-700 dark:text-primary-300" />
          <h2 className="font-bold text-neutral-900 dark:text-neutral-100">ألوان عناصر الموقع (من الأعلى إلى الأسفل)</h2>
        </div>
        <div className="space-y-6">
          {groups.map(group => (
            <div key={group}>
              <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3 pb-2 border-b border-neutral-100 dark:border-gray-700">
                {group}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COLOR_TOKENS.filter(t => t.group === group).map(token => (
                  <ColorField
                    key={token.key}
                    label={token.label}
                    value={String(form[token.key])}
                    onChange={v => update(token.key, v)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* About */}
      <AdminCard className="p-5 mb-4">
        <h2 className="font-bold text-neutral-900 dark:text-neutral-100 mb-4">قسم "من نحن"</h2>
        <div className="space-y-4">
          <AdminField label="عنوان القسم" value={form.about_title} onChange={v => update('about_title', v)} />
          <AdminTextarea label="نص التعريف" value={form.about_text} onChange={v => update('about_text', v)} rows={4} />
        </div>
      </AdminCard>

      {/* Social */}
      <AdminCard className="p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Share2 size={18} className="text-primary-700 dark:text-primary-300" />
          <h2 className="font-bold text-neutral-900 dark:text-neutral-100">الشبكات الاجتماعية</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminField label="فيسبوك" value={form.social_facebook} onChange={v => update('social_facebook', v)} dir="ltr" placeholder="https://facebook.com/..." />
          <AdminField label="تويتر / X" value={form.social_twitter} onChange={v => update('social_twitter', v)} dir="ltr" placeholder="https://x.com/..." />
          <AdminField label="يوتيوب" value={form.social_youtube} onChange={v => update('social_youtube', v)} dir="ltr" placeholder="https://youtube.com/..." />
          <AdminField label="انستغرام" value={form.social_instagram} onChange={v => update('social_instagram', v)} dir="ltr" placeholder="https://instagram.com/..." />
          <AdminField label="تيليغرام" value={form.social_telegram} onChange={v => update('social_telegram', v)} dir="ltr" placeholder="https://t.me/..." />
        </div>
      </AdminCard>

      {/* Contact */}
      <AdminCard className="p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Mail size={18} className="text-primary-700 dark:text-primary-300" />
          <h2 className="font-bold text-neutral-900 dark:text-neutral-100">معلومات التواصل</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminField label="البريد الإلكتروني" value={form.contact_email} onChange={v => update('contact_email', v)} dir="ltr" placeholder="contact@example.com" />
          <AdminField label="رقم الهاتف" value={form.contact_phone} onChange={v => update('contact_phone', v)} dir="ltr" placeholder="+212..." />
        </div>
      </AdminCard>

      <SaveBar saving={saving} onSave={save} onCancel={() => setForm(settings)} />
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-12 h-10 rounded-lg border border-neutral-300 dark:border-gray-600 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          dir="ltr"
          className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <div className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-gray-700" style={{ backgroundColor: value }} />
      </div>
    </div>
  );
}
