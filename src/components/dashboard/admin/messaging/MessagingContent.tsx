"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { theme } from "@/lib/theme";
import {
  ChevronDownIcon,
  ContributeIcon,
  MoreDotsIcon,
  SearchIcon,
  SendIcon,
} from "@/components/ui/icons";
import { sampleThreads, type Thread } from "@/lib/dashboard/messaging-constants";
import {
  CreateMessageTemplateModal,
  type MessageTemplate,
} from "@/components/dashboard/modals/CreateMessageTemplateModal";
import { EditMessageTemplateModal } from "@/components/dashboard/modals/EditMessageTemplateModal";

const MESSAGE_TABS = ["Inbox", "Broadcast", "Templates", "Archived"] as const;
type MessageTab = (typeof MESSAGE_TABS)[number];

const CATEGORY_OPTIONS = [
  "All Categories",
  "Support",
  "Payment",
  "Moderation",
  "Feedback",
] as const;
const PRIORITY_OPTIONS = ["All Priority", "High", "Medium", "Low"] as const;
const TEMPLATE_OPTIONS = [
  "No Template",
  "Welcome Message",
  "Payment Confirmation",
  "Content Approved",
  "Account Warning",
  "Feature Announcement",
] as const;

const BROADCAST_AUDIENCE_OPTIONS = [
  "All Users",
  "Authors Only",
  "Editors Only",
  "Contributors Only",
] as const;
const BROADCAST_PRIORITY_OPTIONS = ["Low", "Normal", "High"] as const;

const DEFAULT_TEMPLATES: MessageTemplate[] = [
  {
    id: "tpl1",
    name: "Welcome Message",
    category: "onboarding",
    subject: "Welcome to the platform",
    body: "Hi {{name}}, welcome!",
  },
  {
    id: "tpl2",
    name: "Payment Confirmation",
    category: "payment",
    subject: "Payment confirmed",
    body: "Hi {{name}}, your payment was confirmed.",
  },
  {
    id: "tpl3",
    name: "Content Approved",
    category: "moderation",
    subject: "Your content was approved",
    body: "Hi {{name}}, great news — approved!",
  },
  {
    id: "tpl4",
    name: "Account Warning",
    category: "moderation",
    subject: "Account warning",
    body: "Hi {{name}}, please review this warning.",
  },
  {
    id: "tpl5",
    name: "Feature Announcement",
    category: "broadcast",
    subject: "New feature announcement",
    body: "Hi {{name}}, check out what's new!",
  },
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
}

function Dropdown({
  open,
  onOpenChange,
  items,
  selected,
  onSelect,
  menuWidthClassName,
  fullWidth,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  items: readonly string[];
  selected: string;
  onSelect: (v: string) => void;
  menuWidthClassName?: string;
  fullWidth?: boolean;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        onOpenChange(false);
      }
    }
    function onDocKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, [open, onOpenChange]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => onOpenChange(!open)}
        className={`inline-flex h-[42px] items-center justify-between gap-3 rounded-lg border border-[#2f2f2f] bg-[#121212] px-4 text-sm text-gray-200 outline-none transition-colors focus:border-[#555] ${
          fullWidth ? "w-full" : "min-w-[140px]"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selected}</span>
        <span className="text-gray-500">
          <ChevronDownIcon />
        </span>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="listbox"
          className={`absolute left-0 top-full z-20 mt-2 rounded-lg border border-[#2f2f2f] bg-[#2a2a2a] p-2 shadow-xl ${
            menuWidthClassName ?? "w-[200px]"
          }`}
        >
          {items.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onSelect(opt);
                onOpenChange(false);
              }}
              className="w-full rounded-md px-3 py-2 text-left text-sm text-white hover:bg-white/5"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ThreadRow({
  thread,
  selected,
  onSelect,
}: {
  thread: Thread;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border px-4 py-4 text-left transition-colors ${
        selected
          ? "border-[#5a4a2a] bg-[#151515]"
          : "border-[#2f2f2f] bg-[#121212] hover:bg-[#151515]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-[#111]"
          style={{ backgroundColor: theme.accentGoldFocus }}
        >
          {getInitials(thread.senderName)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm font-semibold text-white">{thread.senderName}</p>
            {thread.priority && (
              <span className="rounded-full border border-[#3a2f1a] bg-[#1a1a1a] px-2 py-0.5 text-[10px] font-semibold text-[#CBA158]">
                {thread.priority}
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-xs text-gray-400">{thread.subject}</p>
          <p className="mt-1 truncate text-xs text-gray-500">{thread.preview}</p>
        </div>
      </div>
    </button>
  );
}

export function MessagingContent() {
  const [activeTab, setActiveTab] = useState<MessageTab>("Inbox");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORY_OPTIONS)[number]>("All Categories");
  const [priority, setPriority] = useState<(typeof PRIORITY_OPTIONS)[number]>("All Priority");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [template, setTemplate] = useState<(typeof TEMPLATE_OPTIONS)[number]>("No Template");
  const [threadMenuOpen, setThreadMenuOpen] = useState(false);
  const threadMenuButtonRef = useRef<HTMLButtonElement>(null);
  const threadMenuRef = useRef<HTMLDivElement>(null);

  const threadsForTab = useMemo(() => {
    if (activeTab === "Archived") return sampleThreads.filter((t) => t.status === "Archived");
    if (activeTab === "Inbox") return sampleThreads.filter((t) => t.status === "Inbox");
    return [];
  }, [activeTab]);

  const filteredThreads = useMemo(() => {
    const q = query.trim().toLowerCase();
    return threadsForTab.filter((t) => {
      // Sample data uses different labels; dropdown is purely UI for now.
      const categoryOk =
        category === "All Categories" || category.toLowerCase() === t.category.toLowerCase();
      const priorityOk =
        priority === "All Priority" || priority.toLowerCase() === (t.priority ?? "").toLowerCase();
      const queryOk =
        !q ||
        t.senderName.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.preview.toLowerCase().includes(q);
      return categoryOk && priorityOk && queryOk;
    });
  }, [threadsForTab, query, category, priority]);

  const [selectedThreadId, setSelectedThreadId] = useState<string>(
    () => sampleThreads[0]?.id ?? ""
  );
  const selectedThread = useMemo(
    () => filteredThreads.find((t) => t.id === selectedThreadId) ?? filteredThreads[0] ?? null,
    [filteredThreads, selectedThreadId]
  );

  const [composer, setComposer] = useState("");

  const [broadcastAudience, setBroadcastAudience] =
    useState<(typeof BROADCAST_AUDIENCE_OPTIONS)[number]>("All Users");
  const [broadcastPriority, setBroadcastPriority] =
    useState<(typeof BROADCAST_PRIORITY_OPTIONS)[number]>("Normal");
  const [broadcastTemplate, setBroadcastTemplate] =
    useState<(typeof TEMPLATE_OPTIONS)[number]>("No Template");
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastAudienceOpen, setBroadcastAudienceOpen] = useState(false);
  const [broadcastPriorityOpen, setBroadcastPriorityOpen] = useState(false);
  const [broadcastTemplateOpen, setBroadcastTemplateOpen] = useState(false);
  const [createTemplateOpen, setCreateTemplateOpen] = useState(false);
  const [templates, setTemplates] = useState<MessageTemplate[]>(DEFAULT_TEMPLATES);
  const [editTemplateOpen, setEditTemplateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);

  useEffect(() => {
    if (!threadMenuOpen) return;
    function onDocMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        threadMenuRef.current &&
        !threadMenuRef.current.contains(target) &&
        threadMenuButtonRef.current &&
        !threadMenuButtonRef.current.contains(target)
      ) {
        setThreadMenuOpen(false);
      }
    }
    function onDocKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setThreadMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, [threadMenuOpen]);

  return (
    <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
      <CreateMessageTemplateModal
        open={createTemplateOpen}
        onClose={() => setCreateTemplateOpen(false)}
        onCreate={(tpl) => {
          setTemplates((prev) => [{ id: `tpl_${Date.now()}`, ...tpl }, ...prev]);
        }}
      />
      <EditMessageTemplateModal
        open={editTemplateOpen}
        template={selectedTemplate}
        onClose={() => setEditTemplateOpen(false)}
        onSave={(updated) => {
          setTemplates((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        }}
      />
      <div className="flex w-fit gap-1 rounded-lg border border-[#444] bg-[#232323] p-1">
        {MESSAGE_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab
                ? "border border-[#4A4A4A] bg-[#333333] text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                : "border border-transparent bg-transparent text-[#AAAAAA] hover:text-[#E0E0E0]"
            }`}
          >
            {tab === "Inbox" ? "Inbox (24)" : tab}
          </button>
        ))}
      </div>

      {activeTab === "Broadcast" ? (
        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] p-6 lg:p-8">
          <div className="mb-6 border-b border-[#2f2f2f] pb-6">
            <h2 className="text-xl font-semibold text-white">New Broadcast Message</h2>
            <p className="mt-1 text-sm text-gray-500">
              Send a message to all users or specific groups
            </p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white">Target Audience</label>
                <Dropdown
                  open={broadcastAudienceOpen}
                  onOpenChange={(v) => {
                    setBroadcastAudienceOpen(v);
                    if (v) {
                      setBroadcastPriorityOpen(false);
                      setBroadcastTemplateOpen(false);
                    }
                  }}
                  items={BROADCAST_AUDIENCE_OPTIONS}
                  selected={broadcastAudience}
                  onSelect={(v) =>
                    setBroadcastAudience(v as (typeof BROADCAST_AUDIENCE_OPTIONS)[number])
                  }
                  fullWidth
                  menuWidthClassName="w-full"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">Priority</label>
                <Dropdown
                  open={broadcastPriorityOpen}
                  onOpenChange={(v) => {
                    setBroadcastPriorityOpen(v);
                    if (v) {
                      setBroadcastAudienceOpen(false);
                      setBroadcastTemplateOpen(false);
                    }
                  }}
                  items={BROADCAST_PRIORITY_OPTIONS}
                  selected={broadcastPriority}
                  onSelect={(v) =>
                    setBroadcastPriority(v as (typeof BROADCAST_PRIORITY_OPTIONS)[number])
                  }
                  fullWidth
                  menuWidthClassName="w-full"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">Use Template</label>
              <Dropdown
                open={broadcastTemplateOpen}
                onOpenChange={(v) => {
                  setBroadcastTemplateOpen(v);
                  if (v) {
                    setBroadcastAudienceOpen(false);
                    setBroadcastPriorityOpen(false);
                  }
                }}
                items={TEMPLATE_OPTIONS}
                selected={broadcastTemplate}
                onSelect={(v) => setBroadcastTemplate(v as (typeof TEMPLATE_OPTIONS)[number])}
                fullWidth
                menuWidthClassName="w-full"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">Subject</label>
              <input
                value={broadcastSubject}
                onChange={(e) => setBroadcastSubject(e.target.value)}
                placeholder="Inter message subject..."
                className="h-[46px] w-full rounded-lg border border-[#2f2f2f] bg-[#1a1a1a] px-4 text-sm text-white placeholder-[#6b7280] outline-none transition-colors focus:border-[#555]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">Message</label>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Write your Broadcast message..."
                rows={6}
                className="w-full resize-y rounded-lg border border-[#2f2f2f] bg-[#1a1a1a] px-4 py-3 text-sm text-white placeholder-[#6b7280] outline-none transition-colors focus:border-[#555]"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => {
                  setBroadcastSubject("");
                  setBroadcastMessage("");
                }}
                className="h-[46px] rounded-lg border border-[#2f2f2f] bg-[#2a2a2a] text-sm font-medium text-gray-200 transition-colors hover:bg-[#333333]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // Placeholder: wire to drafts API.
                }}
                className="inline-flex h-[46px] items-center justify-center gap-2 rounded-lg border border-[#2f2f2f] bg-[#2a2a2a] text-sm font-medium text-gray-200 transition-colors hover:bg-[#333333]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => {
                  // Placeholder: wire to send broadcast API.
                }}
                className="inline-flex h-[46px] items-center justify-center gap-2 rounded-lg text-sm font-semibold text-black transition-colors hover:opacity-90"
                style={{ backgroundColor: theme.accentGoldFocus }}
              >
                <SendIcon />
                Send Broadcast
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === "Templates" ? (
        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 border-b border-[#2f2f2f] pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">New Broadcast Message</h2>
              <p className="mt-1 text-sm text-gray-500">
                Send a message to all users or specific groups
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCreateTemplateOpen(true);
              }}
              className="h-[40px] rounded-lg border border-[#2f2f2f] bg-[#2a2a2a] px-4 text-sm font-medium text-gray-200 transition-colors hover:bg-[#333333]"
            >
              Create Template
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => {
                  setSelectedTemplate(tpl);
                  setEditTemplateOpen(true);
                }}
                className="flex items-center justify-between gap-4 rounded-xl border border-[#2f2f2f] bg-[#121212] px-6 py-5 text-left transition-colors hover:bg-[#151515]"
              >
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-white">{tpl.name}</p>
                  <p className="mt-1 truncate text-sm text-gray-500">{tpl.category}...</p>
                </div>
                <span className="shrink-0 [&_svg]:h-4 [&_svg]:w-4" style={{ color: "#E8DDC0" }}>
                  <ContributeIcon />
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search messages..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-[#2f2f2f] bg-[#121212] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Dropdown
                open={categoryOpen}
                onOpenChange={(v) => {
                  setCategoryOpen(v);
                  if (v) setPriorityOpen(false);
                }}
                items={CATEGORY_OPTIONS}
                selected={category}
                onSelect={(v) => setCategory(v as (typeof CATEGORY_OPTIONS)[number])}
              />
              <Dropdown
                open={priorityOpen}
                onOpenChange={(v) => {
                  setPriorityOpen(v);
                  if (v) setCategoryOpen(false);
                }}
                items={PRIORITY_OPTIONS}
                selected={priority}
                onSelect={(v) => setPriority(v as (typeof PRIORITY_OPTIONS)[number])}
                menuWidthClassName="w-[160px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
            <div className="space-y-3">
              {filteredThreads.map((t) => (
                <ThreadRow
                  key={t.id}
                  thread={t}
                  selected={selectedThread?.id === t.id}
                  onSelect={() => setSelectedThreadId(t.id)}
                />
              ))}

              {filteredThreads.length === 0 && (
                <div className="rounded-xl border border-[#2f2f2f] bg-[#121212] p-10 text-center text-gray-500">
                  No messages match your filters.
                </div>
              )}
            </div>

            <div className="rounded-xl border border-[#2f2f2f] bg-[#121212]">
              {selectedThread ? (
                <div className="flex h-[640px] flex-col">
                  <div className="flex items-start justify-between gap-4 border-b border-[#2f2f2f] px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-[#111]"
                        style={{ backgroundColor: theme.accentGoldFocus }}
                      >
                        {getInitials(selectedThread.senderName)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {selectedThread.senderName}
                        </p>
                        <p className="truncate text-xs text-gray-500">{selectedThread.subject}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        ref={threadMenuButtonRef}
                        type="button"
                        onClick={() => setThreadMenuOpen((v) => !v)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                        aria-label="More actions"
                        aria-haspopup="menu"
                        aria-expanded={threadMenuOpen}
                      >
                        <MoreDotsIcon />
                      </button>
                      {threadMenuOpen && (
                        <div
                          ref={threadMenuRef}
                          role="menu"
                          className="absolute right-0 top-full z-20 mt-2 w-[180px] rounded-lg border border-[#2f2f2f] bg-[#2a2a2a] p-2 shadow-xl"
                        >
                          <button
                            type="button"
                            className="w-full rounded-md px-3 py-2 text-left text-sm text-white hover:bg-white/5"
                            onClick={() => setThreadMenuOpen(false)}
                          >
                            View profile
                          </button>
                          <button
                            type="button"
                            className="w-full rounded-md px-3 py-2 text-left text-sm text-[#CBA158] hover:bg-white/5"
                            onClick={() => setThreadMenuOpen(false)}
                          >
                            Archive
                          </button>
                          <button
                            type="button"
                            className="w-full rounded-md px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5"
                            onClick={() => setThreadMenuOpen(false)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                    {selectedThread.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex items-end gap-3 ${m.align === "right" ? "justify-end" : ""}`}
                      >
                        {m.align === "left" && (
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-[#111]"
                            style={{ backgroundColor: theme.accentGoldFocus }}
                          >
                            {m.senderInitials}
                          </div>
                        )}
                        <div
                          className={`max-w-[520px] rounded-xl border px-4 py-3 text-sm leading-relaxed ${
                            m.align === "right"
                              ? "border-[#3a2f1a] bg-[#1a1a1a] text-gray-200"
                              : "border-[#2f2f2f] bg-[#151515] text-gray-200"
                          }`}
                        >
                          <p className="whitespace-pre-line">{m.body}</p>
                          <p className="mt-2 text-[11px] text-gray-500">{m.timestamp}</p>
                        </div>
                        {m.align === "right" && (
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-[#111]"
                            style={{ backgroundColor: theme.accentGoldFocus }}
                          >
                            {m.senderInitials}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#2f2f2f] p-4">
                    <div className="mb-3">
                      <Dropdown
                        open={templateOpen}
                        onOpenChange={(v) => setTemplateOpen(v)}
                        items={TEMPLATE_OPTIONS}
                        selected={template}
                        onSelect={(v) => setTemplate(v as (typeof TEMPLATE_OPTIONS)[number])}
                        menuWidthClassName="w-full"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2f2f2f] bg-[#121212] text-gray-400 hover:text-white"
                        aria-label="Attach"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                      </button>
                      <input
                        value={composer}
                        onChange={(e) => setComposer(e.target.value)}
                        placeholder="Type your message"
                        className="h-10 flex-1 rounded-lg border border-[#2f2f2f] bg-[#121212] px-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#555]"
                      />
                      <button
                        type="button"
                        onClick={() => setComposer("")}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-black transition-colors hover:opacity-90"
                        style={{ backgroundColor: theme.accentGoldFocus }}
                        aria-label="Send"
                      >
                        <SendIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-[640px] items-center justify-center text-gray-500">
                  Select a conversation to view messages.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
