import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import { useData } from "vike-react/useData";

import { useSearchDebounce } from "@/hooks/use-search-debounce";
import { useSearchParamsNav } from "@/hooks/use-search-params-nav";

import type { Data } from "./+data";

const COOKING_PATH = `${import.meta.env.BASE_URL}cooking`;

interface CookingContextValue extends Data {
  /** Builds the `<Link>` href that applies (or clears, for "All") a facet value. */
  getFilterLink: (param: string, option: string) => string;
  /** Navigates to the current path with the given facet applied (or cleared for "All"). */
  setFilter: (param: string, option: string) => void;
  goToPage: (page: number) => void;
  setSearchInput: (value: string) => void;
  searchInput: string;
  filterRows: {
    label: string;
    param: string;
    active: string;
    options: string[];
  }[];
}

/** Provides cooking recipes data and state management for the cooking page. */
export function CookingProvider({ children }: { children: ReactNode }) {
  const data = useData<Data>();
  const { searchQuery, filters, activeCuisine, activeMealType, activeCourseType } = data;

  const { setParams, buildHref } = useSearchParamsNav();
  const { searchInput, setSearchInput } = useSearchDebounce(searchQuery, setParams);

  const value: CookingContextValue = {
    ...data,
    searchInput,
    setSearchInput,
    filterRows: [
      { label: "Cuisine", param: "cuisine", active: activeCuisine, options: filters.cuisines },
      { label: "Type", param: "mealType", active: activeMealType, options: filters.mealTypes },
      {
        label: "Course",
        param: "courseType",
        active: activeCourseType,
        options: filters.courseTypes,
      },
    ],
    getFilterLink: (param, option) =>
      buildHref(COOKING_PATH, { [param]: option === "All" ? null : option, page: null }),
    setFilter: (param, option) =>
      setParams({ [param]: option === "All" ? null : option, page: null }),
    goToPage: (page) => setParams({ page: page <= 1 ? null : String(page) }),
  };

  return <CookingContext.Provider value={value}>{children}</CookingContext.Provider>;
}

const CookingContext = createContext<CookingContextValue | null>(null);

export function useCooking(): CookingContextValue {
  const ctx = useContext(CookingContext);
  if (!ctx) throw new Error("useCooking must be used within <CookingProvider>");

  return ctx;
}
