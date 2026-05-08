import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'filled';
  align?: 'left' | 'right';
  maxHeight?: number;
  onChange?: (value: string, option: DropdownOption) => void;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  'aria-label'?: string;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

  .dd-root {
    position: relative;
    width: 100%;
    font-family: 'DM Sans', sans-serif;
  }

  .dd-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 6px;
  }

  .dd-trigger {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    border: 1px solid #1e293b;
    border-radius: 10px;
    background: #0f172a;
    color: #e2e8f0;
    cursor: pointer;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    -webkit-appearance: none;
  }

  .dd-trigger--sm { padding: 7px 12px; font-size: 0.8rem; }
  .dd-trigger--md { padding: 10px 14px; font-size: 0.875rem; }
  .dd-trigger--lg { padding: 13px 16px; font-size: 0.95rem; }

  .dd-trigger--ghost {
    background: transparent;
    border-color: transparent;
  }
  .dd-trigger--filled {
    background: #1e293b;
    border-color: #1e293b;
  }

  .dd-trigger:hover:not(:disabled) {
    border-color: #334155;
    background: #111827;
  }
  .dd-trigger--ghost:hover:not(:disabled) {
    background: #1e293b;
    border-color: transparent;
  }

  .dd-trigger--open {
    border-color: #38bdf8;
    box-shadow: 0 0 0 3px rgba(56,189,248,0.12);
  }

  .dd-trigger:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .dd-trigger--error {
    border-color: #f43f5e !important;
    box-shadow: 0 0 0 3px rgba(244,63,94,0.12) !important;
  }

  .dd-value {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  .dd-value__icon { flex-shrink: 0; color: #64748b; }
  .dd-value__text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
  .dd-value__text--placeholder { color: #475569; }

  .dd-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  .dd-clear-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #334155;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 0;
    transition: background 0.15s, color 0.15s;
  }
  .dd-clear-btn:hover { background: #475569; color: #e2e8f0; }

  .dd-chevron {
    color: #475569;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.15s;
    flex-shrink: 0;
  }
  .dd-chevron--open { transform: rotate(180deg); color: #38bdf8; }

  .dd-loading {
    width: 14px;
    height: 14px;
    border: 2px solid #1e293b;
    border-top-color: #38bdf8;
    border-radius: 50%;
    animation: dd-spin 0.7s linear infinite;
  }

  @keyframes dd-spin { to { transform: rotate(360deg); } }

  .dd-menu {
    position: absolute;
    z-index: 9999;
    width: 100%;
    margin-top: 6px;
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 12px;
    box-shadow: 0 20px 60px -10px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.4);
    overflow: hidden;
    animation: dd-appear 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .dd-menu--right { right: 0; left: auto; }

  @keyframes dd-appear {
    from { opacity: 0; transform: translateY(-6px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .dd-search-wrap {
    padding: 10px 10px 6px;
    border-bottom: 1px solid #1e293b;
  }
  .dd-search {
    width: 100%;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 7px;
    color: #e2e8f0;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.825rem;
    padding: 7px 10px 7px 32px;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s;
  }
  .dd-search:focus { border-color: #38bdf8; }
  .dd-search-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #475569;
    pointer-events: none;
  }
  .dd-search-container { position: relative; }

  .dd-list {
    overflow-y: auto;
    padding: 6px;
  }

  .dd-option {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 9px 10px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: #cbd5e1;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    text-align: left;
    cursor: pointer;
    transition: background 0.1s, color 0.1s;
    outline: none;
    box-sizing: border-box;
  }
  .dd-option:hover:not(.dd-option--disabled) {
    background: #1e293b;
    color: #f1f5f9;
  }
  .dd-option--focused:not(.dd-option--disabled) {
    background: #1e293b;
    color: #f1f5f9;
  }
  .dd-option--selected {
    background: rgba(56,189,248,0.1);
    color: #38bdf8;
  }
  .dd-option--selected:hover { background: rgba(56,189,248,0.15); }
  .dd-option--disabled { opacity: 0.38; cursor: not-allowed; }

  .dd-option__icon { flex-shrink: 0; color: #64748b; }
  .dd-option--selected .dd-option__icon { color: #38bdf8; }

  .dd-option__content { flex: 1; min-width: 0; }
  .dd-option__label { font-weight: 500; }
  .dd-option__desc {
    font-size: 0.75rem;
    color: #64748b;
    margin-top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dd-option__badge {
    flex-shrink: 0;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    padding: 2px 7px;
    border-radius: 20px;
    background: #1e293b;
    color: #94a3b8;
  }
  .dd-option--selected .dd-option__badge { background: rgba(56,189,248,0.2); color: #38bdf8; }

  .dd-check {
    flex-shrink: 0;
    color: #38bdf8;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .dd-option--selected .dd-check { opacity: 1; }

  .dd-empty {
    padding: 20px;
    text-align: center;
    color: #475569;
    font-size: 0.825rem;
  }

  .dd-helper {
    margin-top: 5px;
    font-size: 0.75rem;
    color: #64748b;
  }
  .dd-error-text {
    margin-top: 5px;
    font-size: 0.75rem;
    color: #f43f5e;
    display: flex;
    align-items: center;
    gap: 4px;
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

// ─── Component ───────────────────────────────────────────────────────────────

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value: controlledValue,
  defaultValue,
  placeholder = 'Select an option',
  label,
  helperText,
  error,
  disabled = false,
  searchable = false,
  clearable = false,
  loading = false,
  size = 'md',
  variant = 'default',
  align = 'left',
  maxHeight = 260,
  onChange,
  onOpen,
  onClose,
  className = '',
  'aria-label': ariaLabel,
}) => {
  injectStyles();

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? '');
  const value = isControlled ? controlledValue : internalValue;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) ?? null;

  const filtered = searchable && search
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(search.toLowerCase()) ||
          o.description?.toLowerCase().includes(search.toLowerCase()),
      )
    : options;

  const openMenu = useCallback(() => {
    if (disabled || loading) return;
    setOpen(true);
    setSearch('');
    setFocusedIndex(selectedOption ? filtered.findIndex((o) => o.value === selectedOption.value) : -1);
    onOpen?.();
    setTimeout(() => searchRef.current?.focus(), 50);
  }, [disabled, loading, onOpen, selectedOption, filtered]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setFocusedIndex(-1);
    onClose?.();
    triggerRef.current?.focus();
  }, [onClose]);

  const selectOption = useCallback(
    (option: DropdownOption) => {
      if (option.disabled) return;
      if (!isControlled) setInternalValue(option.value);
      onChange?.(option.value, option);
      closeMenu();
    },
    [isControlled, onChange, closeMenu],
  );

  const clearValue = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isControlled) setInternalValue('');
      onChange?.('', { value: '', label: '' });
    },
    [isControlled, onChange],
  );

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, closeMenu]);

  // Keyboard nav
  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) openMenu();
    }
    if (e.key === 'Escape') closeMenu();
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((i) => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      selectOption(filtered[focusedIndex]);
    }
  };

  const triggerClass = [
    'dd-trigger',
    `dd-trigger--${size}`,
    `dd-trigger--${variant}`,
    open ? 'dd-trigger--open' : '',
    error ? 'dd-trigger--error' : '',
  ].filter(Boolean).join(' ');

  return (
    <div ref={rootRef} className={`dd-root ${className}`}>
      {label && (
        <label className="dd-label" id={`dd-label-${label.replace(/\s/g, '-')}`}>
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        type="button"
        className={triggerClass}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel ?? label}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="dd-value">
          {selectedOption?.icon && (
            <span className="dd-value__icon">{selectedOption.icon}</span>
          )}
          <span
            className={`dd-value__text${!selectedOption ? ' dd-value__text--placeholder' : ''}`}
          >
            {selectedOption?.label ?? placeholder}
          </span>
        </span>

        <span className="dd-actions">
          {clearable && value && !disabled && (
            <button
              type="button"
              className="dd-clear-btn"
              aria-label="Clear selection"
              onClick={clearValue}
              tabIndex={-1}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
          {loading ? (
            <div className="dd-loading" aria-label="Loading options" />
          ) : (
            <svg
              className={`dd-chevron${open ? ' dd-chevron--open' : ''}`}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </button>

      {open && (
        <div
          className={`dd-menu${align === 'right' ? ' dd-menu--right' : ''}`}
          role="listbox"
          aria-label={label ?? ariaLabel ?? 'Options'}
          onKeyDown={handleMenuKeyDown}
        >
          {searchable && (
            <div className="dd-search-wrap">
              <div className="dd-search-container">
                <svg className="dd-search-icon" width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M10 10l-2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  className="dd-search"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setFocusedIndex(0); }}
                  aria-label="Search options"
                />
              </div>
            </div>
          )}

          <div ref={listRef} className="dd-list" style={{ maxHeight }} role="presentation">
            {filtered.length === 0 ? (
              <div className="dd-empty">No options found</div>
            ) : (
              filtered.map((option, idx) => {
                const isSelected = option.value === value;
                const isFocused = idx === focusedIndex;
                const cls = [
                  'dd-option',
                  isSelected ? 'dd-option--selected' : '',
                  isFocused ? 'dd-option--focused' : '',
                  option.disabled ? 'dd-option--disabled' : '',
                ].filter(Boolean).join(' ');

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                    className={cls}
                    onClick={() => selectOption(option)}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    tabIndex={-1}
                  >
                    {option.icon && (
                      <span className="dd-option__icon">{option.icon}</span>
                    )}
                    <span className="dd-option__content">
                      <span className="dd-option__label">{option.label}</span>
                      {option.description && (
                        <span className="dd-option__desc">{option.description}</span>
                      )}
                    </span>
                    {option.badge && (
                      <span className="dd-option__badge">{option.badge}</span>
                    )}
                    <svg className="dd-check" width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M2 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {error ? (
        <p className="dd-error-text" role="alert">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <circle cx="5.5" cy="5.5" r="5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M5.5 3v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="5.5" cy="8" r="0.6" fill="currentColor" />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p className="dd-helper">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Dropdown;