"use client";

import { useCallback, useState } from "react";
import { GripIcon, CopyIcon, TrashIcon } from "./ArticleEditorIcons";
import type { BlockType } from "./AvailableBlocks";
import { CloudUploadIcon } from "@/components/ui/icons";
import type { ContentFormConfig } from "./content-form-config";
import { theme } from "@/lib/theme";

export type ContentBlock = {
  id: string;
  type: BlockType;
  content?: string;
  quoteAttribution?: string;
  /** Callout headline (bold); body is `content`. */
  calloutTitle?: string;
  file?: File | null;
  files?: File[];
  imageUrl?: string;
  /** Caption under image on the public article. */
  imageCaption?: string;
  galleryUrls?: string[];
};

const inputClass =
  "w-full rounded-lg border border-[#444444] bg-[#333333] px-4 py-3 text-sm text-white placeholder:text-white outline-none focus:border-gray-500";

const blockActionsClass =
  "flex h-8 w-8 items-center justify-center rounded bg-[#333333] text-white transition-colors hover:bg-[#3d3d3d]";

type BlockActionsMode = "copy-delete" | "delete-only";

const BLOCK_DRAG_MIME = "application/x-tott-block-id";

function BlockActions({
  onDelete,
  onDuplicate,
  mode,
}: {
  onDelete: () => void;
  onDuplicate: () => void;
  mode: BlockActionsMode;
}) {
  if (mode === "delete-only") {
    return (
      <div className="flex shrink-0 items-center self-stretch">
        <button type="button" onClick={onDelete} className={blockActionsClass} aria-label="Delete">
          <TrashIcon />
        </button>
      </div>
    );
  }
  return (
    <div className="flex shrink-0 flex-col gap-1">
      <button type="button" onClick={onDuplicate} className={blockActionsClass} aria-label="Duplicate">
        <CopyIcon />
      </button>
      <button type="button" onClick={onDelete} className={blockActionsClass} aria-label="Delete">
        <TrashIcon />
      </button>
    </div>
  );
}

function blockActionsModeFor(
  block: ContentBlock,
  firstImageBlockId: string | undefined,
): BlockActionsMode {
  if (block.type === "author-note") {
    return "delete-only";
  }
  if (block.type === "image" && firstImageBlockId != null && block.id === firstImageBlockId) {
    return "delete-only";
  }
  return "copy-delete";
}

function BlockDragHandle({
  blockId,
  isDragging,
  alignCenter,
  onDragStart,
  onDragEnd,
}: {
  blockId: string;
  isDragging: boolean;
  alignCenter?: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      className={`flex shrink-0 ${alignCenter ? "items-center self-stretch" : "flex-col justify-start pt-1"}`}
    >
      <div
        role="button"
        tabIndex={0}
        draggable
        aria-label="Drag to reorder"
        title="Drag to reorder"
        aria-grabbed={isDragging}
        onDragStart={(e) => onDragStart(e, blockId)}
        onDragEnd={onDragEnd}
        className={`flex h-8 w-8 cursor-grab items-center justify-center rounded bg-[#333333] text-white transition-colors select-none hover:bg-[#3d3d3d] active:cursor-grabbing ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <GripIcon />
      </div>
    </div>
  );
}

const DEFAULT_LABELS: Partial<Record<BlockType, string>> = {
  paragraph: "Start writing your article...",
  heading: "Section title",
  quote: "Quote",
    callout: "Callout",
  "author-note": "Author note",
};

type BlockRendererProps = {
  block: ContentBlock;
  labels?: Partial<Record<BlockType, string>>;
  /** First image in article order — used as public cover / hero. */
  isCoverImageBlock?: boolean;
  onChange: (patch: Partial<ContentBlock>) => void;
};

function BlockRenderer({ block, labels, isCoverImageBlock, onChange }: BlockRendererProps) {
  const l = { ...DEFAULT_LABELS, ...labels };
  switch (block.type) {
    case "paragraph":
      return (
        <textarea
          value={block.content ?? ""}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder={l.paragraph ?? "Paragraph"}
          rows={6}
          className={`${inputClass} resize-y`}
        />
      );

    case "heading":
      return (
        <input
          type="text"
          value={block.content ?? ""}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder={l.heading ?? "Section title"}
          className={`${inputClass} text-lg font-semibold`}
        />
      );

    case "quote":
      return (
        <div
          className="flex flex-col gap-2 rounded-lg border-l-4 bg-[#333333] pl-4"
          style={{ borderLeftColor: "#C9A96E" }}
        >
          <textarea
            value={block.content ?? ""}
            onChange={(e) => onChange({ content: e.target.value })}
            placeholder={l.quote ?? "Quote"}
            rows={3}
            className={`${inputClass} resize-y border-0 bg-transparent`}
          />
          <input
            type="text"
            value={block.quoteAttribution ?? ""}
            onChange={(e) => onChange({ quoteAttribution: e.target.value })}
            placeholder="Attribution (optional)"
            className={`${inputClass} border-0 bg-transparent py-2`}
          />
        </div>
      );

    case "image":
      return (
        <div className="space-y-3">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#444444] bg-[#333333] px-6 py-10 transition-colors hover:border-[#C9A96E]">
            <span className="text-white">
              <CloudUploadIcon />
            </span>
            {isCoverImageBlock ? (
              <span className="flex flex-col items-center gap-1 text-center">
                <span className="text-lg font-semibold" style={{ color: theme.accentGold }}>
                  Upload cover
                </span>
                <span className="text-xs text-gray-400">
                  Click to choose an image — this is the article hero on the public page
                </span>
                <span className="text-xs text-white">Recommended: 1200×630px</span>
              </span>
            ) : (
              <>
                <span className="text-sm font-medium">
                  <span className="text-gray-400">choose file</span>{" "}
                  <span style={{ color: "#C9A96E" }}>to upload</span>
                </span>
                <span className="text-xs text-white">Recommended: 1200x630px</span>
              </>
            )}
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onChange({ file: f, imageUrl: "" });
                e.target.value = "";
              }}
            />
          </label>
          <div>
            <p className="mb-1 text-xs text-gray-500">
              {isCoverImageBlock ? "Or paste cover image URL" : "Or paste image URL"}
            </p>
            <input
              type="url"
              value={block.imageUrl ?? ""}
              onChange={(e) => onChange({ imageUrl: e.target.value, file: null })}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
          {block.file && (
            <p className="text-xs text-gray-400">Selected: {block.file.name}</p>
          )}
          <div>
            <p className="mb-1 text-xs text-gray-500">Caption (optional, under image)</p>
            <textarea
              value={block.imageCaption ?? ""}
              onChange={(e) => onChange({ imageCaption: e.target.value })}
              placeholder="e.g. Modern renewable energy infrastructure…"
              rows={2}
              className={`${inputClass} resize-y text-sm`}
            />
          </div>
        </div>
      );

    case "gallery":
      return (
        <div className="space-y-3">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#444444] bg-[#333333] px-6 py-10 transition-colors hover:border-[#C9A96E]">
            <span className="text-white">
              <CloudUploadIcon />
            </span>
            <span className="text-sm font-medium text-white">Add images to gallery</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const list = e.target.files;
                if (!list?.length) return;
                onChange({ files: [...(block.files ?? []), ...Array.from(list)] });
                e.target.value = "";
              }}
            />
          </label>
          {(block.files?.length ?? 0) > 0 && (
            <p className="text-xs text-gray-400">{block.files!.length} file(s) selected</p>
          )}
          <div>
            <p className="mb-1 text-xs text-gray-500">Or one URL per line</p>
            <textarea
              value={(block.galleryUrls ?? []).join("\n")}
              onChange={(e) =>
                onChange({
                  galleryUrls: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                  files: [],
                })
              }
              placeholder={"https://example.com/1.jpg\nhttps://example.com/2.jpg"}
              rows={4}
              className={`${inputClass} resize-y font-mono text-xs`}
            />
          </div>
        </div>
      );

    case "callout":
      return (
        <div className="space-y-3 rounded-2xl border border-[#3a3a3a] bg-[#262626] p-6">
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">Title</p>
            <input
              type="text"
              value={block.calloutTitle ?? ""}
              onChange={(e) => onChange({ calloutTitle: e.target.value })}
              placeholder="e.g. 35%"
              className={`${inputClass} text-xl font-bold text-white`}
            />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">Callout</p>
            <textarea
              value={block.content ?? ""}
              onChange={(e) => onChange({ content: e.target.value })}
              placeholder={l.callout ?? "Callout"}
              rows={4}
              className={`${inputClass} resize-y text-base text-gray-300`}
            />
          </div>
        </div>
      );

    case "author-note":
      return (
        <textarea
          value={block.content ?? ""}
          onChange={(e) => onChange({ content: e.target.value })}
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
  onDuplicateBlock: (id: string) => void;
  onUpdateBlock: (id: string, patch: Partial<ContentBlock>) => void;
  /** Prepends an image block so it becomes the article cover (first image in order). */
  onAddCoverBlock: () => void;
  /** Move block `activeId` to the position of `overId` (HTML5 drag-and-drop). */
  onReorderBlock: (activeId: string, overId: string) => void;
  config: ContentFormConfig;
};

export function ContentBlocks({
  blocks,
  onRemoveBlock,
  onDuplicateBlock,
  onUpdateBlock,
  onAddCoverBlock,
  onReorderBlock,
  config,
}: ContentBlocksProps) {
  const firstImageBlockId = blocks.find((b) => b.type === "image")?.id;
  const hasImageBlock = firstImageBlockId != null;

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    e.dataTransfer.setData(BLOCK_DRAG_MIME, id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverId(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, overId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(overId);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      const sourceId =
        e.dataTransfer.getData(BLOCK_DRAG_MIME) || e.dataTransfer.getData("text/plain");
      if (sourceId && sourceId !== targetId) onReorderBlock(sourceId, targetId);
      setDraggingId(null);
      setDragOverId(null);
    },
    [onReorderBlock],
  );

  return (
    <div className="space-y-6 border-b border-[#444444] pb-4">
      {!hasImageBlock ? (
        <div className="rounded-lg border border-dashed border-[#444444] bg-[#2a2a2a]/40 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-400">
              No cover image. Add a cover block — it becomes the public hero (first image in this
              article).
            </p>
            <button
              type="button"
              onClick={onAddCoverBlock}
              className="shrink-0 rounded-lg border border-[#C9A96E]/50 bg-[#333333] px-4 py-2.5 text-sm font-medium text-[#C9A96E] transition-colors hover:border-[#C9A96E] hover:bg-[#3d3d3d]"
            >
              Add cover block
            </button>
          </div>
        </div>
      ) : null}
      {blocks.map((block) => (
        <div
          key={block.id}
          onDragOverCapture={(e) => handleDragOver(e, block.id)}
          onDropCapture={(e) => handleDrop(e, block.id)}
          className={`flex gap-3 rounded-md transition-shadow ${
            block.type === "divider" ? "items-center" : "items-start"
          } ${
            dragOverId === block.id && draggingId != null && draggingId !== block.id
              ? "ring-1 ring-[#C9A96E]/90 ring-offset-2 ring-offset-[#141414]"
              : ""
          } ${draggingId === block.id ? "opacity-50" : ""}`}
        >
          <BlockDragHandle
            blockId={block.id}
            isDragging={draggingId === block.id}
            alignCenter={block.type === "divider"}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
          <div className="min-w-0 flex-1">
            <BlockRenderer
              block={block}
              labels={config.blockLabels}
              isCoverImageBlock={block.type === "image" && block.id === firstImageBlockId}
              onChange={(patch) => onUpdateBlock(block.id, patch)}
            />
          </div>
          <BlockActions
            mode={blockActionsModeFor(block, firstImageBlockId)}
            onDelete={() => onRemoveBlock(block.id)}
            onDuplicate={() => onDuplicateBlock(block.id)}
          />
        </div>
      ))}
    </div>
  );
}
