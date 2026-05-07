import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";

import { cn } from '@/utils/cn';
import { buttonVariants } from "./button.styles";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "outline"
    | "danger"
    | "success";

  size?: "sm" | "md" | "lg" | "icon";

  loading?: boolean;

  asChild?: boolean;
};

export function Button({
  className,
  variant,
  size,
  loading,
  children,
  asChild = false,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size }),
        "active:scale-[0.98]",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}

      {children}
    </Comp>
  );
}