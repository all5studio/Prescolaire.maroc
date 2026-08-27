import { useState, useEffect, useRef } from 'react';
import { useSiteData } from '@/lib/SiteDataContext';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function HeroSlider() {
  const { heroSlides } = useSiteData();
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % heroSlides.length);
    }, 5000);
  };

  useEffect(() => {
    if (heroSlides.length > 0) startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroSlides.length]);

  const goTo = (idx: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrent(idx);
    startTimer();
  };

  if (heroSlides.length === 0) {
    return <div className="w-full h-[420px] rounded-2xl bg-neutral-200 dark:bg-gray-800 animate-pulse" />;
  }

  const prev = () => goTo((current - 1 + heroSlides.length) % heroSlides.length);
  const next = () => goTo((current + 1) % heroSlides.length);
  const slide = heroSlides[current];

  return (
    <section className="relative w-full overflow-hidden rounded-2xl shadow-lg" style={{ height: 420 }}>
      {heroSlides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute bottom-0 right-0 left-0 z-20 p-6 md:p-8">
        <span className={`tag text-white ${slide.badge_color} mb-3 inline-block`}>{slide.badge}</span>
        <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold leading-tight mb-2 line-clamp-2">
          {slide.title}
        </h2>
        <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-4 max-w-2xl">
          {slide.excerpt}
        </p>
        <div className="flex items-center gap-4">
          <span className="text-white/70 text-xs flex items-center gap-1.5">
            <Calendar size={14} />
            {new Date(slide.date).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
            {slide.category}
          </span>
          <a href={`#cat-${slide.category_slug}`} className="btn-secondary text-sm py-2 px-4 mr-auto">اقرأ المزيد</a>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white flex items-center justify-center transition-all duration-200"
        aria-label="السابق"
      >
        <ChevronRight size={20} />
      </button>
      <button
        onClick={next}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white flex items-center justify-center transition-all duration-200"
        aria-label="التالي"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50'}`}
            aria-label={`الشريحة ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
