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

/**
 * Append a `files` multipart part whose **filename** is the storage path or URL from POST /upload
 * (body is a minimal placeholder so the part is valid).
 */
export function appendContributionFileByUrl(formData: FormData, storagePathOrUrl: string, mimeType: string): void {
  const name = storagePathOrUrl.trim();
  const type = mimeType.trim() || "application/octet-stream";
  const placeholder = new File([new Uint8Array([32])], name, { type });
  formData.append("files", placeholder);
}

const DEFAULT_API_BASE = "https://backend-phd7.onrender.com";

/** Absolute URL to load a contribution file by storage `path` or full URL. */
export function contributionFilePublicUrl(path: string | null | undefined): string {
  const raw = (path ?? "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE).replace(/\/+$/, "");
  const rel = raw.replace(/^\/+/, "");
  return `${base}/${rel}`;
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
