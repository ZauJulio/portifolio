import { useTranslation } from "react-i18next";

import { LegalPage } from "@/components/LegalPage";
import { useLocale } from "@/i18n";
import en from "@/i18n/locales/en.json";
import pt from "@/i18n/locales/pt.json";

export default function AccessibilityPage() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const a11y = (locale.startsWith("pt") ? pt : en).accessibility;

  return (
    <LegalPage
      title={t(($) => $.accessibility.title)}
      intro={t(($) => $.accessibility.intro)}
      sections={a11y.sections}
      breadcrumbLabel={t(($) => $.footer.accessibility)}
    />
  );
}
