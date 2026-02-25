type Contributor = {
  name: string;
  role: string;
  initials: string;
  color?: string;
};

type ContentContributorsProps = {
  contributors: Contributor[];
};

export function ContentContributors({
  contributors,
}: ContentContributorsProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-white ">Contributors</h3>
      <p className="mt-0.5 text-sm" style={{ color: "#A3A3A3" }}>
        {contributors.length} contributed to this content
      </p>

      <ul className="mt-4 space-y-1">
        {contributors.map((c, i) => (
          <li
            key={i}
            className="flex cursor-pointer items-center gap-4 rounded-xl px-2 py-1 transition-colors hover:bg-white/5"
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              style={{ backgroundColor: c.color || "#E8D5A8", color: "#1a1a1a" }}
            >
              {c.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold" style={{ color: "#C9A96E" }}>
                {c.name}
              </p>
              <p className="truncate text-xs" style={{ color: "#A3A3A3" }}>{c.role}</p>
            </div>
            <span className="shrink-0 text-lg text-gray-600">›</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
