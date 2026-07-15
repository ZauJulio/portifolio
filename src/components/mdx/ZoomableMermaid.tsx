import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";

import { Maximize2Icon, Minimize2Icon, RotateCcwIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";

// We render the Mermaid SVG ourselves (rather than reusing the lib's
// `MermaidBlock`) because pan/zoom needs full control of the markup: the lib
// wraps its SVG in a centered, `overflow-x-auto` box that would fight a
// transform-based viewport. The render logic is otherwise identical (same lazy
// `import("mermaid")`, same dark theme), so diagrams look the same — they just
// gain a draggable, zoomable surface and a fullscreen mode.

const MIN_SCALE = 0.2;
const MAX_SCALE = 8;
const ZOOM_STEP = 1.2;
const PAD = 16;
// Fit may upscale a small diagram to fill the viewport, but not past this — a
// 3-node graph blown up edge-to-edge looks worse than one with some margin.
const FIT_MAX = 2;
// How far the pointer must travel from where it went down before a press turns
// into a pan. Below it, the gesture stays a click/double-click (so the SVG's
// text can still be selected) instead of being swallowed by a drag.
const PAN_THRESHOLD = 3;

let mermaidInitialized = false;

interface View {
  scale: number;
  x: number;
  y: number;
}

const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

/** A self-contained pan/zoom surface for an already-rendered Mermaid SVG. */
function MermaidPanZoom({
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
  // The scale `fit()` last settled on — small diagrams now fit above 1:1, so
  // "is the user zoomed in?" is measured against this, not a bare `> 1`.
  const fitScale = useRef(1);
  // Once the user zooms or pans we stop auto-fitting, so late layout settles
  // (images loading above, a scrollbar toggling the viewport width) can't yank
  // their view back to the fitted scale.
  const interacted = useRef(false);
  // A press only becomes a pan after crossing PAN_THRESHOLD; until then it is
  // left alone so clicks, double-clicks and text selection keep working.
  const panning = useRef(false);
  const downPoint = useRef<{ x: number; y: number } | null>(null);

  const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  // The diagram's intrinsic size, read from the SVG's viewBox. Driving it
  // through React (rather than mutating the SVG, which `dangerouslySetInnerHTML`
  // wipes on re-render) pins the content box to full resolution; the transform
  // then scales it. Mermaid otherwise collapses `width="100%"` to ~300px here.
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const vb = contentRef.current?.querySelector("svg")?.viewBox.baseVal;
    if (vb?.width && vb.height) setNatural({ w: vb.width, h: vb.height });
  }, [svg]);

  // Zoom keeping the point (cx, cy) — relative to the viewport — under the cursor.
  const zoomAt = useCallback((factor: number, cx: number, cy: number) => {
    interacted.current = true;
    setView((v) => {
      const scale = clampScale(v.scale * factor);
      const k = scale / v.scale;

      return { scale, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k };
    });
  }, []);

  // Fit the whole diagram into the viewport, centered — downscaling large
  // diagrams and upscaling small ones (up to FIT_MAX) so they fill the space.
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

  // Reset re-enables auto-fit (so later resizes keep it fitted) and re-fits now.
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

  // Re-fit once the SVG is painted and whenever the viewport resizes.
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

  // Wheel zoom. Inline it requires Ctrl/⌘ so the page still scrolls normally;
  // fullscreen it's free. A non-passive native listener is needed to preventDefault.
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

  // Esc closes fullscreen; lock body scroll while it's open.
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

    // Record the pointer but DON'T capture it or start dragging yet — capturing
    // on every press is what stole single/double clicks (the click landed on the
    // viewport, not the button or the SVG word). Panning is armed in
    // onPointerMove, once the pointer has actually travelled.
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

      // A live pan must not paint a text selection across the diagram.
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

  // Touch gestures only own the surface once zoomed in, so an un-zoomed inline
  // diagram still lets a finger scroll the article past it.
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

      {/* Stop pointer events here from reaching the pan surface, so the
          controls always take the click instead of arming a drag. */}
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

/** Renders a Mermaid diagram into a pan/zoom viewport with a fullscreen mode. */
export function ZoomableMermaid({ code }: { code: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const renderId = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    let cancelled = false;

    import("mermaid")
      .then(({ default: mermaid }) => {
        if (!mermaidInitialized) {
          mermaid.initialize({ startOnLoad: false, theme: "dark" });
          mermaidInitialized = true;
        }

        return mermaid.render(renderId, code);
      })
      .then(({ svg: rendered }) => {
        if (!cancelled) setSvg(rendered);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "mermaid render error");
      });

    return () => {
      cancelled = true;
    };
  }, [code, renderId]);

  if (error) {
    return (
      <pre className="flex items-center justify-center rounded-xl bg-gray-900/80 p-4 text-sm text-red-300">
        {error}
      </pre>
    );
  }

  if (!svg) {
    return (
      <pre className="flex items-center justify-center rounded-xl bg-gray-900/80 p-4 text-sm text-gray-400">
        Rendering diagram…
      </pre>
    );
  }

  return (
    <>
      <MermaidPanZoom svg={svg} onToggleFullscreen={() => setFullscreen(true)} />
      {fullscreen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-50 flex flex-col bg-black/90 p-2 backdrop-blur-sm sm:p-6">
            <MermaidPanZoom svg={svg} fullscreen onToggleFullscreen={() => setFullscreen(false)} />
          </div>,
          document.body,
        )}
    </>
  );
}
