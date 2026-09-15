import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * A hairline rule that fades out, matching the one under every section
 * masthead. `decorative` mirrors the shadcn/Radix API.
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}) {
  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        orientation === "horizontal"
          ? "h-px w-full bg-linear-to-r from-bone/25 to-transparent"
          : "h-full w-px bg-linear-to-b from-bone/25 to-transparent",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
