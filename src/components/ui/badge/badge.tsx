import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const badgeVariants = cva(
  [
    // Layout
    "relative inline-flex items-center justify-center gap-1.5 overflow-hidden",

    // Shape
    "rounded-full",

    // Typography
    "text-xs font-medium tracking-tight",

    // Spacing
    "px-3 py-1",

    // Motion
    "transform-gpu transition-all duration-300 ease-out",

    // Interaction
    "hover:-translate-y-[1px]",
    "hover:scale-[1.02]",

    // Polish
    "select-none antialiased",
    "backdrop-blur-2xl",

    // Layering
    "before:absolute before:inset-0",
    "before:bg-gradient-to-b",
    "before:from-white/[0.12]",
    "before:to-transparent",
    "before:pointer-events-none",

    // Border
    "border",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-white/[0.08]",
          "bg-gradient-to-b",
          "from-zinc-800/90",
          "to-zinc-900/90",
          "text-zinc-200",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
          "shadow-black/30",
        ].join(" "),

        success: [
          "border-emerald-400/20",
          "bg-gradient-to-b",
          "from-emerald-500/20",
          "to-emerald-500/5",
          "text-emerald-200",

          // Glow
          "shadow-[0_0_20px_rgba(16,185,129,0.12)]",

          // Inner light
          "shadow-inner",
        ].join(" "),

        danger: [
          "border-red-400/20",
          "bg-gradient-to-b",
          "from-red-500/20",
          "to-red-500/5",
          "text-red-200",
          "shadow-[0_0_20px_rgba(239,68,68,0.12)]",
          "shadow-inner",
        ].join(" "),

        warning: [
          "border-amber-400/20",
          "bg-gradient-to-b",
          "from-amber-500/20",
          "to-amber-500/5",
          "text-amber-200",
          "shadow-[0_0_20px_rgba(245,158,11,0.12)]",
        ].join(" "),

        info: [
          "border-sky-400/20",
          "bg-gradient-to-b",
          "from-sky-500/20",
          "to-sky-500/5",
          "text-sky-200",
          "shadow-[0_0_20px_rgba(14,165,233,0.12)]",
        ].join(" "),

        violet: [
          "border-violet-400/20",
          "bg-gradient-to-b",
          "from-violet-500/20",
          "to-violet-500/5",
          "text-violet-200",
          "shadow-[0_0_20px_rgba(139,92,246,0.14)]",
        ].join(" "),

        outline: [
          "border-zinc-700",
          "bg-zinc-900/40",
          "text-zinc-300",
          "hover:border-zinc-500",
          "hover:bg-zinc-800/50",
        ].join(" "),
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