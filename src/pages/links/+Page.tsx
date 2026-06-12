import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  Code2,
  ExternalLink,
  FileText,
  Github,
  Instagram,
  Linkedin,
  MessageCircle,
  Youtube,
} from "lucide-react";

import { Link } from "@/components/Link";
import { cn } from "@/lib/utils";

import styles from "./Links.module.css";

// ─── Data ────────────────────────────────────────────────────

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: React.ReactNode;
  featured?: boolean;
  thumbnail?: string;
}

interface SocialItem {
  label: string;
  url: string;
  icon: React.ReactNode;
}

// Links and socials are built inside the component to access t()

// ─── Component ───────────────────────────────────────────────

export default function LinksPage() {
  const { t } = useTranslation();

  // Track page view with Umami
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window as Window & { umami?: { track: (event: string) => void } }).umami
    ) {
      (window as Window & { umami?: { track: (event: string) => void } }).umami?.track(
        "links-page-view",
      );
    }
  }, []);

  const links: LinkItem[] = [
    {
      id: "resume",
      title: t(($) => $.links.resume),
      url: "https://raw.githubusercontent.com/ZauJulio/ZauJulio/refs/heads/main/resume/resume.pdf",
      icon: <FileText className="size-5" />,
      featured: true,
    },
    {
      id: "linkedin",
      title: t(($) => $.links.linkedin),
      url: "https://www.linkedin.com/in/zaujulio",
      icon: <Linkedin className="size-5" />,
    },
    {
      id: "github",
      title: t(($) => $.links.github),
      url: "https://github.com/ZauJulio",
      icon: <Github className="size-5" />,
    },
    {
      id: "codersrank",
      title: t(($) => $.links.codersrank),
      url: "https://profile.codersrank.io/user/zaujulio",
      icon: <Code2 className="size-5" />,
    },
    {
      id: "discord",
      title: t(($) => $.links.discord),
      url: "https://discordapp.com/users/439441026021851136",
      icon: <MessageCircle className="size-5" />,
    },
  ];

  const socials: SocialItem[] = [
    {
      label: "Instagram",
      url: "https://instagram.com/ZauJulio",
      icon: <Instagram className="size-6" />,
    },
    {
      label: "YouTube",
      url: "https://www.youtube.com/@zaujulio",
      icon: <Youtube className="size-6" />,
    },
    {
      label: "X",
      url: "https://x.com/zaujulio_dev",
      icon: (
        <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24">
          <path d="M17.805 2.97h3.065l-6.73 7.664 7.863 10.396h-6.171L11 14.712 5.47 21.03H2.403l7.131-8.197-7.53-9.864h6.324l4.365 5.772zm-1.073 16.26h1.7L7.434 4.703H5.609z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={cn(
        styles.page,
        "min-h-screen flex flex-col items-center px-4 pt-12 pb-16 font-sans",
      )}
    >
      <div className="w-full max-w-170">
        {/* Profile Header */}
        <div className={cn(styles.animateIn, "text-center")}>
          <img
            src={`${import.meta.env.BASE_URL}avatar.png`}
            alt="@ZauJulio"
            width={96}
            height={96}
            className="size-24 mx-auto rounded-full object-cover border-[3px] border-[#801336] shadow-[0_0_30px_rgba(199,44,65,0.2)] transition-[transform,box-shadow] duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(199,44,65,0.4)]"
          />
          <h1 className="text-2xl font-bold text-white mt-4 mb-1 tracking-tight">@ZauJulio</h1>
          <p className="text-sm font-normal text-[#FAA8A7] opacity-90">{t(($) => $.links.bio)}</p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3 mt-8 w-full">
          {links.map((link, i) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                styles.animateIn,
                "group relative flex items-center gap-4 px-5 py-4 rounded-xl border text-white no-underline overflow-hidden backdrop-blur-[8px] transition-all duration-[250ms] hover:border-[#C72C41] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(199,44,65,0.2)] active:scale-[0.98]",
                "before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:bg-linear-to-br before:from-[#C72C41] before:to-[#EE4540] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-[0.08]",
                link.featured
                  ? "bg-linear-to-br from-[#C72C41]/[0.12] to-[#EE4540]/[0.06] border-[#C72C41]/25"
                  : "bg-white/[0.06] border-white/[0.08]",
              )}
              style={{ animationDelay: `${(i + 1) * 80}ms` }}
              data-umami-event={`link-click-${link.id}`}
            >
              <div
                className={cn(
                  "flex items-center justify-center size-10 rounded-[10px] shrink-0 relative z-[1] transition-[background-color,color] duration-[250ms]",
                  link.featured
                    ? "bg-[#C72C41]/20 text-[#EE4540]"
                    : "bg-white/[0.08] text-[#F47370] group-hover:bg-[#C72C41]/[0.15] group-hover:text-[#EE4540]",
                )}
              >
                {link.icon}
              </div>
              <span className="font-medium text-base relative z-[1] flex-1">{link.title}</span>
              <ExternalLink className="size-4 text-white/30 shrink-0 relative z-[1] transition-[color,transform] duration-[250ms] group-hover:text-[#F47370] group-hover:translate-x-[3px]" />
            </a>
          ))}
        </div>

        {/* Social Icons */}
        <div
          className={cn(styles.animateIn, "flex items-center justify-center gap-2 mt-8")}
          style={{ animationDelay: `${(links.length + 1) * 80}ms` }}
        >
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center size-11 rounded-full bg-transparent text-[#FAA8A7] cursor-pointer no-underline transition-all duration-250 hover:text-white hover:bg-white/[0.08] hover:scale-110"
              aria-label={s.label}
              title={s.label}
              data-umami-event={`social-click-${s.label.toLowerCase()}`}
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Footer */}
        <div
          className={cn(styles.animateIn, "mt-12 text-center")}
          style={{ animationDelay: `${(links.length + 2) * 80}ms` }}
        >
          <Link
            to={`${import.meta.env.BASE_URL}`}
            className="text-xs text-[#F47370] no-underline opacity-60 tracking-[0.02em] transition-opacity duration-200 hover:opacity-100"
          >
            zaujulio.vercel.app
          </Link>
        </div>
      </div>
    </div>
  );
}
