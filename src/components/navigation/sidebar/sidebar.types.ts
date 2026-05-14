import type { ReactNode } from 'react';

export interface SidebarItem {
  key: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  /** Numeric / string badge shown on the right */
  badge?: number | string;
  /** Badge colour preset */
  badgeVariant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  onClick?: () => void;
}

export interface SidebarGroup {
  /** Optional visible group label */
  label?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  /** Flat list of items OR grouped items — provide one, not both */
  items?: SidebarItem[];
  groups?: SidebarGroup[];
  /** Collapsed = icon-only rail */
  collapsed?: boolean;
  /** Controlled collapse toggle */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Width when expanded (px) */
  expandedWidth?: number;
  /** Width when collapsed (px) */
  collapsedWidth?: number;
  /** Content rendered below the navigation items (e.g. user card) */
  footer?: ReactNode;
  /** Extra class name on the root element */
  className?: string;
}
