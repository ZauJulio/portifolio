import { SearchIcon } from "lucide-react";

interface HeaderSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

/**
 * Compact search field designed to sit in the sticky `PageHeader` center slot.
 * Used by the hobby listing pages, where the collection search lives in the
 * header bar rather than in the page body.
 */
export function HeaderSearch({ value, onChange, placeholder }: HeaderSearchProps) {
  return (
    <div className="relative w-full">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
      <input
        type="text"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-900/50 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-page-500/50 transition-colors"
      />
    </div>
  );
}
