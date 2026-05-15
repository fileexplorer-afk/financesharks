import type { ReactNode } from 'react';

export type ErrorStateVariant = '404' | '500' | 'network' | 'permission' | 'generic';

export interface ErrorStateProps {
  variant?: ErrorStateVariant;
  /** Override the default illustration */
  icon?: ReactNode;
  title?: string;
  description?: string;
  /** Primary action (e.g. retry button) */
  action?: ReactNode;
  /** Secondary action (e.g. go home link) */
  secondaryAction?: ReactNode;
  /** Show a code / error id beneath the description */
  errorCode?: string;
  className?: string;
  fullHeight?: boolean;
}
