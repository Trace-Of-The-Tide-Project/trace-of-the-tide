import { isLikelyAudioUrl, isLikelyVideoUrl } from "@/lib/content/media-url";
import type { ArticleDetail, ArticleListItem } from "@/services/articles.service";

export type PublicContentHrefInput = {
  id: string;
  content_type?: string | null;
  category?: string | null;
  media_url?: string | null;
  blocks?: Array<{ block_type?: string | null }> | null;
};

export function normalizeContentTypeKey(raw: string | null | undefined): string {
  return (raw || "article").trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function isVideoContentTypeKey(key: string): boolean {
  return key === "video" || key === "videos";
}

function isAudioContentTypeKey(key: string): boolean {
  return key === "audio" || key === "audios";
}

export function inferArticleContentType(input: PublicContentHrefInput): string {
  const direct = normalizeContentTypeKey(input.content_type);
  if (isVideoContentTypeKey(direct) || isAudioContentTypeKey(direct)) {
    return direct === "videos" ? "video" : direct === "audios" ? "audio" : direct;
  }

  const category = normalizeContentTypeKey(input.category);
  if (isVideoContentTypeKey(category)) return "video";
  if (isAudioContentTypeKey(category)) return "audio";

  for (const block of input.blocks ?? []) {
    const blockType = normalizeContentTypeKey(block.block_type);
    if (blockType === "video") return "video";
    if (blockType === "audio") return "audio";
  }

  const mediaUrl = input.media_url?.trim();
  if (mediaUrl) {
    if (isLikelyVideoUrl(mediaUrl)) return "video";
    if (isLikelyAudioUrl(mediaUrl)) return "audio";
  }

  return direct;
}

/**
 * Public preview URL for an article row by API `content_type`.
 * Video/audio use dedicated routes; everything else uses the article reader.
 */
export function previewHrefForContentType(contentType: string | undefined, articleId: string): string {
  const t = inferArticleContentType({ id: articleId, content_type: contentType });
  const id = encodeURIComponent(articleId);
  if (t === "video") return `/content/video?id=${id}`;
  if (t === "audio") return `/content/audio?id=${id}`;
  return `/content/article?id=${id}`;
}

export function publicContentHrefForArticle(input: PublicContentHrefInput): string {
  return previewHrefForContentType(inferArticleContentType(input), input.id);
}

export function publicContentHrefForListItem(article: Pick<
  ArticleListItem,
  "id" | "content_type" | "category" | "media_url" | "blocks"
>): string {
  return publicContentHrefForArticle(article);
}

export function publicContentHrefForDetail(article: ArticleDetail): string {
  return publicContentHrefForArticle(article);
}
