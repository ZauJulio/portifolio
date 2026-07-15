import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useComposed } from "@indago/hyper-json/hooks";
import { CameraIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useData } from "vike-react/useData";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { ShareButton } from "@/components/ShareButton";
import { useLocale } from "@/i18n";

import { PhotoGrid } from "../components/PhotoGrid";

import type { Data } from "./+data";

export default function AlbumPage() {
  const { displayLocale } = useLocale();
  const { t } = useTranslation();
  const album = useData<Data>();

  const [activeTag, setActiveTag] = useState("All");
  const [photoPage, setPhotoPage] = useState(1);

  const tags = useMemo(() => {
    const set = new Set<string>(["All"]);
    for (const photo of album.photos) {
      for (const tag of photo.tags ?? []) set.add(tag);
    }
    return Array.from(set);
  }, [album.photos]);

  const tagFilter = activeTag !== "All" ? [{ key: "tags" as const, value: activeTag }] : [];

  const {
    paginated: { items: pagedPhotos, totalPages: photoTotalPages, page: photoCurrentPage },
  } = useComposed(album.photos, {
    filters: tagFilter,
    searchFields: ["title", "description", "alt", "location"],
    page: photoPage,
    perPage: 12,
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageHeader backToUrl={`${import.meta.env.BASE_URL}photography`} />

      <div className="max-w-4xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: t(($) => $.common.home), href: "/" },
            { label: t(($) => $.photography.title), href: "/photography" },
            { label: album.name },
          ]}
        />
      </div>

      {/* Album Header */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto flex items-start gap-4">
          <div className="size-14 rounded-xl overflow-hidden border border-gray-800 shadow-md flex items-center justify-center bg-linear-to-br from-sky-500/15 to-cyan-400/5 shrink-0">
            <CameraIcon className="size-7 text-sky-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{album.name}</h1>
                {album.description && (
                  <p className="text-gray-400 mt-1 max-w-2xl">{album.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
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
              <ShareButton title={`Zau Julio | ${album.name}`} description={album.description} />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-6 px-6">
        <div className="max-w-6xl mx-auto space-y-3">
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
                  {tag === "All" ? t(($) => $.common.all) : tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Photo Grid */}
      <section className="pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <PhotoGrid
            photos={pagedPhotos}
            albumSlug={album.id}
            baseUrl={`${import.meta.env.BASE_URL}photography/`}
          />
        </div>
      </section>

      {/* Pagination */}
      {photoTotalPages > 1 && (
        <section className="pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-4 px-6 py-4 border-t border-gray-800/50">
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
          </div>
        </section>
      )}
    </div>
  );
}
