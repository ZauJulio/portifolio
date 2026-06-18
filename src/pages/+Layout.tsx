import type { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";

import { SpeedInsights } from "@vercel/speed-insights/react";
import { usePageContext } from "vike-react/usePageContext";

import { Analytics, LanguageSwitcher, ToastProvider } from "@/components";
import { i18nByLocale, I18N, type Locale } from "@/i18n";

import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/geist-sans/700.css";
// Geist Mono powers code blocks + inline code (Tailwind `font-mono`).
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";

import "@/root.css";

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
  const { locale = I18N.defaultLocale } = usePageContext();

  return (
    <I18nextProvider i18n={i18nByLocale[locale as Locale]}>
      <ToastProvider>
        <LanguageSwitcher />
        {children}
        {/* Privacy-focused analytics, injected resiliently (never fatal). */}
        <Analytics />
        <SpeedInsights />
      </ToastProvider>
    </I18nextProvider>
  );
}
