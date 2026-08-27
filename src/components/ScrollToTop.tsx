import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 left-6 z-40 w-11 h-11 rounded-full bg-primary-700 hover:bg-primary-800 text-white shadow-lg flex items-center justify-center transition-all duration-300 animate-fade-in"
      aria-label="الصعود إلى الأعلى"
    >
      <ArrowUp size={20} />
    </button>
  );
}
