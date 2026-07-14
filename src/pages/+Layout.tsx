import type { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";

import { SpeedInsights } from "@vercel/speed-insights/react";
import { usePageContext } from "vike-react/usePageContext";

import { Analytics, LanguageSwitcher, ToastProvider } from "@/components";
import { Footer } from "@/components/Footer";
import { i18nByLocale, I18N, type Locale } from "@/i18n";

import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/geist-sans/700.css";
// Geist Mono powers code blocks + inline code (Tailwind `font-mono`).
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";

import "@/root.css";

// Per-page accent palette (`--page-500/400/300`) applied to the whole shell so
// shared, page-agnostic chrome — the fixed language switcher, back link, search,
// filters and cards — all pick up the current collection's color. Falls back to
// the brand red (see root.css) on routes not listed here.
const PAGE_ACCENTS: Record<string, React.CSSProperties> = {
  games: { "--page-500": "#14b8a6", "--page-400": "#2dd4bf", "--page-300": "#5eead4" },
  books: { "--page-500": "#f59e0b", "--page-400": "#fbbf24", "--page-300": "#fcd34d" },
  movies: { "--page-500": "#8b5cf6", "--page-400": "#a78bfa", "--page-300": "#c4b5fd" },
} as Record<string, React.CSSProperties>;

// Match the first path segment after the (optional) locale prefix.
function accentForPath(pathname: string): React.CSSProperties | undefined {
  const segment = pathname
    .replace(/^\/(en|pt)(?=\/|$)/, "")
    .split("/")
    .filter(Boolean)[0];
  return segment ? PAGE_ACCENTS[segment] : undefined;
}

/**
 * App shell (the React Router `root.tsx` <body> tree, ported to Vike).
 *
 * vike-react owns the <html>/<head>/<body> document; this Layout wraps the page
 * inside <body> with the toast portal, language switcher and analytics. The
 * request locale (from +onBeforeRoute, passed to the client) selects the matching
 * react-i18next instance, so `useTranslation()` resolves the right language under
 * both SSG prerender and client hydration.
 */
export default function LayoutDefault({ children }: { children: ReactNode }) {
  const pageContext = usePageContext();
  const { locale = I18N.defaultLocale } = pageContext;
  const accent = accentForPath(pageContext.urlPathname);

  return (
    <I18nextProvider i18n={i18nByLocale[locale as Locale]}>
      <ToastProvider>
        <div style={accent}>
          <LanguageSwitcher />
          {children}
          <Footer />
        </div>
        {/* Privacy-focused analytics, injected resiliently (never fatal). */}
        <Analytics />
        <SpeedInsights />
      </ToastProvider>
    </I18nextProvider>
  );
}
