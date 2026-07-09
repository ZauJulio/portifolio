// Perceived luminance (Rec. 709) — used to rank buckets by lightness.
const luminance = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

type ColorBucket = { r: number; g: number; b: number; count: number };

/**
 * Extract the dominant accent color from an image.
 *
 * Downscales the image, buckets its pixels into a coarse color histogram
 * (5 bits per channel), discards noise buckets (<1% of pixels) and returns the
 * lightest meaningful color as raw `"r g b"` channels — the CSS consumes it as
 * `rgb(var(--accent) / …)`, so it must NOT be hex.
 */
export function getAverageColor(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.src = src;
    img.crossOrigin = "Anonymous";
    img.onerror = reject;
    img.onload = () => {
      const canvas = document.createElement("canvas");

      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve("0 0 0");

      const size = 32;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const { data } = ctx.getImageData(0, 0, size, size);
      const buckets = new Map<string, ColorBucket>();

      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
        if (a < 128) continue; // skip transparent pixels

        // Quantize to 5-bit-per-channel buckets so similar shades merge.
        const key = `${r >> 3}-${g >> 3}-${b >> 3}`;
        const bucket = buckets.get(key);
        if (bucket) {
          bucket.r += r;
          bucket.g += g;
          bucket.b += b;
          bucket.count += 1;
        } else {
          buckets.set(key, { r, g, b, count: 1 });
        }
      }

      const all = [...buckets.values()];
      if (all.length === 0) return resolve("0 0 0");

      const lum = (bucket: ColorBucket) =>
        luminance(bucket.r / bucket.count, bucket.g / bucket.count, bucket.b / bucket.count);
      // Chroma proxy: max-min channel spread. ~0 for grays/whites, high for
      // saturated colors. Used to prefer a real hue over a washed-out gray.
      const chroma = (bucket: ColorBucket) => {
        const r = bucket.r / bucket.count;
        const g = bucket.g / bucket.count;
        const b = bucket.b / bucket.count;
        return Math.max(r, g, b) - Math.min(r, g, b);
      };

      // A bucket only counts as a "real" color region if it covers at least
      // ~2 sampled pixels (0.3% of a 32×32 grid) — this filters lone-pixel
      // noise (JPEG speckle, anti-aliased edges) while keeping small but real
      // bright accents on an otherwise dark cover (which sit around 0.2–1%).
      const totalPixels = data.length / 4;
      const minShare = totalPixels * 0.003;

      // Reject near-white buckets (highlights, borders, glare) — otherwise the
      // "lightest" pick almost always lands on white and the accent loses its
      // hue. Anything brighter than this ceiling is treated as glare, not color.
      const MAX_LUMINANCE = 210;

      // Minimum chroma for a bucket to read as a "color" rather than a gray.
      const MIN_CHROMA = 24;

      // Among the meaningful, non-white regions, prefer the lightest one that
      // still carries an actual hue — otherwise a washed-out light gray wins
      // and the accent looks white. Fall back progressively so we never fail.
      const meaningful = all.filter((bucket) => bucket.count >= minShare);
      const nonWhite = meaningful.filter((bucket) => lum(bucket) <= MAX_LUMINANCE);
      const colored = nonWhite.filter((bucket) => chroma(bucket) >= MIN_CHROMA);

      const pool =
        colored.length > 0
          ? colored
          : nonWhite.length > 0
            ? nonWhite
            : meaningful.length > 0
              ? meaningful
              : all;

      const lightest = pool.reduce((best, bucket) => (lum(bucket) > lum(best) ? bucket : best));

      const r = Math.round(lightest.r / lightest.count);
      const g = Math.round(lightest.g / lightest.count);
      const b = Math.round(lightest.b / lightest.count);

      resolve(`${r} ${g} ${b}`);
    };
  });
}
