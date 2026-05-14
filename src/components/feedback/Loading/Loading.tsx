import React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'bar' | 'skeleton-card';

export interface LoadingProps {
  variant?: LoadingVariant;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  /** Show label below the indicator */
  showLabel?: boolean;
  /** Full-page overlay mode */
  overlay?: boolean;
  /** Overlay backdrop blur */
  blur?: boolean;
  className?: string;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');

  /* ── Overlay ── */
  .loading-overlay {
    position: fixed;
    inset: 0;
    z-index: 99998;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(9,9,11,0.8);
  }
  .loading-overlay--blur { backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }

  /* ── Wrapper ── */
  .loading-wrap {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    font-family: 'DM Sans', sans-serif;
  }

  .loading-label {
    font-size: 0.8rem;
    font-weight: 500;
    color: #475569;
    letter-spacing: 0.02em;
  }

  /* ════════════════════════════
     SPINNER
  ════════════════════════════ */
  .loading-spinner {
    border-radius: 50%;
    border-style: solid;
    border-color: #1e293b;
    border-top-color: #38bdf8;
    animation: ls-spin 0.7s linear infinite;
  }
  .loading-spinner--sm { width: 20px; height: 20px; border-width: 2px; }
  .loading-spinner--md { width: 32px; height: 32px; border-width: 2.5px; }
  .loading-spinner--lg { width: 48px; height: 48px; border-width: 3px; }

  @keyframes ls-spin { to { transform: rotate(360deg); } }

  /* ════════════════════════════
     DOTS
  ════════════════════════════ */
  .loading-dots {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .loading-dot {
    border-radius: 50%;
    background: #38bdf8;
    animation: ld-bounce 1.1s ease-in-out infinite;
  }
  .loading-dots--sm .loading-dot { width: 6px; height: 6px; }
  .loading-dots--md .loading-dot { width: 8px; height: 8px; }
  .loading-dots--lg .loading-dot { width: 11px; height: 11px; }

  .loading-dot:nth-child(1) { animation-delay: 0s;    background: #38bdf8; }
  .loading-dot:nth-child(2) { animation-delay: 0.18s; background: #818cf8; }
  .loading-dot:nth-child(3) { animation-delay: 0.36s; background: #38bdf8; opacity: 0.6; }

  @keyframes ld-bounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40%           { transform: scale(1);   opacity: 1; }
  }

  /* ════════════════════════════
     PULSE (ring)
  ════════════════════════════ */
  .loading-pulse {
    position: relative;
    border-radius: 50%;
    background: rgba(56,189,248,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .loading-pulse--sm { width: 32px; height: 32px; }
  .loading-pulse--md { width: 48px; height: 48px; }
  .loading-pulse--lg { width: 64px; height: 64px; }

  .loading-pulse::before,
  .loading-pulse::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(56,189,248,0.12);
    animation: lp-pulse 2s ease-out infinite;
  }
  .loading-pulse::after { animation-delay: 0.7s; }

  .loading-pulse-core {
    width: 40%;
    height: 40%;
    border-radius: 50%;
    background: #38bdf8;
    box-shadow: 0 0 12px rgba(56,189,248,0.7);
    animation: lp-core 2s ease-in-out infinite;
    position: relative;
    z-index: 1;
  }

  @keyframes lp-pulse {
    0%   { transform: scale(1);   opacity: 0.6; }
    100% { transform: scale(2.4); opacity: 0; }
  }
  @keyframes lp-core {
    0%, 100% { transform: scale(1);    box-shadow: 0 0 12px rgba(56,189,248,0.7); }
    50%       { transform: scale(0.85); box-shadow: 0 0 20px rgba(56,189,248,0.9); }
  }

  /* ════════════════════════════
     BAR (indeterminate)
  ════════════════════════════ */
  .loading-bar-wrap {
    overflow: hidden;
    border-radius: 999px;
    background: #1e293b;
  }
  .loading-bar-wrap--sm { width: 120px; height: 3px; }
  .loading-bar-wrap--md { width: 200px; height: 4px; }
  .loading-bar-wrap--lg { width: 300px; height: 5px; }

  .loading-bar-track {
    height: 100%;
    width: 40%;
    background: linear-gradient(90deg, #0ea5e9, #38bdf8, #818cf8);
    border-radius: 999px;
    animation: lb-slide 1.4s cubic-bezier(0.4,0,0.2,1) infinite;
  }

  @keyframes lb-slide {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(350%); }
  }

  /* ════════════════════════════
     SKELETON CARD
  ════════════════════════════ */
  .loading-skeleton-card {
    width: 100%;
    max-width: 340px;
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 14px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .loading-skel-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .loading-skel {
    border-radius: 6px;
    background: linear-gradient(
      90deg,
      #1e293b 25%,
      #273548 50%,
      #1e293b 75%
    );
    background-size: 200% 100%;
    animation: skel-shimmer 1.5s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes skel-shimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  .loading-skel--circle { border-radius: 50%; }
`;

let styleInjected = false;
function injectStyles() {
  if (styleInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.textContent = styles;
  document.head.appendChild(el);
  styleInjected = true;
}

// ─── Sub-renderers ────────────────────────────────────────────────────────────

const Spinner: React.FC<{ size: string }> = ({ size }) => (
  <div className={`loading-spinner loading-spinner--${size}`} role="progressbar" aria-label="Loading" />
);

const Dots: React.FC<{ size: string }> = ({ size }) => (
  <div className={`loading-dots loading-dots--${size}`} role="progressbar" aria-label="Loading">
    <div className="loading-dot" />
    <div className="loading-dot" />
    <div className="loading-dot" />
  </div>
);

const Pulse: React.FC<{ size: string }> = ({ size }) => (
  <div className={`loading-pulse loading-pulse--${size}`} role="progressbar" aria-label="Loading">
    <div className="loading-pulse-core" />
  </div>
);

const Bar: React.FC<{ size: string }> = ({ size }) => (
  <div className={`loading-bar-wrap loading-bar-wrap--${size}`} role="progressbar" aria-label="Loading">
    <div className="loading-bar-track" />
  </div>
);

const SkeletonCard: React.FC = () => (
  <div className="loading-skeleton-card" aria-label="Loading content" role="progressbar">
    <div className="loading-skel-row">
      <div className="loading-skel loading-skel--circle" style={{ width: 40, height: 40 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="loading-skel" style={{ height: 12, width: '60%' }} />
        <div className="loading-skel" style={{ height: 10, width: '40%' }} />
      </div>
    </div>
    <div className="loading-skel" style={{ height: 10, width: '90%' }} />
    <div className="loading-skel" style={{ height: 10, width: '75%' }} />
    <div className="loading-skel" style={{ height: 10, width: '55%' }} />
    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
      <div className="loading-skel" style={{ height: 28, flex: 1, borderRadius: 8 }} />
      <div className="loading-skel" style={{ height: 28, flex: 1, borderRadius: 8 }} />
    </div>
  </div>
);

const variantMap = {
  spinner: Spinner,
  dots: Dots,
  pulse: Pulse,
  bar: Bar,
};

// ─── Component ───────────────────────────────────────────────────────────────

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  label,
  showLabel = false,
  overlay = false,
  blur = false,
  className = '',
}) => {
  injectStyles();

  const inner = (
    <div className={`loading-wrap ${className}`}>
      {variant === 'skeleton-card' ? (
        <SkeletonCard />
      ) : (
        (() => {
          const Cmp = variantMap[variant];
          return <Cmp size={size} />;
        })()
      )}
      {showLabel && label && (
        <p className="loading-label">{label}</p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className={`loading-overlay${blur ? ' loading-overlay--blur' : ''}`} role="dialog" aria-label={label ?? 'Loading'}>
        {inner}
      </div>
    );
  }

  return inner;
};

export default Loading;