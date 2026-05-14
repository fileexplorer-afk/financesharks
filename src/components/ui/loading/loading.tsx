import React from 'react';
import type { LoadingProps, LoadingVariant } from './loading.types';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  .loading {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .loading--overlay {
    position: absolute;
    inset: 0;
    z-index: 50;
    background: rgba(9,9,11,0.65);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border-radius: inherit;
  }
  .loading__label { font-size: 0.8rem; font-weight: 500; color: #71717a; }

  /* SPINNER */
  .loading__spinner {
    border-radius: 50%;
    border-style: solid;
    border-color: rgba(255,255,255,0.08);
    border-top-color: var(--lc, #38bdf8);
    animation: ls 0.7s linear infinite;
    box-shadow: 0 0 16px -4px var(--lc, #38bdf8);
  }
  @keyframes ls { to { transform: rotate(360deg); } }
  .loading--xs .loading__spinner { width:16px;height:16px;border-width:2px; }
  .loading--sm .loading__spinner { width:22px;height:22px;border-width:2px; }
  .loading--md .loading__spinner { width:32px;height:32px;border-width:3px; }
  .loading--lg .loading__spinner { width:44px;height:44px;border-width:3px; }
  .loading--xl .loading__spinner { width:60px;height:60px;border-width:4px; }

  /* DOTS */
  .loading__dots { display:flex;align-items:center;gap:6px; }
  .loading__dot {
    border-radius:50%;
    background:var(--lc,#38bdf8);
    animation:ld 1.2s ease-in-out infinite;
    opacity:0.3;
  }
  .loading__dot:nth-child(1){animation-delay:0s}
  .loading__dot:nth-child(2){animation-delay:.2s}
  .loading__dot:nth-child(3){animation-delay:.4s}
  @keyframes ld {
    0%,80%,100%{transform:scale(.6);opacity:.3}
    40%{transform:scale(1);opacity:1}
  }
  .loading--xs .loading__dot{width:5px;height:5px}
  .loading--sm .loading__dot{width:7px;height:7px}
  .loading--md .loading__dot{width:9px;height:9px}
  .loading--lg .loading__dot{width:12px;height:12px}
  .loading--xl .loading__dot{width:16px;height:16px}

  /* BAR */
  .loading__bar-track {
    border-radius:99px;
    background:rgba(255,255,255,.07);
    overflow:hidden;
    position:relative;
  }
  .loading__bar-fill {
    height:100%;
    border-radius:99px;
    background:linear-gradient(90deg,#0ea5e9,#38bdf8,#7dd3fc);
    background-size:200% 100%;
    animation:lb 1.6s ease-in-out infinite;
    box-shadow:0 0 10px rgba(56,189,248,.5);
  }
  @keyframes lb {
    0%  {background-position:200% center;margin-left:0%;width:30%}
    50% {background-position:0% center;margin-left:40%;width:40%}
    100%{background-position:200% center;margin-left:100%;width:10%}
  }
  .loading--xs .loading__bar-track{width:80px;height:3px}
  .loading--sm .loading__bar-track{width:100px;height:3px}
  .loading--md .loading__bar-track{width:140px;height:4px}
  .loading--lg .loading__bar-track{width:180px;height:5px}
  .loading--xl .loading__bar-track{width:240px;height:6px}

  /* PULSE */
  .loading__pulse {
    position:relative;
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius:50%;
  }
  .loading__pulse-core {
    position:relative;z-index:1;
    border-radius:50%;
    background:var(--lc,#38bdf8);
  }
  .loading__pulse-ring {
    position:absolute;inset:0;
    border-radius:50%;
    background:var(--lc,#38bdf8);
    opacity:0;
    animation:lp 2s ease-out infinite;
  }
  .loading__pulse-ring:nth-child(2){animation-delay:.5s}
  .loading__pulse-ring:nth-child(3){animation-delay:1s}
  @keyframes lp {
    0%{transform:scale(.9);opacity:.6}
    100%{transform:scale(2.2);opacity:0}
  }
  .loading--xs .loading__pulse{width:20px;height:20px} .loading--xs .loading__pulse-core{width:8px;height:8px}
  .loading--sm .loading__pulse{width:28px;height:28px} .loading--sm .loading__pulse-core{width:10px;height:10px}
  .loading--md .loading__pulse{width:40px;height:40px} .loading--md .loading__pulse-core{width:14px;height:14px}
  .loading--lg .loading__pulse{width:56px;height:56px} .loading--lg .loading__pulse-core{width:18px;height:18px}
  .loading--xl .loading__pulse{width:72px;height:72px} .loading--xl .loading__pulse-core{width:24px;height:24px}
`;

let _injected = false;
function inject() {
  if (_injected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.dataset.fs = 'loading';
  el.textContent = CSS;
  document.head.appendChild(el);
  _injected = true;
}

export function Loading({
  variant = 'spinner',
  size    = 'md',
  label,
  overlay = false,
  className = '',
  color   = '#38bdf8',
}: LoadingProps) {
  inject();

  const indicator: Record<LoadingVariant, React.ReactNode> = {
    spinner: <span className="loading__spinner" aria-hidden="true" />,
    dots: (
      <span className="loading__dots" aria-hidden="true">
        <span className="loading__dot" /><span className="loading__dot" /><span className="loading__dot" />
      </span>
    ),
    bar: (
      <span className="loading__bar-track" aria-hidden="true">
        <span className="loading__bar-fill" />
      </span>
    ),
    pulse: (
      <span className="loading__pulse" aria-hidden="true">
        <span className="loading__pulse-ring" />
        <span className="loading__pulse-ring" />
        <span className="loading__pulse-ring" />
        <span className="loading__pulse-core" />
      </span>
    ),
  };

  const cls = ['loading', `loading--${size}`, overlay ? 'loading--overlay' : '', className]
    .filter(Boolean).join(' ');

  return (
    <div
      className={cls}
      role="status"
      aria-label={label ?? 'Loading…'}
      style={{ '--lc': color } as React.CSSProperties}
    >
      {indicator[variant]}
      {label && <span className="loading__label">{label}</span>}
    </div>
  );
}

Loading.displayName = 'Loading';
export default Loading;
