import { useState, useRef, useEffect } from 'react';
import {
  Menu, X, Sun, Moon, ChevronDown, Newspaper, Trophy, BookOpen, BookOpenCheck,
  Palette, Gamepad2, FileText, Video, FolderOpen, Lightbulb, Home, Bell, Search, LayoutDashboard,
  type LucideIcon,
} from 'lucide-react';
import { useSiteData } from '@/lib/SiteDataContext';

const iconMap: Record<string, LucideIcon> = {
  Newspaper, Trophy, BookOpen, BookOpenCheck, Palette, Gamepad2,
  FileText, Video, FolderOpen, Lightbulb,
};

interface HeaderProps {
  darkMode: boolean;
  toggleDark: () => void;
  onOpenSearch: () => void;
  onOpenRegister: () => void;
}

export default function Header({ darkMode, toggleDark, onOpenSearch, onOpenRegister }: HeaderProps) {
  const { categories, settings } = useSiteData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="text-xs hidden md:block" style={{ backgroundColor: 'var(--c-topbar-bg)', color: 'var(--c-topbar-text)' }}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Bell size={12} /> آخر تحديث: {new Date().toLocaleDateString('ar-MA')}</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-secondary-300 transition-colors">تواصل معنا</a>
            <span className="text-white/30">|</span>
            <a href="#/admin" className="hover:text-secondary-300 transition-colors flex items-center gap-1.5"><LayoutDashboard size={12} /> لوحة التحكم</a>
            <span className="text-white/30">|</span>
            <button onClick={onOpenRegister} className="hover:text-secondary-300 transition-colors">تسجيل الدخول</button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className="sticky top-0 z-40 transition-all duration-300"
        style={{
          backgroundColor: 'var(--c-header-bg)',
          color: 'var(--c-header-text)',
          boxShadow: scrolled ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 flex-shrink-0">
              {settings.logo_image ? (
                <img src={settings.logo_image} alt={settings.site_title} className="h-10 w-auto max-w-[180px] object-contain" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold text-xl shadow-md">
                    {settings.logo_letter || 'P'}
                  </div>
                  <div className="leading-tight">
                    <div className="font-bold text-base text-primary-700 dark:text-primary-300">{settings.site_title}</div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400">{settings.site_tagline}</div>
                  </div>
                </>
              )}
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <a href="#" className="nav-link flex items-center gap-1.5">
                <Home size={16} /> القائمة الرئيسية
              </a>

              {/* Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="nav-link flex items-center gap-1.5"
                  aria-expanded={dropdownOpen}
                >
                  الأقسام <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-neutral-200 dark:border-gray-700 overflow-hidden animate-slide-down z-50">
                    {categories.map(cat => {
                      const Icon = iconMap[cat.icon] || FileText;
                      return (
                        <a key={cat.id} href={`#cat-${cat.slug}`} className="dropdown-item flex items-center gap-3" onClick={() => setDropdownOpen(false)}>
                          <Icon size={16} />
                          <span className="flex-1">{cat.name}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSearch}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="بحث"
              >
                <Search size={18} />
              </button>
              <button
                onClick={toggleDark}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="تبديل الوضع"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="القائمة"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto animate-slide-down">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-gray-700">
              <span className="font-bold text-primary-700 dark:text-primary-300">القائمة</span>
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-gray-800" aria-label="إغلاق">
                <X size={20} />
              </button>
            </div>
            <nav className="p-3">
              <a href="#" className="dropdown-item flex items-center gap-3 font-semibold" onClick={() => setMobileOpen(false)}>
                <Home size={18} /> القائمة الرئيسية
              </a>
              <div className="px-4 py-2 text-xs font-bold text-neutral-400 uppercase mt-2">الأقسام</div>
              {categories.map(cat => {
                const Icon = iconMap[cat.icon] || FileText;
                return (
                  <a key={cat.id} href={`#cat-${cat.slug}`} className="dropdown-item flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                    <Icon size={18} />
                    <span className="flex-1">{cat.name}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
