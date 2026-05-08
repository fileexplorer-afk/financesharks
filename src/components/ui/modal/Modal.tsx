import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showClose?: boolean;
  scrollable?: boolean;
  className?: string;
  overlayClassName?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    animation: modal-overlay-in 0.2s ease;
    font-family: 'DM Sans', sans-serif;
  }

  @keyframes modal-overlay-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-overlay--out {
    animation: modal-overlay-out 0.18s ease forwards;
  }

  @keyframes modal-overlay-out {
    to { opacity: 0; }
  }

  .modal-panel {
    position: relative;
    width: 100%;
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 16px;
    box-shadow:
      0 0 0 1px rgba(56,189,248,0.06),
      0 32px 80px -20px rgba(0,0,0,0.8),
      0 8px 32px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 32px);
    animation: modal-panel-in 0.22s cubic-bezier(0.34, 1.4, 0.64, 1);
    overflow: hidden;
  }

  @keyframes modal-panel-in {
    from { opacity: 0; transform: scale(0.94) translateY(12px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .modal-panel--xs { max-width: 360px; }
  .modal-panel--sm { max-width: 480px; }
  .modal-panel--md { max-width: 560px; }
  .modal-panel--lg { max-width: 720px; }
  .modal-panel--xl { max-width: 900px; }
  .modal-panel--full {
    max-width: calc(100vw - 32px);
    max-height: calc(100vh - 32px);
    border-radius: 12px;
  }

  .modal-accent-bar {
    height: 2px;
    background: linear-gradient(90deg, #38bdf8 0%, #818cf8 60%, transparent 100%);
    flex-shrink: 0;
  }

  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 22px 24px 16px;
    flex-shrink: 0;
  }

  .modal-header__text { flex: 1; min-width: 0; }

  .modal-title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 600;
    color: #f1f5f9;
    line-height: 1.35;
    letter-spacing: -0.01em;
  }

  .modal-description {
    margin: 5px 0 0;
    font-size: 0.825rem;
    color: #64748b;
    line-height: 1.55;
  }

  .modal-close {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid #1e293b;
    color: #475569;
    cursor: pointer;
    padding: 0;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    margin-top: 2px;
  }
  .modal-close:hover {
    background: #1e293b;
    color: #94a3b8;
    border-color: #334155;
  }
  .modal-close:focus-visible {
    outline: 2px solid #38bdf8;
    outline-offset: 2px;
  }

  .modal-divider {
    height: 1px;
    background: #1e293b;
    margin: 0;
    border: none;
    flex-shrink: 0;
  }

  .modal-body {
    flex: 1;
    padding: 20px 24px;
    color: #94a3b8;
    font-size: 0.875rem;
    line-height: 1.65;
    min-height: 0;
  }

  .modal-body--scrollable {
    overflow-y: auto;
    overflow-x: hidden;
  }

  .modal-body--scrollable::-webkit-scrollbar {
    width: 5px;
  }
  .modal-body--scrollable::-webkit-scrollbar-track {
    background: transparent;
  }
  .modal-body--scrollable::-webkit-scrollbar-thumb {
    background: #1e293b;
    border-radius: 4px;
  }
  .modal-body--scrollable::-webkit-scrollbar-thumb:hover {
    background: #334155;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 24px 20px;
    border-top: 1px solid #1e293b;
    flex-shrink: 0;
    background: rgba(15, 23, 42, 0.7);
  }
`;

let styleInjected = false;
function injectStyles() {
  if (styleInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.textContent = styles;
  document.head.appendChild(el);
  styleInjected = true;
}

// ─── Focus Trap ──────────────────────────────────────────────────────────────

function useFocusTrap(ref: React.RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    el.addEventListener('keydown', trap);
    return () => el.removeEventListener('keydown', trap);
  }, [active, ref]);
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  closeOnEsc = true,
  showClose = true,
  scrollable = true,
  className = '',
  overlayClassName = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  injectStyles();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2)}`);
  const descId = useRef(`modal-desc-${Math.random().toString(36).slice(2)}`);

  useFocusTrap(panelRef, open);

  // Scroll lock
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  // Esc key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') onClose();
    },
    [closeOnEsc, onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open || typeof document === 'undefined') return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlay && e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className={`modal-overlay ${overlayClassName}`}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-label={ariaLabel ?? (typeof title === 'string' ? title : undefined)}
      aria-labelledby={title ? titleId.current : undefined}
      aria-describedby={description ? descId.current : ariaDescribedBy}
    >
      <div
        ref={panelRef}
        className={`modal-panel modal-panel--${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="modal-accent-bar" />

        {(title || showClose) && (
          <div className="modal-header">
            {title && (
              <div className="modal-header__text">
                <h2 id={titleId.current} className="modal-title">{title}</h2>
                {description && (
                  <p id={descId.current} className="modal-description">{description}</p>
                )}
              </div>
            )}
            {showClose && (
              <button
                type="button"
                className="modal-close"
                aria-label="Close modal"
                onClick={onClose}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        )}

        {title && <hr className="modal-divider" />}

        {children && (
          <div className={`modal-body${scrollable ? ' modal-body--scrollable' : ''}`}>
            {children}
          </div>
        )}

        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;