import type { ReactNode } from 'react';

export interface BreadcrumbItem {
  /** Display label */
  label: ReactNode;
  /** If provided the item is rendered as a link/button */
  href?: string;
  /** Icon rendered before the label */
  icon?: ReactNode;
  /** onClick handler */
  onClick?: () => void;
}

export type BreadcrumbVariant = 'default' | 'ghost' | 'pill';

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Visual style */
  variant?: BreadcrumbVariant;
  /** Custom separator node; defaults to '/' */
  separator?: ReactNode;
  /** Maximum items to show; collapses middle items with '…' */
  maxItems?: number;
  /** Extra class names on the root element */
  className?: string;
}
