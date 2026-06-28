import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { useData } from "vike-react/useData";
import { navigate } from "vike/client/router";

import { Link } from "@/components/Link";

import type { Data } from "./+data";

export default function PhotoPage() {
  const { t } = useTranslation();
  const { photo, album, prev, next, index, total } = useData<Data>();

  const albumUrl = `${import.meta.env.BASE_URL}photography/${album.id}`;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" && prev) {
        navigate(`${albumUrl}/${prev.id}`);
      } else if (e.key === "ArrowRight" && next) {
        navigate(`${albumUrl}/${next.id}`);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [prev, next, albumUrl]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top bar */}
      <header className="py-2 bg-black/80 backdrop-blur-md border-b border-gray-800/50 shrink-0">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to={albumUrl}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
              aria-label={t(($) => $.common.close)}
            >
              <XIcon className="size-5" />
            </Link>
            <div className="min-w-0">
              {photo.title && (
                <p className="text-white text-sm font-medium truncate">{photo.title}</p>
              )}
              <p className="text-gray-500 text-xs truncate">
                {album.name} &mdash; {index + 1} of {total}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Photo area */}
      <div className="flex-1 flex flex-col min-h-0 my-4">
        <div className="flex-1 flex items-center justify-center relative min-h-0">
          {prev && (
            <Link
              to={`${albumUrl}/${prev.id}`}
              className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              aria-label={t(($) => $.cooking.prevPage)}
            >
              <ChevronLeftIcon className="size-8" />
            </Link>
          )}

          <img
            src={photo.src}
            alt={photo.alt}
            className="max-w-[95vw] max-h-full w-auto h-auto object-contain rounded-sm"
          />

          {next && (
            <Link
              to={`${albumUrl}/${next.id}`}
              className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              aria-label={t(($) => $.cooking.nextPage)}
            >
              <ChevronRightIcon className="size-8" />
            </Link>
          )}
        </div>

        {(prev || next) && (
          <div className="flex lg:hidden items-center justify-center gap-12 py-3 w-full shrink-0">
            {prev ? (
              <Link
                to={`${albumUrl}/${prev.id}`}
                className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                aria-label={t(($) => $.cooking.prevPage)}
              >
                <ChevronLeftIcon className="size-8" />
              </Link>
            ) : (
              <div className="size-8" />
            )}
            <span className="text-gray-500 text-xs">
              {index + 1}/{total}
            </span>
            {next ? (
              <Link
                to={`${albumUrl}/${next.id}`}
                className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                aria-label={t(($) => $.cooking.nextPage)}
              >
                <ChevronRightIcon className="size-8" />
              </Link>
            ) : (
              <div className="size-8" />
            )}
          </div>
        )}
      </div>

      {/* Bottom metadata bar */}
      {(photo.description || photo.location || photo.date || photo.timeOfDay || photo.tags) && (
        <div className="px-6 py-4 bg-black/80 backdrop-blur-sm border-t border-gray-800/50 shrink-0">
          <div className="max-w-3xl mx-auto text-center">
            {photo.description && <p className="text-gray-300 text-sm mb-2">{photo.description}</p>}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500">
              {photo.location && <span>{photo.location}</span>}
              {photo.date && <span>{photo.date}</span>}
              {photo.timeOfDay && (
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-gray-400">
                  {photo.timeOfDay}
                </span>
              )}
            </div>
            {photo.tags && photo.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                {photo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
