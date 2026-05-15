import { useState, useRef, useEffect } from 'react';
import type { NavbarProps } from './navbar.types';

// ─── Styles ──────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  /* ── Shell ── */
  .nav {
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 0;
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    background: var(--glass-bg);
    border-bottom: 1px solid var(--glass-border);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    box-shadow: var(--glass-shadow);
    z-index: 100;
  }

  .nav--sticky {
    position: sticky;
    top: 0;
  }

  /* ── Brand ── */
  .nav__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    text-decoration: none;
    cursor: pointer;
  }

  .nav__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: var(--color-accent-gradient);
    box-shadow: 0 0 0 1px rgba(245,158,11,0.4), 0 4px 12px rgba(245,158,11,0.3);
    flex-shrink: 0;
  }

  .nav__app-name {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    white-space: nowrap;
  }

  .nav__app-name span {
    background: var(--color-accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Primary nav links (desktop) ── */
  .nav__links {
    display: flex;
    align-items: center;
    gap: 2px;
    list-style: none;
    margin: 0 0 0 32px;
    padding: 0;
    flex: 1;
  }

  .nav__link {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 13px;
    border-radius: 9px;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-secondary);
    text-decoration: none;
    cursor: pointer;
    border: none;
    background: transparent;
    outline: none;
    transition: color 0.18s ease, background 0.18s ease;
    white-space: nowrap;
    user-select: none;
  }

  .nav__link:hover:not(.nav__link--disabled) {
    color: var(--text-primary);
    background: rgba(255,255,255,0.06);
  }

  .nav__link--active {
    color: var(--color-accent) !important;
    background: rgba(245,158,11,0.1) !important;
  }

  .nav__link--active::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 18px;
    height: 2px;
    border-radius: 99px;
    background: var(--color-accent-gradient);
    box-shadow: 0 0 8px rgba(245,158,11,0.5);
  }

  .nav__link--disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  /* badge on nav link */
  .nav__link-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 99px;
    font-size: 0.65rem;
    font-weight: 600;
    background: rgba(56,189,248,0.18);
    color: #7dd3fc;
    border: 1px solid rgba(56,189,248,0.25);
    line-height: 1;
  }

  /* ── Spacer ── */
  .nav__spacer { flex: 1; }

  /* ── Right actions ── */
  .nav__actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  .nav__action-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 9px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.04);
    color: #94a3b8;
    cursor: pointer;
    transition:
      color      0.18s ease,
      background 0.18s ease,
      border-color 0.18s ease,
      transform  0.18s cubic-bezier(0.34,1.56,0.64,1);
    outline: none;
    flex-shrink: 0;
  }

  .nav__action-btn:hover {
    color: #e2e8f0;
    background: rgba(255,255,255,0.09);
    border-color: rgba(255,255,255,0.13);
    transform: translateY(-1px);
  }

  .nav__action-btn:active {
    transform: scale(0.93);
  }

  .nav__action-dot {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0ea5e9, #38bdf8);
    box-shadow: 0 0 6px rgba(56,189,248,0.7);
    border: 1.5px solid #09090b;
  }

  .nav__action-count {
    position: absolute;
    top: 3px;
    right: 3px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 99px;
    font-size: 0.6rem;
    font-weight: 700;
    background: linear-gradient(135deg, #0ea5e9, #38bdf8);
    color: #0c1a2e;
    border: 1.5px solid #09090b;
    line-height: 1;
  }

  /* ── Divider ── */
  .nav__divider {
    width: 1px;
    height: 22px;
    background: rgba(255,255,255,0.08);
    margin: 0 8px;
    flex-shrink: 0;
  }

  /* ── User slot ── */
  .nav__user {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  /* ── Hamburger (mobile) ── */
  .nav__hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    transition: background 0.15s;
  }
  .nav__hamburger:hover { background: rgba(255,255,255,0.07); }

  .nav__hamburger-bar {
    display: block;
    width: 20px;
    height: 2px;
    border-radius: 2px;
    background: #94a3b8;
    transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
    transform-origin: center;
  }
  .nav__hamburger--open .nav__hamburger-bar:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .nav__hamburger--open .nav__hamburger-bar:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }
  .nav__hamburger--open .nav__hamburger-bar:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  /* ── Mobile drawer ── */
  .nav__drawer {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    z-index: 10000;
    background: rgba(9, 9, 11, 0.96);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    padding: 12px 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    /* animation */
    transform-origin: top;
    animation: nav-drawer-in 0.22s cubic-bezier(0.4,0,0.2,1) both;
  }

  @keyframes nav-drawer-in {
    from { opacity: 0; transform: translateY(-8px) scaleY(0.96); }
    to   { opacity: 1; transform: translateY(0)    scaleY(1);    }
  }

  .nav__drawer-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 14px;
    border-radius: 10px;
    font-size: 0.88rem;
    font-weight: 500;
    color: #94a3b8;
    text-decoration: none;
    cursor: pointer;
    border: none;
    background: transparent;
    transition: color 0.15s, background 0.15s;
    width: 100%;
    text-align: left;
    outline: none;
    justify-content: space-between;
  }

  .nav__drawer-link:hover:not(.nav__drawer-link--disabled) {
    color: #e2e8f0;
    background: rgba(255,255,255,0.06);
  }

  .nav__drawer-link--active {
    color: var(--color-accent) !important;
    background: rgba(245,158,11,0.1) !important;
  }

  .nav__drawer-link--disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .nav__drawer-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* ── Focus visible ── */
  .nav__link:focus-visible,
  .nav__action-btn:focus-visible,
  .nav__drawer-link:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .nav__links   { display: none; }
    .nav__hamburger { display: flex; }
  }
`;

let _navCSSInjected = false;
function injectNavCSS() {
  if (_navCSSInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.dataset.fs = 'navbar';
  el.textContent = CSS;
  document.head.appendChild(el);
  _navCSSInjected = true;
}

// ─── Default logo SVG ─────────────────────────────────────────────────────────

const DefaultLogo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 2L16 6V12L9 16L2 12V6L9 2Z" fill="#0c1a2e" />
    <path d="M6 9.5L8 11.5L12 7.5" stroke="#0c1a2e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export function Navbar({
  logo,
  appName = 'FinanceSharks',
  items = [],
  actions = [],
  userSlot,
  sticky = false,
  className = '',
  onMobileMenuToggle,
}: NavbarProps) {
  injectNavCSS();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const toggleDrawer = () => {
    const next = !drawerOpen;
    setDrawerOpen(next);
    onMobileMenuToggle?.(next);
  };

  // Close drawer on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        drawerRef.current &&
        hamburgerRef.current &&
        !drawerRef.current.contains(e.target as Node) &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        setDrawerOpen(false);
        onMobileMenuToggle?.(false);
      }
    };
    if (drawerOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [drawerOpen, onMobileMenuToggle]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        onMobileMenuToggle?.(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onMobileMenuToggle]);

  const navCls = ['nav', sticky ? 'nav--sticky' : '', className].filter(Boolean).join(' ');

  return (
    <>
      <nav className={navCls} role="navigation" aria-label="Primary navigation">
        {/* Brand */}
        <div className="nav__brand" role="link" tabIndex={0} aria-label={appName}>
          <div className="nav__logo">{logo ?? <DefaultLogo />}</div>
          <span className="nav__app-name">
            Finance<span>Sharks</span>
          </span>
        </div>

        {/* Desktop nav links */}
        {items.length > 0 && (
          <ul className="nav__links" role="list">
            {items.map((item) => {
              const cls = [
                'nav__link',
                item.active   ? 'nav__link--active'   : '',
                item.disabled ? 'nav__link--disabled' : '',
              ].filter(Boolean).join(' ');

              return (
                <li key={item.key}>
                  <button
                    className={cls}
                    onClick={item.disabled ? undefined : item.onClick}
                    aria-current={item.active ? 'page' : undefined}
                    aria-disabled={item.disabled}
                    tabIndex={item.disabled ? -1 : 0}
                  >
                    {item.icon && <span style={{ opacity: 0.75, display: 'inline-flex' }}>{item.icon}</span>}
                    {item.label}
                    {item.badge !== undefined && (
                      <span className="nav__link-badge">{item.badge}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <span className="nav__spacer" />

        {/* Action icon buttons */}
        {actions.length > 0 && (
          <div className="nav__actions" role="toolbar" aria-label="Quick actions">
            {actions.map((action) => (
              <button
                key={action.key}
                className="nav__action-btn"
                onClick={action.onClick}
                aria-label={action.label}
                title={action.label}
              >
                {action.icon}
                {typeof action.badge === 'number' && action.badge > 0 && (
                  <span className="nav__action-count" aria-label={`${action.badge} notifications`}>
                    {action.badge > 99 ? '99+' : action.badge}
                  </span>
                )}
                {typeof action.badge === 'string' && (
                  <span className="nav__action-dot" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Divider + user slot */}
        {userSlot && (
          <>
            <span className="nav__divider" aria-hidden="true" />
            <div className="nav__user">{userSlot}</div>
          </>
        )}

        {/* Hamburger */}
        <button
          ref={hamburgerRef}
          className={`nav__hamburger ${drawerOpen ? 'nav__hamburger--open' : ''}`}
          onClick={toggleDrawer}
          aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={drawerOpen}
          aria-controls="nav-mobile-drawer"
        >
          <span className="nav__hamburger-bar" />
          <span className="nav__hamburger-bar" />
          <span className="nav__hamburger-bar" />
        </button>
      </nav>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          ref={drawerRef}
          id="nav-mobile-drawer"
          className="nav__drawer"
          role="dialog"
          aria-label="Mobile navigation"
        >
          {items.map((item) => {
            const cls = [
              'nav__drawer-link',
              item.active   ? 'nav__drawer-link--active'   : '',
              item.disabled ? 'nav__drawer-link--disabled' : '',
            ].filter(Boolean).join(' ');

            return (
              <button
                key={item.key}
                className={cls}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.();
                    setDrawerOpen(false);
                  }
                }}
                aria-current={item.active ? 'page' : undefined}
                aria-disabled={item.disabled}
              >
                <span className="nav__drawer-left">
                  {item.icon && <span style={{ opacity: 0.7, display: 'inline-flex' }}>{item.icon}</span>}
                  {item.label}
                </span>
                {item.badge !== undefined && (
                  <span className="nav__link-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

Navbar.displayName = 'Navbar';
export default Navbar;
