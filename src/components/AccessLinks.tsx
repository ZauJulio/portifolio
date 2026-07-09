import { useTranslation } from "react-i18next";

import { resolvePlatform } from "@/lib/access-platforms";

export type AccessLink = { platform: string; url: string; label?: string };

/**
 * "Available on" section for a hobby detail page — renders the content's
 * external access links (streaming services, digital stores, catalogs) as
 * brand-tinted chips. Renders nothing when there are no links.
 */
export function AccessLinks({ links }: { links?: AccessLink[] }) {
  const { t } = useTranslation();

  if (!links || links.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
        {t(($) => $.common.availableOn)}
      </h2>
      <ul className="flex flex-wrap gap-2.5">
        {links.map((link) => {
          const platform = resolvePlatform(link.platform);

          return (
            <li key={`${link.platform}-${link.url}`}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900/40 px-3.5 py-1.5 text-sm text-gray-300 no-underline transition-colors hover:border-gray-600 hover:text-white"
              >
                <span className="shrink-0" style={{ color: platform.color }}>
                  {platform.icon}
                </span>
                {link.label ?? platform.label}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
