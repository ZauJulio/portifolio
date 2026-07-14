import { useTranslation } from "react-i18next";

import { MailIcon } from "lucide-react";

import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { Link } from "@/components/Link";

/**
 * Global site footer — shared across the homepage, hobby collections and
 * articles. Branding + quick links (About / Accessibility), social icons, and a
 * legal line with the copyright and business registration (CNPJ).
 */
export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-800/60 py-10">
      <div className="relative container mx-auto px-6 max-w-6xl">
        {/* Flex row: left = branding, right = social links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: branding */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>{t(($) => $.footer.poweredBy)}</span>
            <a
              href="https://github.com/zaujulio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-300 hover:text-brand-500 transition-colors no-underline font-medium"
            >
              zaujulio
            </a>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/zaujulio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-brand-300 transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="size-5" />
            </a>
            <a
              href="https://linkedin.com/in/zaujulio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-brand-300 transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="size-5" />
            </a>
            <a
              href="mailto:zaujulio.dev@gmail.com"
              className="text-gray-500 hover:text-brand-300 transition-colors"
              aria-label="Email"
            >
              <MailIcon className="size-5" />
            </a>
          </div>
        </div>

        {/* Centered site links (lower-contrast gray) */}
        <nav
          className="absolute top-20 sm:top-10 inset-x-0 flex items-center justify-center gap-6 text-sm pointer-events-none"
          aria-label={t(($) => $.footer.links)}
        >
          <Link
            to="/about"
            className="pointer-events-auto text-gray-600 hover:text-brand-300 transition-colors no-underline"
          >
            {t(($) => $.footer.about)}
          </Link>

          <Link
            to="/accessibility"
            className="pointer-events-auto text-gray-600 hover:text-brand-300 transition-colors no-underline"
          >
            {t(($) => $.footer.accessibility)}
          </Link>
        </nav>

        {/* Legal: copyright + business registration */}
        <div className="mt-6 pt-6 text-center text-gray-500 text-xs space-y-1">
          <p>
            &copy; {year} Zau Julio. {t(($) => $.footer.copyright)}
          </p>
        </div>
      </div>
    </footer>
  );
}
