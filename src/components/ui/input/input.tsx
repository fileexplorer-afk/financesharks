import * as React from "react";

import { cn } from "@/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<
  HTMLInputElement,
  InputProps
>(({ className, type, error, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        [
          // Layout
          "flex h-12 w-full",

          // Shape
          "rounded-2xl",

          // Border
          "border border-white/[0.06]",

          // Background
          "bg-[#0F0F12]/80",

          // Padding
          "px-4 py-3",

          // Typography
          "text-sm text-white placeholder:text-zinc-500",

          // Blur softness
          "backdrop-blur-xl",

          // Motion
          "transition-all duration-300 ease-out",

          // Focus
          "focus:outline-none",
          "focus:ring-2",
          "focus:ring-violet-500/30",
          "focus:border-violet-500/30",

          // Hover
          "hover:border-white/[0.10]",

          // Disabled
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",

          // Error state
          error &&
            "border-red-500/40 focus:ring-red-500/30",

          // Shadow depth
          "shadow-lg shadow-black/20",
        ],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";