import * as React from "react";

import { cn } from "@/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/80 px-4 py-3",
          "text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] backdrop-blur-xl",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/25 focus:border-[var(--color-accent)]/40",
          "hover:border-[var(--border-color-hover)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-[var(--color-danger)]/40 focus:ring-[var(--color-danger)]/25",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";