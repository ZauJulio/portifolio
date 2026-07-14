import { useTranslation } from "react-i18next";

import { CameraIcon, ImageIcon } from "lucide-react";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HobbyHero } from "@/components/HobbyHero";
import { PageHeader } from "@/components/PageHeader";

import { AlbumCard } from "./components/AlbumCard";
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
  const { albums } = usePhotography();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageHeader backToUrl="/" />

      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: t(($) => $.common.home), href: "/" },
            { label: t(($) => $.photography.title) },
          ]}
        />
      </div>

      <section className="pt-12 px-6">
        <HobbyHero
          icon={<CameraIcon className="size-10 text-sky-400" />}
          iconWrapperClassName="bg-linear-to-br from-sky-500/15 to-cyan-400/5"
          title={t(($) => $.photography.title)}
          description={t(($) => $.photography.description)}
        />
      </section>

      <section className="px-6 pt-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {albums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
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
    </div>
  );
}
