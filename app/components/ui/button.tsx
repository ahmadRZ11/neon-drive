"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * shadcn/ui Button, restyled for the synthwave theme.
 *
 * Square corners, condensed HUD type and neon edges rather than the default
 * rounded-slate look — the point of shadcn is that the component lives in the
 * repo and gets dressed for the project it is in.
 */
const buttonVariants = cva(
  "btn-label relative inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap " +
    "outline-offset-4 transition-[color,background-color,border-color,box-shadow] duration-300 " +
    "focus-visible:outline-2 focus-visible:outline-cyan " +
    "disabled:pointer-events-none disabled:opacity-40 " +
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        solid: "bg-magenta text-ink hover:bg-pink hover:shadow-[0_0_28px_-4px_var(--color-magenta)]",
        outline:
          "border border-bone/25 text-bone hover:border-magenta hover:text-magenta " +
          "hover:shadow-[0_0_24px_-6px_var(--color-magenta)]",
        cyan:
          "border border-cyan/40 text-cyan hover:bg-cyan hover:text-ink " +
          "hover:shadow-[0_0_24px_-6px_var(--color-cyan)]",
        ghost: "text-ash hover:text-bone",
        link: "border-b border-magenta/50 pb-1.5 text-magenta hover:border-magenta hover:text-pink",
      },
      size: {
        sm: "px-4 py-2.5 text-btn-sm [&_svg]:size-3.5",
        md: "px-7 py-4 text-btn [&_svg]:size-4",
        lg: "px-9 py-5 text-btn-lg [&_svg]:size-[18px]",
        icon: "size-10 [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "outline", size: "md" },
  }
);

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render as the child element (a link, for example) instead of a button. */
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
