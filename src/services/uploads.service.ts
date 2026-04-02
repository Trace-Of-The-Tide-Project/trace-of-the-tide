import { api } from "./api";

/**
 * POST /upload — multipart file upload. Backend may return `{ url }`, `{ data: { url } }`, or a raw URL string.
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

  if (typeof data === "string" && data.trim()) return data.trim();
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (typeof o.url === "string" && o.url.trim()) return o.url.trim();
    const inner = o.data;
    if (inner && typeof inner === "object" && typeof (inner as { url?: string }).url === "string") {
      return String((inner as { url: string }).url).trim();
    }
  }
  throw new Error("Upload response did not include a URL.");
}
