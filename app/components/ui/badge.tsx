import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * shadcn/ui Badge, restyled as a HUD chip: square, hairline, condensed type.
 * Used for stack tags, timeline tags and the "used in" links in Arsenal.
 */
const badgeVariants = cva(
  "hud inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-hud-sm " +
    "transition-colors duration-300 [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        outline: "border-bone/12 text-ash",
        magenta: "border-magenta/45 text-magenta",
        cyan: "border-cyan/40 text-cyan",
        solid: "border-transparent bg-magenta text-ink",
      },
      interactive: {
        true: "hover:border-magenta hover:text-magenta",
        false: "",
      },
    },
    defaultVariants: { variant: "outline", interactive: false },
  }
);

export type BadgeProps = React.ComponentPropsWithoutRef<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Render as the child element (a link, for example) instead of a span. */
    asChild?: boolean;
  };

function Badge({ className, variant, interactive, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp className={cn(badgeVariants({ variant, interactive }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
