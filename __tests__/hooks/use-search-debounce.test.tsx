import { StrictMode } from "react";

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useSearchDebounce } from "@/hooks/use-search-debounce";
import type { SearchParamsPatch } from "@/hooks/use-search-params-nav";

// Regression: under React Strict Mode the effect double-invokes on mount. The
// `searchInput === serverQuery` guard must prevent any navigation until the
// user actually changes the input — otherwise mount fires a spurious navigation
// that resets the URL / drops the locale.

/** A real callback that records the patches it receives (no spy/mock library). */
function makeRecorder() {
  const calls: SearchParamsPatch[] = [];
  return { fn: (patch: SearchParamsPatch) => calls.push(patch), calls };
}

const delay = 20;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("useSearchDebounce", () => {
  it("does not navigate on mount, even under StrictMode", async () => {
    const rec = makeRecorder();
    renderHook(() => useSearchDebounce("pizza", rec.fn, delay), { wrapper: StrictMode });

    await act(() => wait(delay * 3));
    expect(rec.calls).toHaveLength(0);
  });

  it("navigates (debounced) once the user changes the input", async () => {
    const rec = makeRecorder();
    const { result } = renderHook(() => useSearchDebounce("", rec.fn, delay), {
      wrapper: StrictMode,
    });

    act(() => result.current.setSearchInput("dough"));
    await act(() => wait(delay * 3));

    expect(rec.calls).toEqual([{ q: "dough", page: null }]);
  });

  it("clears `q` when the box is emptied", async () => {
    const rec = makeRecorder();
    const { result } = renderHook(() => useSearchDebounce("dough", rec.fn, delay), {
      wrapper: StrictMode,
    });

    act(() => result.current.setSearchInput(""));
    await act(() => wait(delay * 3));

    expect(rec.calls).toEqual([{ q: null, page: null }]);
  });
});
