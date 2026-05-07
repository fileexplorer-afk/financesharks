import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const avatarVariants = cva(
  [
    // Root
    "relative inline-flex shrink-0",

    // Motion
    "transform-gpu transition-all duration-300 ease-out",

    // Hover
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

    defaultVariants: {
      size: "md",
    },
  }
);

type Status =
  | "online"
  | "idle"
  | "dnd"
  | "offline";

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  status?: Status;
}

export function Avatar({
  className,
  size,
  src,
  alt,
  fallback,
  status,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] =
    React.useState(false);

  const showFallback = !src || imageError;

  const statusStyles = {
    online: [
      "bg-emerald-400",
      "shadow-[0_0_16px_rgba(74,222,128,0.9)]",
    ].join(" "),

    idle: [
      "bg-amber-400",
      "shadow-[0_0_16px_rgba(251,191,36,0.9)]",
    ].join(" "),

    dnd: [
      "bg-red-500",
      "shadow-[0_0_16px_rgba(239,68,68,0.9)]",
    ].join(" "),

    offline: [
      "bg-zinc-500",
      "shadow-[0_0_10px_rgba(113,113,122,0.5)]",
    ].join(" "),
  };

  return (
    <div
      className={cn(
        avatarVariants({ size }),
        className
      )}
      {...props}
    >
      {/* Avatar Surface */}
      <div
        className={cn(
          [
            "h-full w-full overflow-hidden rounded-full",

            // Surface
            "bg-gradient-to-b",
            "from-zinc-800",
            "to-zinc-900",

            // Border
            "border border-white/[0.08]",

            // Depth
            "shadow-lg shadow-black/30",

            // Blur softness
            "backdrop-blur-xl",
          ]
        )}
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
                "font-semibold tracking-tight text-white antialiased",

                // Gradient fallback
                "bg-gradient-to-b",
                "from-violet-500/20",
                "via-fuchsia-500/10",
                "to-transparent",
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
      </div>

      {/* Status Indicator */}
      {status && (
        <span
          className={cn(
            [
              "absolute bottom-0 right-0 z-20",

              // Shape
              "rounded-full",

              // Overlay border
              "border-[3px] border-[#09090B]",

              // Motion
              "transition-all duration-300",

              // Status styles
              statusStyles[status],
            ],

            size === "sm" && "h-2.5 w-2.5",
            size === "md" && "h-3.5 w-3.5",
            size === "lg" && "h-4 w-4",
            size === "xl" && "h-5 w-5"
          )}
        />
      )}
    </div>
  );
}