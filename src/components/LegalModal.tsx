import { useState, useEffect } from 'react';
import Modal from './Modal';
import { Shield, FileText } from 'lucide-react';
import { useSiteData } from '@/lib/SiteDataContext';

interface Props {
  open: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

export default function LegalModal({ open, onClose, type }: Props) {
  const { pages } = useSiteData();
  const slug = type === 'privacy' ? 'privacy' : 'terms';
  const page = pages.find(p => p.slug === slug);

  const title = page?.title || (type === 'privacy' ? 'سياسة الخصوصية' : 'اتفاقية الاستخدام');
  const Icon = type === 'privacy' ? Shield : FileText;

  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-2xl">
      <div className="flex items-center gap-3 mb-5 p-4 bg-primary-50 dark:bg-gray-700/50 rounded-xl">
        <div className="w-10 h-10 rounded-lg bg-primary-700 text-white flex items-center justify-center">
          <Icon size={20} />
        </div>
        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          آخر تحديث: {page ? new Date().toLocaleDateString('ar-MA') : '—'}
        </p>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
          {page?.content || 'المحتوى غير متوفر حالياً.'}
        </p>
      </div>
      <div className="mt-6 pt-5 border-t border-neutral-200 dark:border-gray-700 text-xs text-neutral-500 dark:text-neutral-400 text-center">
        جميع الحقوق محفوظة 2026 Préscolaire Maroc
      </div>
    </Modal>
  );
}
