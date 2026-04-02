import { api } from "./api";

export type AdminTagItem = {
  id: string;
  name: string;
};

function unwrapTagsList(raw: unknown): AdminTagItem[] {
  if (raw && typeof raw === "object" && "data" in raw) {
    const d = (raw as { data: unknown }).data;
    if (Array.isArray(d)) return unwrapTagsList(d);
  }
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (row): row is AdminTagItem =>
      row != null &&
      typeof row === "object" &&
      typeof (row as AdminTagItem).id === "string" &&
      typeof (row as AdminTagItem).name === "string"
  );
}

/** GET /admin/system-settings/tags — Bearer (admin). Returns `[{ id, name }, …]`. */
export async function getAdminTags(): Promise<AdminTagItem[]> {
  const { data } = await api.get<unknown>("/tags");
  return unwrapTagsList(data);
}
