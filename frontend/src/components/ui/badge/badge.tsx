import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const badgeVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-1.5 overflow-hidden",
    "rounded-full text-xs font-medium tracking-tight px-3 py-1",
    "transform-gpu transition-all duration-300 ease-out select-none antialiased backdrop-blur-2xl",
    "hover:-translate-y-[1px] hover:scale-[1.02]",
    "before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.10] before:to-transparent before:pointer-events-none",
    "border",
  ],
  {
    variants: {
      variant: {
        default: "border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]",
        success: "border-[var(--color-success)]/20 bg-[var(--color-success)]/10 text-[var(--color-success)] shadow-[0_0_16px_rgba(16,185,129,0.1)]",
        danger: "border-[var(--color-danger)]/20 bg-[var(--color-danger)]/10 text-[var(--color-danger)] shadow-[0_0_16px_rgba(244,63,94,0.1)]",
        warning: "border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 text-[var(--color-accent)] shadow-[0_0_16px_rgba(245,158,11,0.1)]",
        info: "border-[var(--color-info)]/20 bg-[var(--color-info)]/10 text-[var(--color-info)] shadow-[0_0_16px_rgba(56,189,248,0.1)]",
        violet: "border-[var(--color-violet)]/20 bg-[var(--color-violet)]/10 text-[var(--color-violet)] shadow-[0_0_16px_rgba(139,92,246,0.12)]",
        outline: "border-[var(--border-color)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({
  className,
  variant,
  size,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({
          variant,
          size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}