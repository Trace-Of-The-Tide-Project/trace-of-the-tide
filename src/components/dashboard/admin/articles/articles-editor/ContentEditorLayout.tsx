"use client";

import { useState, useCallback } from "react";
import {
  AvailableBlocks,
  type BlockType,
} from "@/components/dashboard/admin/articles/articles-editor/AvailableBlocks";
import {
  ContentBlocks,
  type ContentBlock,
} from "@/components/dashboard/admin/articles/articles-editor/ContentBlocks";
import { ContentSettings } from "@/components/dashboard/admin/articles/articles-editor/ArticleSettings";
import { ContentEditorFooter } from "@/components/dashboard/admin/articles/articles-editor/ContentEditorFooter";
import type { ContentFormConfig } from "./content-form-config";

const titleClass =
  "w-full border-0 bg-transparent px-0 py-2 text-lg text-white placeholder:text-white outline-none";

type ContentEditorLayoutProps = {
  config: ContentFormConfig;
};

export function ContentEditorLayout({ config }: ContentEditorLayoutProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(config.defaultBlocks);

  const addBlock = useCallback((type: BlockType) => {
    setBlocks((prev) => [...prev, { id: crypto.randomUUID(), type }]);
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Main content area */}
        <div className="min-w-0 flex-1 space-y-6 overflow-y-auto">
          <input
            type="text"
            placeholder={config.titlePlaceholder}
            className={titleClass}
          />
          <ContentBlocks
            blocks={blocks}
            onRemoveBlock={removeBlock}
            config={config}
          />
        </div>

        {/* Right sidebar */}
        <aside className="flex w-64 shrink-0 flex-col gap-4 overflow-y-auto">
          <AvailableBlocks onAddBlock={addBlock} />
          <ContentSettings title={config.settingsTitle} />
        </aside>
      </div>

      {/* Footer */}
      <ContentEditorFooter primaryButtonLabel={config.primaryButtonLabel} />
    </div>
  );
}
