import { ImageIcon } from "lucide-react";

import { Link } from "@/components/Link";

import type { Photo } from "@indago/hyper-json";

interface PhotoGridProps {
  photos: Photo[];
  albumSlug?: string;
  baseUrl?: string;
}

export function PhotoGrid({ photos, albumSlug, baseUrl = "/photography/" }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex p-4 rounded-2xl bg-gray-900/50 mb-4">
          <ImageIcon className="size-8 text-gray-600" />
        </div>

        <p className="text-gray-500 text-lg mb-2">No photos in this album</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {photos.map((photo) => {
        const photoUrl = albumSlug ? `${baseUrl}${albumSlug}/${photo.id}` : undefined;

        return photoUrl ? (
          <Link
            key={photo.id}
            to={photoUrl}
            className="block w-full text-left break-inside-avoid rounded-xl overflow-hidden border border-gray-800 group relative no-underline"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {photo.title && <p className="text-white text-sm font-medium">{photo.title}</p>}
              {photo.location && <p className="text-gray-300 text-sm">{photo.location}</p>}
              <div className="flex items-center gap-2 mt-1">
                {photo.date && <span className="text-gray-300 text-xs">{photo.date}</span>}
                {photo.timeOfDay && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                    {photo.timeOfDay}
                  </span>
                )}
              </div>
              {photo.tags && photo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {photo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ) : (
          <div
            key={photo.id}
            className="break-inside-avoid rounded-xl overflow-hidden border border-gray-800 group relative"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {photo.title && <p className="text-white text-sm font-medium">{photo.title}</p>}
              {photo.location && <p className="text-gray-300 text-sm">{photo.location}</p>}
              <div className="flex items-center gap-2 mt-1">
                {photo.date && <span className="text-gray-300 text-xs">{photo.date}</span>}
                {photo.timeOfDay && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                    {photo.timeOfDay}
                  </span>
                )}
              </div>
              {photo.tags && photo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {photo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
