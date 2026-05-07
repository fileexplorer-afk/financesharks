import * as React from "react";

import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/utils/cn";

import { buttonVariants } from "@/components/ui/button/button-variants";

import type { ButtonProps } from "./button.types";

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          className={cn(
            [
              "h-4 w-4 rounded-full border-2",
              "border-white/30 border-t-white",
              "animate-spin",
            ]
          )}
        />
      )}

      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </Comp>
  );
}