import { api } from "./api";

/**
 * Picks the best URL/path from POST /upload responses.
 * Prefer a full `https` URL (e.g. signed GCS) over a relative `path` so `<video>` / `<img>` can load without API auth.
 */
function pickPathOrUrlFromPayload(data: unknown): string | null {
  if (typeof data === "string" && data.trim()) return data.trim();
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const inner =
    o.data != null && typeof o.data === "object" && !Array.isArray(o.data)
      ? (o.data as Record<string, unknown>)
      : null;

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

/**
 * POST /upload — multipart file upload.
 * Backend may return `{ status, data: { path, url } }` (prefer signed `url`), a plain path/URL string, or `{ path }` / `{ url }`.
 */
export async function uploadArticleAsset(file: File): Promise<string> {
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

  const loc = pickPathOrUrlFromPayload(data);
  if (loc) return loc;
  throw new Error("Upload response did not include a path or URL.");
}

/** Same as {@link uploadArticleAsset}; prefer this name when the file is not article-specific. */
export const uploadFileToUrl = uploadArticleAsset;
