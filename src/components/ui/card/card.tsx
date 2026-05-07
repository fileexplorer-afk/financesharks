import * as React from "react";

import { cn } from "@/utils/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        [
          // Layout
          "relative overflow-hidden",

          // Surface
          "rounded-3xl border border-white/[0.06]",

          // Background
          "bg-[#101014]/80",

          // Glass softness
          "backdrop-blur-xl",

          // Depth
          "shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
          "shadow-black/40",

          // Motion
          "transition-all duration-300 ease-out",

          // Hover
          "hover:border-white/[0.10]",
          "hover:shadow-2xl",
          "hover:shadow-black/50",

          // Subtle glow layer
          "before:absolute before:inset-0",
          "before:bg-gradient-to-b",
          "before:from-white/[0.03]",
          "before:to-transparent",
          "before:pointer-events-none",
        ],
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-6",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold tracking-tight text-white",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-sm text-zinc-400",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 pb-6", className)}
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center px-6 pb-6 pt-2",
        className
      )}
      {...props}
    />
  );
}