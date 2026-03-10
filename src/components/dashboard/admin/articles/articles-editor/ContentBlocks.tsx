"use client";

import { GripIcon, CopyIcon, TrashIcon } from "./ArticleEditorIcons";
import type { BlockType } from "./AvailableBlocks";
import { CloudUploadIcon } from "@/components/ui/icons";
import type { ContentFormConfig } from "./content-form-config";

export type ContentBlock = { id: string; type: BlockType };

const inputClass =
  "w-full rounded-lg border border-[#444444] bg-[#333333] px-4 py-3 text-sm text-white placeholder:text-white outline-none focus:border-gray-500";

const blockActionsClass =
  "flex h-8 w-8 items-center justify-center rounded bg-[#333333] text-white transition-colors hover:bg-[#3d3d3d]";

function BlockActions({ onDelete }: { onDelete: () => void }) {
  return (
    <div className="flex shrink-0 flex-col gap-1">
      <button type="button" className={blockActionsClass} aria-label="Reorder">
        <GripIcon />
      </button>
      <button type="button" className={blockActionsClass} aria-label="Duplicate">
        <CopyIcon />
      </button>
      <button type="button" onClick={onDelete} className={blockActionsClass} aria-label="Delete">
        <TrashIcon />
      </button>
    </div>
  );
}

const DEFAULT_LABELS: Partial<Record<BlockType, string>> = {
  paragraph: "Start writing your article...",
  quote: "Quote",
  callout: "Callout",
  "author-note": "Author note",
};

type BlockRendererProps = {
  block: ContentBlock;
  labels?: Partial<Record<BlockType, string>>;
};

function BlockRenderer({ block, labels }: BlockRendererProps) {
  const l = { ...DEFAULT_LABELS, ...labels };
  switch (block.type) {
    case "paragraph":
      return (
        <textarea
          placeholder={l.paragraph ?? "Paragraph"}
          rows={6}
          className={`${inputClass} resize-y`}
        />
      );

    case "quote":
      return (
        <div
          className="flex gap-3 rounded-lg border-l-4 bg-[#333333] pl-4"
          style={{ borderLeftColor: "#C9A96E" }}
        >
          <input
            type="text"
            placeholder={l.quote ?? "Quote"}
            className={`${inputClass} border-0 bg-transparent`}
          />
        </div>
      );

    case "image":
      return (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#444444] bg-[#333333] px-6 py-10 transition-colors hover:border-[#C9A96E]">
          <span className="text-white">
            <CloudUploadIcon />
          </span>
          <span className="text-sm font-medium">
            <span className="text-gray-400">choose file</span>{" "}
            <span style={{ color: "#C9A96E" }}>to upload</span>
          </span>
          <span className="text-xs text-white">Recommended: 1200x630px</span>
          <span className="text-xs text-white">
            Supported formats: JPG, PNG, PDF, MP3, MP4, DOC (Max 20MB)
          </span>
          <input type="file" className="hidden" />
        </label>
      );

    case "gallery":
      return (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#444444] bg-[#333333] px-6 py-10 transition-colors hover:border-[#C9A96E]">
          <span className="text-white">
            <CloudUploadIcon />
          </span>
          <span className="text-sm font-medium text-white">Add images to gallery</span>
          <input type="file" multiple className="hidden" />
        </label>
      );

    case "callout":
      return (
        <div
          className="flex gap-3 rounded-lg border-l-4 bg-[#333333] pl-4"
          style={{ borderLeftColor: "#C9A96E" }}
        >
          <input
            type="text"
            placeholder={l.callout ?? "Callout"}
            className={`${inputClass} border-0 bg-transparent`}
          />
        </div>
      );

    case "author-note":
      return (
        <textarea
          placeholder={l["author-note"] ?? "Author note"}
          rows={4}
          className="w-full resize-y rounded-lg border border-[#444444] bg-[#333333] px-4 py-3 text-sm text-white placeholder:text-white outline-none focus:border-gray-500"
        />
      );

    case "divider":
      return <hr className="w-full border-[#444444]" />;

    default:
      return null;
  }
}

type ContentBlocksProps = {
  blocks: ContentBlock[];
  onRemoveBlock: (id: string) => void;
  config: ContentFormConfig;
};

export function ContentBlocks({ blocks, onRemoveBlock, config }: ContentBlocksProps) {
  const iconBlock = blocks.find((b) => b.type === config.iconBlockType);

  return (
    <div className="flex gap-3 border-b border-[#444444] pb-4">
      <div className="min-w-0 flex-1 space-y-6">
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} labels={config.blockLabels} />
        ))}
      </div>
      {iconBlock && (
        <div className="shrink-0 self-start">
          <BlockActions onDelete={() => onRemoveBlock(iconBlock.id)} />
        </div>
      )}
    </div>
  );
}
