import { LinkIcon, MoreDotsIcon } from "@/components/ui/icons";

type ContentAuthorCardProps = {
  name: string;
  initials: string;
  link?: string;
  color?: string;
};

export function ContentAuthorCard({
  name,
  initials,
  link,
  color = "black",
}: ContentAuthorCardProps) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-bold"
        style={{ backgroundColor: color, color: "#1a1a1a" }}
      >
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className="min-w-0 flex-1 text-lg font-bold text-white wrap-break-word">{name}</p>
          <button
            type="button"
            className="shrink-0 rounded-lg border border-gray-600 p-1.5 text-white hover:text-white/80"
          >
            <MoreDotsIcon />
          </button>
          <button
            type="button"
            className="shrink-0 rounded-lg px-4 py-1.5 text-xs font-semibold text-[#1a1a1a] transition-colors hover:opacity-90"
            style={{ backgroundColor: "#C9A96E" }}
          >
            Follow
          </button>
        </div>
        {link && (
          <p className="mt-1 flex items-center gap-1.5 text-sm break-all" style={{ color: "#C9A96E" }}>
            <LinkIcon />
            <span>{link}</span>
          </p>
        )}
      </div>
    </div>
  );
}
