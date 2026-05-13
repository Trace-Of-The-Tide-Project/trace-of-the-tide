import { uploadedMediaPersistedRef } from "@/lib/media/uploaded-media";
import { api } from "./api";

export type AdminUserStatus = "active" | "suspended" | "inactive" | "pending";

export type AdminUserListItem = {
  id: string;
  username: string;
  full_name: string;
  email: string;
  status: string;
  /** Display slug from API (`role`, nested `role.name`, or `user_role`). Defaults to `user`. */
  role: string;
  /** ISO date string when available (`joined_at`, `created_at`, etc.). */
  joined_at: string | null;
  /** ISO date string for last activity (`last_active_at`, `last_login_at`, etc.). */
  last_active_at: string | null;
  contributions_count: number;
};

export type UsersListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type GetUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminUserStatus;
  sortBy?: string;
  order?: "ASC" | "DESC";
};

export type UsersListResult = {
  users: AdminUserListItem[];
  meta: UsersListMeta;
  status: number;
  results: number;
};

function firstParsableDateString(o: Record<string, unknown>, keys: readonly string[]): string | null {
  for (const k of keys) {
    const v = o[k];
    if (v == null) continue;
    if (typeof v === "string" && v.trim()) {
      const t = Date.parse(v.trim());
      if (Number.isFinite(t)) return v.trim();
    }
    if (typeof v === "number" && Number.isFinite(v)) {
      const d = new Date(v);
      if (!Number.isNaN(d.getTime())) return d.toISOString();
    }
  }
  return null;
}

function firstIntField(o: Record<string, unknown>, keys: readonly string[]): number {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "number" && Number.isFinite(v)) return Math.max(0, Math.trunc(v));
    if (typeof v === "string" && v.trim()) {
      const n = parseInt(v.trim(), 10);
      if (Number.isFinite(n)) return Math.max(0, n);
    }
  }
  return 0;
}

function extractRoleFromPayload(o: Record<string, unknown>): string {
  const r = o.role;
  if (typeof r === "string" && r.trim()) return r.trim();
  if (r && typeof r === "object") {
    const ro = r as Record<string, unknown>;
    if (typeof ro.name === "string" && ro.name.trim()) return ro.name.trim();
    if (typeof ro.slug === "string" && ro.slug.trim()) return ro.slug.trim();
  }
  const ur = o.user_role;
  if (typeof ur === "string" && ur.trim()) return ur.trim();
  return "";
}

function normalizeUserRow(raw: unknown): AdminUserListItem | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.email !== "string") return null;
  const roleRaw = extractRoleFromPayload(o);
  return {
    id: o.id,
    username: String(o.username ?? ""),
    full_name: String(o.full_name ?? ""),
    email: o.email,
    status: String(o.status ?? "inactive"),
    role: roleRaw || "user",
    joined_at: firstParsableDateString(o, [
      "joined_at",
      "created_at",
      "registered_at",
      "date_joined",
      "createdAt",
      "joinedAt",
    ]),
    last_active_at: firstParsableDateString(o, [
      "last_active_at",
      "last_seen_at",
      "last_login_at",
      "lastActiveAt",
      "lastLoginAt",
      "updated_at",
      "updatedAt",
    ]),
    contributions_count: firstIntField(o, [
      "contributions_count",
      "contributions",
      "contribution_count",
      "articles_count",
      "published_articles_count",
      "published_count",
    ]),
  };
}

function parseMeta(raw: unknown): UsersListMeta | null {
  if (!raw || typeof raw !== "object") return null;
  const m = raw as Record<string, unknown>;
  const total = typeof m.total === "number" ? m.total : Number(m.total);
  const page = typeof m.page === "number" ? m.page : Number(m.page);
  const limit = typeof m.limit === "number" ? m.limit : Number(m.limit);
  const totalPages = typeof m.totalPages === "number" ? m.totalPages : Number(m.totalPages);
  if (!Number.isFinite(total) || !Number.isFinite(page) || !Number.isFinite(limit)) return null;
  const tp = Number.isFinite(totalPages) ? totalPages : Math.max(1, Math.ceil(total / Math.max(1, limit)));
  return { total, page, limit, totalPages: tp };
}

/**
 * GET /users — admin only; passwords excluded.
 */
export function normalizeUsersListPayload(raw: unknown): UsersListResult {
  if (!raw || typeof raw !== "object") {
    return {
      users: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
      status: 200,
      results: 0,
    };
  }
  const o = raw as Record<string, unknown>;
  const data = Array.isArray(o.data) ? o.data : [];
  const users = data.map(normalizeUserRow).filter((u): u is AdminUserListItem => u !== null);
  const results = typeof o.results === "number" && Number.isFinite(o.results) ? o.results : users.length;
  const status = typeof o.status === "number" && Number.isFinite(o.status) ? o.status : 200;
  let meta = parseMeta(o.meta);
  if (!meta) {
    const limit = 10;
    meta = {
      total: users.length,
      page: 1,
      limit,
      totalPages: Math.max(1, Math.ceil(users.length / limit)),
    };
  }
  return { users, meta, status, results };
}

export type CreateUserPayload = {
  full_name: string;
  email: string;
  password: string;
};

export type CreateUserResult = {
  id: string;
  full_name: string;
  email: string;
  status: string;
};

function unwrapCreateUserResponse(raw: unknown): CreateUserResult | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const inner = o.data;
  const row =
    inner && typeof inner === "object" && inner !== null && !Array.isArray(inner)
      ? (inner as Record<string, unknown>)
      : o;
  if (typeof row.id !== "string" || typeof row.email !== "string") return null;
  return {
    id: row.id,
    full_name: String(row.full_name ?? ""),
    email: row.email,
    status: String(row.status ?? "active"),
  };
}

/** POST /users — admin only. */
export async function createUser(payload: CreateUserPayload): Promise<CreateUserResult> {
  const { data } = await api.post<unknown>("/users", {
    full_name: payload.full_name.trim(),
    email: payload.email.trim(),
    password: payload.password,
  });
  const parsed = unwrapCreateUserResponse(data);
  if (!parsed) {
    throw new Error("Invalid response from server when creating user");
  }
  return parsed;
}

export async function getUsers(params?: GetUsersParams): Promise<UsersListResult> {
  const query: Record<string, string | number> = {};
  if (params?.page != null) query.page = params.page;
  if (params?.limit != null) query.limit = Math.min(100, Math.max(1, params.limit));
  if (params?.search?.trim()) query.search = params.search.trim();
  if (params?.status) query.status = params.status;
  if (params?.sortBy?.trim()) query.sortBy = params.sortBy.trim();
  if (params?.order) query.order = params.order;

  const { data } = await api.get<unknown>("/users", { params: query });
  return normalizeUsersListPayload(data);
}

export type AdminUserDetail = {
  id: string;
  username: string;
  full_name: string;
  email: string;
  status: string;
};

function unwrapUserDetailResponse(raw: unknown): AdminUserDetail | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const inner = o.data;
  const row =
    inner && typeof inner === "object" && inner !== null && !Array.isArray(inner)
      ? (inner as Record<string, unknown>)
      : o;
  if (typeof row.id !== "string" || typeof row.email !== "string") return null;
  return {
    id: row.id,
    username: String(row.username ?? ""),
    full_name: String(row.full_name ?? ""),
    email: row.email,
    status: String(row.status ?? "active"),
  };
}

/** GET /users/:id — authenticated. */
export async function getUserById(userId: string): Promise<AdminUserDetail> {
  const { data } = await api.get<unknown>(`/users/${encodeURIComponent(userId)}`);
  const parsed = unwrapUserDetailResponse(data);
  if (!parsed) {
    throw new Error("Invalid response from server when loading user");
  }
  return parsed;
}

export type AdminUserProfileDetails = {
  id: string;
  user_id: string;
  avatar: string | null;
  display_name: string;
  company: string | null;
  job_title: string | null;
  personal_link: string | null;
  website: string | null;
  birth_date: string | null;
  gender: string | null;
  location: string;
  about: string;
  social_links: string | null;
};

export type AdminUserProfileView = {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  email_verified: boolean;
  status: string;
  profile: AdminUserProfileDetails | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseNullableString(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  return value.trim();
}

function parseSocialLinksField(raw: unknown): string | null {
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (!isRecord(raw)) return null;
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") normalized[key] = value;
  }
  return Object.keys(normalized).length > 0 ? JSON.stringify(normalized) : null;
}

function unwrapProfileDetails(raw: unknown): AdminUserProfileDetails | null {
  if (!isRecord(raw)) return null;
  const id = typeof raw.id === "string" ? raw.id : null;
  const user_id = typeof raw.user_id === "string" ? raw.user_id : null;
  if (!id || !user_id) return null;
  const about =
    parseNullableString(raw.about) ??
    parseNullableString(raw.bio) ??
    "";
  return {
    id,
    user_id,
    avatar: parseNullableString(raw.avatar),
    display_name: parseNullableString(raw.display_name) ?? "",
    company: parseNullableString(raw.company),
    job_title: parseNullableString(raw.job_title),
    personal_link: parseNullableString(raw.personal_link),
    website: parseNullableString(raw.website) ?? parseNullableString(raw.personal_link),
    birth_date: parseNullableString(raw.birth_date),
    gender: parseNullableString(raw.gender),
    location: parseNullableString(raw.location) ?? "",
    about,
    social_links: parseSocialLinksField(raw.social_links),
  };
}

function unwrapUserProfileResponse(raw: unknown): AdminUserProfileView | null {
  if (!isRecord(raw)) return null;
  const row = isRecord(raw.data) ? raw.data : raw;
  if (typeof row.id !== "string" || typeof row.email !== "string") return null;
  const profileRaw = row.profile;
  return {
    id: row.id,
    username: String(row.username ?? ""),
    full_name: String(row.full_name ?? ""),
    email: row.email,
    phone_number: parseNullableString(row.phone_number) ?? "",
    email_verified: row.email_verified === true,
    status: String(row.status ?? ""),
    profile: profileRaw ? unwrapProfileDetails(profileRaw) : null,
  };
}

/** GET /users/:id/profile — authenticated. */
export async function getUserProfile(userId: string): Promise<AdminUserProfileView | null> {
  const { data } = await api.get<unknown>(`/users/${encodeURIComponent(userId)}/profile`);
  return unwrapUserProfileResponse(data);
}

export type UserProfileSocialLinks = Record<string, string>;

export const PROFILE_SOCIAL_LINK_KEYS = [
  "facebook",
  "twitter",
  "instagram",
  "linkedin",
] as const;

export function canonicalSocialLinksObject(links: UserProfileSocialLinks): UserProfileSocialLinks {
  return {
    facebook: links.facebook?.trim() ?? "",
    twitter: links.twitter?.trim() ?? "",
    instagram: links.instagram?.trim() ?? "",
    linkedin: links.linkedin?.trim() ?? "",
  };
}

export function canonicalSocialLinksJson(links: UserProfileSocialLinks): string {
  return JSON.stringify(canonicalSocialLinksObject(links));
}

export function parseSocialLinksObject(raw: string | null | undefined): UserProfileSocialLinks {
  const empty: UserProfileSocialLinks = {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  };
  const trimmed = raw?.trim();
  if (!trimmed) return empty;
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return empty;
    const source = parsed as Record<string, unknown>;
    return {
      facebook: typeof source.facebook === "string" ? source.facebook : "",
      twitter: typeof source.twitter === "string" ? source.twitter : "",
      instagram: typeof source.instagram === "string" ? source.instagram : "",
      linkedin: typeof source.linkedin === "string" ? source.linkedin : "",
    };
  } catch {
    return empty;
  }
}

export type UpdateUserProfilePayload = {
  about?: string;
  location?: string;
  personal_link?: string;
  avatar?: string;
  social_links?: UserProfileSocialLinks;
};

export type UpdatedUserProfile = {
  id: string;
  about: string;
  location: string;
  personal_link: string;
  avatar: string | null;
  social_links: UserProfileSocialLinks;
};

function unwrapSocialLinksFromProfile(profile: Record<string, unknown>): UserProfileSocialLinks {
  const raw = profile.social_links;
  if (typeof raw === "string" && raw.trim()) {
    return parseSocialLinksObject(raw);
  }
  if (isRecord(raw)) {
    const out: UserProfileSocialLinks = {};
    for (const [key, value] of Object.entries(raw)) {
      if (typeof value === "string") out[key] = value;
    }
    return canonicalSocialLinksObject(out);
  }
  return parseSocialLinksObject(null);
}

function unwrapUpdatedUserProfileResponse(raw: unknown): UpdatedUserProfile | null {
  if (!isRecord(raw)) return null;
  const row = isRecord(raw.data) ? raw.data : raw;
  const profile = isRecord(row.profile) ? row.profile : row;
  if (typeof row.id !== "string" && typeof profile.id !== "string") return null;
  return {
    id: typeof row.id === "string" ? row.id : String(profile.id),
    about: parseNullableString(profile.about) ?? parseNullableString(profile.bio) ?? "",
    location: parseNullableString(profile.location) ?? "",
    personal_link:
      parseNullableString(profile.personal_link) ?? parseNullableString(profile.website) ?? "",
    avatar: parseNullableString(profile.avatar),
    social_links: unwrapSocialLinksFromProfile(profile),
  };
}

/** PATCH /users/:id/profile — authenticated. */
export async function updateUserProfile(
  userId: string,
  payload: UpdateUserProfilePayload,
): Promise<UpdatedUserProfile> {
  const body: Record<string, unknown> = {};
  if (payload.about !== undefined) body.about = payload.about.trim();
  if (payload.location !== undefined) body.location = payload.location.trim();
  if (payload.personal_link !== undefined) body.personal_link = payload.personal_link.trim();
  if (payload.avatar !== undefined) body.avatar = uploadedMediaPersistedRef(payload.avatar);
  if (payload.social_links !== undefined) {
    body.social_links = canonicalSocialLinksObject(payload.social_links);
  }
  if (Object.keys(body).length === 0) {
    throw new Error("No fields to update");
  }
  const { data } = await api.patch<unknown>(`/users/${encodeURIComponent(userId)}/profile`, body);
  const parsed = unwrapUpdatedUserProfileResponse(data);
  if (!parsed) {
    throw new Error("Invalid response from server when updating profile");
  }
  return parsed;
}

const EXPORT_PAGE_LIMIT = 100;
const EXPORT_MAX_PAGES = 500;

type AllUsersParams = Pick<GetUsersParams, "search" | "status" | "sortBy" | "order">;

/**
 * Fetches every user page from GET /users (limit 100) until done. Safe cap on page count.
 */
export type UpdateUserPayload = {
  full_name?: string;
  status?: Exclude<AdminUserStatus, "pending">;
};

export type UpdateUserResult = {
  id: string;
  full_name: string;
  status: string;
};

function unwrapUpdateUserResponse(raw: unknown): UpdateUserResult | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const inner = o.data;
  const row =
    inner && typeof inner === "object" && inner !== null && !Array.isArray(inner)
      ? (inner as Record<string, unknown>)
      : o;
  if (typeof row.id !== "string") return null;
  return {
    id: row.id,
    full_name: String(row.full_name ?? ""),
    status: String(row.status ?? "active"),
  };
}

/** PATCH /users/:id — admin only; send only changed fields in the body. */
export async function updateUser(
  userId: string,
  payload: UpdateUserPayload,
): Promise<UpdateUserResult> {
  const body: Record<string, string> = {};
  if (payload.full_name !== undefined) body.full_name = payload.full_name.trim();
  if (payload.status !== undefined) body.status = payload.status;
  if (Object.keys(body).length === 0) {
    throw new Error("No fields to update");
  }
  const { data } = await api.patch<unknown>(`/users/${encodeURIComponent(userId)}`, body);
  const parsed = unwrapUpdateUserResponse(data);
  if (!parsed) {
    throw new Error("Invalid response from server when updating user");
  }
  return parsed;
}

export type UserStatusValue = "active" | "pending" | "inactive" | "suspended" | "deleted";

/** PATCH /users/:id/status — admin only. */
export async function updateUserStatus(userId: string, status: UserStatusValue): Promise<void> {
  await api.patch(`/users/${encodeURIComponent(userId)}/status`, { status });
}

export async function getAllUsersForExport(params?: AllUsersParams): Promise<AdminUserListItem[]> {
  const sortBy = params?.sortBy?.trim() || "username";
  const order = params?.order ?? "ASC";
  const all: AdminUserListItem[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const res = await getUsers({
      page,
      limit: EXPORT_PAGE_LIMIT,
      search: params?.search?.trim() || undefined,
      status: params?.status,
      sortBy,
      order,
    });
    all.push(...res.users);
    totalPages = Math.max(1, res.meta.totalPages);
    page += 1;
    if (page > EXPORT_MAX_PAGES) break;
  } while (page <= totalPages);

  return all;
}
