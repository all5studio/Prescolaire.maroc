import { useSiteData } from '@/lib/SiteDataContext';

interface Props {
  variant?: 'leaderboard' | 'in-article' | 'rectangle' | 'skyscraper' | 'mobile';
  className?: string;
}

const config = {
  leaderboard: { label: '728×90',  h: 90,  w: 'w-full max-w-[728px]', format: 'auto',    layout: 'horizontal' },
  'in-article': { label: 'داخل المقال', h: 120, w: 'w-full max-w-[728px]', format: 'auto', layout: 'in-article' },
  rectangle:   { label: '300×250', h: 250, w: 'w-full max-w-[300px]', format: 'auto',    layout: 'rectangle' },
  skyscraper:  { label: '300×600', h: 600, w: 'w-full max-w-[300px]', format: 'vertical', layout: 'vertical' },
  mobile:      { label: '320×100', h: 100, w: 'w-full max-w-[320px]', format: 'auto',   layout: 'horizontal' },
};

let adsenseLoaded = false;

function ensureAdsenseScript(client: string) {
  if (adsenseLoaded || !client) return;
  const existing = document.querySelector('script[data-adsense]');
  if (existing) { adsenseLoaded = true; return; }
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
  s.crossOrigin = 'anonymous';
  s.setAttribute('data-adsense', 'true');
  document.head.appendChild(s);
  adsenseLoaded = true;
}

export default function AdSlot({ variant = 'leaderboard', className = '' }: Props) {
  const { adSlots, settings } = useSiteData();
  const c = config[variant];
  const slot = adSlots.find(s => s.slot_key === variant);

  // AdSense configured and enabled: render real ad unit
  if (settings.adsense_client && slot?.enabled && slot.adsense_slot) {
    ensureAdsenseScript(settings.adsense_client);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).adsbygoogle.push({});
    } catch { /* no-op */ }
    return (
      <div className={`mx-auto my-4 ${c.w} ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', height: c.h }}
          data-ad-client={settings.adsense_client}
          data-ad-slot={slot.adsense_slot}
          data-ad-format={c.format}
          data-full-width-responsive={variant === 'rectangle' || variant === 'leaderboard' ? 'true' : 'false'}
        />
      </div>
    );
  }

  // Fallback placeholder
  return (
    <div className={`mx-auto my-4 ${c.w} ${className}`}>
      <div
        className={`ad-slot ${variant === 'skyscraper' ? 'hidden lg:flex' : ''}`}
        style={{ height: c.h }}
      >
        {slot?.fallback_text || `مساحة إعلانية – ${c.label}`}
      </div>
    </div>
  );
}
