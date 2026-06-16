import { Children, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Horizontal, scroll-snap carousel shown only on mobile (`< md`). Each direct
 * child becomes a snap item; the desktop layout (a grid, usually) should be
 * rendered separately and hidden below `md` with `hidden md:grid`.
 */
export function MobileCarousel({
  children,
  className,
  itemClassName,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  ariaLabel?: string;
}) {
  return (
    <ul
      aria-label={ariaLabel}
      className={cn(
        "md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-4 list-none",
        "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {Children.map(children, (child) => (
        <li className={cn("snap-start shrink-0", itemClassName)}>{child}</li>
      ))}
    </ul>
  );
}
