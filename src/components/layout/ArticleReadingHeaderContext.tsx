"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ArticleReadingHeaderMeta = {
  viewCount: number;
};

type Ctx = {
  meta: ArticleReadingHeaderMeta | null;
  setArticleHeaderMeta: (meta: ArticleReadingHeaderMeta | null) => void;
};

const ArticleReadingHeaderContext = createContext<Ctx | null>(null);

export function ArticleReadingHeaderProvider({ children }: { children: ReactNode }) {
  const [meta, setMeta] = useState<ArticleReadingHeaderMeta | null>(null);
  const setArticleHeaderMeta = useCallback((m: ArticleReadingHeaderMeta | null) => {
    setMeta((prev) => {
      if (m === null && prev === null) return prev;
      if (m != null && prev != null && prev.viewCount === m.viewCount) return prev;
      return m;
    });
  }, []);
  const value = useMemo(
    () => ({ meta, setArticleHeaderMeta }),
    [meta, setArticleHeaderMeta],
  );
  return (
    <ArticleReadingHeaderContext.Provider value={value}>{children}</ArticleReadingHeaderContext.Provider>
  );
}

export function useOptionalArticleReadingHeader(): Ctx | null {
  return useContext(ArticleReadingHeaderContext);
}

export function useArticleReadingHeader(): Ctx {
  const ctx = useContext(ArticleReadingHeaderContext);
  if (!ctx) {
    throw new Error("useArticleReadingHeader requires ArticleReadingHeaderProvider");
  }
  return ctx;
}
