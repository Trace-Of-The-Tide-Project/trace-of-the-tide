"use client";

import {
  FileTextIcon,
  QuoteIcon,
  ImageIcon,
  GalleryIcon,
  StarIcon,
  MoreDotsIcon,
} from "./ArticleEditorIcons";
export type BlockType =
  | "paragraph"
  | "quote"
  | "image"
  | "gallery"
  | "callout"
  | "author-note"
  | "divider";

const BLOCKS: { id: BlockType; label: string; icon: React.ReactNode }[] = [
  { id: "paragraph", label: "Paragraph", icon: <FileTextIcon /> },
  { id: "quote", label: "Quote", icon: <QuoteIcon /> },
  { id: "image", label: "Image", icon: <ImageIcon /> },
  { id: "gallery", label: "Gallery", icon: <GalleryIcon /> },
  { id: "callout", label: "Callout", icon: <StarIcon /> },
  { id: "author-note", label: "Author note", icon: <FileTextIcon /> },
  { id: "divider", label: "Divider", icon: <MoreDotsIcon /> },
];

type AvailableBlocksProps = {
  onAddBlock: (type: BlockType) => void;
};

export function AvailableBlocks({ onAddBlock }: AvailableBlocksProps) {
  return (
    <div className="shrink-0 rounded-lg border border-[#444444] p-4">
      <h3 className="mb-4 text-base font-bold text-white">Available Blocks</h3>
      <div className="flex flex-col gap-2">
        {BLOCKS.map((block) => (
          <button
            key={block.id}
            type="button"
            onClick={() => onAddBlock(block.id)}
            className="flex items-center justify-between gap-3 rounded-lg border border-[#444444] bg-[#333333] px-3 py-2.5 text-left text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-300"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-400">{block.icon}</span>
              <span className="text-sm font-medium text-gray-400">{block.label}</span>
            </div>
            <span className="shrink-0 text-gray-400">+</span>
          </button>
        ))}
      </div>
    </div>
  );
}
