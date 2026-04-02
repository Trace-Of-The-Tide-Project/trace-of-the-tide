import { api } from "./api";

export type CollectionItem = {
  id: string;
  name: string;
  description?: string | null;
};

export type CollectionsListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function unwrapCollectionsData(raw: unknown): CollectionItem[] {
  if (!raw || typeof raw !== "object") return [];
  const o = raw as Record<string, unknown>;
  const d = o.data;
  if (!Array.isArray(d)) return [];
  return d.filter(
    (row): row is CollectionItem =>
      row != null &&
      typeof row === "object" &&
      typeof (row as CollectionItem).id === "string" &&
      typeof (row as CollectionItem).name === "string",
  );
}

export type GetCollectionsParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: string;
};

/** GET /collections — public list (paginated). */
export async function getCollections(params?: GetCollectionsParams): Promise<CollectionItem[]> {
  const { data } = await api.get<unknown>("/collections", { params });
  return unwrapCollectionsData(data);
}
