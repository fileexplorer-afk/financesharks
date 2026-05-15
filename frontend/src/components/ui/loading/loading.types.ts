export type LoadingVariant = 'spinner' | 'dots' | 'bar' | 'pulse';
export type LoadingSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  /** Text shown below the indicator */
  label?: string;
  /** Render as an overlay over parent (position: absolute, inset 0) */
  overlay?: boolean;
  /** Extra class names */
  className?: string;
  /** Colour — defaults to sky-blue brand colour */
  color?: string;
}
