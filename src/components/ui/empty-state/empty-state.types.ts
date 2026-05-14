import type { ReactNode } from 'react';

export type EmptyStateVariant = 'default' | 'search' | 'data' | 'error';

export interface EmptyStateProps {
  variant?: EmptyStateVariant;
  /** Override the default illustration */
  icon?: ReactNode;
  title: string;
  description?: string;
  /** Primary CTA button rendered below the description */
  action?: ReactNode;
  /** Secondary link / button */
  secondaryAction?: ReactNode;
  /** Extra class names */
  className?: string;
  /** Make the component take full available height */
  fullHeight?: boolean;
}
