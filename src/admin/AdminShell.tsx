import { useState, ReactNode } from 'react';
import {
  LayoutDashboard, FileText, FolderTree, Image, Radio, FileCode, Settings,
  Megaphone, Link2, Menu, X, ExternalLink, Moon, Sun, type LucideIcon,
} from 'lucide-react';
import { useSiteData } from '@/lib/SiteDataContext';

export interface AdminNav {
  key: string;
  label: string;
  icon: LucideIcon;
}

const NAV: AdminNav[] = [
  { key: 'dashboard', label: 'لوحة القيادة', icon: LayoutDashboard },
  { key: 'posts', label: 'المقالات', icon: FileText },
  { key: 'categories', label: 'التصنيفات', icon: FolderTree },
  { key: 'hero', label: 'الشرائح الرئيسية', icon: Image },
  { key: 'ticker', label: 'الشريط الإخباري', icon: Radio },
  { key: 'pages', label: 'الصفحات', icon: FileCode },
  { key: 'ads', label: 'الإعلانات', icon: Megaphone },
  { key: 'footer-links', label: 'روابط التذييل', icon: Link2 },
  { key: 'settings', label: 'إعدادات الموقع', icon: Settings },
];

interface Props {
  current: string;
  onNavigate: (key: string) => void;
  children: ReactNode;
  darkMode: boolean;
  toggleDark: () => void;
}

export default function AdminShell({ current, onNavigate, children, darkMode, toggleDark }: Props) {
  const { settings } = useSiteData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map(item => {
        const Icon = item.icon;
        const active = current === item.key;
        return (
          <button
            key={item.key}
            onClick={() => { onNavigate(item.key); setSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              active
                ? 'bg-primary-700 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-gray-700'
            }`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-950 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-l border-neutral-200 dark:border-gray-800 sticky top-0 h-screen">
        <div className="p-5 border-b border-neutral-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold text-xl shadow-md">
              {settings.logo_letter || 'P'}
            </div>
            <div>
              <div className="font-bold text-sm text-primary-700 dark:text-primary-300">{settings.site_title}</div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400">لوحة التحكم</div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3">{nav}</div>
        <div className="p-3 border-t border-neutral-200 dark:border-gray-800">
          <a href="#/" className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-gray-700 transition-colors">
            <ExternalLink size={16} /> عرض الموقع
          </a>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-neutral-200 dark:border-gray-800">
              <span className="font-bold text-sm text-primary-700 dark:text-primary-300">القائمة</span>
              <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-gray-800" aria-label="إغلاق">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">{nav}</div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-gray-800" aria-label="القائمة">
                <Menu size={20} />
              </button>
              <span className="font-semibold text-neutral-700 dark:text-neutral-200">
                {NAV.find(n => n.key === current)?.label || 'لوحة التحكم'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDark}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="تبديل الوضع"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <a href="#/" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors">
                <ExternalLink size={16} /> عرض الموقع
              </a>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
