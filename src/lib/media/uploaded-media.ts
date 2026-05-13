import { isUsableImageSrc } from "@/lib/content/content-image-src";
import { DEFAULT_PUBLIC_API_BASE_URL } from "@/lib/public-api-base-url";
import { api } from "@/services/api";

const DEFAULT_API_BASE = DEFAULT_PUBLIC_API_BASE_URL;

/**
 * Default GCS bucket for object keys under `images/…` (POST /upload) and `contributions/…`
 * (persisted on contribution records — backend often copies/renames from `images/` into this prefix).
 * Override via `NEXT_PUBLIC_STORAGE_PUBLIC_BASE_URL`.
 */
const DEFAULT_STORAGE_PUBLIC_BASE = "https://storage.googleapis.com/traceofthetide-uploads";

export function getUploadedMediaApiBaseUrl(): string {
  const raw =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL
      ? process.env.NEXT_PUBLIC_API_BASE_URL
      : DEFAULT_API_BASE;
  return raw.replace(/\/+$/, "");
}

function joinStoragePublicUrl(base: string, relativePath: string): string {
  const b = base.replace(/\/+$/, "");
  const rel = relativePath.replace(/^\/+/, "");
  const encoded = rel
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `${b}/${encoded}`;
}

function resolveBucketStoragePublicUrl(relativeKey: string): string {
  const rel = relativeKey.replace(/^\/+/, "");
  const fromEnv =
    typeof process !== "undefined" ? process.env.NEXT_PUBLIC_STORAGE_PUBLIC_BASE_URL?.trim() : "";
  if (fromEnv) {
    return joinStoragePublicUrl(fromEnv, rel);
  }
  return joinStoragePublicUrl(DEFAULT_STORAGE_PUBLIC_BASE, rel);
}

/**
 * API media refs: full URLs, site paths, `uploads/…`, `videos/…`, `audio/…`, `images/…`, `contributions/…` (no scheme).
 */
export function isUsableUploadedMediaRef(raw: string | null | undefined): raw is string {
  if (isUsableImageSrc(raw)) return true;
  const s = String(raw ?? "").trim();
  if (!s || s.includes("..")) return false;
  if (/^(uploads|videos|audio|images|contributions)\//i.test(s) && /^[\w./+%-]+$/i.test(s))
    return true;
  return false;
}

function normalizeStoredMediaPath(ref: string): string {
  const s = ref.trim();
  if (!s) return s;
  const rel = s.replace(/^\/+/, "");
  if (/^(images|contributions|uploads|videos|audio)\//i.test(rel)) return rel;
  if (rel.includes("/")) return rel;
  if (/^[\w.-]+\.(jpe?g|png|gif|webp|avif|bmp|svg|mp4|webm|mov|mp3|wav|ogg|m4a|aac)$/i.test(rel)) {
    return `images/${rel}`;
  }
  return rel;
}

/** Storage key from POST /upload (e.g. `images/…`) for multipart filenames and persisted refs. */
export function uploadedMediaStoragePath(ref: string): string {
  const s = ref.trim();
  if (!s) return s;
  if (/^https?:\/\//i.test(s)) {
    try {
      const pathname = decodeURIComponent(new URL(s).pathname.replace(/^\/+/, ""));
      const imagesIdx = pathname.toLowerCase().indexOf("images/");
      if (imagesIdx !== -1) return normalizeStoredMediaPath(pathname.slice(imagesIdx));
      const contributionsIdx = pathname.toLowerCase().indexOf("contributions/");
      if (contributionsIdx !== -1) return pathname.slice(contributionsIdx);
    } catch {
      /* fall through */
    }
  }
  return normalizeStoredMediaPath(s);
}

/** True when `ref` is a signed or otherwise directly loadable upload URL (not a bare storage key). */
export function isSignedUploadedMediaRef(ref: string): boolean {
  const s = ref.trim();
  if (!/^https?:\/\//i.test(s)) return false;
  try {
    const url = new URL(s);
    if (url.hostname === "storage.googleapis.com" && !url.search) return false;
    return true;
  } catch {
    return false;
  }
}

/** Value to persist on profile/article APIs: storage key only, never a signed URL with query params. */
export function uploadedMediaPersistedRef(ref: string): string {
  return uploadedMediaStoragePath(ref);
}

/**
 * Absolute URL for `<video>` / `<audio>` / `<img>`:
 * - Full `https://` refs (e.g. signed GCS URLs from the editor) are returned as-is.
 * - `images/…` (upload) and `contributions/…` (saved on contributions) use the same bucket / env base.
 * - `uploads/…`, `videos/…`, `audio/…` (and leading `/` forms) use the API host.
 */
export function resolveUploadedMediaSrc(ref: string): string {
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

  const rel = normalizeStoredMediaPath(s).replace(/^\/+/, "");
  if (/^(images|contributions)\//i.test(rel)) {
    return resolveBucketStoragePublicUrl(rel);
  }

  if (s.startsWith("/") && !/^\/(uploads|videos|audio)\//i.test(s)) {
    return s;
  }
  const base = getUploadedMediaApiBaseUrl();
  const path = s.startsWith("/") ? s : `/${s}`;
  return `${base}${path}`;
}

const RELATED_CARD_IMAGE_FALLBACK = "/images/image.png";

/**
 * API list/detail often returns `cover_image` as a bucket key (`images/…`) or API path (`uploads/…`).
 * next/image requires a usable absolute URL or site path; this maps refs the same way as article heroes.
 */
export function resolveUploadedMediaForNextImage(
  ref: string | null | undefined,
  fallback: string = RELATED_CARD_IMAGE_FALLBACK,
): string {
  if (ref == null) return fallback;
  const s = String(ref).trim();
  if (!s) return fallback;
  if (isUsableImageSrc(s)) return s;
  if (isUsableUploadedMediaRef(s)) {
    const resolved = resolveUploadedMediaSrc(s);
    if (isUsableImageSrc(resolved)) return resolved;
  }
  return fallback;
}

/**
 * URL on the API origin for a relative storage key (e.g. `images/…`). Many backends proxy or
 * authorize reads here while the bucket stays private.
 */
export function uploadedMediaApiUrl(path: string | null | undefined): string {
  const raw = (path ?? "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const rel = raw.replace(/^\/+/, "");
  const base = getUploadedMediaApiBaseUrl();
  return `${base}/${rel.split("/").map(encodeURIComponent).join("/")}`;
}

function payloadInnerRecord(data: Record<string, unknown>): Record<string, unknown> | null {
  const inner = data.data;
  return inner != null && typeof inner === "object" && !Array.isArray(inner)
    ? (inner as Record<string, unknown>)
    : null;
}

function pickPathOrUrlFromPayload(data: unknown): string | null {
  if (typeof data === "string" && data.trim()) return data.trim();
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const inner = payloadInnerRecord(o);

  const urlInner = inner && typeof inner.url === "string" ? inner.url.trim() : "";
  const pathInner = inner && typeof inner.path === "string" ? inner.path.trim() : "";
  const urlRoot = typeof o.url === "string" ? o.url.trim() : "";
  const pathRoot = typeof o.path === "string" ? o.path.trim() : "";

  if (/^https?:\/\//i.test(urlInner)) return urlInner;
  if (/^https?:\/\//i.test(urlRoot)) return urlRoot;
  if (urlInner) return urlInner;
  if (urlRoot) return urlRoot;
  if (pathInner) return pathInner;
  if (pathRoot) return pathRoot;
  return null;
}

async function postUploadFile(file: File): Promise<unknown> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<unknown>("/upload", formData, {
    transformRequest: [
      (body, headers) => {
        if (body instanceof FormData) {
          delete headers["Content-Type"];
        }
        return body;
      },
    ],
  });

  return data;
}

/**
 * POST /upload — multipart file upload for articles, avatars, and other persisted media refs.
 * Prefer signed `url` when present; otherwise use relative `path`.
 */
export async function uploadUploadedMediaFile(file: File): Promise<string> {
  const data = await postUploadFile(file);
  const loc = pickPathOrUrlFromPayload(data);
  if (loc) return loc;
  throw new Error("Upload response did not include a path or URL.");
}
