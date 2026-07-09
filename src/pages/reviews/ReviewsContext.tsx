import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { useData } from "vike-react/useData";

import { useSearchDebounce } from "@/hooks/use-search-debounce";
import { useSearchParamsNav } from "@/hooks/use-search-params-nav";

import type { Data, SortKey } from "./+data";

interface ReviewsContextValue extends Data {
  /** Controlled value of the (debounced) search box. */
  searchInput: string;
  setSearchInput: (value: string) => void;
  /** Tags to render, including the active one even if beyond the visible window. */
  tagsToShow: string[];
  canShowMoreTags: boolean;
  showMoreTags: () => void;
  /** Patches the `tag` filter (null clears it) without scrolling to the top. */
  setTag: (tag: string | null) => void;
  toggleSort: (key: SortKey) => void;
  goToPage: (page: number) => void;
}

/** Provides reviews data and state management for the reviews page. */
export function ReviewsProvider({ children }: { children: ReactNode }) {
  const data = useData<Data>();
  const { tags, searchQuery, activeTag, sortBy, sortDir } = data;

  const { setParams } = useSearchParamsNav();
  const { searchInput, setSearchInput } = useSearchDebounce(searchQuery, setParams);
  const [visibleTagsCount, setVisibleTagsCount] = useState(5);

  const tagsToShow = useMemo(() => {
    const shown = tags.slice(0, visibleTagsCount);

    if (activeTag && tags.includes(activeTag) && !shown.includes(activeTag)) {
      shown.push(activeTag);
    }

    return shown;
  }, [tags, visibleTagsCount, activeTag]);

  const value: ReviewsContextValue = {
    ...data,
    searchInput,
    setSearchInput,
    tagsToShow,
    canShowMoreTags: visibleTagsCount < tags.length,
    showMoreTags: () => setVisibleTagsCount((count) => count + 3),
    setTag: (tag) => setParams({ tag, page: null }),
    goToPage: (page) => setParams({ page: page <= 1 ? null : String(page) }),
    toggleSort: (key) =>
      setParams({
        sort: key,
        dir: key === sortBy && sortDir === "desc" ? "asc" : "desc",
        page: null,
      }),
  };

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

const ReviewsContext = createContext<ReviewsContextValue | null>(null);

export function useReviews(): ReviewsContextValue {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used within <ReviewsProvider>");

  return ctx;
}
