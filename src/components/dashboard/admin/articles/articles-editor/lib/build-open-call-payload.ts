import { uploadArticleAsset } from "@/services/uploads.service";
import type { OpenCallContentBlock, OpenCallMainMedia } from "@/services/open-calls.service";
import type { ContentBlock } from "../ContentBlocks";

function fileSizeMb(file: File): number {
  return Math.round((file.size / (1024 * 1024)) * 1000) / 1000;
}

export type OpenCallBlocksResult = {
  content_blocks: OpenCallContentBlock[];
  main_media: OpenCallMainMedia | null;
};

/**
 * Maps editor blocks to API `content_blocks` and derives `main_media` from the first image with a URL.
 */
export async function buildOpenCallContentBlocksAndMainMedia(
  blocks: ContentBlock[]
): Promise<OpenCallBlocksResult> {
  const content_blocks: OpenCallContentBlock[] = [];
  let order = 1;
  let main_media: OpenCallMainMedia | null = null;

  const setMainMediaIfEmpty = (url: string, sizeMb: number, type: "image" | "file" = "image") => {
    if (main_media || !url.trim()) return;
    main_media = { type, url: url.trim(), size_mb: Math.max(0, sizeMb) };
  };

  for (const b of blocks) {
    if (b.type === "heading") {
      const t = (b.content ?? "").trim();
      if (!t) continue;
      content_blocks.push({
        type: "paragraph",
        value: `# ${t}`,
        order: order++,
      });
      continue;
    }

    if (b.type === "divider") {
      content_blocks.push({ type: "divider", value: "", order: order++ });
      continue;
    }

    if (b.type === "image") {
      let url = "";
      let sizeMb = 0;
      if (b.file) {
        url = await uploadArticleAsset(b.file);
        sizeMb = fileSizeMb(b.file);
      } else {
        url = (b.imageUrl ?? "").trim();
      }
      if (!url) continue;
      setMainMediaIfEmpty(url, sizeMb, "image");
      content_blocks.push({ type: "image", value: url, order: order++ });
      continue;
    }

    if (b.type === "gallery") {
      const files = b.files ?? [];
      const urls: string[] = [];
      if (files.length) {
        for (const f of files) {
          const u = await uploadArticleAsset(f);
          urls.push(u);
          if (urls.length === 1) setMainMediaIfEmpty(u, fileSizeMb(f), "image");
        }
      } else {
        for (const u of b.galleryUrls ?? []) {
          const t = u.trim();
          if (t) urls.push(t);
        }
        if (urls[0]) setMainMediaIfEmpty(urls[0], 0, "image");
      }
      if (!urls.length) continue;
      content_blocks.push({ type: "gallery", value: urls, order: order++ });
      continue;
    }

    if (b.type === "quote") {
      const text = (b.content ?? "").trim();
      if (!text) continue;
      const attribution = (b.quoteAttribution ?? "").trim();
      content_blocks.push({
        type: "quote",
        value: attribution ? JSON.stringify({ text, attribution }) : text,
        order: order++,
      });
      continue;
    }

    if (b.type === "callout") {
      const title = (b.calloutTitle ?? "").trim();
      const body = (b.content ?? "").trim();
      if (!title && !body) continue;
      content_blocks.push({
        type: "callout",
        value: JSON.stringify({ title, body }),
        order: order++,
      });
      continue;
    }

    if (b.type === "author-note") {
      const text = (b.content ?? "").trim();
      if (!text) continue;
      content_blocks.push({ type: "author_note", value: text, order: order++ });
      continue;
    }

    const text = (b.content ?? "").trim();
    if (!text) continue;
    content_blocks.push({ type: "paragraph", value: text, order: order++ });
  }

  return { content_blocks, main_media };
}
