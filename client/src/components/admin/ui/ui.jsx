/**
 * ui.jsx — Shared admin design system primitives
 * Path: client/src/components/admin/ui/ui.jsx
 *
 * Import only what you need:
 *   import { StatCard, Card, Btn, Badge } from '../../components/admin/ui/ui';
 */

// ── Icon helper ───────────────────────────────────────────────
export const Ic = ({ d, size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

// ── StatCard ──────────────────────────────────────────────────
export function StatCard({ label, value, delta, icon, accent = '#38bdf8', loading }) {
    if (loading)
      return (
        <div className="bg-navy-900 border border-navy-800 rounded-xl p-5 animate-pulse">
          <div className="w-9 h-9 rounded-lg bg-navy-800 mb-4" />
          <div className="h-7 w-14 bg-navy-800 rounded mb-2" />
          <div className="h-3 w-24 bg-navy-800 rounded" />
        </div>
      );
  const positive = delta >= 0;
  return (
    <div className="bg-navy-900 border border-navy-800 rounded-xl p-5 hover:border-navy-700 transition-colors duration-200">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${accent}14`, border: `1px solid ${accent}22` }}
        >
          <span style={{ color: accent }}>{icon}</span>
        </div>
        {delta !== undefined && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}
          >
            {positive ? '+' : ''}
            {delta}%
          </span>
        )}
      </div>
      <div className="text-2xl font-semibold text-white mb-0.5 tabular-nums tracking-tight">
        {value}
      </div>
      <div className="text-xs text-slate-500 leading-none">{label}</div>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────
const BADGE = {
  blue: 'bg-blue-500/10   text-blue-400   border-blue-500/20',
  green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  amber: 'bg-amber-500/10  text-amber-400  border-amber-500/20',
  red: 'bg-red-500/10    text-red-400    border-red-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  slate: 'bg-slate-500/10  text-slate-400  border-slate-500/20',
};
export function Badge({ label, variant = 'slate' }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${BADGE[variant] ?? BADGE.slate}`}
    >
      {label}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────
export function Card({ children, className = '', padding = true }) {
  return (
    <div
      className={`bg-navy-900 border border-navy-800 rounded-xl ${padding ? 'p-5' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

// ── CardHeader ────────────────────────────────────────────────
export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h3 className="text-sm font-semibold text-white leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-slate-600 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  );
}

// ── PageHeader ────────────────────────────────────────────────
export function PageHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 className="text-lg font-semibold text-white leading-tight">{title}</h1>
        {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Btn ───────────────────────────────────────────────────────
const BTN_VARIANTS = {
  primary: 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20',
  ghost:
    'border border-navy-800 hover:border-navy-700 text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]',
  danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20',
  success:
    'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20',
};
const BTN_SIZES = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-sm px-5 py-2.5 gap-2',
};
export function Btn({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  type = 'button',
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center font-medium rounded-lg transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${BTN_SIZES[size]} ${BTN_VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// ── Input ─────────────────────────────────────────────────────
export function Input({ label, error, hint, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>}
      <input
        className={`w-full bg-navy-950 border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-700 outline-none transition-colors duration-150 ${
          error
            ? 'border-red-500/50 focus:border-red-400'
            : 'border-navy-800 focus:border-blue-400/50'
        }`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-slate-600 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────
export function Textarea({ label, error, className = '', rows = 3, ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>}
      <textarea
        rows={rows}
        className={`w-full bg-navy-950 border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-700 outline-none transition-colors duration-150 resize-none ${
          error
            ? 'border-red-500/50 focus:border-red-400'
            : 'border-navy-800 focus:border-blue-400/50'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────
export function Select({ label, children, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>}
      <select
        className="w-full bg-navy-950 border border-navy-800 focus:border-blue-400/50 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-colors duration-150"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────
export function Modal({ open, onClose, title, subtitle, children, footer, maxWidth = 'max-w-xl' }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 pt-20 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`bg-navy-900 border border-navy-800 rounded-2xl w-full ${maxWidth} shadow-2xl max-h-[85vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800">
          <div>
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            {subtitle && <p className="text-xs text-slate-600 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-600 hover:text-slate-300 hover:bg-white/5 rounded-lg transition-all"
          >
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M18 6L6 18 M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="p-6">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-navy-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ── ConfirmModal ──────────────────────────────────────────────
export function ConfirmModal({ open, onClose, onConfirm, title, message, loading, confirmText = 'Delete' }) {
  if (!open) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <Btn variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Btn>
          <Btn variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? <Spinner /> : confirmText}
          </Btn>
        </>
      }
    >
      <p className="text-sm text-slate-300 leading-relaxed">
        {message}
      </p>
    </Modal>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-navy-800 rounded ${className}`} />;
}

// ── SkeletonRow ────────────────────────────────────────────────
export function SkeletonRow({ columns = 3 }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-navy-800 animate-pulse">
      <div className="w-10 h-10 bg-navy-800 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-navy-800 rounded w-1/3" />
        <div className="h-3 bg-navy-800/50 rounded w-1/4" />
      </div>
      {columns > 2 && <div className="hidden sm:block h-3 bg-navy-800/50 rounded w-20" />}
      <div className="h-8 bg-navy-800 rounded w-16 ml-auto" />
    </div>
  );
}

// ── SkeletonCard ──────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="bg-navy-900 border border-navy-800 rounded-xl p-5 animate-pulse">
      <div className="h-4 bg-navy-800 rounded w-1/2 mb-4" />
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-navy-800 rounded w-full" />
        <div className="h-3 bg-navy-800 rounded w-5/6" />
      </div>
      <div className="h-8 bg-navy-800 rounded w-24 mt-4" />
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-navy-800 flex items-center justify-center mb-4 text-slate-600">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-slate-300 mb-1">{title}</h3>
      <p className="text-xs text-slate-600 max-w-xs leading-relaxed mb-5">{description}</p>
      {action}
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────
export function Spinner({ size = 16 }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="border-2 border-white/20 border-t-white rounded-full animate-spin flex-shrink-0"
    />
  );
}

// ── Toggle ────────────────────────────────────────────────────
export function Toggle({ value, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${value ? 'bg-blue-500' : 'bg-navy-800'}`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-4' : ''}`}
        />
      </div>
      {label && <span className="text-sm text-slate-300">{label}</span>}
    </label>
  );
}
