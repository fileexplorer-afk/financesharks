import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    // Core
    "group relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap isolate",

    // Shape
    "rounded-2xl",

    // Typography
    "font-semibold tracking-tight text-white",

    // Motion
    "transform-gpu transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",

    // Interaction
    "active:scale-[0.985]",
    "active:translate-y-[1px]",
    "hover:-translate-y-[1px]",

    // Accessibility
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-violet-500/30",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-[#09090B]",

    // Disabled
    "disabled:pointer-events-none",
    "disabled:opacity-50",

    // Polish
    "select-none antialiased",
    "backdrop-blur-xl",

    // Texture
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]",

    // Reflection layer
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]",
  ],
  {
    variants: {
      variant: {
        primary: [
          // Surface
          "bg-gradient-to-b",
          "from-violet-500",
          "via-violet-600",
          "to-violet-700",

          // Border
          "border border-white/[0.10]",

          // Cinematic depth
          "shadow-[0_6px_20px_rgba(139,92,246,0.22)]",

          // Hover feel
          "hover:shadow-[0_10px_28px_rgba(139,92,246,0.28)]",
          "hover:brightness-[1.03]",

          // Top lighting
          "before:bg-gradient-to-b",
          "before:from-white/[0.16]",
          "before:via-white/[0.04]",
          "before:to-transparent",

          // Moving reflection
          "after:bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.08)_50%,transparent_80%)]",
          "after:translate-x-[-180%]",
          "hover:after:translate-x-[180%]",
          "after:transition-transform",
          "after:duration-[1400ms]",

          // Inner surface depth
          "ring-1 ring-inset ring-white/[0.06]",
        ].join(" "),

        glass: [
          // Glass surface
          "bg-white/[0.05]",

          // Border
          "border border-white/[0.08]",

          // Glass depth
          "shadow-[0_8px_24px_rgba(0,0,0,0.22)]",

          // Hover
          "hover:bg-white/[0.08]",
          "hover:border-white/[0.12]",

          // Blur
          "backdrop-blur-2xl",

          // Top lighting
          "before:bg-gradient-to-b",
          "before:from-white/[0.10]",
          "before:to-transparent",

          // Reflection sweep
          "after:bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.06)_50%,transparent_80%)]",
          "after:translate-x-[-180%]",
          "hover:after:translate-x-[180%]",
          "after:transition-transform",
          "after:duration-[1400ms]",

          // Inner border
          "ring-1 ring-inset ring-white/[0.05]",
        ].join(" "),

        success: [
          "bg-gradient-to-b",
          "from-emerald-500",
          "to-emerald-700",

          "border border-emerald-300/15",

          "shadow-[0_6px_20px_rgba(16,185,129,0.20)]",

          "hover:shadow-[0_10px_28px_rgba(16,185,129,0.25)]",

          "before:bg-gradient-to-b",
          "before:from-white/[0.12]",
          "before:to-transparent",

          "ring-1 ring-inset ring-white/[0.05]",
        ].join(" "),

        danger: [
          "bg-gradient-to-b",
          "from-red-500",
          "to-red-700",

          "border border-red-300/15",

          "shadow-[0_6px_20px_rgba(239,68,68,0.20)]",

          "hover:shadow-[0_10px_28px_rgba(239,68,68,0.25)]",

          "before:bg-gradient-to-b",
          "before:from-white/[0.12]",
          "before:to-transparent",

          "ring-1 ring-inset ring-white/[0.05]",
        ].join(" "),

        ghost: [
          "bg-transparent",

          "text-zinc-300",

          "hover:bg-white/[0.04]",
          "hover:text-white",

          "border border-transparent",
        ].join(" "),
      },

      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-11 w-11",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);