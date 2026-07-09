import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import {
  ArrowRightIcon,
  BookOpenIcon,
  CameraIcon,
  ClapperboardIcon,
  CookingPotIcon,
  GamepadIcon,
  Music2Icon,
} from "lucide-react";

import { Link } from "@/components/Link";
import type en from "@/i18n/locales/en.json";

/** A type-safe i18next selector into the translation tree (see {@link useTranslation}). */
type TextSelector = ($: typeof en) => string;

interface HobbyCard {
  key: string;
  title: TextSelector;
  description: TextSelector;
  icon: React.ElementType;
  to: string;
  gradient: string;
  iconColor: string;
  /** Per-card `--page-*` accent triple — drives the hover border/title/link/shadow. */
  accent: Record<`--page-${300 | 400 | 500}`, string>;
}

const hobbies: HobbyCard[] = [
  {
    key: "photography",
    title: ($) => $.hobbies.photography.title,
    description: ($) => $.hobbies.photography.description,
    icon: CameraIcon,
    to: "/photography",
    gradient: "from-sky-500/15 to-cyan-400/5",
    iconColor: "text-sky-400",
    accent: { "--page-500": "#0ea5e9", "--page-400": "#38bdf8", "--page-300": "#7dd3fc" },
  },
  {
    key: "cooking",
    title: ($) => $.hobbies.cooking.title,
    description: ($) => $.hobbies.cooking.description,
    icon: CookingPotIcon,
    to: "/cooking",
    gradient: "from-[#E2502D]/15 to-[#FF8243]/5",
    iconColor: "text-[#E2502D]",
    accent: { "--page-500": "#e2502d", "--page-400": "#f4703f", "--page-300": "#ff8243" },
  },
  {
    key: "music",
    title: ($) => $.hobbies.music.title,
    description: ($) => $.hobbies.music.description,
    icon: Music2Icon,
    to: "/music",
    gradient: "from-brand-700/20 to-brand-500/5",
    iconColor: "text-brand-300",
    accent: {
      "--page-500": "var(--color-brand-500)",
      "--page-400": "var(--color-brand-400)",
      "--page-300": "var(--color-brand-300)",
    },
  },
  {
    key: "games",
    title: ($) => $.hobbies.games.title,
    description: ($) => $.hobbies.games.description,
    icon: GamepadIcon,
    to: "/games",
    gradient: "from-teal-500/15 to-cyan-400/5",
    iconColor: "text-teal-400",
    accent: { "--page-500": "#14b8a6", "--page-400": "#2dd4bf", "--page-300": "#5eead4" },
  },
  {
    key: "books",
    title: ($) => $.hobbies.books.title,
    description: ($) => $.hobbies.books.description,
    icon: BookOpenIcon,
    to: "/books",
    gradient: "from-amber-500/15 to-orange-400/5",
    iconColor: "text-amber-400",
    accent: { "--page-500": "#f59e0b", "--page-400": "#fbbf24", "--page-300": "#fcd34d" },
  },
  {
    key: "movies",
    title: ($) => $.hobbies.movies.title,
    description: ($) => $.hobbies.movies.description,
    icon: ClapperboardIcon,
    to: "/movies",
    gradient: "from-violet-500/15 to-purple-400/5",
    iconColor: "text-violet-400",
    accent: { "--page-500": "#8b5cf6", "--page-400": "#a78bfa", "--page-300": "#c4b5fd" },
  },
];

function HobbyCardComponent({ hobby }: { hobby: HobbyCard }) {
  const { t } = useTranslation();
  const Icon = hobby.icon;

  return (
    <Link
      to={hobby.to}
      style={hobby.accent as CSSProperties}
      className="group block rounded-xl border border-gray-800 bg-gray-950/10 p-6 transition-all duration-300 hover:border-page-500/50 hover:bg-gray-800/535 hover:shadow-lg hover:shadow-page-500/5 no-underline"
    >
      <div className={`inline-flex p-3 rounded-lg bg-linear-to-br ${hobby.gradient} mb-4`}>
        <Icon className={`size-6 ${hobby.iconColor}`} />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-page-300 transition-colors">
        {t(hobby.title)}
      </h3>

      <p className="text-sm text-gray-400 leading-relaxed mb-4">{t(hobby.description)}</p>

      <span className="inline-flex items-center gap-1.5 text-sm text-page-400 group-hover:text-page-300 transition-colors">
        {t(($) => $.articles.readMore)}
        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function HobbiesSection() {
  const { t } = useTranslation();

  return (
    <section id="hobbies" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
          {t(($) => $.hobbies.title)}
        </h2>
        <div className="text-center mb-12 max-w-3xl mx-auto space-y-4">
          <p className="text-gray-300 text-lg leading-relaxed">{t(($) => $.hobbies.subtitle)}</p>
          <p className="text-gray-400 leading-relaxed">{t(($) => $.hobbies.description)}</p>
          <p className="text-gray-500 text-sm italic">{t(($) => $.hobbies.quote)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hobbies.map((hobby) => (
            <HobbyCardComponent key={hobby.key} hobby={hobby} />
          ))}
        </div>
      </div>
    </section>
  );
}
