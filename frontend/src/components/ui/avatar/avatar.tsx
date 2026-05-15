import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const avatarVariants = cva(
  [
    "relative inline-flex shrink-0",
    "transform-gpu transition-all duration-300 ease-out",
    "hover:scale-[1.03]",
  ],
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-14 w-14",
        xl: "h-20 w-20",
      },
    },
    defaultVariants: { size: "md" },
  }
);

type Status = "online" | "idle" | "dnd" | "offline";

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  status?: Status;
}

export function Avatar({ className, size, src, alt, fallback, status, ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  const showFallback = !src || imageError;

  return (
    <div className={cn(avatarVariants({ size }), className)} {...props}>
      <div className="h-full w-full overflow-hidden rounded-full bg-gradient-to-b from-[var(--bg-tertiary)] to-[var(--bg-secondary)] border border-[var(--border-color)] shadow-lg shadow-black/30 backdrop-blur-xl">
        {!showFallback ? (
          <img src={src} alt={alt} onError={() => setImageError(true)} className="h-full w-full object-cover" />
        ) : (
          <div className={cn(
            "flex h-full w-full items-center justify-center font-semibold tracking-tight text-[var(--text-primary)] antialiased bg-gradient-to-b from-[var(--color-violet)]/20 via-transparent to-transparent",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-lg",
            size === "xl" && "text-2xl"
          )}>
            {fallback}
          </div>
        )}
      </div>

      {status && (
        <span className={cn(
          "absolute bottom-0 right-0 z-20 rounded-full border-[3px] border-[var(--bg-primary)] transition-all duration-300",
          status === "online" && "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]",
          status === "idle" && "bg-[var(--color-warning)] shadow-[0_0_12px_rgba(251,191,36,0.7)]",
          status === "dnd" && "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)]",
          status === "offline" && "bg-zinc-500 shadow-[0_0_8px_rgba(113,113,122,0.4)]",
          size === "sm" && "h-2.5 w-2.5",
          size === "md" && "h-3.5 w-3.5",
          size === "lg" && "h-4 w-4",
          size === "xl" && "h-5 w-5"
        )} />
      )}
    </div>
  );
}