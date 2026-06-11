import { useTranslation } from "react-i18next";

import { ImageIcon } from "lucide-react";

import { useLocale } from "@/i18n";

import type { Album } from "@virtus/hyper-json";

interface AlbumCardProps {
  album: Album;
  onSelect: (album: Album) => void;
}

export function AlbumCard({ album, onSelect }: AlbumCardProps) {
  const { displayLocale } = useLocale();
  const { t } = useTranslation();
  const coverPhoto = album.photos[0];
  const photoCount = album.photos.length;

  return (
    <button
      type="button"
      onClick={() => onSelect(album)}
      aria-label={album.name}
      className="group block text-left rounded-xl overflow-hidden border border-gray-800 hover:border-brand-500 transition-all duration-300 hover:shadow-lg hover:shadow-brand-900/20 cursor-pointer"
    >
      <div className="aspect-video bg-gray-900 relative overflow-hidden">
        {coverPhoto ? (
          <img
            src={coverPhoto.src}
            alt={coverPhoto.alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="size-12 text-gray-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-brand-300 transition-colors">
          {album.name}
        </h3>
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{album.description}</p>
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
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
            • {photoCount} {t(($) => $.photography.photos)}
          </span>
        </div>
      </div>
    </button>
  );
}
