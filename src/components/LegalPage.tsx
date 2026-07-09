import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";

export type LegalSection = { heading: string; body: string };

interface LegalPageProps {
  title: string;
  intro: string;
  sections: LegalSection[];
  /** Localized label for the breadcrumb trail's current page. */
  breadcrumbLabel: string;
  /** Optional extra content rendered after the sections (e.g. a call-to-action). */
  footerSlot?: ReactNode;
}

/**
 * Shared shell for static informational pages (About, Accessibility): the top
 * bar, a breadcrumb, an intro lede, a stack of heading/body sections rendered
 * as readable prose, and the global footer.
 */
export function LegalPage({ title, intro, sections, breadcrumbLabel, footerSlot }: LegalPageProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageHeader backToUrl="/" />

      <div className="max-w-3xl mx-auto px-6">
        <Breadcrumbs
          items={[{ label: t(($) => $.common.home), href: "/" }, { label: breadcrumbLabel }]}
        />
      </div>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        <p className="text-gray-300 text-lg leading-relaxed mb-10">{intro}</p>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold text-white mb-2">{section.heading}</h2>
              <p className="text-gray-400 leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>

        {footerSlot}
      </main>

      <Footer />
    </div>
  );
}
