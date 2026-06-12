import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useComposed } from "@muttum/hyper-json/hooks";
import { CameraIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon, XIcon } from "lucide-react";

import { useLocale } from "@/i18n";

import { PhotoGrid } from "./PhotoGrid";

import type { Album } from "@muttum/hyper-json";

interface AlbumModalProps {
  album: Album | null;
  tags: string[];
  onClose: () => void;
}

const PHOTOS_PER_PAGE = 12;

export function AlbumModal({ album, tags, onClose }: AlbumModalProps) {
  const { displayLocale } = useLocale();
  const { t } = useTranslation();
  const [activeTag, setActiveTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [photoPage, setPhotoPage] = useState(1);

  // Reset per-album state when the album changes
  useEffect(() => {
    setActiveTag("All");
    setSearchQuery("");
    setPhotoPage(1);
  }, [album?.id]);

  // Close on Escape
  useEffect(() => {
    if (!album) return undefined;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [album, onClose]);

  const tagFilter = activeTag !== "All" ? [{ key: "tags" as const, value: activeTag }] : [];

  const {
    paginated: { items: pagedPhotos, totalPages: photoTotalPages, page: photoCurrentPage },
  } = useComposed(album?.photos ?? [], {
    filters: tagFilter,
    searchQuery,
    searchFields: ["title", "description", "alt", "location"],
    page: photoPage,
    perPage: PHOTOS_PER_PAGE,
  });

  if (!album) return null;

  return (
    <dialog
      open
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm m-0 w-full h-full border-none"
      aria-label={album.name}
    >
      {/* Backdrop button — closes on click outside the panel */}
      <button
        type="button"
        className="absolute inset-0 w-full h-full cursor-default bg-transparent border-none"
        onClick={onClose}
        aria-label="Close album"
        tabIndex={-1}
      />
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-gray-800/50 bg-gray-900/30">
          <div className="size-12 rounded-lg overflow-hidden border border-gray-800 shadow-md flex items-center justify-center bg-gradient-to-br from-amber-500/15 to-orange-500/5 shrink-0">
            <CameraIcon className="size-6 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white truncate">{album.name}</h2>
            <p className="text-sm text-gray-400 truncate">{album.description}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              {album.date && (
                <span>
                  {new Date(album.date).toLocaleDateString(displayLocale, {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              )}
              {album.location && <span>• {album.location}</span>}
              <span>
                • {album.photos.length} {t(($) => $.photography.photos)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t(($) => $.common.close) ?? "Close"}
            className="p-2 text-gray-400 hover:text-brand-400 hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-800/50 bg-gray-900/20 space-y-3">
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
            <input
              type="text"
              aria-label={t(($) => $.common.search)}
              placeholder={t(($) => $.common.search)}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPhotoPage(1);
              }}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-500/50 transition-colors"
            />
          </div>

          {tags.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium shrink-0">
                {t(($) => $.common.tags)}
              </span>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setActiveTag(tag);
                    setPhotoPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 border cursor-pointer ${
                    tag === activeTag
                      ? "bg-brand-500 text-white border-brand-500 font-medium"
                      : "bg-gray-900/50 text-gray-400 border-gray-800 hover:border-brand-500/50 hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Photo grid */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <PhotoGrid photos={pagedPhotos as NonNullable<typeof album>["photos"]} />
        </div>

        {/* Pagination */}
        {photoTotalPages > 1 && (
          <div className="flex items-center justify-center gap-4 px-6 py-4 border-t border-gray-800/50 bg-gray-900/30">
            <button
              type="button"
              disabled={photoCurrentPage <= 1}
              onClick={() => setPhotoPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-800 text-sm text-gray-400 hover:text-white hover:border-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="size-4" />
              {t(($) => $.cooking.prevPage)}
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: photoTotalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPhotoPage(n)}
                  className={`size-8 rounded-lg text-sm transition-colors ${
                    n === photoCurrentPage
                      ? "bg-brand-500 text-white"
                      : "text-gray-500 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={photoCurrentPage >= photoTotalPages}
              onClick={() => setPhotoPage((p) => Math.min(photoTotalPages, p + 1))}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-800 text-sm text-gray-400 hover:text-white hover:border-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t(($) => $.cooking.nextPage)}
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
