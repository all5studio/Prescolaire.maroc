import { useSiteData } from '@/lib/SiteDataContext';
import SocialLinks from './SocialLinks';
import { Mail, Shield, FileText, Heart } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export default function Footer({ onOpenPrivacy, onOpenTerms }: FooterProps) {
  const { categories, settings, posts, footerLinks } = useSiteData();
  const topCats = categories.slice(0, 6);

  return (
    <footer className="mt-12" style={{ backgroundColor: 'var(--c-footer-bg)', color: 'var(--c-footer-text)' }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {settings.logo_image ? (
                <img src={settings.logo_image} alt={settings.site_title} className="h-10 w-auto max-w-[180px] object-contain" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl shadow-md">
                    {settings.logo_letter || 'P'}
                  </div>
                  <div>
                    <div className="font-bold text-base">{settings.site_title}</div>
                    <div className="text-[10px] opacity-60">{settings.site_tagline}</div>
                  </div>
                </>
              )}
            </div>
            <p className="text-sm opacity-70 leading-relaxed mb-4">
              {settings.about_text}
            </p>
            <SocialLinks compact />
          </div>

          {/* Quick links (editable from admin) */}
          <div>
            <h4 className="font-bold text-base mb-4 border-r-4 border-secondary-500 pr-3">روابط سريعة</h4>
            <ul className="space-y-2 text-sm opacity-70">
              {footerLinks.map(link => (
                <li key={link.id}>
                  <a href={link.url} className="hover:text-secondary-300 transition-colors">{link.label}</a>
                </li>
              ))}
              {settings.contact_email && (
                <li><a href={`mailto:${settings.contact_email}`} className="hover:text-secondary-300 transition-colors flex items-center gap-2"><Mail size={14} /> تواصل معنا</a></li>
              )}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-base mb-4 border-r-4 border-secondary-500 pr-3">الأقسام</h4>
            <ul className="space-y-2 text-sm opacity-70">
              {topCats.map(c => {
                const count = posts.filter(p => p.category?.slug === c.slug).length;
                return (
                  <li key={c.id}>
                    <a href={`#cat-${c.slug}`} className="hover:text-secondary-300 transition-colors">{c.name} ({count})</a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-base mb-4 border-r-4 border-secondary-500 pr-3">معلومات قانونية</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><button onClick={onOpenPrivacy} className="hover:text-secondary-300 transition-colors flex items-center gap-2"><Shield size={14} /> سياسة الخصوصية</button></li>
              <li><button onClick={onOpenTerms} className="hover:text-secondary-300 transition-colors flex items-center gap-2"><FileText size={14} /> اتفاقية الاستخدام</button></li>
              <li><a href="#" className="hover:text-secondary-300 transition-colors flex items-center gap-2"><Shield size={14} /> سياسة ملفات تعريف الارتباط</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs opacity-60">
          <div className="flex items-center gap-1">
            صُنع بـ <Heart size={12} className="text-secondary-400" fill="currentColor" /> في المغرب
          </div>
          <div>جميع الحقوق محفوظة 2026 {settings.site_title}</div>
        </div>
      </div>
    </footer>
  );
}
