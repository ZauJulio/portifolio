import { useTranslation } from "react-i18next";

import { CameraIcon, ImageIcon } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";

import { AlbumCard } from "./components/AlbumCard";
import { AlbumModal } from "./components/AlbumModal";
import { PhotographyProvider, usePhotography } from "./PhotographyContext";

export default function PhotographyPage() {
  return (
    <PhotographyProvider>
      <PhotographyView />
    </PhotographyProvider>
  );
}

function PhotographyView() {
  const { t } = useTranslation();
  const { albums, selectedAlbum, selectAlbum, modalTags } = usePhotography();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageHeader backToUrl="/" />

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex p-4 rounded-2xl bg-linear-to-br from-amber-500/10 to-orange-500/5 mb-6">
            <CameraIcon className="size-10 text-amber-400" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t(($) => $.photography.title)}</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {t(($) => $.photography.description)}
          </p>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {albums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <AlbumCard key={album.id} album={album} onSelect={selectAlbum} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex p-4 rounded-2xl bg-gray-900/50 mb-4">
                <ImageIcon className="size-8 text-gray-600" />
              </div>
              <p className="text-gray-500 text-lg mb-2">{t(($) => $.photography.noAlbums)}</p>
            </div>
          )}
        </div>
      </section>

      <AlbumModal album={selectedAlbum} tags={modalTags} onClose={() => selectAlbum(null)} />
    </div>
  );
}
