"use client";

import { useState, useRef, useEffect } from "react";
import { theme } from "@/lib/theme";
import { SearchIcon, MoreDotsIcon, HeartIcon, MessageSquareIcon } from "@/components/ui/icons";
import { sampleComments, type Comment } from "@/lib/dashboard/engagements-constants";

const ENGAGEMENT_TABS = [
  { id: "comments", label: "Comments" },
  { id: "trending", label: "Trending discussions" },
  { id: "badges", label: "Badges & Recognition" },
] as const;

const FILTER_OPTIONS = [
  { id: "all", label: "All" },
  { id: "flagged", label: (count: number) => `Flagged (${count})` },
] as const;

function CommentCard({ comment }: { comment: Comment }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex gap-4 rounded-lg border border-[#444] bg-[#232323] px-4 py-4">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ backgroundColor: theme.accentGoldFocus }}
      >
        {comment.author.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-white">
          <span className="font-medium">{comment.author}</span>
          {" On "}
          <span className="text-gray-400">
            {comment.contentTitle}
            {comment.flagged && (
              <span className="ml-2 inline-flex rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                FLAGGED
              </span>
            )}
          </span>
        </p>
        <p className="mt-1 text-sm text-gray-400 line-clamp-2">{comment.content}</p>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="[&_svg]:h-4 [&_svg]:w-4 text-gray-500">
              <HeartIcon />
            </span>
            {comment.likes}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="[&_svg]:h-4 [&_svg]:w-4 text-gray-500">
              <MessageSquareIcon />
            </span>
            {comment.replies} Replies
          </span>
          <span>{comment.timeAgo}</span>
        </div>
      </div>
      <div ref={ref} className="relative shrink-0">
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          className="rounded p-1.5 transition-colors hover:bg-white/5"
          style={{ color: "#A3A3A3" }}
          aria-label="More actions"
        >
          <MoreDotsIcon />
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full z-20 mt-1 min-w-[140px] rounded-lg border border-[#444] bg-[#232323] py-1 shadow-lg">
            <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2a2a2a]">
              View
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2a2a2a]">
              Edit
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function EngagementsContent() {
  const [activeTab, setActiveTab] = useState<(typeof ENGAGEMENT_TABS)[number]["id"]>("comments");
  const [filter, setFilter] = useState<"all" | "flagged">("all");
  const [search, setSearch] = useState("");

  const filtered = sampleComments.filter((c) => {
    const matchesFilter = filter === "all" || c.flagged;
    const matchesSearch =
      !search.trim() ||
      c.author.toLowerCase().includes(search.toLowerCase()) ||
      c.content.toLowerCase().includes(search.toLowerCase()) ||
      c.contentTitle.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const flaggedCount = sampleComments.filter((c) => c.flagged).length;

  return (
    <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
      {/* Tabs */}
      <div className="flex w-fit gap-1 rounded-lg border border-[#444] bg-[#232323] p-1">
        {ENGAGEMENT_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-md px-6 py-3 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "border border-[#4A4A4A] bg-[#333333] text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                : "border border-transparent bg-transparent text-[#AAAAAA] hover:text-[#E0E0E0]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "comments" && (
        <>
          {/* Search and filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="relative flex-1 max-w-md">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search comments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-[#444] bg-[#232323] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "border-[#555] bg-[#333] text-white"
                    : "border-[#444] bg-transparent text-gray-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter("flagged")}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  filter === "flagged"
                    ? "border-[#555] bg-[#333] text-white"
                    : "border-[#444] bg-transparent text-gray-400 hover:text-white"
                }`}
              >
                {typeof FILTER_OPTIONS[1].label === "function"
                  ? FILTER_OPTIONS[1].label(flaggedCount)
                  : FILTER_OPTIONS[1].label}
              </button>
            </div>
          </div>

          {/* Comment list */}
          <div className="space-y-4">
            {filtered.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-12 text-center text-gray-500">No comments match your filters.</p>
          )}
        </>
      )}

      {activeTab === "trending" && (
        <p className="py-12 text-center text-gray-500">Trending discussions coming soon.</p>
      )}

      {activeTab === "badges" && (
        <p className="py-12 text-center text-gray-500">Badges & Recognition coming soon.</p>
      )}
    </div>
  );
}
