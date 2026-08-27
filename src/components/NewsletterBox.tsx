import { useState } from 'react';
import { Mail, Check } from 'lucide-react';

export default function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    setEmail('');
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <div className="card p-5 bg-gradient-to-br from-primary-700 to-primary-900 border-0 text-white">
      <div className="flex items-center gap-2 mb-3">
        <Mail size={20} />
        <h3 className="font-bold text-lg">النشرة البريدية</h3>
      </div>
      <p className="text-white/80 text-sm mb-4 leading-relaxed">
        اشترك في نشرتنا البريدية لتصلك آخر الأخبار والمستجدات والمستندات التربوية الخاصة بالتعليم الأولي.
      </p>
      {done ? (
        <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg text-sm font-semibold">
          <Check size={18} /> تم الاشتراك بنجاح، شكراً لك!
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="بريدك الإلكتروني"
            required
            className="w-full px-4 py-2.5 rounded-lg bg-white/15 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:bg-white/25 transition-all"
          />
          <button type="submit" className="w-full btn-secondary">اشترك الآن</button>
        </form>
      )}
    </div>
  );
}
