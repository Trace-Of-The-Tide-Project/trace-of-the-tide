import type { ArticleListItem } from "@/services/articles.service";

let cacheValid = false;
let cachedList: ArticleListItem[] = [];

/** Valid cache snapshot (may be empty). `undefined` means must fetch. */
export function peekValidAdminArticlesList(): ArticleListItem[] | undefined {
  return cacheValid ? cachedList : undefined;
}

export function commitAdminArticlesList(list: ArticleListItem[]): void {
  cachedList = list;
  cacheValid = true;
}

/** Call after create / update / publish / schedule so the list refetches on next visit. */
export function invalidateAdminArticlesListCache(): void {
  cacheValid = false;
}

/** After a successful delete — keep cache in sync without refetching. */
export function removeArticleFromAdminArticlesListCache(id: string): void {
  if (!cacheValid) return;
  cachedList = cachedList.filter((a) => a.id !== id);
}
