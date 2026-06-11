import { useEffect, useRef, useState } from "react";

import type { SearchParamsPatch } from "./use-search-params-nav";

type SetParams = (patch: SearchParamsPatch, opts?: { replace?: boolean }) => void;

/**
 * Controlled search box that debounces input into `?q=` (resetting `page`). The
 * guard `searchInput === serverQuery` only navigates when the box differs from the
 * server's value, so Strict Mode's double-effect can't fire a spurious navigation
 * (which would drop the locale). `serverQuery` is mirrored into a ref to stay current.
 */
export function useSearchDebounce(serverQuery: string, setParams: SetParams, delay = 300) {
  const [searchInput, setSearchInput] = useState(serverQuery);

  const setParamsRef = useRef(setParams);
  setParamsRef.current = setParams;

  const serverQueryRef = useRef(serverQuery);
  serverQueryRef.current = serverQuery;

  useEffect(() => {
    if (searchInput === serverQueryRef.current) return;

    const timer = setTimeout(() => {
      setParamsRef.current({ q: searchInput.trim() || null, page: null }, { replace: true });
    }, delay);

    return () => clearTimeout(timer);
  }, [searchInput, delay]);

  return { searchInput, setSearchInput };
}
