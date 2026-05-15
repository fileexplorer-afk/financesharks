import React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ErrorStateVariant = 'generic' | 'network' | 'notfound' | 'unauthorized' | 'server' | 'timeout';

export interface ErrorStateProps {
  variant?: ErrorStateVariant;
  title?: string;
  description?: string;
  code?: string | number;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Show a subtle code badge e.g. "500", "ERR_NETWORK" */
  showCode?: boolean;
  className?: string;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400&display=swap');

  .err-root {
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .err-root--sm { padding: 32px 16px; gap: 12px; }
  .err-root--md { padding: 48px 24px; gap: 16px; }
  .err-root--lg { padding: 72px 32px; gap: 20px; }

  /* Icon shell */
  .err-icon-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .err-root--sm .err-icon-wrap { width: 60px; height: 60px; }
  .err-root--md .err-icon-wrap { width: 76px; height: 76px; }
  .err-root--lg .err-icon-wrap { width: 96px; height: 96px; }

  .err-icon-bg {
    position: absolute;
    inset: 0;
    border-radius: 22px;
    background: rgba(244,63,94,0.06);
    border: 1px solid rgba(244,63,94,0.15);
    box-shadow:
      inset 0 1px 0 rgba(244,63,94,0.08),
      0 4px 24px rgba(244,63,94,0.08);
  }

  /* Pulsing red glow */
  .err-icon-glow {
    position: absolute;
    inset: -10px;
    border-radius: 30px;
    background: radial-gradient(circle, rgba(244,63,94,0.08) 0%, transparent 65%);
    animation: err-glow 3s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes err-glow {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.1); }
  }

  .err-icon-svg {
    position: relative;
    z-index: 1;
    color: #f43f5e;
  }
  .err-root--sm .err-icon-svg svg { width: 24px; height: 24px; }
  .err-root--md .err-icon-svg svg { width: 30px; height: 30px; }
  .err-root--lg .err-icon-svg svg { width: 38px; height: 38px; }

  /* Code badge */
  .err-code {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    color: #f43f5e;
    background: rgba(244,63,94,0.08);
    border: 1px solid rgba(244,63,94,0.18);
    border-radius: 6px;
    padding: 2px 9px;
    letter-spacing: 0.05em;
  }

  /* Text */
  .err-title {
    font-size: 1rem;
    font-weight: 600;
    color: #f1f5f9;
    letter-spacing: -0.01em;
    line-height: 1.3;
  }
  .err-root--sm .err-title { font-size: 0.875rem; }
  .err-root--lg .err-title { font-size: 1.2rem; }

  .err-desc {
    font-size: 0.825rem;
    color: #475569;
    line-height: 1.65;
    max-width: 360px;
  }
  .err-root--lg .err-desc { font-size: 0.875rem; max-width: 440px; }

  /* Divider */
  .err-divider {
    width: 32px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(244,63,94,0.25), transparent);
  }

  /* Actions */
  .err-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 4px;
  }

  /* Detail panel (optional stack trace style) */
  .err-detail {
    width: 100%;
    max-width: 400px;
    background: #0a0f1a;
    border: 1px solid rgba(244,63,94,0.12);
    border-radius: 10px;
    padding: 12px 14px;
    text-align: left;
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    color: #64748b;
    line-height: 1.7;
    margin-top: 4px;
  }
  .err-detail span { color: #f43f5e; }
`;

let styleInjected = false;
function injectStyles() {
  if (styleInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.textContent = styles;
  document.head.appendChild(el);
  styleInjected = true;
}

// ─── Preset Config ────────────────────────────────────────────────────────────

interface Preset {
  title: string;
  description: string;
  code: string;
  icon: React.ReactNode;
}

const presets: Record<ErrorStateVariant, Preset> = {
  generic: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again or contact support if the issue persists.',
    code: 'ERR_UNKNOWN',
    icon: (
      <svg viewBox="0 0 30 30" fill="none">
        <circle cx="15" cy="15" r="12" stroke="currentColor" strokeWidth="1.6" />
        <path d="M15 9v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="15" cy="19.5" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  network: {
    title: 'No internet connection',
    description: 'We couldn\'t reach the server. Check your network connection and try again.',
    code: 'ERR_NETWORK',
    icon: (
      <svg viewBox="0 0 30 30" fill="none">
        <path d="M3 10c3.3-3.3 7.8-5 12-5s8.7 1.7 12 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7 14c2.2-2.2 5.3-3.5 8-3.5s5.8 1.3 8 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M11 18c1.1-1.1 2.7-1.8 4-1.8s2.9.7 4 1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="15" cy="22" r="1.5" fill="currentColor" />
        <path d="M4 4l22 22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  notfound: {
    title: 'Page not found',
    description: 'The resource you\'re looking for doesn\'t exist or may have been moved.',
    code: '404',
    icon: (
      <svg viewBox="0 0 30 30" fill="none">
        <circle cx="13" cy="13" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path d="M20 20l7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M10 10l6 6M16 10l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  unauthorized: {
    title: 'Access denied',
    description: 'You don\'t have permission to view this page. Sign in with a different account or contact your administrator.',
    code: '401',
    icon: (
      <svg viewBox="0 0 30 30" fill="none">
        <rect x="6" y="13" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 13V9a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="15" cy="20" r="2" fill="currentColor" />
      </svg>
    ),
  },
  server: {
    title: 'Server error',
    description: 'Our servers are experiencing issues. We\'re working on a fix — please try again in a few minutes.',
    code: '500',
    icon: (
      <svg viewBox="0 0 30 30" fill="none">
        <rect x="4" y="5" width="22" height="8" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <rect x="4" y="17" width="22" height="8" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="8.5" cy="9" r="1.2" fill="currentColor" />
        <circle cx="8.5" cy="21" r="1.2" fill="currentColor" />
        <path d="M14 9h7M14 21h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M20 23l2-2-2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  timeout: {
    title: 'Request timed out',
    description: 'The server took too long to respond. Check your connection speed or try again later.',
    code: 'TIMEOUT',
    icon: (
      <svg viewBox="0 0 30 30" fill="none">
        <circle cx="15" cy="16" r="11" stroke="currentColor" strokeWidth="1.6" />
        <path d="M15 9v7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 3h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export const ErrorState: React.FC<ErrorStateProps> = ({
  variant = 'generic',
  title,
  description,
  code,
  action,
  secondaryAction,
  size = 'md',
  showCode = false,
  className = '',
}) => {
  injectStyles();

  const preset = presets[variant];
  const resolvedTitle = title ?? preset.title;
  const resolvedDesc = description ?? preset.description;
  const resolvedCode = code ?? preset.code;

  return (
    <div className={`err-root err-root--${size} ${className}`} role="alert" aria-label={resolvedTitle}>
      {/* Icon */}
      <div className="err-icon-wrap">
        <div className="err-icon-bg" />
        <div className="err-icon-glow" />
        <div className="err-icon-svg">{preset.icon}</div>
      </div>

      {/* Code */}
      {showCode && <span className="err-code">{resolvedCode}</span>}

      {/* Text */}
      <p className="err-title">{resolvedTitle}</p>
      <div className="err-divider" aria-hidden="true" />
      <p className="err-desc">{resolvedDesc}</p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="err-actions">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
};

export default ErrorState;