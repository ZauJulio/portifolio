import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/* eslint-disable jsx-a11y/prefer-tag-over-role, jsx-a11y/no-noninteractive-element-to-interactive-role, react/no-array-index-key */
import { ChevronLeftIcon, ChevronRightIcon, XIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function ImageCarousel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);
  const count = items.length;
  const [active, setActive] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const didMoveRef = useRef(false);

  const srcs = items.map((child) => {
    if (child && typeof child === "object" && "props" in child) {
      return (child.props as Record<string, unknown>).src as string | undefined;
    }
    return undefined;
  });

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

  const resetZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const goLightbox = useCallback(
    (delta: number) => {
      setLightboxIndex((prev) => {
        if (prev === null) return null;
        return (((prev + delta) % count) + count) % count;
      });
      resetZoom();
    },
    [count],
  );

  useEffect(() => {
    if (lightboxIndex === null) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowLeft") goLightbox(-1);
      if (event.key === "ArrowRight") goLightbox(1);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxIndex, count, goLightbox]);

  const handleSlideClick = (index: number) => {
    setLightboxIndex(index);
    resetZoom();
  };

  const lightboxSrc = lightboxIndex !== null ? srcs[lightboxIndex] : null;

  return (
    <>
      <div className={cn("relative mx-auto max-w-3xl select-none", className)}>
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((child, i) => (
            <div
              key={i}
              data-idx={i}
              role="button"
              tabIndex={0}
              onClick={() => handleSlideClick(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleSlideClick(i);
              }}
              className="flex w-full shrink-0 snap-center items-center justify-center cursor-zoom-in"
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
              <ChevronLeftIcon className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollTo(active + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
            >
              <ChevronRightIcon className="size-5" />
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

      {lightboxSrc && lightboxIndex !== null && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close lightbox"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setLightboxIndex(null);
          }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 cursor-default"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Lightbox arrows — only for multi-image carousels */}
          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  goLightbox(-1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-[60] rounded-full bg-black/50 p-2.5 text-white backdrop-blur-sm transition hover:bg-black/70"
              >
                <ChevronLeftIcon className="size-6" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  goLightbox(1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-[60] rounded-full bg-black/50 p-2.5 text-white backdrop-blur-sm transition hover:bg-black/70"
              >
                <ChevronRightIcon className="size-6" />
              </button>
            </>
          )}

          <div
            role="presentation"
            className="relative max-w-[90vw] max-h-[85vh]"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <div className="absolute -top-12 right-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setScale((s) => (s > 1 ? 1 : 2));
                  setOffset({ x: 0, y: 0 });
                }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-700 bg-black/70 px-3 py-1 text-xs text-gray-200 hover:text-white"
              >
                {scale > 1 ? <ZoomOutIcon className="size-4" /> : <ZoomInIcon className="size-4" />}
                {scale > 1 ? "Zoom out" : "Zoom in"}
              </button>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-700 bg-black/70 px-3 py-1 text-xs text-gray-200 hover:text-white"
                aria-label="Close image"
              >
                <XIcon className="size-4" />
                Close
              </button>
            </div>

            <div
              className="max-w-[90vw] max-h-[85vh] overflow-hidden"
              onWheel={(event) => {
                event.preventDefault();
                const delta = event.deltaY * -0.001;
                setScale((s) => {
                  const next = Math.min(4, Math.max(1, s + delta));
                  if (next === 1) setOffset({ x: 0, y: 0 });
                  return next;
                });
              }}
              onPointerDown={(event) => {
                if (scale <= 1) return;
                isDraggingRef.current = true;
                didMoveRef.current = false;
                lastPointerRef.current = { x: event.clientX, y: event.clientY };
              }}
              onPointerMove={(event) => {
                if (!isDraggingRef.current || scale <= 1) return;
                const dx = event.clientX - lastPointerRef.current.x;
                const dy = event.clientY - lastPointerRef.current.y;
                lastPointerRef.current = { x: event.clientX, y: event.clientY };
                if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didMoveRef.current = true;
                setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
              }}
              onPointerUp={() => {
                isDraggingRef.current = false;
              }}
              onPointerLeave={() => {
                isDraggingRef.current = false;
              }}
            >
              <img
                role="button"
                tabIndex={0}
                src={lightboxSrc}
                alt=""
                aria-label="Toggle zoom"
                className={`max-w-[90vw] max-h-[85vh] object-contain transition-transform duration-200 ${
                  scale > 1
                    ? isDraggingRef.current
                      ? "cursor-grabbing"
                      : "cursor-grab"
                    : "cursor-zoom-in"
                }`}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                  userSelect: "none",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (didMoveRef.current) return;
                    setScale((s) => (s > 1 ? 1 : 2));
                    setOffset({ x: 0, y: 0 });
                  }
                }}
                onClick={() => {
                  if (didMoveRef.current) return;
                  setScale((s) => (s > 1 ? 1 : 2));
                  setOffset({ x: 0, y: 0 });
                }}
                onPointerDown={(event) => {
                  if (scale <= 1) return;
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onDragStart={(event) => event.preventDefault()}
              />
            </div>

            {/* Lightbox page indicators */}
            {count > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: count }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to image ${i + 1}`}
                    onClick={() => {
                      setLightboxIndex(i);
                      resetZoom();
                    }}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      i === lightboxIndex ? "w-6 bg-white/80" : "w-2 bg-white/30",
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
