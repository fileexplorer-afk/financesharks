import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    // Layout
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",

    // Shape
    "rounded-2xl",

    // Typography
    "font-medium tracking-tight",

    // Motion
    "transform-gpu transition-all duration-300 ease-out",

    // Interaction
    "active:scale-[0.985]",
    "hover:-translate-y-[1px]",

    // Accessibility
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-violet-500/40",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-[#09090B]",

    // Disabled
    "disabled:pointer-events-none",
    "disabled:opacity-50",

    // Visual polish
    "select-none",
    "antialiased",
    "backdrop-blur-sm",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-violet-600 text-white",

          // Hover
          "hover:bg-violet-500",

          // Depth
          "shadow-lg shadow-violet-900/30",

          // Border glow
          "border border-violet-500/20",

          // Subtle shine
          "before:absolute before:inset-0 before:rounded-2xl",
          "before:bg-white/[0.02]",
          "before:opacity-0 hover:before:opacity-100",
          "before:transition-opacity before:duration-300",

          // Active feel
          "hover:shadow-violet-700/40",
        ].join(" "),

        secondary: [
          "bg-zinc-900 text-zinc-100",
          "border border-zinc-800",
          "hover:bg-zinc-800",
          "hover:border-zinc-700",
          "shadow-md shadow-black/20",
        ].join(" "),

        ghost: [
          "bg-transparent text-zinc-300",
          "hover:bg-zinc-800/70",
          "hover:text-white",
        ].join(" "),

        outline: [
          "border border-zinc-700",
          "bg-transparent",
          "text-zinc-100",
          "hover:bg-zinc-800/60",
          "hover:border-zinc-600",
        ].join(" "),

        danger: [
          "bg-red-600 text-white",
          "hover:bg-red-500",
          "shadow-lg shadow-red-900/30",
          "border border-red-500/20",
        ].join(" "),

        success: [
          "bg-emerald-600 text-white",
          "hover:bg-emerald-500",
          "shadow-lg shadow-emerald-900/30",
          "border border-emerald-500/20",
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