import { useState } from 'react';
import { User, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import Modal from './Modal';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function RegisterModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    setTimeout(() => { setDone(false); onClose(); }, 1500);
  };

  return (
    <Modal open={open} onClose={onClose} title={mode === 'login' ? 'تسجيل الدخول' : 'التسجيل بالموقع'}>
      {done ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
            <UserPlus className="text-green-600 dark:text-green-300" size={28} />
          </div>
          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
            {mode === 'login' ? 'تم تسجيل الدخول بنجاح' : 'تم إنشاء حسابك بنجاح'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-5 p-1 bg-neutral-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${mode === 'register' ? 'bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-300 shadow-sm' : 'text-neutral-500'}`}
            >
              حساب جديد
            </button>
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${mode === 'login' ? 'bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-300 shadow-sm' : 'text-neutral-500'}`}
            >
              دخول
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">الاسم الكامل</label>
                <div className="relative">
                  <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="text" required placeholder="أدخل اسمك الكامل" className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">البريد الإلكتروني</label>
              <div className="relative">
                <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="email" required placeholder="example@email.com" className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="password" required placeholder="••••••••" className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
              </div>
            </div>
            <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
              {mode === 'login' ? <><LogIn size={18} /> دخول</> : <><UserPlus size={18} /> إنشاء الحساب</>}
            </button>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
              بتسجيلك فإنك توافق على <a href="#" className="text-primary-700 dark:text-primary-300 hover:underline">اتفاقية الاستخدام</a> و<a href="#" className="text-primary-700 dark:text-primary-300 hover:underline">سياسة الخصوصية</a>
            </p>
          </form>
        </>
      )}
    </Modal>
  );
}
