import { useState } from 'react';
import type { BreadcrumbsProps, BreadcrumbItem } from './breadcrumbs.types';

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  /* ── Shared base ── */
  .bc {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.83rem;
    -webkit-font-smoothing: antialiased;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* ── Item wrapper ── */
  .bc__item {
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }

  /* ── Crumb button / span ── */
  .bc__crumb {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 6px;
    border-radius: 6px;
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: inherit;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    outline: none;
    transition:
      color      0.15s ease,
      background 0.15s ease;
    white-space: nowrap;
    user-select: none;
  }

  .bc__crumb:focus-visible {
    outline: 2px solid #38bdf8;
    outline-offset: 2px;
  }

  /* ── Icon inside crumb ── */
  .bc__icon {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    opacity: 0.7;
  }

  /* ── Separator ── */
  .bc__sep {
    display: inline-flex;
    align-items: center;
    margin: 0 1px;
    pointer-events: none;
    user-select: none;
  }

  /* ── Ellipsis button ── */
  .bc__ellipsis {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 8px;
    border-radius: 6px;
    border: none;
    background: rgba(255,255,255,0.05);
    color: #52525b;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    outline: none;
    transition: background 0.15s, color 0.15s;
    letter-spacing: 0.05em;
  }
  .bc__ellipsis:hover { background: rgba(255,255,255,0.09); color: #a1a1aa; }
  .bc__ellipsis:focus-visible { outline: 2px solid #38bdf8; outline-offset: 2px; }

  /* ════════════════════════════
     VARIANT: DEFAULT
  ════════════════════════════ */
  .bc--default .bc__crumb--link {
    color: #52525b;
  }
  .bc--default .bc__crumb--link:hover {
    color: #e2e8f0;
    background: rgba(255,255,255,0.05);
  }
  .bc--default .bc__crumb--current {
    color: #f4f4f5;
    cursor: default;
    font-weight: 600;
    background: transparent;
  }
  .bc--default .bc__sep {
    color: #3f3f46;
    font-size: 0.78rem;
  }

  /* ════════════════════════════
     VARIANT: GHOST
  ════════════════════════════ */
  .bc--ghost .bc__crumb--link {
    color: #52525b;
    padding: 3px 4px;
  }
  .bc--ghost .bc__crumb--link:hover {
    color: #38bdf8;
    background: transparent;
  }
  .bc--ghost .bc__crumb--current {
    color: #38bdf8;
    cursor: default;
    font-weight: 600;
    background: transparent;
    padding: 3px 4px;
  }
  .bc--ghost .bc__sep {
    color: #27272a;
    font-size: 0.72rem;
  }

  /* ════════════════════════════
     VARIANT: PILL
  ════════════════════════════ */
  .bc--pill {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 99px;
    padding: 4px 10px;
    gap: 0;
    width: fit-content;
  }
  .bc--pill .bc__crumb {
    border-radius: 99px;
    padding: 3px 10px;
  }
  .bc--pill .bc__crumb--link {
    color: #71717a;
  }
  .bc--pill .bc__crumb--link:hover {
    color: #e2e8f0;
    background: rgba(255,255,255,0.07);
  }
  .bc--pill .bc__crumb--current {
    color: #0c1a2e;
    font-weight: 600;
    cursor: default;
    background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 60%, #7dd3fc 100%);
    box-shadow: 0 0 10px rgba(56,189,248,0.35);
  }
  .bc--pill .bc__sep {
    color: #3f3f46;
    font-size: 0.72rem;
    margin: 0 2px;
  }
`;

let _bcCSSInjected = false;
function injectBreadcrumbsCSS() {
  if (_bcCSSInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.dataset.fs = 'breadcrumbs';
  el.textContent = CSS;
  document.head.appendChild(el);
  _bcCSSInjected = true;
}

// ─── Default separator ────────────────────────────────────────────────────────

const DefaultSep = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path d="M3 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Helper: resolve visible items with optional collapse ─────────────────────

function resolveVisible(
  items: BreadcrumbItem[],
  maxItems: number,
  expanded: boolean,
): Array<BreadcrumbItem | 'ellipsis'> {
  if (items.length <= maxItems || expanded) return items;
  // Always show first + last two
  const head = [items[0]];
  const tail = items.slice(-2);
  return [...head, 'ellipsis', ...tail];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Breadcrumbs({
  items,
  variant = 'default',
  separator,
  maxItems = 4,
  className = '',
}: BreadcrumbsProps) {
  injectBreadcrumbsCSS();
  const [expanded, setExpanded] = useState(false);

  if (!items.length) return null;

  const sep = separator ?? <DefaultSep />;
  const visible = resolveVisible(items, maxItems, expanded);
  const rootCls = ['bc', `bc--${variant}`, className].filter(Boolean).join(' ');

  return (
    <nav aria-label="Breadcrumb">
      <ol className={rootCls}>
        {visible.map((item, idx) => {
          const isLast = idx === visible.length - 1;
          const isEllipsis = item === 'ellipsis';

          return (
            <li key={idx} className="bc__item">
              {/* Separator (not before first item) */}
              {idx > 0 && (
                <span className="bc__sep" aria-hidden="true">
                  {sep}
                </span>
              )}

              {/* Ellipsis */}
              {isEllipsis ? (
                <button
                  className="bc__ellipsis"
                  onClick={() => setExpanded(true)}
                  aria-label="Show full path"
                  title="Show all"
                >
                  •••
                </button>
              ) : (
                /* Regular crumb */
                (() => {
                  const crumb = item as BreadcrumbItem;
                  const isLink = !isLast && (crumb.href || crumb.onClick);
                  const crumbCls = [
                    'bc__crumb',
                    isLast ? 'bc__crumb--current' : 'bc__crumb--link',
                  ].join(' ');

                  const inner = (
                    <>
                      {crumb.icon && <span className="bc__icon">{crumb.icon}</span>}
                      {crumb.label}
                    </>
                  );

                  if (isLast) {
                    return (
                      <span
                        className={crumbCls}
                        aria-current="page"
                      >
                        {inner}
                      </span>
                    );
                  }

                  if (isLink) {
                    return (
                      <button
                        className={crumbCls}
                        onClick={crumb.onClick}
                        aria-label={typeof crumb.label === 'string' ? crumb.label : undefined}
                      >
                        {inner}
                      </button>
                    );
                  }

                  return (
                    <span className={crumbCls}>
                      {inner}
                    </span>
                  );
                })()
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

Breadcrumbs.displayName = 'Breadcrumbs';
export default Breadcrumbs;
