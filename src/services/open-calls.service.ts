import { api } from "./api";

export type OpenCallContentBlockType =
  | "paragraph"
  | "quote"
  | "image"
  | "gallery"
  | "callout"
  | "author_note"
  | "divider";

export type OpenCallContentBlock = {
  type: OpenCallContentBlockType;
  value: string | string[];
  order: number;
};

export type OpenCallMainMedia = {
  type: "image" | "file";
  url: string;
  size_mb: number;
};

export type ApplicationFormField =
  | { name: string; type: "text"; required: boolean }
  | { name: string; type: "email"; required: boolean }
  | { name: string; type: "phone"; required: boolean }
  | { name: string; type: "textarea"; required: boolean }
  | { name: string; type: "checkbox"; required: boolean }
  | { name: string; type: "select"; required: boolean; options: string[] }
  | {
      name: string;
      type: "file_multiple";
      required: boolean;
      max_files: number;
      allowed_types: string[];
      max_size_mb: number;
    };

export type OpenCallSettings = {
  status: "draft" | "published" | "scheduled";
  category: string;
  tags: string[];
  language: "en" | "ar";
  visibility: "public" | "private";
};

export type OpenCallSeo = {
  title: string;
  meta_description: string;
};

export type CreateOpenCallPayload = {
  title: string;
  content_blocks: OpenCallContentBlock[];
  main_media: OpenCallMainMedia | null;
  application_form: { fields: ApplicationFormField[] };
  settings: OpenCallSettings;
  seo: OpenCallSeo;
  action: "publish" | "draft" | "schedule";
  /** ISO datetime when action is schedule; otherwise null */
  scheduled_at: string | null;
};

/** Default contributor application schema (editable in admin UI). */
export const DEFAULT_OPEN_CALL_APPLICATION_FIELDS: ApplicationFormField[] = [
  { name: "first_name", type: "text", required: true },
  { name: "last_name", type: "text", required: true },
  { name: "email", type: "email", required: true },
  { name: "phone", type: "phone", required: true },
  {
    name: "experience_field",
    type: "select",
    required: true,
    options: ["Design", "Writing", "Photography"],
  },
  { name: "about", type: "textarea", required: true },
  { name: "country", type: "select", required: true, options: ["Palestine", "Jordan", "Lebanon"] },
  { name: "city", type: "select", required: true, options: ["Ramallah", "Amman", "Beirut"] },
  {
    name: "files",
    type: "file_multiple",
    required: false,
    max_files: 5,
    allowed_types: ["jpg", "png", "pdf", "mp3", "mp4", "doc"],
    max_size_mb: 20,
  },
  { name: "terms_agreement", type: "checkbox", required: true },
];

export function validateOpenCallApplicationFields(fields: ApplicationFormField[]): string | null {
  if (!fields.length) return "Add at least one field to the application form.";
  const names = new Set<string>();
  for (const f of fields) {
    const n = f.name.trim();
    if (!n) return "Each field needs a non-empty name.";
    if (names.has(n)) return `Duplicate field name: ${n}`;
    names.add(n);
    if (f.type === "select" && (!f.options || f.options.length === 0)) {
      return `Select field "${n}" needs at least one option.`;
    }
    if (f.type === "file_multiple") {
      if (f.max_files < 1) return `Field "${n}": max_files must be at least 1.`;
      if (!f.allowed_types?.length) return `Field "${n}": add at least one allowed file type.`;
      if (f.max_size_mb < 1) return `Field "${n}": max_size_mb must be at least 1.`;
    }
  }
  return null;
}

export type OpenCallDetail = {
  id: string;
  title: string;
  category?: string;
  content_blocks: OpenCallContentBlock[];
  main_media: OpenCallMainMedia | null;
  application_form: { fields: ApplicationFormField[] };
  settings?: OpenCallSettings;
  seo?: OpenCallSeo;
  status?: string;
  created_at?: string;
  createdAt?: string;
  published_at?: string;
  creator?: {
    id: string;
    username: string;
    full_name?: string;
    email?: string;
  };
};

function unwrapOpenCallPayload(raw: unknown): OpenCallDetail | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const inner = o.data ?? o;
  if (inner && typeof inner === "object" && "id" in inner && "application_form" in inner) {
    return inner as unknown as OpenCallDetail;
  }
  return null;
}

export async function getOpenCallById(id: string): Promise<OpenCallDetail | null> {
  try {
    const { data } = await api.get<unknown>(`/open-calls/${encodeURIComponent(id)}`);
    return unwrapOpenCallPayload(data);
  } catch {
    return null;
  }
}

export async function createOpenCall(payload: CreateOpenCallPayload): Promise<unknown> {
  const { data } = await api.post<unknown>("/open-calls", payload);
  return data;
}
