import { isUsableImageSrc } from "@/lib/content/content-image-src";

const DEFAULT_API_BASE = "https://backend-phd7.onrender.com";

export function getArticleApiBaseUrl(): string {
  const raw =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL
      ? process.env.NEXT_PUBLIC_API_BASE_URL
      : DEFAULT_API_BASE;
  return raw.replace(/\/+$/, "");
}

/**
 * API media refs: full URLs, site paths, `uploads/…`, `videos/…`, `audio/…` (no scheme).
 */
export function isUsableArticleMediaRef(raw: string | null | undefined): raw is string {
  if (isUsableImageSrc(raw)) return true;
  const s = String(raw ?? "").trim();
  if (!s || s.includes("..")) return false;
  if (/^(uploads|videos|audio)\//i.test(s) && /^[\w./-]+$/i.test(s)) return true;
  return false;
}

/**
 * Absolute URL for `<video>` / `<audio>` / `<img>` when the API stores `/videos/…`, `/audio/…`, or `uploads/…`
 * (browser must hit the API host, not the Next.js origin).
 */
export function resolveArticleMediaSrc(ref: string): string {
  const s = ref.trim();
  if (!s) return s;
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("//")) {
    try {
      return new URL(`https:${s}`).href;
    } catch {
      return s;
    }
  }
  if (s.startsWith("/") && !/^\/(uploads|videos|audio)\//i.test(s)) {
    return s;
  }
  const base = getArticleApiBaseUrl();
  const path = s.startsWith("/") ? s : `/${s}`;
  return `${base}${path}`;
}
