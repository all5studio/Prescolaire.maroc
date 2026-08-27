import { ReactNode } from 'react';

export function AdminCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-neutral-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

export function AdminHeader({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{title}</h1>
        {desc && <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  dir?: 'rtl' | 'ltr';
  maxLength?: number;
}

export function AdminField({ label, value, onChange, type = 'text', placeholder, required, dir, maxLength }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        dir={dir}
        maxLength={maxLength}
        className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
      />
    </div>
  );
}

export function AdminTextarea({ label, value, onChange, placeholder, required, rows = 4 }: FieldProps & { rows?: number }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-y"
      />
    </div>
  );
}

export function AdminSelect({ label, value, onChange, options, required }: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  options: { value: string | number; label: string }[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export function AdminButton({ children, onClick, variant = 'primary', type = 'button', disabled }: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  const variants = {
    primary: 'bg-primary-700 hover:bg-primary-800 text-white',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white',
    outline: 'border-2 border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white dark:text-primary-300 dark:border-primary-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-gray-700',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export function AdminToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary-700' : 'bg-neutral-300 dark:bg-gray-600'}`}
        aria-pressed={checked}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'left-0.5' : 'right-0.5'}`} />
      </button>
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</span>
    </label>
  );
}

export function EmptyState({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="text-center py-16 text-neutral-400 dark:text-neutral-500">
      <div className="flex justify-center mb-3">{icon}</div>
      <p className="text-sm">{text}</p>
    </div>
  );
}

export function SaveBar({ saving, onSave, onCancel }: { saving: boolean; onSave: () => void; onCancel: () => void }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-5 border-t border-neutral-200 dark:border-gray-700 mt-6">
      <AdminButton variant="ghost" onClick={onCancel}>إلغاء</AdminButton>
      <AdminButton variant="primary" onClick={onSave} disabled={saving}>
        {saving ? 'جاري الحفظ...' : 'حفظ'}
      </AdminButton>
    </div>
  );
}
