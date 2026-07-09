import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  prevLabel: string;
  nextLabel: string;
}

/** Numbered pager shared by the article and recipe listings. Renders nothing
 *  when there's a single page. Page changes are delegated to `onPageChange`. */
export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  prevLabel,
  nextLabel,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <section className="pb-20 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-800 text-sm text-gray-400 hover:text-white hover:border-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="size-4" />
          {prevLabel}
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`size-8 rounded-lg text-sm transition-colors ${
                page === currentPage
                  ? "bg-page-500 text-white"
                  : "text-gray-500 hover:text-white hover:bg-gray-800"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-800 text-sm text-gray-400 hover:text-white hover:border-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {nextLabel}
          <ChevronRightIcon className="size-4" />
        </button>
      </div>
    </section>
  );
}
