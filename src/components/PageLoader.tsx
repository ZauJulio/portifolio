export function PageLoader() {
  // <output> carries an implicit role="status" + aria-live="polite".
  return (
    <output className="flex items-center justify-center min-h-screen pt-24 bg-black">
      <div className="size-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      <span className="sr-only">Loading…</span>
    </output>
  );
}
