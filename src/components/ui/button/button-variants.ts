import type { ButtonVariant, ButtonSize } from './button.types';

export const variantStyles: Record<ButtonVariant, string> = {
  primary: 'btn--primary',
  glass:   'btn--glass',
  success: 'btn--success',
  danger:  'btn--danger',
  ghost:   'btn--ghost',
  outline: 'btn--outline',
  gold:    'btn--gold',
};

export const sizeStyles: Record<ButtonSize, string> = {
  xs: 'btn--xs',
  sm: 'btn--sm',
  md: 'btn--md',
  lg: 'btn--lg',
  xl: 'btn--xl',
};