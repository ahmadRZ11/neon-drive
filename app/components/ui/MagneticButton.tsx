"use client";

import type { ComponentProps, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { useCanRunHeavyEffects } from "../../lib/hooks";
import { Button } from "./button";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
  /** Trailing icon. Pass null to render none. */
  icon?: LucideIcon | null;
  /** How far the button chases the pointer, in px. */
  strength?: number;
  className?: string;
  external?: boolean;
};

/**
 * Magnetism wrapper around the shadcn Button.
 *
 * The button keeps all its styling in `ui/button.tsx`; this only adds the
 * lean-toward-the-cursor behaviour, which is disabled wholesale on touch and
 * under reduce-motion — there the hover state carries the affordance.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "outline",
  size = "md",
  icon: Icon = ArrowRight,
  strength = 16,
  className,
  external,
}: Props) {
  const magnetic = useCanRunHeavyEffects();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  function handleMove(event: React.PointerEvent<HTMLSpanElement>) {
    if (!magnetic) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    x.set((dx / rect.width) * strength * 2);
    y.set((dy / rect.height) * strength * 2);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const inner = (
    <>
      <span>{children}</span>
      {Icon && (
        <Icon
          aria-hidden
          className="transition-transform duration-300 group-hover/mag:translate-x-0.5"
        />
      )}
    </>
  );

  return (
    <motion.span
      className="group/mag inline-flex"
      style={{ x: sx, y: sy }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      whileTap={{ scale: 0.97 }}
    >
      {href ? (
        <Button asChild variant={variant} size={size} className={className}>
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {inner}
          </a>
        </Button>
      ) : (
        <Button variant={variant} size={size} className={className} onClick={onClick}>
          {inner}
        </Button>
      )}
    </motion.span>
  );
}
