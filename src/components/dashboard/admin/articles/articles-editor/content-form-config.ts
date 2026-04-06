import type { ContentBlock } from "./ContentBlocks";
import type { BlockType } from "./AvailableBlocks";

/** Block types allowed for Open Call (API has no `heading`). */
export const openCallAllowedBlockTypes: BlockType[] = [
  "paragraph",
  "quote",
  "image",
  "gallery",
  "callout",
  "author-note",
  "divider",
];

export type ContentFormConfig = {
  contentType: string;
  titlePlaceholder: string;
  defaultBlocks: ContentBlock[];
  blockLabels?: Partial<Record<BlockType, string>>;
  iconBlockType: "paragraph" | "image";
  settingsTitle: string;
  primaryButtonLabel: string;
};

/** Open Call: same block set as article but no heading (API enum). */
export const openCallConfig: ContentFormConfig = {
  contentType: "open-call",
  titlePlaceholder: "Enter your content title here...",
  defaultBlocks: [
    { id: "1", type: "paragraph", content: "" },
    { id: "2", type: "quote", content: "", quoteAttribution: "" },
    { id: "3", type: "image" },
    { id: "4", type: "callout", content: "", calloutTitle: "" },
    { id: "5", type: "author-note", content: "" },
  ],
  blockLabels: {
    paragraph: "Describe your content...",
    quote: "Quote",
    callout: "Callout",
    "author-note": "Author note",
  },
  iconBlockType: "paragraph",
  settingsTitle: "Content Settings",
  primaryButtonLabel: "Publish Now",
};

export const articleConfig: ContentFormConfig = {
  contentType: "article",
  titlePlaceholder: "Enter your article title...",
  defaultBlocks: [
    { id: "1", type: "paragraph", content: "" },
    { id: "2", type: "quote", content: "", quoteAttribution: "" },
    { id: "3", type: "image" },
    { id: "4", type: "callout", content: "", calloutTitle: "" },
    { id: "5", type: "author-note", content: "" },
  ],
  blockLabels: {
    paragraph: "Start writing your article...",
    heading: "Section title",
    quote: "Quote",
    callout: "Callout",
    "author-note": "Author note",
  },
  iconBlockType: "paragraph",
  settingsTitle: "Article Settings",
  primaryButtonLabel: "Publish Now",
};

export const videoConfig: ContentFormConfig = {
  contentType: "video",
  titlePlaceholder: "Enter your Video title...",
  defaultBlocks: [
    { id: "1", type: "image" },
    { id: "2", type: "paragraph", content: "" },
    { id: "3", type: "quote", content: "", quoteAttribution: "" },
    { id: "4", type: "callout", content: "", calloutTitle: "" },
    { id: "5", type: "author-note", content: "" },
  ],
  blockLabels: {
    paragraph: "Describe your video",
    heading: "Section title",
    quote: "Quote",
    callout: "Callout",
    "author-note": "Author note",
  },
  iconBlockType: "image",
  settingsTitle: "Video Settings",
  primaryButtonLabel: "Publish Video",
};

export const threadConfig: ContentFormConfig = {
  contentType: "thread",
  titlePlaceholder: "Enter your Thread title...",
  defaultBlocks: [
    { id: "1", type: "paragraph", content: "" },
    { id: "2", type: "paragraph", content: "" },
    { id: "3", type: "image" },
    { id: "4", type: "quote", content: "", quoteAttribution: "" },
    { id: "5", type: "paragraph", content: "" },
    { id: "6", type: "callout", content: "", calloutTitle: "" },
    { id: "7", type: "author-note", content: "" },
  ],
  blockLabels: {
    paragraph: "First part of your story...",
    heading: "Section title",
    quote: "Quote",
    callout: "Callout",
    "author-note": "Author note",
  },
  iconBlockType: "paragraph",
  settingsTitle: "Thread Settings",
  primaryButtonLabel: "Publish Thread",
};

export const audioConfig: ContentFormConfig = {
  contentType: "audio",
  titlePlaceholder: "Enter your Audio title...",
  defaultBlocks: [
    { id: "1", type: "image" },
    { id: "2", type: "image" },
    { id: "3", type: "paragraph", content: "" },
    { id: "4", type: "quote", content: "", quoteAttribution: "" },
    { id: "5", type: "callout", content: "", calloutTitle: "" },
    { id: "6", type: "author-note", content: "" },
  ],
  blockLabels: {
    paragraph: "Episode notes...",
    heading: "Section title",
    quote: "Quote",
    callout: "Callout",
    "author-note": "Author note",
  },
  iconBlockType: "image",
  settingsTitle: "Audio Settings",
  primaryButtonLabel: "Publish Audio",
};

/** Pick create/edit defaults from API `content_type`. */
export function contentFormConfigForType(contentType: string | undefined): ContentFormConfig {
  const t = (contentType || "article").toLowerCase().replace(/-/g, "_");
  if (t === "video") return videoConfig;
  if (t === "thread") return threadConfig;
  if (t === "audio") return audioConfig;
  if (t === "open_call" || t === "opencall") return openCallConfig;
  return articleConfig;
}
