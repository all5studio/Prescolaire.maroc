import { Facebook, Twitter, Youtube, Instagram, Mail, Rss, Send } from 'lucide-react';
import { useSiteData } from '@/lib/SiteDataContext';

export default function SocialLinks({ compact = false }: { compact?: boolean }) {
  const { settings } = useSiteData();

  const links = [
    { Icon: Facebook,   label: 'Facebook',   color: 'hover:bg-blue-600',   url: settings.social_facebook },
    { Icon: Twitter,    label: 'Twitter',    color: 'hover:bg-sky-500',    url: settings.social_twitter },
    { Icon: Youtube,    label: 'YouTube',    color: 'hover:bg-red-600',    url: settings.social_youtube },
    { Icon: Instagram,  label: 'Instagram',  color: 'hover:bg-pink-600',   url: settings.social_instagram },
    { Icon: Send,       label: 'Telegram',   color: 'hover:bg-sky-600',    url: settings.social_telegram },
    { Icon: Mail,       label: 'Email',      color: 'hover:bg-primary-700', url: settings.contact_email ? `mailto:${settings.contact_email}` : '' },
  ].filter(l => l.url);

  if (links.length === 0) return null;

  if (compact) {
    return (
      <div className="flex gap-2 flex-wrap">
        {links.map(({ Icon, label, color, url }) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className={`w-9 h-9 rounded-lg bg-neutral-100 dark:bg-gray-700 text-neutral-600 dark:text-neutral-300 ${color} hover:text-white flex items-center justify-center transition-all duration-200`}>
            <Icon size={16} />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {links.map(({ Icon, label, color, url }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-100 dark:bg-gray-700 text-neutral-700 dark:text-neutral-200 ${color} hover:text-white font-medium text-sm transition-all duration-200`}
        >
          <Icon size={18} />
          <span className="hidden sm:inline">{label}</span>
        </a>
      ))}
    </div>
  );
}
