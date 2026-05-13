import {
  resolveUploadedMediaSrc,
  uploadedMediaApiUrl,
} from "@/lib/media/uploaded-media";
import { api } from "@/services/api";
import { getStoredToken } from "@/services/auth.service";

export type ContributionType = {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ContributionFile = {
  id: string;
  contribution_id: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  path: string;
  /** When the API returns a signed/public URL, prefer it for previews over `path`. */
  url?: string | null;
  upload_date: string;
  createdAt: string;
  updatedAt: string;
  resolution: string | null;
  duration: string | null;
  transcript: string | null;
  participant_id: string | null;
  uploaded_by: string | null;
};

export type ContributionUser = {
  id: string;
  username: string;
  full_name: string;
  email?: string;
};

export type ContributionCollection = {
  id: string;
  name: string;
  description: string;
  cover_image: string | null;
  created_by: string;
  created_date: string;
  createdAt: string;
  updatedAt: string;
};

export type ContributionListItem = {
  id: string;
  title: string;
  description: string;
  type_id: string | null;
  user_id: string | null;
  submission_date: string;
  status: string;
  contributor_name: string | null;
  contributor_email: string | null;
  contributor_phone: string | null;
  phone_number: string | null;
  consent_given: boolean;
  open_call_id: string | null;
  createdAt: string;
  updatedAt: string;
  user: ContributionUser | null;
  type: ContributionType | null;
  files: ContributionFile[];
  collections: ContributionCollection[];
};

export type CreatedContribution = {
  id: string;
  title: string;
  description: string;
  type_id: string | null;
  user_id: string | null;
  submission_date: string;
  status: string;
  contributor_name: string;
  contributor_email: string;
  contributor_phone: string | null;
  phone_number: string | null;
  consent_given: boolean;
  open_call_id: string | null;
  createdAt: string;
  updatedAt: string;
  files: ContributionFile[];
  collections: unknown[];
  user: unknown | null;
  type: unknown | null;
};

export type ApiEnvelope<T> = {
  status: number;
  results: number;
  data: T;
};

export type ContributionListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type ContributionListResponse = {
  data: ContributionListItem[];
  meta: ContributionListMeta;
};

export async function getContributions(
  page = 1,
  limit = 10
): Promise<{ items: ContributionListItem[]; meta: ContributionListMeta }> {
  const { data } = await api.get<ContributionListResponse>("/contributions", {
    params: { page, limit },
  });
  return { items: data.data ?? [], meta: data.meta };
}

export async function fetchContributionTypes(): Promise<ContributionType[]> {
  const { data } = await api.get<ApiEnvelope<ContributionType[]>>("/contributions/types");
  return data.data;
}

/**
 * Create contribution with multipart/form-data (each part field name MUST be `files`).
 * Do not set Content-Type manually — Axios must add the multipart boundary.
 * Backend requires Authorization Bearer token.
 */
export async function createContribution(formData: FormData): Promise<CreatedContribution> {
  const token = getStoredToken();
  if (!token) {
    throw new Error("Missing access token");
  }

  const { data } = await api.post<ApiEnvelope<CreatedContribution>>("/contributions", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    transformRequest: [
      (body, headers) => {
        if (body instanceof FormData) {
          delete headers["Content-Type"];
        }
        return body;
      },
    ],
  });

  return data.data;
}

export function contributionDisplayMediaRef(file: ContributionFile): string {
  const url = file.url?.trim();
  if (url) return url;
  const path = file.path?.trim();
  if (path) return path;
  return file.file_name?.trim() ?? "";
}

function unwrapSignedFileUrlResponse(raw: unknown): string | null {
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const inner = o.data;
  if (typeof o.url === "string" && o.url.trim()) return o.url.trim();
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    const row = inner as Record<string, unknown>;
    if (typeof row.url === "string" && row.url.trim()) return row.url.trim();
  }
  return null;
}

/** Temporary signed URL for a stored file (same kind of ref as POST /upload returns for articles). */
export async function getContributionFileSignedUrl(fileId: string): Promise<string | null> {
  const { data } = await api.get<unknown>(`/files/${encodeURIComponent(fileId)}/url`);
  return unwrapSignedFileUrlResponse(data);
}

/**
 * Append a `files` multipart part: **full file bytes** (same as POST /upload) and the part
 * **filename** set to the storage key from that upload (e.g. `images/….png`). A 1-byte placeholder
 * produced invalid stored images (`file_size: 1`) and broken previews.
 */
export function appendContributionFile(
  formData: FormData,
  storageKey: string,
  mimeType: string,
  file: File,
): void {
  const name = storageKey.trim();
  if (!name) return;
  const type = (mimeType.trim() || file.type || "application/octet-stream").trim();
  const body =
    file.type === type ? file : new File([file], file.name, { type, lastModified: file.lastModified });
  formData.append("files", body, name);
}

/**
 * Absolute URL for a contribution file `path` (same rules as article body / hero media:
 * {@link resolveArticleMediaSrc}).
 */
export function contributionFilePublicUrl(path: string | null | undefined): string {
  const raw = (path ?? "").trim();
  if (!raw) return "";
  return resolveUploadedMediaSrc(raw);
}

/**
 * URL on the API origin for a relative storage key (e.g. `images/…`). Many backends proxy or
 * authorize reads here while the bucket stays private.
 */
export function contributionFileApiUrl(path: string | null | undefined): string {
  return uploadedMediaApiUrl(path);
}

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|bmp|svg)(\?.*)?$/i;

/** First file that can be shown as an image preview (mime or extension). */
export function firstContributionPreviewableImageFile(
  files: ContributionFile[] | null | undefined,
): ContributionFile | null {
  if (!files?.length) return null;
  for (const f of files) {
    const p = f.path?.trim();
    if (!p) continue;
    const mime = (f.mime_type ?? "").toLowerCase();
    if (mime.startsWith("image/")) return f;
    const label = `${f.file_name ?? ""} ${p}`.toLowerCase();
    if (IMAGE_EXT.test(label)) return f;
  }
  return null;
}
