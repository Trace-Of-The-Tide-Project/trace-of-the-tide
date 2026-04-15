/**
 * Use API cover when it is a safe local path or valid http(s) URL; otherwise `fallback`.
 */
export function resolveTripCoverImage(raw: string | null | undefined, fallback: string): string {
  const s = raw?.trim() ?? "";
  if (!s) return fallback;
  if (s.startsWith("/")) return s;
  if (/^https?:\/\//i.test(s)) {
    try {
      new URL(s);
      return s;
    } catch {
      return fallback;
    }
  }
  return fallback;
}
