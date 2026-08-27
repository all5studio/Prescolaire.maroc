import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useSiteData } from '@/lib/SiteDataContext';
import { AdminCard, AdminHeader, AdminField, AdminButton, AdminToggle, SaveBar } from './ui';
import { Megaphone, Save } from 'lucide-react';
import type { AdSlot as AdSlotType, SiteSettings } from '@/lib/types';

const SLOT_LABELS: Record<string, string> = {
  leaderboard: 'بانر علوي (728×90)',
  'in-article': 'داخل المقال',
  rectangle: 'مستطيل (300×250)',
  skyscraper: 'ناطحة سحاب (300×600)',
  mobile: 'موبايل (320×100)',
};

export default function AdminAds() {
  const { adSlots, settings, refresh } = useSiteData();
  const [slots, setSlots] = useState<AdSlotType[]>(adSlots);
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setSlots(adSlots); }, [adSlots]);
  useEffect(() => { setForm(settings); }, [settings]);

  const updateSlot = (id: number, patch: Partial<AdSlotType>) =>
    setSlots(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));

  const updateSettings = (key: keyof SiteSettings, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      // Save settings (adsense_client)
      const { error: e1 } = await supabase.from('site_settings').upsert({ ...form, id: 1 });
      if (e1) throw e1;
      // Save each slot
      for (const s of slots) {
        const { error } = await supabase.from('ad_slots').update({
          adsense_slot: s.adsense_slot,
          enabled: s.enabled,
          fallback_text: s.fallback_text,
        }).eq('id', s.id);
        if (error) throw error;
      }
      refresh();
      alert('تم حفظ إعدادات الإعلانات.');
    } catch (e) {
      alert('فشل الحفظ: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader title="الإعلانات" desc="إدارة مساحات Google AdSense على الموقع" />

      {/* AdSense client ID */}
      <AdminCard className="p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone size={18} className="text-primary-700 dark:text-primary-300" />
          <h2 className="font-bold text-neutral-900 dark:text-neutral-100">حساب Google AdSense</h2>
        </div>
        <AdminField
          label="معرّف الناشر (Publisher ID)"
          value={form.adsense_client}
          onChange={v => updateSettings('adsense_client', v)}
          dir="ltr"
          placeholder="ca-pub-XXXXXXXXXXXXXXXX"
        />
        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
          تجده في حساب AdSense تحت «الإعدادات → معلومات الحساب». اتركه فارغاً لإيقاف الإعلانات على كامل الموقع.
        </p>
      </AdminCard>

      {/* Per-slot config */}
      <AdminCard className="p-5 mb-4">
        <h2 className="font-bold text-neutral-900 dark:text-neutral-100 mb-4">المساحات الإعلانية</h2>
        <div className="space-y-5">
          {slots.map(slot => (
            <div key={slot.id} className="p-4 rounded-lg border border-neutral-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
                  {SLOT_LABELS[slot.slot_key] || slot.slot_key}
                </div>
                <AdminToggle
                  label="مفعّل"
                  checked={slot.enabled}
                  onChange={v => updateSlot(slot.id, { enabled: v })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AdminField
                  label="معرّف الوحدة (Slot ID)"
                  value={slot.adsense_slot}
                  onChange={v => updateSlot(slot.id, { adsense_slot: v })}
                  dir="ltr"
                  placeholder="XXXXXXXXXX"
                />
                <AdminField
                  label="نص بديل (عند عدم التوفر)"
                  value={slot.fallback_text}
                  onChange={v => updateSlot(slot.id, { fallback_text: v })}
                />
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      <SaveBar saving={saving} onSave={save} onCancel={() => { setSlots(adSlots); setForm(settings); }} />
    </div>
  );
}
