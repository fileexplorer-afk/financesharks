import * as React from "react";

import { cn } from "@/utils/cn";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4;
};

const headingStyles = {
  1: "text-4xl font-semibold tracking-tight",
  2: "text-3xl font-semibold tracking-tight",
  3: "text-2xl font-semibold tracking-tight",
  4: "text-xl font-medium tracking-tight",
};

export function Heading({ className, level = 1, children, ...props }: HeadingProps) {
  const Comp = `h${level}` as React.ElementType;
  return (
    <Comp className={cn("text-[var(--text-primary)] antialiased", headingStyles[level], className)} {...props}>
      {children}
    </Comp>
  );
}

export function Text({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm leading-7 text-[var(--text-secondary)] antialiased", className)} {...props}>
      {children}
    </p>
  );
}

export function Muted({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-[var(--text-tertiary)] antialiased", className)} {...props}>
      {children}
    </p>
  );
}

export function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-sm font-medium text-[var(--text-secondary)] antialiased", className)} {...props}>
      {children}
    </label>
  );
}

export function Metric({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-4xl font-semibold tracking-tight text-[var(--text-primary)] antialiased", className)} {...props}>
      {children}
    </p>
  );
}

export function GradientText({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("bg-gradient-to-r from-[var(--color-accent)] via-amber-300 to-amber-200 bg-clip-text text-transparent antialiased", className)} {...props}>
      {children}
    </span>
  );
}