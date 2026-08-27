import { useState, useEffect } from 'react';
import { SiteDataProvider } from '@/lib/SiteDataContext';
import { useThemeColors } from '@/lib/useThemeColors';
import { useHashRoute, parseRoute } from '@/lib/useHashRoute';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';
import PostDetail from '@/components/PostDetail';
import DownloadPage from '@/components/DownloadPage';
import Footer from '@/components/Footer';
import RegisterModal from '@/components/RegisterModal';
import SearchModal from '@/components/SearchModal';
import LegalModal from '@/components/LegalModal';
import AdminShell from '@/admin/AdminShell';
import AdminDashboard from '@/admin/AdminDashboard';
import AdminPosts from '@/admin/AdminPosts';
import AdminCategories from '@/admin/AdminCategories';
import AdminHero from '@/admin/AdminHero';
import AdminTicker from '@/admin/AdminTicker';
import AdminPages from '@/admin/AdminPages';
import AdminSettings from '@/admin/AdminSettings';
import AdminAds from '@/admin/AdminAds';
import AdminFooterLinks from '@/admin/AdminFooterLinks';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState<null | 'privacy' | 'terms'>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored ? stored === 'dark' : prefersDark;
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <SiteDataProvider>
      <ThemeWrapper darkMode={darkMode} toggleDark={() => setDarkMode(d => !d)}>
        <Router
          darkMode={darkMode}
          toggleDark={() => setDarkMode(d => !d)}
          registerOpen={registerOpen}
          setRegisterOpen={setRegisterOpen}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          legalOpen={legalOpen}
          setLegalOpen={setLegalOpen}
        />
      </ThemeWrapper>
    </SiteDataProvider>
  );
}

function ThemeWrapper({ darkMode, toggleDark, children }: { darkMode: boolean; toggleDark: () => void; children: React.ReactNode }) {
  useThemeColors();
  return <>{children}</>;
}

interface RouterProps {
  darkMode: boolean;
  toggleDark: () => void;
  registerOpen: boolean;
  setRegisterOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  legalOpen: null | 'privacy' | 'terms';
  setLegalOpen: (v: null | 'privacy' | 'terms') => void;
  postView?: { id: number } | null;
  downloadView?: { id: number } | null;
}

function Router(props: RouterProps) {
  const [route] = useHashRoute();
  const { base, param } = parseRoute(route);

  // Admin routes
  if (base === '/admin') {
    return <AdminRouter {...props} />;
  }

  // Post detail route: #/post/:id
  if (base === '/post' && param) {
    const id = Number(param);
    if (!Number.isNaN(id)) {
      return <PublicSite {...props} postView={{ id }} />;
    }
  }

  // Download interstitial route: #/download/:id
  if (base === '/download' && param) {
    const id = Number(param);
    if (!Number.isNaN(id)) {
      return <PublicSite {...props} downloadView={{ id }} />;
    }
  }

  // Public site
  return <PublicSite {...props} />;
}

function AdminRouter(props: RouterProps) {
  const [route, navigate] = useHashRoute();
  const { base, param } = parseRoute(route);

  // Determine current section
  let section = 'dashboard';
  let editingId: number | null = null;

  if (base === '/admin') {
    if (!param) {
      section = 'dashboard';
    } else {
      const parts = param.split('/');
      const sec = parts[0];
      if (['dashboard', 'posts', 'categories', 'hero', 'ticker', 'pages', 'ads', 'footer-links', 'settings'].includes(sec)) {
        section = sec;
      }
      if (parts[1] === 'new') {
        editingId = 0;
      } else if (parts[1] === 'edit' && parts[2]) {
        editingId = Number(parts[2]);
      }
    }
  }

  const goSection = (key: string) => navigate('/admin/' + (key === 'dashboard' ? '' : key));

  return (
    <AdminShell current={section} onNavigate={goSection} darkMode={props.darkMode} toggleDark={props.toggleDark}>
      {section === 'dashboard' && <AdminDashboard onNavigate={goSection} />}
      {section === 'posts' && <AdminPosts editingId={editingId} onEdit={(id) => id === null ? navigate('/admin/posts') : id === 0 ? navigate('/admin/posts/new') : navigate('/admin/posts/edit/' + id)} />}
      {section === 'categories' && <AdminCategories editingId={editingId} onEdit={(id) => id === null ? navigate('/admin/categories') : id === 0 ? navigate('/admin/categories/new') : navigate('/admin/categories/edit/' + id)} />}
      {section === 'hero' && <AdminHero editingId={editingId} onEdit={(id) => id === null ? navigate('/admin/hero') : id === 0 ? navigate('/admin/hero/new') : navigate('/admin/hero/edit/' + id)} />}
      {section === 'ticker' && <AdminTicker />}
      {section === 'pages' && <AdminPages editingId={editingId} onEdit={(id) => id === null ? navigate('/admin/pages') : id === 0 ? navigate('/admin/pages/new') : navigate('/admin/pages/edit/' + id)} />}
      {section === 'ads' && <AdminAds />}
      {section === 'footer-links' && <AdminFooterLinks />}
      {section === 'settings' && <AdminSettings />}
    </AdminShell>
  );
}

function PublicSite({ darkMode, toggleDark, registerOpen, setRegisterOpen, searchOpen, setSearchOpen, legalOpen, setLegalOpen, postView, downloadView }: RouterProps) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-950 transition-colors duration-300">
      <Header
        darkMode={darkMode}
        toggleDark={toggleDark}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenRegister={() => setRegisterOpen(true)}
      />
      {downloadView ? <DownloadPage postId={downloadView.id} /> : postView ? <PostDetail postId={postView.id} /> : <MainContent />}
      <Footer
        onOpenPrivacy={() => setLegalOpen('privacy')}
        onOpenTerms={() => setLegalOpen('terms')}
      />

      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <LegalModal open={legalOpen !== null} type={legalOpen || 'privacy'} onClose={() => setLegalOpen(null)} />
    </div>
  );
}
