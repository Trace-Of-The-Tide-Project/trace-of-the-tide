/**
 * Guards hero/cover URLs before passing to next/image (invalid strings throw
 * "Failed to construct 'URL': Invalid URL").
 */

export function isUsableImageSrc(raw: string | undefined | null): raw is string {
  if (raw == null) return false;
  const s = String(raw).trim();
  if (!s) return false;
  const lower = s.toLowerCase();
  if (lower === "undefined" || lower === "null") return false;
  if (s.includes("..")) return false;

  if (s.startsWith("data:image/")) return true;

  if (s.startsWith("/")) {
    return s.length >= 2;
  }

  if (/^https?:\/\//i.test(s)) {
    try {
      new URL(s);
      return true;
    } catch {
      return false;
    }
  }

  if (s.startsWith("//")) {
    try {
      new URL(`https:${s}`);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}
