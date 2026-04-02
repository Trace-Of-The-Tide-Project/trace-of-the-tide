import { uploadArticleAsset } from "@/services/uploads.service";
import type { CreateArticleBlock } from "@/services/articles.service";
import type { ContentBlock } from "../ContentBlocks";

export async function buildArticleBlocksFromEditor(
  blocks: ContentBlock[]
): Promise<CreateArticleBlock[]> {
  const out: CreateArticleBlock[] = [];
  let order = 1;

  for (const b of blocks) {
    if (b.type === "divider") {
      out.push({ block_order: order++, block_type: "divider", content: null });
      continue;
    }

    if (b.type === "image") {
      const caption = (b.imageCaption ?? "").trim();
      if (b.file) {
        const url = await uploadArticleAsset(b.file);
        out.push({
          block_order: order++,
          block_type: "image",
          content: null,
          metadata: JSON.stringify({ url, alt: "", caption }),
        });
        continue;
      }
      const url = (b.imageUrl ?? "").trim();
      if (!url) continue;
      out.push({
        block_order: order++,
        block_type: "image",
        content: null,
        metadata: JSON.stringify({ url, alt: "", caption }),
      });
      continue;
    }

    if (b.type === "gallery") {
      const files = b.files ?? [];
      if (files.length) {
        const urls: string[] = [];
        for (const f of files) urls.push(await uploadArticleAsset(f));
        out.push({
          block_order: order++,
          block_type: "gallery",
          content: null,
          metadata: JSON.stringify({
            images: urls.map((url) => ({ url, alt: "", caption: "" })),
          }),
        });
        continue;
      }
      const existing = b.galleryUrls ?? [];
      if (!existing.length) continue;
      out.push({
        block_order: order++,
        block_type: "gallery",
        content: null,
        metadata: JSON.stringify({
          images: existing.map((url) => ({ url, alt: "", caption: "" })),
        }),
      });
      continue;
    }

    if (b.type === "quote") {
      const text = (b.content ?? "").trim();
      if (!text) continue;
      const attribution = (b.quoteAttribution ?? "").trim();
      out.push({
        block_order: order++,
        block_type: "quote",
        content: text,
        metadata: attribution ? JSON.stringify({ attribution }) : undefined,
      });
      continue;
    }

    if (b.type === "callout") {
      const title = (b.calloutTitle ?? "").trim();
      const body = (b.content ?? "").trim();
      if (!title && !body) continue;
      const meta: Record<string, string> = {};
      if (title) meta.title = title;
      if (body) meta.body = body;
      out.push({
        block_order: order++,
        block_type: "callout",
        content: body || null,
        metadata: Object.keys(meta).length ? JSON.stringify(meta) : undefined,
      });
      continue;
    }

    if (b.type === "heading") {
      const t = (b.content ?? "").trim();
      if (!t) continue;
      out.push({ block_order: order++, block_type: "heading", content: t });
      continue;
    }

    const text = (b.content ?? "").trim();
    if (!text) continue;

    const block_type: CreateArticleBlock["block_type"] =
      b.type === "author-note" ? "author_note" : "paragraph";

    out.push({
      block_order: order++,
      block_type,
      content: text,
    });
  }

  return out;
}
