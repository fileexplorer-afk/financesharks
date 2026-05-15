import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  variant?: 'line' | 'pill' | 'card';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export interface TabProps {
  value: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  className?: string;
}

export interface TabPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  keepMounted?: boolean;
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface TabsContext {
  active: string;
  setActive: (v: string) => void;
  variant: 'line' | 'pill' | 'card';
  size: 'sm' | 'md' | 'lg';
  fullWidth: boolean;
  registerTab: (value: string) => void;
}

const Ctx = createContext<TabsContext | null>(null);
function useTabsContext() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('Tab/TabPanel must be used inside <Tabs>');
  return ctx;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  .tabs-root {
    font-family: 'DM Sans', sans-serif;
    width: 100%;
  }

  /* ── TabList ── */
  .tabs-list {
    position: relative;
    display: flex;
    align-items: center;
  }
  .tabs-list--full { width: 100%; }
  .tabs-list--full .tab-btn { flex: 1; }

  /* Variant: line */
  .tabs-list--line {
    border-bottom: 1px solid #1e293b;
    gap: 0;
  }

  /* Variant: pill */
  .tabs-list--pill {
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 10px;
    padding: 4px;
    gap: 3px;
    display: inline-flex;
  }
  .tabs-list--pill.tabs-list--full { display: flex; }

  /* Variant: card */
  .tabs-list--card {
    gap: 6px;
  }

  /* ── Sliding indicator (line variant) ── */
  .tabs-indicator {
    position: absolute;
    bottom: -1px;
    height: 2px;
    background: linear-gradient(90deg, #38bdf8, #818cf8);
    border-radius: 2px 2px 0 0;
    transition: left 0.22s cubic-bezier(0.4, 0, 0.2, 1), width 0.22s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }

  /* ── Tab button ── */
  .tab-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    white-space: nowrap;
    outline: none;
    transition: color 0.15s, background 0.15s;
    border-radius: 0;
    text-decoration: none;
    flex-shrink: 0;
  }

  /* Size */
  .tab-btn--sm { padding: 7px 12px; font-size: 0.78rem; }
  .tab-btn--md { padding: 10px 16px; font-size: 0.85rem; }
  .tab-btn--lg { padding: 13px 20px; font-size: 0.925rem; }

  /* Line variant tab */
  .tabs-list--line .tab-btn {
    color: #475569;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
  }
  .tabs-list--line .tab-btn:hover:not(:disabled) { color: #94a3b8; }
  .tabs-list--line .tab-btn--active { color: #38bdf8; }

  /* Pill variant tab */
  .tabs-list--pill .tab-btn {
    color: #475569;
    border-radius: 7px;
    min-width: 0;
  }
  .tabs-list--pill .tab-btn:hover:not(:disabled) {
    color: #94a3b8;
    background: #1e293b;
  }
  .tabs-list--pill .tab-btn--active {
    background: #1e293b;
    color: #f1f5f9;
    box-shadow: 0 1px 6px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(56,189,248,0.15);
  }

  /* Card variant tab */
  .tabs-list--card .tab-btn {
    color: #475569;
    border-radius: 8px;
    border: 1px solid transparent;
    background: transparent;
  }
  .tabs-list--card .tab-btn:hover:not(:disabled) {
    color: #94a3b8;
    background: #0f172a;
    border-color: #1e293b;
  }
  .tabs-list--card .tab-btn--active {
    background: #0f172a;
    border-color: #38bdf8;
    color: #38bdf8;
    box-shadow: 0 0 0 1px rgba(56,189,248,0.15), 0 2px 12px rgba(56,189,248,0.1);
  }

  .tab-btn:disabled { opacity: 0.38; cursor: not-allowed; }

  .tab-btn:focus-visible::after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: inherit;
    outline: 2px solid #38bdf8;
    outline-offset: 2px;
    pointer-events: none;
  }

  .tab-btn__icon { flex-shrink: 0; color: inherit; }

  .tab-btn__badge {
    font-size: 0.68rem;
    font-weight: 600;
    min-width: 18px;
    height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    border-radius: 20px;
    background: #1e293b;
    color: #94a3b8;
    line-height: 1;
    transition: background 0.15s, color 0.15s;
  }
  .tab-btn--active .tab-btn__badge {
    background: rgba(56,189,248,0.2);
    color: #38bdf8;
  }

  /* ── Panel ── */
  .tabs-panel {
    outline: none;
    animation: tabs-panel-in 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes tabs-panel-in {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .tabs-panel--hidden { display: none; }
`;

let styleInjected = false;
function injectStyles() {
  if (styleInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.textContent = styles;
  document.head.appendChild(el);
  styleInjected = true;
}

// ─── Tabs (root) ─────────────────────────────────────────────────────────────

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  onChange,
  children,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  className = '',
}) => {
  injectStyles();
  const isControlled = controlledValue !== undefined;
  const [internalActive, setInternalActive] = useState<string>(defaultValue ?? '');
  const active = isControlled ? controlledValue! : internalActive;

  const registeredTabs = useRef<string[]>([]);

  const setActive = useCallback(
    (v: string) => {
      if (!isControlled) setInternalActive(v);
      onChange?.(v);
    },
    [isControlled, onChange],
  );

  const registerTab = useCallback((value: string) => {
    if (!registeredTabs.current.includes(value)) {
      registeredTabs.current.push(value);
      if (!isControlled && !internalActive) setInternalActive(value);
    }
  }, [isControlled, internalActive]);

  return (
    <Ctx.Provider value={{ active, setActive, variant, size, fullWidth, registerTab }}>
      <div className={`tabs-root ${className}`}>{children}</div>
    </Ctx.Provider>
  );
};

// ─── TabList ─────────────────────────────────────────────────────────────────

export const TabList: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const { variant, fullWidth } = useTabsContext();
  const listRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const { active } = useTabsContext();

  // Compute indicator position for line variant
  useEffect(() => {
    if (variant !== 'line' || !listRef.current) return;
    const activeBtn = listRef.current.querySelector<HTMLElement>('.tab-btn--active');
    if (activeBtn) {
      setIndicatorStyle({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    }
  }, [active, variant]);

  const cls = [
    'tabs-list',
    `tabs-list--${variant}`,
    fullWidth ? 'tabs-list--full' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div ref={listRef} className={cls} role="tablist">
      {children}
      {variant === 'line' && (
        <span className="tabs-indicator" style={indicatorStyle} aria-hidden="true" />
      )}
    </div>
  );
};

// ─── Tab ─────────────────────────────────────────────────────────────────────

export const Tab: React.FC<TabProps> = ({
  value,
  children,
  icon,
  badge,
  disabled = false,
  className = '',
}) => {
  const { active, setActive, size, registerTab } = useTabsContext();

  useEffect(() => { registerTab(value); }, [value, registerTab]);

  const isActive = active === value;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) setActive(value);
    }
  };

  const cls = [
    'tab-btn',
    `tab-btn--${size}`,
    isActive ? 'tab-btn--active' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      className={cls}
      tabIndex={isActive ? 0 : -1}
      onClick={() => !disabled && setActive(value)}
      onKeyDown={handleKeyDown}
      id={`tab-${value}`}
      aria-controls={`panel-${value}`}
    >
      {icon && <span className="tab-btn__icon">{icon}</span>}
      {children}
      {badge !== undefined && (
        <span className="tab-btn__badge" aria-label={`${badge} items`}>{badge}</span>
      )}
    </button>
  );
};

// ─── TabPanels ───────────────────────────────────────────────────────────────

export const TabPanels: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={className}>{children}</div>;

// ─── TabPanel ────────────────────────────────────────────────────────────────

export const TabPanel: React.FC<TabPanelProps> = ({
  value,
  children,
  className = '',
  keepMounted = false,
}) => {
  const { active } = useTabsContext();
  const isActive = active === value;

  if (!keepMounted && !isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      className={[
        'tabs-panel',
        !isActive ? 'tabs-panel--hidden' : '',
        className,
      ].filter(Boolean).join(' ')}
      hidden={!isActive}
    >
      {children}
    </div>
  );
};

export default Tabs;