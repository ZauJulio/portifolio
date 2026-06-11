import { useEffect, useRef, useState } from "react";

/* eslint-disable jsx-a11y/prefer-tag-over-role, jsx-a11y/no-noninteractive-element-to-interactive-role */
import { XIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";

type CoverImageProps = {
  src: string;
  alt: string;
  maxHeightClass?: string;
};

export function CoverImage({ src, alt, maxHeightClass }: CoverImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const didMoveRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const containerClass = `group relative w-full overflow-hidden rounded-xl bg-black/40 transition-[max-height] duration-300 ${
    maxHeightClass || "max-h-[400px]"
  } hover:max-h-[70vh]`;

  return (
    <>
      <button
        type="button"
        className={containerClass}
        onClick={() => {
          setIsOpen(true);
          setScale(1);
          setOffset({ x: 0, y: 0 });
        }}
        aria-label={`View larger image of ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-all duration-300 group-hover:object-contain cursor-zoom-in"
        />
      </button>

      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close modal backdrop"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setIsOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 cursor-default"
          onClick={() => setIsOpen(false)}
        >
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
                  setScale((current) => (current > 1 ? 1 : 2));
                  setOffset({ x: 0, y: 0 });
                }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-700 bg-black/70 px-3 py-1 text-xs text-gray-200 hover:text-white"
              >
                {scale > 1 ? <ZoomOutIcon className="size-4" /> : <ZoomInIcon className="size-4" />}
                {scale > 1 ? "Zoom out" : "Zoom in"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setScale(1);
                  setOffset({ x: 0, y: 0 });
                }}
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
                setScale((current) => {
                  const nextScale = Math.min(4, Math.max(1, current + delta));
                  if (nextScale === 1) {
                    setOffset({ x: 0, y: 0 });
                  }
                  return nextScale;
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
                if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
                  didMoveRef.current = true;
                }
                setOffset((current) => ({ x: current.x + dx, y: current.y + dy }));
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
                src={src}
                alt={alt}
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
                    setScale((current) => (current > 1 ? 1 : 2));
                    setOffset({ x: 0, y: 0 });
                  }
                }}
                onClick={() => {
                  if (didMoveRef.current) return;
                  setScale((current) => (current > 1 ? 1 : 2));
                  setOffset({ x: 0, y: 0 });
                }}
                onPointerDown={(event) => {
                  if (scale <= 1) return;
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onDragStart={(event) => event.preventDefault()}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
