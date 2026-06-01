import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Command } from "lucide-react";

export interface CommandItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
}

interface SearchModalProps {
  data: CommandItem[];
  children?: React.ReactNode;
  placeholder?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SearchModal({
  data,
  children,
  placeholder = "Search...",
  open: controlledOpen,
  onOpenChange,
}: SearchModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const filtered = query.trim()
    ? data.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase()) ||
          item.category?.toLowerCase().includes(query.toLowerCase())
      )
    : data;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].onSelect?.();
        setOpen(false);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [filtered, selectedIndex, setOpen]
  );

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setOpen]);

  if (!isOpen) {
    return (
      <>
        {children ? (
          <div onClick={() => setOpen(true)}>{children}</div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="nav__action-btn"
            aria-label="Search"
            title="Search (Ctrl+K)"
          >
            <Search size={16} />
          </button>
        )}
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[15vh]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div
        className="relative w-full max-w-lg rounded-xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-color)",
        }}
      >
        <div
          className="flex items-center gap-3 px-4 border-b"
          style={{ borderColor: "var(--border-color)" }}
        >
          <Search size={16} style={{ color: "var(--text-tertiary)" }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 h-12 bg-transparent text-sm outline-none border-none"
            style={{ color: "var(--text-primary)" }}
          />
          <kbd
            className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-mono"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-tertiary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <Command size={10} />K
          </kbd>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
            style={{ color: "var(--text-tertiary)" }}
          >
            <X size={16} />
          </button>
        </div>
        <div
          ref={listRef}
          className="max-h-72 overflow-y-auto p-2 space-y-0.5"
        >
          {filtered.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: "var(--text-tertiary)" }}>
              No results found.
            </p>
          )}
          {filtered.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                item.onSelect?.();
                setOpen(false);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors"
              style={{
                backgroundColor:
                  index === selectedIndex ? "var(--bg-tertiary)" : "transparent",
                color: "var(--text-primary)",
              }}
            >
              {item.icon && (
                <span className="shrink-0" style={{ color: "var(--color-accent)" }}>
                  {item.icon}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{item.title}</div>
                {item.description && (
                  <div
                    className="text-xs truncate"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {item.description}
                  </div>
                )}
              </div>
              {item.category && (
                <span
                  className="shrink-0 text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-tertiary)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  {item.category}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
