import React, { useRef, useState } from 'react';
import type { ButtonProps } from './button.types';
import { variantStyles, sizeStyles } from './button-variants';

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  /* ── Reset & base ── */
  .btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    letter-spacing: 0.01em;
    border: none;
    outline: none;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    text-decoration: none;
    overflow: hidden;
    isolation: isolate;
    -webkit-font-smoothing: antialiased;
    transition:
      transform       0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow      0.2s  cubic-bezier(0.4, 0, 0.2, 1),
      filter          0.2s  ease,
      opacity         0.15s ease;
  }

  .btn:focus-visible {
    outline: 2px solid #38bdf8;
    outline-offset: 3px;
  }

  .btn:active:not(:disabled):not(.btn--loading) {
    transform: scale(0.96) translateY(1px) !important;
  }

  .btn:disabled,
  .btn[aria-disabled="true"] {
    opacity: 0.38;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* fullWidth */
  .btn--full { width: 100%; }

  /* ── Shimmer layer (shared) ── */
  .btn__shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 35%,
      rgba(255,255,255,0.13) 50%,
      transparent 65%
    );
    background-size: 250% 100%;
    background-position: 200% center;
    transition: background-position 0.55s ease;
    pointer-events: none;
    z-index: 1;
    border-radius: inherit;
  }
  .btn:hover:not(:disabled) .btn__shimmer {
    background-position: -50% center;
  }

  /* ── Content layer ── */
  .btn__content {
    position: relative;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: opacity 0.15s;
  }
  .btn--loading .btn__content { opacity: 0; }

  /* ── Spinner ── */
  .btn__spinner {
    position: absolute;
    inset: 0;
    z-index: 3;
    display: none;
    align-items: center;
    justify-content: center;
  }
  .btn--loading .btn__spinner { display: flex; }

  .btn__spinner-ring {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.25);
    border-top-color: rgba(255,255,255,0.9);
    animation: btn-spin 0.65s linear infinite;
  }
  @keyframes btn-spin { to { transform: rotate(360deg); } }

  /* ── Ripple ── */
  .btn__ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    background: rgba(255,255,255,0.18);
    animation: btn-ripple 0.55s linear;
    pointer-events: none;
    z-index: 0;
  }
  @keyframes btn-ripple {
    to { transform: scale(4); opacity: 0; }
  }

  /* ════════════════════════════════════════
     SIZES
  ════════════════════════════════════════ */
  .btn--xs { padding: 5px 12px;  font-size: 0.72rem; border-radius: 7px;  }
  .btn--sm { padding: 7px 16px;  font-size: 0.8rem;  border-radius: 9px;  }
  .btn--md { padding: 10px 22px; font-size: 0.875rem;border-radius: 11px; }
  .btn--lg { padding: 13px 28px; font-size: 0.95rem; border-radius: 13px; }
  .btn--xl { padding: 16px 36px; font-size: 1.05rem; border-radius: 15px; letter-spacing: 0.02em; }

  /* ════════════════════════════════════════
     PRIMARY  — electric sky-blue with glow
  ════════════════════════════════════════ */
  .btn--primary {
    background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%);
    color: #0c1a2e;
    box-shadow:
      0 0 0 1px rgba(56,189,248,0.4),
      0 4px 16px -2px rgba(14,165,233,0.5),
      inset 0 1px 0 rgba(255,255,255,0.25);
  }
  .btn--primary:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.015);
    box-shadow:
      0 0 0 1px rgba(56,189,248,0.5),
      0 8px 28px -4px rgba(14,165,233,0.65),
      0 2px 8px rgba(125,211,252,0.3),
      inset 0 1px 0 rgba(255,255,255,0.3);
    filter: brightness(1.06);
  }

  /* ════════════════════════════════════════
     GLASS  — frosted dark panel
  ════════════════════════════════════════ */
  .btn--glass {
    background: rgba(255,255,255,0.06);
    color: #e2e8f0;
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.1),
      inset 0 -1px 0 rgba(0,0,0,0.2),
      0 4px 16px rgba(0,0,0,0.3);
  }
  .btn--glass:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.012);
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.18);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.18),
      inset 0 -1px 0 rgba(0,0,0,0.15),
      0 8px 32px rgba(0,0,0,0.4),
      0 1px 0 rgba(255,255,255,0.06);
  }

  /* ════════════════════════════════════════
     SUCCESS  — emerald pulse
  ════════════════════════════════════════ */
  .btn--success {
    background: linear-gradient(135deg, #059669 0%, #10b981 55%, #34d399 100%);
    color: #022c22;
    box-shadow:
      0 0 0 1px rgba(16,185,129,0.35),
      0 4px 16px -2px rgba(5,150,105,0.5),
      inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .btn--success:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.015);
    box-shadow:
      0 0 0 1px rgba(16,185,129,0.5),
      0 8px 28px -4px rgba(5,150,105,0.6),
      0 2px 8px rgba(52,211,153,0.25),
      inset 0 1px 0 rgba(255,255,255,0.25);
    filter: brightness(1.07);
  }

  /* ════════════════════════════════════════
     DANGER  — deep crimson with pulse
  ════════════════════════════════════════ */
  .btn--danger {
    background: linear-gradient(135deg, #be123c 0%, #f43f5e 55%, #fb7185 100%);
    color: #fff1f2;
    box-shadow:
      0 0 0 1px rgba(244,63,94,0.3),
      0 4px 16px -2px rgba(190,18,60,0.5),
      inset 0 1px 0 rgba(255,255,255,0.18);
  }
  .btn--danger:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.015);
    box-shadow:
      0 0 0 1px rgba(244,63,94,0.45),
      0 8px 28px -4px rgba(190,18,60,0.65),
      0 2px 8px rgba(251,113,133,0.25),
      inset 0 1px 0 rgba(255,255,255,0.22);
    filter: brightness(1.06);
  }

  /* ════════════════════════════════════════
     GHOST  — invisible until hovered
  ════════════════════════════════════════ */
  .btn--ghost {
    background: transparent;
    color: #94a3b8;
    border: 1px solid transparent;
    box-shadow: none;
  }
  .btn--ghost:hover:not(:disabled) {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.08);
    color: #e2e8f0;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }

  /* ════════════════════════════════════════
     OUTLINE  — bordered, no fill
  ════════════════════════════════════════ */
  .btn--outline {
    background: transparent;
    color: #38bdf8;
    border: 1px solid rgba(56,189,248,0.4);
    box-shadow: inset 0 0 0 0 rgba(56,189,248,0);
    transition:
      transform       0.18s cubic-bezier(0.34,1.56,0.64,1),
      box-shadow      0.25s ease,
      background      0.2s  ease,
      border-color    0.2s  ease,
      color           0.2s  ease;
  }
  .btn--outline:hover:not(:disabled) {
    background: rgba(56,189,248,0.08);
    border-color: rgba(56,189,248,0.7);
    color: #7dd3fc;
    transform: translateY(-2px) scale(1.012);
    box-shadow:
      0 0 16px rgba(56,189,248,0.2),
      inset 0 0 12px rgba(56,189,248,0.06);
  }

  /* ════════════════════════════════════════
     GOLD  — prestige / premium CTA
  ════════════════════════════════════════ */
  .btn--gold {
    background: linear-gradient(135deg, #92400e 0%, #d97706 40%, #fbbf24 75%, #fde68a 100%);
    color: #1c0a00;
    font-weight: 600;
    box-shadow:
      0 0 0 1px rgba(251,191,36,0.35),
      0 4px 20px -2px rgba(217,119,6,0.55),
      inset 0 1px 0 rgba(255,255,255,0.3);
  }
  .btn--gold:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.015);
    box-shadow:
      0 0 0 1px rgba(251,191,36,0.5),
      0 10px 32px -4px rgba(217,119,6,0.7),
      0 2px 10px rgba(253,230,138,0.3),
      inset 0 1px 0 rgba(255,255,255,0.35);
    filter: brightness(1.06) saturate(1.1);
  }

  /* ── Icon sizing helper ── */
  .btn__icon {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    opacity: 0.85;
  }
`;

let injected = false;
function injectStyles() {
  if (injected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.textContent = styles;
  document.head.appendChild(el);
  injected = true;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      className = '',
      onClick,
      ...rest
    },
    ref,
  ) => {
    injectStyles();

    const innerRef = useRef<HTMLButtonElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLButtonElement>) ?? innerRef;

    // Ripple
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;

      const btn = resolvedRef.current ?? e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const id = Date.now();

      setRipples((prev) => [...prev, { id, x, y, size }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);

      onClick?.(e);
    };

    const cls = [
      'btn',
      variantStyles[variant],
      sizeStyles[size],
      loading ? 'btn--loading' : '',
      fullWidth ? 'btn--full' : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={resolvedRef}
        className={cls}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        onClick={handleClick}
        {...rest}
      >
        {/* Shimmer */}
        <span className="btn__shimmer" aria-hidden="true" />

        {/* Ripples */}
        {ripples.map(({ id, x, y, size }) => (
          <span
            key={id}
            className="btn__ripple"
            aria-hidden="true"
            style={{ left: x, top: y, width: size, height: size }}
          />
        ))}

        {/* Content */}
        <span className="btn__content">
          {leftIcon && <span className="btn__icon">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="btn__icon">{rightIcon}</span>}
        </span>

        {/* Spinner */}
        <span className="btn__spinner" aria-hidden="true">
          <span className="btn__spinner-ring" />
        </span>
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;