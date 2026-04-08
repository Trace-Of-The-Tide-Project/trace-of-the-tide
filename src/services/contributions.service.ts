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
  limit = 10,
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
 * Create contribution with multipart/form-data (files field name MUST be "files").
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
      // Override the default JSON content-type for this request.
      // Axios will attach the correct multipart boundary automatically.
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data;
}

