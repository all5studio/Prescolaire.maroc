import { useState, useEffect, useCallback } from 'react';
import { useSiteData } from '@/lib/SiteDataContext';
import { useHashRoute } from '@/lib/useHashRoute';
import AdSlot from './AdSlot';
import { ArrowRight, Download, Loader2, CheckCircle } from 'lucide-react';

interface Props {
  postId: number;
}

const COUNTDOWN_SECONDS = 10;

export default function DownloadPage({ postId }: Props) {
  const { posts } = useSiteData();
  const [, navigate] = useHashRoute();
  const post = posts.find(p => p.id === postId);

  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [ready, setReady] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const tick = useCallback(() => {
    setSecondsLeft(prev => {
      if (prev <= 1) { setReady(true); return 0; }
      return prev - 1;
    });
  }, []);

  useEffect(() => {
    if (ready) return;
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [ready, tick]);

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">المقال غير موجود.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-primary-700 dark:text-primary-300 hover:underline">
          العودة للرئيسية
        </button>
      </main>
    );
  }

  if (!post.download_url) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">لا يوجد رابط تحميل لهذا المقال.</p>
        <button onClick={() => navigate(`/post/${post.id}`)} className="mt-4 text-primary-700 dark:text-primary-300 hover:underline">
          العودة للمقال
        </button>
      </main>
    );
  }

  const handleDownload = () => {
    setDownloadStarted(true);
    window.open(post.download_url!, '_blank', 'noopener,noreferrer');
  };

  const progress = ((COUNTDOWN_SECONDS - secondsLeft) / COUNTDOWN_SECONDS) * 100;

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      {/* Back to article */}
      <button
        onClick={() => navigate(`/post/${post.id}`)}
        className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors mb-6"
      >
        <ArrowRight size={16} /> العودة للمقال
      </button>

      {/* Top ad */}
      <AdSlot variant="leaderboard" />

      {/* Article title reference */}
      <div className="text-center my-6">
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">جاري تحضير رابط التحميل الخاص بـ</p>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2">{post.title}</h1>
      </div>

      {/* Countdown card */}
      <div className="my-8 p-8 rounded-2xl bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 shadow-lg text-center">
        {!ready ? (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 size={48} className="text-primary-700 dark:text-primary-300 animate-spin" />
            </div>
            <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-2">
              الرجاء الانتظار {secondsLeft} {secondsLeft === 1 ? 'ثانية' : 'ثواني'}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              شاهد الإعلانات أدناه حتى يظهر زر التحميل
            </p>

            {/* Progress bar */}
            <div className="w-full h-3 rounded-full bg-neutral-200 dark:bg-gray-700 overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-primary-600 to-primary-800 transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-neutral-400">
              <span>0</span>
              <span className="font-bold text-primary-700 dark:text-primary-300">{secondsLeft}</span>
              <span>{COUNTDOWN_SECONDS}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-2">
              رابط التحميل جاهز!
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              اضغط على الزر أدناه لبدء التحميل
            </p>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-base transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <Download size={20} />
              اضغط هنا للتحميل
            </button>
          </>
        )}
      </div>

      {/* Middle ad */}
      <AdSlot variant="in-article" />

      {/* Related / placeholder content while waiting */}
      <div className="my-8 p-6 rounded-xl bg-neutral-50 dark:bg-gray-800/50 border border-neutral-200 dark:border-gray-700">
        <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3">قد يهمك أيضاً</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          أثناء انتظارك للتحميل، تصفّح مقالاتنا الأخرى في {post.category?.name || 'الموقع'}.
        </p>
      </div>

      {/* Bottom ad */}
      <AdSlot variant="leaderboard" />
      <AdSlot variant="mobile" />

      {downloadStarted && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-green-600 text-white text-sm font-medium shadow-lg z-50">
          تم فتح رابط التحميل في نافذة جديدة
        </div>
      )}
    </main>
  );
}
