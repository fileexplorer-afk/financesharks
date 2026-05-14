import type { ReactNode } from 'react';

export interface NavItem {
  /** Unique key */
  key: string;
  /** Display label */
  label: string;
  /** Optional leading icon */
  icon?: ReactNode;
  /** Route href — if omitted the item is non-navigable */
  href?: string;
  /** Mark this item as currently active */
  active?: boolean;
  /** Disable the item */
  disabled?: boolean;
  /** Small badge count shown on the item */
  badge?: number | string;
  /** onClick handler */
  onClick?: () => void;
}

export interface NavbarAction {
  key: string;
  icon: ReactNode;
  label: string;
  badge?: number | string;
  onClick?: () => void;
}

export interface NavbarProps {
  /** Brand / logo area */
  logo?: ReactNode;
  /** App name shown next to the logo */
  appName?: string;
  /** Primary navigation items */
  items?: NavItem[];
  /** Icon-only action buttons shown on the right (bell, settings…) */
  actions?: NavbarAction[];
  /** Avatar / user menu rendered on the far right */
  userSlot?: ReactNode;
  /** Sticky to the top of the viewport */
  sticky?: boolean;
  /** Extra class names */
  className?: string;
  /** Called when the hamburger is toggled on mobile */
  onMobileMenuToggle?: (open: boolean) => void;
}
