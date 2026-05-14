import React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface EmptyStateProps {
  icon?: React.ReactNode;
  /** Preset icon slot: 'transactions' | 'search' | 'notifications' | 'portfolio' | 'documents' */
  preset?: 'transactions' | 'search' | 'notifications' | 'portfolio' | 'documents' | 'generic';
  title: string;
  description?: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  .empty-root {
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .empty-root--sm { padding: 32px 16px; gap: 12px; }
  .empty-root--md { padding: 48px 24px; gap: 16px; }
  .empty-root--lg { padding: 72px 32px; gap: 20px; }

  /* Glowing icon shell */
  .empty-icon-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .empty-root--sm .empty-icon-wrap { width: 56px; height: 56px; }
  .empty-root--md .empty-icon-wrap { width: 72px; height: 72px; }
  .empty-root--lg .empty-icon-wrap { width: 88px; height: 88px; }

  .empty-icon-bg {
    position: absolute;
    inset: 0;
    border-radius: 20px;
    background: #0f172a;
    border: 1px solid #1e293b;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.04),
      0 4px 20px rgba(0,0,0,0.4);
  }

  .empty-icon-glow {
    position: absolute;
    inset: -8px;
    border-radius: 28px;
    background: radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .empty-icon-svg {
    position: relative;
    z-index: 1;
    color: #334155;
  }

  .empty-root--sm .empty-icon-svg svg { width: 22px; height: 22px; }
  .empty-root--md .empty-icon-svg svg { width: 28px; height: 28px; }
  .empty-root--lg .empty-icon-svg svg { width: 36px; height: 36px; }

  /* Dots decorative */
  .empty-dots {
    position: absolute;
    inset: -20px;
    pointer-events: none;
    z-index: 0;
  }
  .empty-dot {
    position: absolute;
    border-radius: 50%;
    background: #1e293b;
  }

  /* Text */
  .empty-title {
    font-size: 1rem;
    font-weight: 600;
    color: #e2e8f0;
    letter-spacing: -0.01em;
    line-height: 1.3;
  }
  .empty-root--sm .empty-title { font-size: 0.875rem; }
  .empty-root--lg .empty-title { font-size: 1.15rem; }

  .empty-desc {
    font-size: 0.825rem;
    color: #475569;
    line-height: 1.6;
    max-width: 340px;
  }
  .empty-root--lg .empty-desc { font-size: 0.875rem; max-width: 420px; }

  /* Actions */
  .empty-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 4px;
  }

  /* Divider line */
  .empty-divider {
    width: 40px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #1e293b, transparent);
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

// ─── Preset Icons ─────────────────────────────────────────────────────────────

const presetIcons: Record<NonNullable<EmptyStateProps['preset']>, React.ReactNode> = {
  transactions: (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="28" height="20" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 14h28" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 20h6M10 24h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="26" cy="22" r="3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M23 23l7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 16h8M16 12v8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  notifications: (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 4a10 10 0 0110 10v7l2 3H6l2-3V14A10 10 0 0118 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 28a4 4 0 008 0" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="26" cy="8" r="4" fill="#f43f5e" />
    </svg>
  ),
  portfolio: (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="4,28 12,18 18,22 24,12 32,16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 8h4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  documents: (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4h12l8 8v20H10V4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M22 4v8h8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M15 18h6M15 22h8M15 26h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  generic: (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="12" stroke="currentColor" strokeWidth="1.6" />
      <path d="M18 12v7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// ─── Decorative dots ─────────────────────────────────────────────────────────

const dots = [
  { top: '10%', left: '10%', w: 3 },
  { top: '20%', right: '5%', w: 2 },
  { bottom: '15%', left: '5%', w: 2 },
  { bottom: '10%', right: '12%', w: 3 },
  { top: '50%', left: '0%', w: 2 },
];

// ─── Component ───────────────────────────────────────────────────────────────

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  preset = 'generic',
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
  className = '',
}) => {
  injectStyles();

  const resolvedIcon = icon ?? presetIcons[preset];

  return (
    <div className={`empty-root empty-root--${size} ${className}`} role="status" aria-label={title}>
      {/* Icon */}
      <div className="empty-icon-wrap">
        <div className="empty-icon-bg" />
        <div className="empty-icon-glow" />

        {/* Floating dots */}
        <div className="empty-dots" aria-hidden="true">
          {dots.map((d, i) => (
            <span
              key={i}
              className="empty-dot"
              style={{
                top: d.top,
                left: (d as any).left,
                right: (d as any).right,
                bottom: (d as any).bottom,
                width: d.w,
                height: d.w,
              }}
            />
          ))}
        </div>

        <div className="empty-icon-svg">{resolvedIcon}</div>
      </div>

      {/* Text */}
      <p className="empty-title">{title}</p>

      {description && (
        <>
          <div className="empty-divider" aria-hidden="true" />
          <p className="empty-desc">{description}</p>
        </>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="empty-actions">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
};

export default EmptyState;