"use client";

import { useState } from "react";
import {
  FileTextIcon,
  GridIcon,
  TagIcon,
  GlobeIcon,
  EyeIcon,
  SettingsIcon,
} from "./ArticleEditorIcons";

const inputClass =
  "w-full rounded-lg border border-[#444444] bg-[#333333] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-gray-500";

const selectClass =
  "w-full rounded-lg border border-[#444444] bg-[#333333] px-3 py-2 text-sm text-gray-400 outline-none focus:border-gray-500";

type ContentSettingsProps = {
  title?: string;
};

export function ContentSettings({ title = "Article Settings" }: ContentSettingsProps) {
  const [tags, setTags] = useState(["Music", "Art", "Palestine", "Writer"]);

  const removeTag = (i: number) => {
    setTags((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="rounded-lg border border-[#444444] bg-[#1a1a1a] p-4">
      <h3 className="mb-4 text-base font-bold text-white">{title}</h3>

      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-400">
            <FileTextIcon />
            Status
          </label>
          <select className={selectClass}>
            <option>Drafts</option>
            <option>Published</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-400">
            <GridIcon />
            Category
          </label>
          <input type="text" placeholder="e.g., Art, Music" className={inputClass} />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-400">
            <TagIcon />
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="flex items-center gap-1 rounded-lg border border-[#444444] bg-[#333333] px-2.5 py-1 text-xs text-white"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(i)}
                  className="ml-0.5 text-gray-500 hover:text-white"
                  aria-label={`Remove ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add tag..."
              className="max-w-[100px] rounded border border-[#444444] bg-[#333333] px-2 py-1 text-xs text-gray-400 placeholder-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-400">
            <GlobeIcon />
            Language
          </label>
          <select className={selectClass}>
            <option>English</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-400">
            <EyeIcon />
            Visibility
          </label>
          <select className={selectClass}>
            <option>Private</option>
            <option>Public</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-400">
            <SettingsIcon />
            SEO Preview
          </label>
          <div className="space-y-2">
            <div className="rounded-lg border border-[#444444] bg-[#333333] px-3 py-2 text-xs text-gray-400">
              <p className="text-white">yoursite.com/articles/...</p>
              <p className="mt-1">Add a meta description to improve search visibility.</p>
            </div>
            <input type="text" placeholder="SEO Title" className={inputClass} />
            <input type="text" placeholder="Meta description" className={inputClass} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const ArticleSettings = ContentSettings;
