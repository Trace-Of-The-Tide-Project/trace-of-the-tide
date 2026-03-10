import type { ContentBlock } from "./ContentBlocks";
import type { BlockType } from "./AvailableBlocks";

export type ContentFormConfig = {
  titlePlaceholder: string;
  defaultBlocks: ContentBlock[];
  blockLabels?: Partial<Record<BlockType, string>>;
  iconBlockType: "paragraph" | "image";
  settingsTitle: string;
  primaryButtonLabel: string;
};

export const articleConfig: ContentFormConfig = {
  titlePlaceholder: "Enter your article title...",
  defaultBlocks: [
    { id: "1", type: "paragraph" },
    { id: "2", type: "quote" },
    { id: "3", type: "image" },
    { id: "4", type: "callout" },
    { id: "5", type: "author-note" },
  ],
  blockLabels: {
    paragraph: "Start writing your article...",
    quote: "Quote",
    callout: "Callout",
    "author-note": "Author note",
  },
  iconBlockType: "paragraph",
  settingsTitle: "Article Settings",
  primaryButtonLabel: "Publish Now",
};

export const videoConfig: ContentFormConfig = {
  titlePlaceholder: "Enter your Video title...",
  defaultBlocks: [
    { id: "1", type: "image" },
    { id: "2", type: "paragraph" },
    { id: "3", type: "quote" },
    { id: "4", type: "callout" },
    { id: "5", type: "author-note" },
  ],
  blockLabels: {
    paragraph: "Describe your video",
    quote: "Quote",
    callout: "Callout",
    "author-note": "Author note",
  },
  iconBlockType: "image",
  settingsTitle: "Video Settings",
  primaryButtonLabel: "Publish Video",
};

export const threadConfig: ContentFormConfig = {
  titlePlaceholder: "Enter your Thread title...",
  defaultBlocks: [
    { id: "1", type: "paragraph" },
    { id: "2", type: "paragraph" },
    { id: "3", type: "image" },
    { id: "4", type: "quote" },
    { id: "5", type: "paragraph" },
    { id: "6", type: "callout" },
    { id: "7", type: "author-note" },
  ],
  blockLabels: {
    paragraph: "First part of your story...",
    quote: "Quote",
    callout: "Callout",
    "author-note": "Author note",
  },
  iconBlockType: "paragraph",
  settingsTitle: "Thread Settings",
  primaryButtonLabel: "Publish Thread",
};

export const audioConfig: ContentFormConfig = {
  titlePlaceholder: "Enter your Audio title...",
  defaultBlocks: [
    { id: "1", type: "image" },
    { id: "2", type: "image" },
    { id: "3", type: "paragraph" },
    { id: "4", type: "quote" },
    { id: "5", type: "callout" },
    { id: "6", type: "author-note" },
  ],
  blockLabels: {
    paragraph: "Episode notes...",
    quote: "Quote",
    callout: "Callout",
    "author-note": "Author note",
  },
  iconBlockType: "image",
  settingsTitle: "Audio Settings",
  primaryButtonLabel: "Publish Audio",
};
