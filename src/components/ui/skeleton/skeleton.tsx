import * as React from "react";

import { cn } from "@/utils/cn";

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        [
          // Layout
          "relative overflow-hidden",

          // Shape
          "rounded-xl",

          // Surface
          "bg-zinc-900/80",

          // Glow depth
          "border border-white/[0.04]",

          // Shimmer layer
          "before:absolute before:inset-0",
          "before:-translate-x-full",
          "before:animate-[shimmer_2s_infinite]",

          "before:bg-gradient-to-r",
          "before:from-transparent",
          "before:via-white/[0.05]",
          "before:to-transparent",
        ],
        className
      )}
      {...props}
    />
  );
}