export const articleStats = [
  { id: "1", value: "8", label: "Articles Published", iconKey: "book" },
  { id: "2", value: "420", label: "Contributions", iconKey: "pen" },
  { id: "3", value: "1,200", label: "Total Reads", iconKey: "barChart" },
  { id: "4", value: "765", label: "Days Active", iconKey: "calendar" },
] as const;

export const articleTabs = [
  { id: "all", label: "All" },
  { id: "drafts", label: "Drafts" },
  { id: "published", label: "Published" },
  { id: "scheduled", label: "Scheduled" },
] as const;

export const articlesTableData = [
  { id: "1", slug: "british-restrict", title: "British Restrict Jewish..", status: "Published" as const, statusColor: "emerald", lastUpdated: "January 22, 2025", views: "1,456", supporters: "4" },
  { id: "2", slug: "future-cinema", title: "The Future of Cinema", status: "Published" as const, statusColor: "emerald", lastUpdated: "January 21, 2025", views: "2,890", supporters: "12" },
  { id: "3", slug: "antis-article", title: "Antis Article...", status: "Draft" as const, statusColor: "blue", lastUpdated: "1 day ago", views: "—", supporters: "—" },
  { id: "4", slug: "climate-culture", title: "Climate and Culture", status: "Published" as const, statusColor: "emerald", lastUpdated: "January 20, 2025", views: "945", supporters: "7" },
  { id: "5", slug: "scheduled-one", title: "Scheduled Article...", status: "Scheduled" as const, statusColor: "orange", lastUpdated: "January 22, 2025", views: "—", supporters: "—" },
  { id: "6", slug: "wip", title: "Work in Progress...", status: "Draft" as const, statusColor: "blue", lastUpdated: "2 hours ago", views: "—", supporters: "—" },
  { id: "7", slug: "documenting-tide", title: "Documenting the Tide", status: "Published" as const, statusColor: "emerald", lastUpdated: "January 18, 2025", views: "3,210", supporters: "23" },
  { id: "8", slug: "upcoming-feature", title: "Upcoming Feature...", status: "Scheduled" as const, statusColor: "orange", lastUpdated: "January 25, 2025", views: "—", supporters: "—" },
];

export const draftsData = [
  { id: "d1", title: "Antis Article...", updatedAt: "2 hours ago", continueHref: "/admin/articles/create" },
  { id: "d2", title: "Draft Title Two...", updatedAt: "5 hours ago", continueHref: "/admin/articles/create" },
  { id: "d3", title: "Another Draft...", updatedAt: "1 day ago", continueHref: "/admin/articles/create" },
];

export const scheduledData = [
  { id: "s1", title: "Scheduled Article...", date: "January 22, 2024", views: "1.2k", viewHref: "#" },
  { id: "s2", title: "Upcoming Piece...", date: "January 25, 2024", views: "—", viewHref: "#" },
  { id: "s3", title: "Upcoming l.k...", date: "January 25, 2024", views: "—", viewHref: "#" },
];
