import * as React from "react";

import { cn } from "@/utils/cn";

export function InputGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("space-y-2", className)}
      {...props}
    />
  );
}

export function InputLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-zinc-200",
        className
      )}
      {...props}
    />
  );
}

export function InputDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-sm text-zinc-500",
        className
      )}
      {...props}
    />
  );
}

export function InputError({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-sm text-red-400",
        className
      )}
      {...props}
    />
  );
}