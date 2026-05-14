import React, { useState } from 'react';
import type { SidebarProps, SidebarItem, SidebarGroup } from './sidebar.types';

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  /* ── Shell ── */
  .sidebar {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    background: var(--glass-bg);
    border-right: 1px solid var(--glass-border);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    box-shadow: 4px 0 24px rgba(0,0,0,0.3);
    transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: visible;
    flex-shrink: 0;
  }

  /* ── Toggle button ── */
  .sidebar__toggle {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -14px;
    z-index: 20;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--color-accent);
    border: 2px solid var(--bg-primary);
    box-shadow:
      0 0 0 2px var(--bg-primary),
      0 2px 12px rgba(245,158,11,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--bg-primary);
    transition: color 0.15s, background 0.15s, transform 0.28s ease;
    outline: none;
    flex-shrink: 0;
  }
  .sidebar__toggle:hover { background: var(--color-accent-hover); color: var(--bg-primary); }
  .sidebar__toggle:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
  .sidebar--collapsed .sidebar__toggle { transform: translateY(-50%) rotate(180deg); }

  /* ── Scroll area ── */
  .sidebar__scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px 8px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.08) transparent;
  }
  .sidebar__scroll::-webkit-scrollbar { width: 4px; }
  .sidebar__scroll::-webkit-scrollbar-track { background: transparent; }
  .sidebar__scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

  /* ── Group ── */
  .sidebar__group { margin-bottom: 8px; }

  .sidebar__group-label {
    display: block;
    padding: 0 10px 6px;
    font-size: 0.67rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-tertiary);
    white-space: nowrap;
    overflow: hidden;
    transition: opacity 0.2s;
  }
  .sidebar--collapsed .sidebar__group-label { opacity: 0; height: 0; padding: 0; margin: 0; }

  /* ── Item ── */
  .sidebar__item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 11px;
    width: 100%;
    padding: 9px 10px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: var(--text-tertiary);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    outline: none;
    transition: color 0.18s ease, background 0.18s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1);
    white-space: nowrap;
    overflow: hidden;
    user-select: none;
    -webkit-font-smoothing: antialiased;
  }

  .sidebar__item:hover:not(.sidebar__item--disabled) {
    color: var(--text-primary);
    background: rgba(255,255,255,0.06);
    transform: translateX(2px);
  }

  .sidebar__item:active:not(.sidebar__item--disabled) {
    transform: translateX(1px) scale(0.98);
  }

  .sidebar__item:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 1px;
  }

  .sidebar__item--active {
    color: var(--color-accent) !important;
    background: rgba(245,158,11,0.08) !important;
  }

  .sidebar__item--active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    border-radius: 0 3px 3px 0;
    background: var(--color-accent-gradient);
    box-shadow: 0 0 10px rgba(245,158,11,0.5);
  }

  /* Disabled */
  .sidebar__item--disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  /* ── Icon ── */
  .sidebar__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    opacity: 0.7;
    transition: opacity 0.18s;
  }
  .sidebar__item--active .sidebar__icon { opacity: 1; }
  .sidebar__item:hover:not(.sidebar__item--disabled) .sidebar__icon { opacity: 0.9; }

  /* ── Label ── */
  .sidebar__label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: opacity 0.2s, max-width 0.28s;
    max-width: 180px;
  }
  .sidebar--collapsed .sidebar__label {
    opacity: 0;
    max-width: 0;
    pointer-events: none;
  }

  /* ── Badge ── */
  .sidebar__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 99px;
    font-size: 0.65rem;
    font-weight: 600;
    line-height: 1;
    transition: opacity 0.2s;
    flex-shrink: 0;
  }
  .sidebar--collapsed .sidebar__badge { opacity: 0; pointer-events: none; }

  .sidebar__badge--default { background: rgba(255,255,255,0.08);  color: var(--text-secondary); border: 1px solid var(--border-color); }
  .sidebar__badge--success { background: rgba(16,185,129,0.15);  color: var(--color-success); border: 1px solid rgba(16,185,129,0.25); }
  .sidebar__badge--danger  { background: rgba(244,63,94,0.15);   color: var(--color-danger); border: 1px solid rgba(244,63,94,0.25);  }
  .sidebar__badge--warning { background: rgba(245,158,11,0.15);  color: var(--color-accent); border: 1px solid rgba(245,158,11,0.25); }
  .sidebar__badge--info    { background: rgba(56,189,248,0.15);  color: var(--color-info); border: 1px solid rgba(56,189,248,0.25); }

  /* ── Separator between groups ── */
  .sidebar__sep {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 8px 10px;
  }

  /* ── Footer ── */
  .sidebar__footer {
    flex-shrink: 0;
    padding: 10px 8px 14px;
    border-top: 1px solid var(--border-color);
    overflow: hidden;
  }

  /* ── Tooltip for collapsed icons ── */
  .sidebar__tooltip {
    position: absolute;
    left: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
    z-index: 200;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 5px 10px;
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    animation: sidebar-tip-in 0.14s ease both;
  }
  .sidebar__tooltip::before {
    content: '';
    position: absolute;
    left: -5px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    background: var(--bg-tertiary);
    border-left: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
  }
  @keyframes sidebar-tip-in {
    from { opacity: 0; transform: translateY(-50%) translateX(-4px); }
    to   { opacity: 1; transform: translateY(-50%) translateX(0);    }
  }
`;

let _sidebarCSSInjected = false;
function injectSidebarCSS() {
  if (_sidebarCSSInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.dataset.fs = 'sidebar';
  el.textContent = CSS;
  document.head.appendChild(el);
  _sidebarCSSInjected = true;
}

// ─── Chevron icon ─────────────────────────────────────────────────────────────

const ChevronLeft = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M7.5 2L4 6l3.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Single item ──────────────────────────────────────────────────────────────

function SidebarItemRow({
  item,
  collapsed,
}: {
  item: SidebarItem;
  collapsed: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const cls = [
    'sidebar__item',
    item.active   ? 'sidebar__item--active'   : '',
    item.disabled ? 'sidebar__item--disabled' : '',
  ].filter(Boolean).join(' ');

  const badgeVariant = item.badgeVariant ?? 'info';

  return (
    <li style={{ listStyle: 'none', position: 'relative' }}>
      <button
        className={cls}
        onClick={item.disabled ? undefined : item.onClick}
        aria-current={item.active ? 'page' : undefined}
        aria-disabled={item.disabled}
        tabIndex={item.disabled ? -1 : 0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={collapsed ? item.label : undefined}
      >
        {item.icon && <span className="sidebar__icon">{item.icon}</span>}
        <span className="sidebar__label">{item.label}</span>
        {item.badge !== undefined && (
          <span className={`sidebar__badge sidebar__badge--${badgeVariant}`}>
            {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
          </span>
        )}
      </button>

      {/* Collapsed tooltip */}
      {collapsed && hovered && (
        <span className="sidebar__tooltip" role="tooltip">
          {item.label}
          {item.badge !== undefined && ` · ${item.badge}`}
        </span>
      )}
    </li>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Sidebar({
  items,
  groups,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  expandedWidth  = 240,
  collapsedWidth = 60,
  footer,
  className = '',
}: SidebarProps) {
  injectSidebarCSS();

  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = controlledCollapsed ?? internalCollapsed;

  const toggleCollapsed = () => {
    const next = !isCollapsed;
    setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };

  // Resolve groups
  const resolvedGroups: SidebarGroup[] =
    groups ?? (items ? [{ items }] : []);

  const rootCls = [
    'sidebar',
    isCollapsed ? 'sidebar--collapsed' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <aside
      className={rootCls}
      style={{ width: isCollapsed ? collapsedWidth : expandedWidth }}
      aria-label="Side navigation"
    >
      {/* Collapse toggle */}
      <button
        className={`sidebar__toggle ${isCollapsed ? 'sidebar__toggle--collapsed' : ''}`}
        onClick={toggleCollapsed}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!isCollapsed}
      >
        <ChevronLeft />
      </button>

      {/* Scroll area */}
      <div className="sidebar__scroll">
        {resolvedGroups.map((group, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && <div className="sidebar__sep" aria-hidden="true" />}
            <div className="sidebar__group">
              {group.label && (
                <span className="sidebar__group-label" aria-hidden={isCollapsed}>
                  {group.label}
                </span>
              )}
              <ul style={{ margin: 0, padding: 0 }}>
                {group.items.map((item) => (
                  <SidebarItemRow key={item.key} item={item} collapsed={isCollapsed} />
                ))}
              </ul>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Footer */}
      {footer && <div className="sidebar__footer">{footer}</div>}
    </aside>
  );
}

Sidebar.displayName = 'Sidebar';
export default Sidebar;
