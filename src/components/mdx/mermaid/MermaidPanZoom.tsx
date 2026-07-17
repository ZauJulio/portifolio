import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { Maximize2Icon, Minimize2Icon, RotateCcwIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";

import { FIT_MAX, PAD, PAN_THRESHOLD, ZOOM_STEP, clampScale, type View } from "./constants";

export function MermaidPanZoom({
  svg,
  fullscreen = false,
  onToggleFullscreen,
}: {
  svg: string;
  fullscreen?: boolean;
  onToggleFullscreen: () => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchDist = useRef(0);
  const fitScale = useRef(1);
  const interacted = useRef(false);
  const panning = useRef(false);
  const downPoint = useRef<{ x: number; y: number } | null>(null);

  const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const vb = contentRef.current?.querySelector("svg")?.viewBox.baseVal;
    if (vb?.width && vb.height) setNatural({ w: vb.width, h: vb.height });
  }, [svg]);

  const zoomAt = useCallback((factor: number, cx: number, cy: number) => {
    interacted.current = true;
    setView((v) => {
      const scale = clampScale(v.scale * factor);
      const k = scale / v.scale;
      return { scale, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k };
    });
  }, []);

  const fit = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp || !natural) return;

    const cw = vp.clientWidth;
    const ch = vp.clientHeight;
    const { w: sw, h: sh } = natural;

    const scale = clampScale(Math.min((cw - PAD * 2) / sw, (ch - PAD * 2) / sh, FIT_MAX));
    fitScale.current = scale;
    setView({
      scale,
      x: (cw - sw * scale) / 2,
      y: Math.max(PAD, (ch - sh * scale) / 2),
    });
  }, [natural]);

  const resetView = useCallback(() => {
    interacted.current = false;
    fit();
  }, [fit]);

  const centerZoom = useCallback(
    (factor: number) => {
      const vp = viewportRef.current;
      if (!vp) return;
      zoomAt(factor, vp.clientWidth / 2, vp.clientHeight / 2);
    },
    [zoomAt],
  );

  useEffect(() => {
    const raf = requestAnimationFrame(fit);

    const vp = viewportRef.current;
    if (!vp) return () => cancelAnimationFrame(raf);

    const ro = new ResizeObserver(() => {
      if (!interacted.current) fit();
    });
    ro.observe(vp);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [fit, svg]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return undefined;

    const onWheel = (e: WheelEvent) => {
      if (!fullscreen && !e.ctrlKey && !e.metaKey) return;
      e.preventDefault();

      const rect = vp.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP, e.clientX - rect.left, e.clientY - rect.top);
    };

    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [fullscreen, zoomAt]);

  useEffect(() => {
    if (!fullscreen) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onToggleFullscreen();
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [fullscreen, onToggleFullscreen]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) downPoint.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;

    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 1) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;

      if (!panning.current) {
        const start = downPoint.current;
        if (!start || Math.hypot(e.clientX - start.x, e.clientY - start.y) < PAN_THRESHOLD) return;

        panning.current = true;
        interacted.current = true;
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
      }

      window.getSelection()?.removeAllRanges();
      setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
      return;
    }

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);

      if (pinchDist.current) {
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = (a.x + b.x) / 2 - rect.left;
        const cy = (a.y + b.y) / 2 - rect.top;
        zoomAt(dist / pinchDist.current, cx, cy);
      }

      pinchDist.current = dist;
    }
  };

  const endPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchDist.current = 0;
    if (pointers.current.size === 0) {
      panning.current = false;
      downPoint.current = null;
      setDragging(false);
    }
  };

  const touchAction: CSSProperties["touchAction"] =
    fullscreen || view.scale > fitScale.current + 0.01 ? "none" : "pan-y";

  const btn =
    "rounded-md border border-gray-800 bg-gray-900/80 p-1.5 text-gray-300 backdrop-blur transition-colors hover:bg-gray-800 hover:text-white";

  return (
    <div
      ref={viewportRef}
      className={`relative overflow-hidden rounded-xl border border-gray-800 bg-gray-950/40 ${
        fullscreen ? "h-full w-full" : "h-[22rem] sm:h-[26rem]"
      }`}
      style={{ touchAction, cursor: dragging ? "grabbing" : "grab" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
    >
      <div
        ref={contentRef}
        className="absolute left-0 top-0 origin-top-left will-change-transform [&>svg]:h-full! [&>svg]:w-full! [&>svg]:max-w-none!"
        style={{
          width: natural?.w,
          height: natural?.h,
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
        }}
        // eslint-disable-next-line react/no-danger -- SVG comes from our own Mermaid render
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      <div className="absolute right-2 top-2 flex gap-1" onPointerDown={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label="Zoom in"
          className={btn}
          onClick={() => centerZoom(ZOOM_STEP)}
        >
          <ZoomInIcon className="size-4" />
        </button>

        <button
          type="button"
          aria-label="Zoom out"
          className={btn}
          onClick={() => centerZoom(1 / ZOOM_STEP)}
        >
          <ZoomOutIcon className="size-4" />
        </button>

        <button type="button" aria-label="Reset view" className={btn} onClick={resetView}>
          <RotateCcwIcon className="size-4" />
        </button>

        <button
          type="button"
          aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          className={btn}
          onClick={onToggleFullscreen}
        >
          {fullscreen ? <Minimize2Icon className="size-4" /> : <Maximize2Icon className="size-4" />}
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-2 left-2 rounded bg-gray-950/70 px-2 py-1 text-[10px] text-gray-500">
        {fullscreen ? "scroll: zoom · drag: move · Esc" : "⌘/Ctrl+scroll: zoom · drag: move"}
      </div>
    </div>
  );
}
