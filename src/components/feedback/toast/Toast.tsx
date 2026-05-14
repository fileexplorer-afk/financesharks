import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading';
export type ToastPosition =
  | 'top-right' | 'top-left' | 'top-center'
  | 'bottom-right' | 'bottom-left' | 'bottom-center';

export interface ToastProps {
  id: string;
  type?: ToastType;
  title: string;
  description?: string;
  duration?: number;         // ms; 0 = persist until dismissed
  action?: { label: string; onClick: () => void };
  onDismiss?: (id: string) => void;
}

interface ToastState extends ToastProps {
  visible: boolean;
  progress: number;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  .toast-viewport {
    position: fixed;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
    font-family: 'DM Sans', sans-serif;
    width: 360px;
    max-width: calc(100vw - 32px);
  }

  /* Positions */
  .toast-viewport--top-right    { top: 20px; right: 20px; align-items: flex-end; }
  .toast-viewport--top-left     { top: 20px; left: 20px; align-items: flex-start; }
  .toast-viewport--top-center   { top: 20px; left: 50%; transform: translateX(-50%); align-items: center; }
  .toast-viewport--bottom-right { bottom: 20px; right: 20px; align-items: flex-end; flex-direction: column-reverse; }
  .toast-viewport--bottom-left  { bottom: 20px; left: 20px; align-items: flex-start; flex-direction: column-reverse; }
  .toast-viewport--bottom-center{ bottom: 20px; left: 50%; transform: translateX(-50%); align-items: center; flex-direction: column-reverse; }

  /* Card */
  .toast-card {
    pointer-events: all;
    position: relative;
    width: 100%;
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04),
      0 8px 32px rgba(0,0,0,0.55),
      0 2px 8px rgba(0,0,0,0.3);
    overflow: hidden;
    animation: toast-in 0.3s cubic-bezier(0.34,1.4,0.64,1) both;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .toast-card--hiding {
    animation: toast-out 0.22s ease forwards;
  }

  @keyframes toast-in {
    from { opacity: 0; transform: translateX(24px) scale(0.95); }
    to   { opacity: 1; transform: translateX(0)    scale(1); }
  }
  @keyframes toast-out {
    to { opacity: 0; transform: translateX(16px) scale(0.96); }
  }

  /* Left accent bar */
  .toast-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    border-radius: 14px 0 0 14px;
  }

  .toast-card--default::before  { background: #334155; }
  .toast-card--success::before  { background: linear-gradient(180deg,#10b981,#059669); }
  .toast-card--error::before    { background: linear-gradient(180deg,#f43f5e,#be123c); }
  .toast-card--warning::before  { background: linear-gradient(180deg,#fbbf24,#d97706); }
  .toast-card--info::before     { background: linear-gradient(180deg,#38bdf8,#0ea5e9); }
  .toast-card--loading::before  { background: linear-gradient(180deg,#818cf8,#6366f1); }

  /* Icon */
  .toast-icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
  }
  .toast-icon--default  { background: #1e293b; color: #64748b; }
  .toast-icon--success  { background: rgba(16,185,129,0.12); color: #10b981; }
  .toast-icon--error    { background: rgba(244,63,94,0.12);  color: #f43f5e; }
  .toast-icon--warning  { background: rgba(251,191,36,0.12); color: #fbbf24; }
  .toast-icon--info     { background: rgba(56,189,248,0.12); color: #38bdf8; }
  .toast-icon--loading  { background: rgba(129,140,248,0.12);color: #818cf8; }

  /* Spinner for loading */
  .toast-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(129,140,248,0.25);
    border-top-color: #818cf8;
    border-radius: 50%;
    animation: toast-spin 0.65s linear infinite;
  }
  @keyframes toast-spin { to { transform: rotate(360deg); } }

  /* Body */
  .toast-body { flex: 1; min-width: 0; }
  .toast-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #f1f5f9;
    line-height: 1.3;
  }
  .toast-desc {
    font-size: 0.78rem;
    color: #64748b;
    margin-top: 3px;
    line-height: 1.5;
  }
  .toast-action {
    margin-top: 8px;
    font-size: 0.75rem;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    background: none;
    border: 1px solid #334155;
    border-radius: 6px;
    color: #94a3b8;
    padding: 3px 10px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .toast-action:hover { background: #1e293b; color: #e2e8f0; border-color: #475569; }

  /* Dismiss btn */
  .toast-dismiss {
    flex-shrink: 0;
    width: 22px; height: 22px;
    border-radius: 6px;
    background: transparent;
    border: none;
    color: #475569;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: background 0.15s, color 0.15s;
    margin-top: 1px;
  }
  .toast-dismiss:hover { background: #1e293b; color: #94a3b8; }

  /* Progress bar */
  .toast-progress {
    position: absolute;
    bottom: 0; left: 0;
    height: 2px;
    transition: width 0.1s linear;
    border-radius: 0 0 14px 14px;
  }
  .toast-card--success  .toast-progress { background: #10b981; }
  .toast-card--error    .toast-progress { background: #f43f5e; }
  .toast-card--warning  .toast-progress { background: #fbbf24; }
  .toast-card--info     .toast-progress { background: #38bdf8; }
  .toast-card--loading  .toast-progress { display: none; }
  .toast-card--default  .toast-progress { background: #475569; }
`;

let styleInjected = false;
function injectStyles() {
  if (styleInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.textContent = styles;
  document.head.appendChild(el);
  styleInjected = true;
}

// ─── Icons ───────────────────────────────────────────────────────────────────

const icons: Record<ToastType, React.ReactNode> = {
  default: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7" cy="9.5" r="0.6" fill="currentColor" />
    </svg>
  ),
  success: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7.5l3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2L1.5 12h11L7 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 6v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7" cy="10" r="0.6" fill="currentColor" />
    </svg>
  ),
  info: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 6.5v3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7" cy="4.5" r="0.65" fill="currentColor" />
    </svg>
  ),
  loading: <div className="toast-spinner" />,
};

// ─── Context ─────────────────────────────────────────────────────────────────

type ToastAPI = {
  add: (props: Omit<ToastProps, 'id'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

const ToastCtx = createContext<ToastAPI | null>(null);

export function useToast(): ToastAPI {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('<Toaster /> must be rendered in the tree');
  return ctx;
}

// Module-level singleton so `toast.*` helpers work outside React
let _api: ToastAPI | null = null;

export const toast = {
  show: (p: Omit<ToastProps, 'id'>) => _api?.add(p) ?? '',
  success: (title: string, rest?: Partial<Omit<ToastProps, 'id' | 'type' | 'title'>>) =>
    _api?.add({ title, type: 'success', ...rest }) ?? '',
  error: (title: string, rest?: Partial<Omit<ToastProps, 'id' | 'type' | 'title'>>) =>
    _api?.add({ title, type: 'error', ...rest }) ?? '',
  warning: (title: string, rest?: Partial<Omit<ToastProps, 'id' | 'type' | 'title'>>) =>
    _api?.add({ title, type: 'warning', ...rest }) ?? '',
  info: (title: string, rest?: Partial<Omit<ToastProps, 'id' | 'type' | 'title'>>) =>
    _api?.add({ title, type: 'info', ...rest }) ?? '',
  loading: (title: string, rest?: Partial<Omit<ToastProps, 'id' | 'type' | 'title'>>) =>
    _api?.add({ title, type: 'loading', duration: 0, ...rest }) ?? '',
  dismiss: (id: string) => _api?.dismiss(id),
  dismissAll: () => _api?.dismissAll(),
};

// ─── Toaster ─────────────────────────────────────────────────────────────────

interface ToasterProps {
  position?: ToastPosition;
  maxToasts?: number;
}

export const Toaster: React.FC<ToasterProps> = ({
  position = 'top-right',
  maxToasts = 5,
}) => {
  injectStyles();
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t)),
    );
    clearInterval(timers.current.get(id));
    timers.current.delete(id);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 250);
  }, []);

  const dismissAll = useCallback(() => {
    setToasts((prev) => prev.map((t) => ({ ...t, visible: false })));
    timers.current.forEach((_, id) => clearInterval(timers.current.get(id)));
    timers.current.clear();
    setTimeout(() => setToasts([]), 250);
  }, []);

  const add = useCallback(
    (props: Omit<ToastProps, 'id'>): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const duration = props.duration ?? 4000;
      const newToast: ToastState = { ...props, id, visible: true, progress: 100, duration };

      setToasts((prev) => {
        const next = [...prev, newToast];
        return next.slice(-maxToasts);
      });

      if (duration > 0) {
        const step = 100;
        const interval = duration / step;
        let remaining = 100;

        const timer = setInterval(() => {
          remaining -= 100 / step;
          setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, progress: Math.max(0, remaining) } : t)),
          );
          if (remaining <= 0) dismiss(id);
        }, interval);

        timers.current.set(id, timer);
      }

      return id;
    },
    [dismiss, maxToasts],
  );

  // Register singleton
  useEffect(() => {
    _api = { add, dismiss, dismissAll };
    return () => { _api = null; };
  }, [add, dismiss, dismissAll]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <ToastCtx.Provider value={{ add, dismiss, dismissAll }}>
      <div className={`toast-viewport toast-viewport--${position}`} aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={[
              'toast-card',
              `toast-card--${t.type ?? 'default'}`,
              !t.visible ? 'toast-card--hiding' : '',
            ].filter(Boolean).join(' ')}
          >
            <div className={`toast-icon toast-icon--${t.type ?? 'default'}`}>
              {icons[t.type ?? 'default']}
            </div>

            <div className="toast-body">
              <p className="toast-title">{t.title}</p>
              {t.description && <p className="toast-desc">{t.description}</p>}
              {t.action && (
                <button
                  className="toast-action"
                  onClick={() => { t.action!.onClick(); dismiss(t.id); }}
                >
                  {t.action.label}
                </button>
              )}
            </div>

            <button
              className="toast-dismiss"
              aria-label="Dismiss notification"
              onClick={() => { t.onDismiss?.(t.id); dismiss(t.id); }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>

            {(t.duration ?? 4000) > 0 && (
              <div className="toast-progress" style={{ width: `${t.progress}%` }} />
            )}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>,
    document.body,
  );
};

export default Toaster;