import { useTranslation } from "react-i18next";

import { AccessibilityIcon } from "lucide-react";

import { LegalPage } from "@/components/LegalPage";
import { Link } from "@/components/Link";
import { useLocale } from "@/i18n";
import en from "@/i18n/locales/en.json";
import pt from "@/i18n/locales/pt.json";

export default function AboutPage() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const about = (locale.startsWith("pt") ? pt : en).siteAbout;

  return (
    <LegalPage
      title={t(($) => $.siteAbout.title)}
      intro={t(($) => $.siteAbout.intro)}
      sections={about.sections}
      breadcrumbLabel={t(($) => $.footer.about)}
      footerSlot={
        <div className="mt-10 pt-8 border-t border-gray-800/60">
          <Link
            to="/accessibility"
            className="inline-flex items-center gap-2 text-sm text-brand-300 hover:text-brand-400 transition-colors no-underline"
          >
            <AccessibilityIcon className="size-4" />
            {t(($) => $.siteAbout.accessibilityCta)}
          </Link>
        </div>
      }
    />
  );
}
