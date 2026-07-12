import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ImageCarousel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const count = Children.count(children);
  const [active, setActive] = useState(0);

  const scrollTo = useCallback(
    (index: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const wrapped = ((index % count) + count) % count;
      el.scrollTo({ left: wrapped * el.offsetWidth, behavior: "smooth" });
    },
    [count],
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        }
      },
      { root: el, threshold: 0.6 },
    );
    for (const child of el.children) observer.observe(child);
    return () => observer.disconnect();
  }, [count]);

  return (
    <div className={cn("relative mx-auto max-w-3xl select-none", className)}>
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child, i) => (
          <div
            key={i}
            data-idx={i}
            className="flex w-full shrink-0 snap-center items-center justify-center"
          >
            {child}
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollTo(active - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollTo(active + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="mt-3 flex justify-center gap-2">
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === active ? "w-6 bg-current opacity-80" : "w-2 bg-current opacity-30",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
