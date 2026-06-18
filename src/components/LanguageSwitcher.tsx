import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";

import { stripLocale, useLocale, withLocale, type Locale } from "@/i18n";

const languages: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
];

export function LanguageSwitcher() {
  const { locale } = useLocale();
  const pageContext = usePageContext();

  const handleLanguageChange = (langCode: Locale) => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("language", langCode);
    }

    // Use the real browser path (locale-prefixed), not the logical pageContext
    // path: strip its prefix to recover the logical route, then re-apply the
    // target locale's prefix (the default locale is served prefix-free).
    const logical = stripLocale(window.location.pathname);
    const newPath = withLocale(langCode, logical);

    const search = pageContext.urlParsed.searchOriginal ?? "";
    const hash = pageContext.urlParsed.hashOriginal ?? "";

    void navigate(`${newPath}${search}${hash}`, { keepScrollPosition: true });
  };

  return (
    <div className="fixed top-[1.15rem] right-4 z-50 flex items-center gap-1 bg-black/10 backdrop-blur-md border border-gray-800 rounded-lg px-1 py-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            locale === lang.code ? "bg-brand-500/70 text-white" : "text-gray-400 hover:text-white"
          }`}
          aria-label={`Switch to ${lang.label}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
