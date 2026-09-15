import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge has to be told about our theme.
 *
 * Out of the box it classifies any unknown `text-*` class as a colour, so
 * `cn("text-hud", "text-magenta")` dropped the size and left the button
 * rendering at the inherited font-size. Registering the scale as font-size
 * keeps size and colour in separate conflict groups, and `text-glow` (a
 * text-shadow utility) gets a group of its own for the same reason.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "lead",
            "body",
            "body-sm",
            "hud",
            "hud-lg",
            "hud-sm",
            "nav",
            "btn",
            "btn-sm",
            "btn-lg",
          ],
        },
      ],
      "text-shadow": ["text-glow"],
    },
  },
});

/**
 * shadcn/ui's class helper: clsx for conditionals, tailwind-merge so a prop
 * passed by a caller reliably beats the component's own default rather than
 * both landing in the class list and letting source order decide.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
