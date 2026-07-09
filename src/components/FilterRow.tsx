import { useTranslation } from "react-i18next";

export function FilterRow({
  label,
  options,
  active,
  onSelect,
  getLabel,
}: {
  label: string;
  options: string[];
  active: string;
  onSelect: (v: string) => void;
  getLabel?: (opt: string) => string;
}) {
  const { t } = useTranslation();

  if (options.length <= 1) return null;

  // Default label: the sentinel "All" option is localized (common.all); every
  // other option renders verbatim. A caller-supplied `getLabel` wins entirely.
  const renderLabel = getLabel ?? ((opt: string) => (opt === "All" ? t(($) => $.common.all) : opt));

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-500 uppercase tracking-wider font-medium w-16 shrink-0">
        {label}
      </span>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onSelect(opt)}
          className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 border cursor-pointer ${
            opt === active
              ? "bg-page-500 text-black border-page-500 font-medium"
              : "bg-gray-900/50 text-gray-400 border-gray-800 hover:border-page-500/50 hover:text-white"
          }`}
        >
          {renderLabel(opt)}
        </button>
      ))}
    </div>
  );
}
