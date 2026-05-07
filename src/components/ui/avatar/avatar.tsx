import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const avatarVariants = cva(
  [
    // Layout
    "relative inline-flex shrink-0 overflow-hidden",

    // Shape
    "rounded-full",

    // Surface
    "bg-gradient-to-b from-zinc-800 to-zinc-900",

    // Border
    "border border-white/[0.08]",

    // Motion
    "transition-all duration-300 ease-out",

    // Polish
    "shadow-lg shadow-black/30",
    "backdrop-blur-xl",

    // Hover
    "hover:scale-[1.02]",
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

    defaultVariants: {
      size: "md",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  online?: boolean;
}

export function Avatar({
  className,
  size,
  src,
  alt,
  fallback,
  online,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const showFallback = !src || imageError;

  return (
    <div
      className={cn(
        avatarVariants({ size }),
        className
      )}
      {...props}
    >
      {!showFallback ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className={cn(
            [
              "flex h-full w-full items-center justify-center",

              // Typography
              "font-medium tracking-tight text-white",

              // Soft lighting
              "bg-gradient-to-b",
              "from-violet-500/20",
              "to-fuchsia-500/10",
            ],
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-lg",
            size === "xl" && "text-2xl"
          )}
        >
          {fallback}
        </div>
      )}

      {online && (
        <span
          className={cn(
            [
              "absolute bottom-0 right-0",

              // Shape
              "rounded-full",

              // Status color
              "bg-emerald-400",

              // Border
              "border-2 border-[#09090B]",

              // Glow
              "shadow-[0_0_12px_rgba(74,222,128,0.8)]",
            ],
            size === "sm" && "h-2.5 w-2.5",
            size === "md" && "h-3 w-3",
            size === "lg" && "h-4 w-4",
            size === "xl" && "h-5 w-5"
          )}
        />
      )}
    </div>
  );
}