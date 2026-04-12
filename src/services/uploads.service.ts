import { api } from "./api";

function pickPathOrUrlFromPayload(data: unknown): string | null {
  if (typeof data === "string" && data.trim()) return data.trim();
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const directPath = typeof o.path === "string" ? o.path.trim() : "";
  if (directPath) return directPath;
  const directUrl = typeof o.url === "string" ? o.url.trim() : "";
  if (directUrl) return directUrl;
  const inner = o.data;
  if (inner && typeof inner === "object") {
    const i = inner as Record<string, unknown>;
    const p = typeof i.path === "string" ? i.path.trim() : "";
    if (p) return p;
    const u = typeof i.url === "string" ? i.url.trim() : "";
    if (u) return u;
  }
  return null;
}

/**
 * POST /upload — multipart file upload.
 * Backend may return a path (`uploads/...`), full URL, `{ path }`, `{ url }`, nested `data`, or a raw string.
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
