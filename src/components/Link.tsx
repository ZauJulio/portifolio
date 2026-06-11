import type { AnchorHTMLAttributes, ReactNode } from "react";

import { usePageContext } from "vike-react/usePageContext";

import { I18N, type Locale } from "@/i18n";

/**
 * Vike `<Link>` (https://vike.dev/i18n#link-component): maps `to` (a logical path)
 * → `href`, prepending the active locale's prefix unless it's the default, so links
 * stay on the same-language site. Locale defaults to `pageContext.locale`; override
 * via the `locale` prop (e.g. a language switcher).
 */
export function Link({
  to,
  locale,
  children,
  ...props
}: {
  to: string;
  locale?: Locale;
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const pageContext = usePageContext();
  // Fall back to the default locale when there's no page context (e.g. unit
  // tests rendering the component in isolation) — no prefix is then applied.
  const activeLocale = locale ?? pageContext?.locale ?? I18N.defaultLocale;

  let href = to;

  if (activeLocale !== I18N.defaultLocale) {
    const path = to.startsWith("/") ? to : `/${to}`;
    href = `${I18N.locales[activeLocale].routePrefix}${path}`;
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
