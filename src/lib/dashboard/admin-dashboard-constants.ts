import {
  AlertTriangleIcon,
  ShieldIcon,
  PersonIcon,
  SendIcon,
  PersonPlusIcon,
  StarIcon,
  SettingsIcon,
  FileTextIcon,
  FilmIcon,
  MusicIcon,
  CameraIcon,
  BookIcon,
  MicIcon,
  UsersIcon,
  HeartHandshakeIcon,
  PenLineIcon,
  BarChartIcon,
  DollarSignIcon,
  TrendingUpIcon,
  CreditCardIcon,
  EyeIcon,
} from "@/components/ui/icons";

export const unusualLogins = [
  { id: "l1", editor: "Sarah Marzouq", location: "Cairo, Egypt", time: "30 min ago" },
  { id: "l2", editor: "Ahmed Hassan", location: "Amman, Jordan", time: "1h ago" },
  { id: "l3", editor: "Layla Khalil", location: "Beirut, Lebanon", time: "2h ago" },
];

export const alerts = [
  {
    id: "1",
    icon: AlertTriangleIcon,
    title: "8 content items flagged",
    description: "Requires immediate review for policy violations",
    actionLabel: "Review now",
    actionHref: "/admin/reports",
    modal: {
      badge: { label: "Critical", color: "#ef4444" },
      items: [
        { id: "f1", title: "Controversial Opinion Piece", subtitle: "By User1234 · Hate speech · 1h ago", actionLabel: "Review" },
        { id: "f2", title: "Controversial Opinion Piece", subtitle: "By User1234 · Hate speech · 1h ago", actionLabel: "Review" },
        { id: "f3", title: "Controversial Opinion Piece", subtitle: "By User1234 · Hate speech · 1h ago", actionLabel: "Review" },
      ],
      viewAllHref: "/admin/reports",
    },
  },
  {
    id: "2",
    icon: ShieldIcon,
    title: "Unusual login activity",
    description: "3 editor accounts accessed from new locations",
    actionLabel: "View details",
    actionHref: "/admin/security",
    modal: {
      badge: { label: "Warning", color: "#ef4444" },
      items: unusualLogins.map((l) => ({
        id: l.id,
        title: `Editor: ${l.editor}`,
        subtitle: `New location: ${l.location} · ${l.time}`,
        actionLabel: "Flag",
        actionColor: "#CBA158",
      })),
      viewAllHref: "/admin/security",
    },
  },
  {
    id: "3",
    icon: PersonIcon,
    title: "5 pending editor applications",
    description: "Awaiting review for more than 24 hours",
    actionLabel: "Process",
    actionHref: "/admin/users",
    modal: {
      badge: { label: "Pending", color: "#CBA158" },
      items: [
        { id: "a1", title: "Mariam Ali", subtitle: "5 years journalism · Applied 26h ago", processButtons: true },
        { id: "a2", title: "Fatima Zahra", subtitle: "Photographer · 5 years experience · Applied 1d ago", processButtons: true },
        { id: "a3", title: "Omar Farouq", subtitle: "Writer · 2 years experience · Applied 1d ago", processButtons: true },
      ],
      viewAllHref: "/admin/users",
    },
  },
];

export const pendingEditorApplicationsModal = {
  title: "Pending Editor Applications",
  description: "Review and approve editor applications.",
  items: [
    { id: "p1", title: "Mariam Ali", subtitle: "Applied for Editor role", processButtons: true },
    { id: "p2", title: "Fatima Zahra", subtitle: "Applied for Editor role", processButtons: true },
    { id: "p3", title: "Omar Farouq", subtitle: "Applied for Editor role", processButtons: true },
  ],
  viewAllHref: "/admin/users",
};

export const quickActions = [
  { id: "1", icon: SendIcon, label: "Send Broadcast", description: "Message all users or specific roles", href: "/admin/messaging" },
  { id: "2", icon: PersonPlusIcon, label: "Approve editor", description: "5 pending applications", href: "/admin/users" },
  { id: "3", icon: StarIcon, label: "Feature content", description: "Highlight on homepage", href: "/admin/content" },
  { id: "4", icon: SettingsIcon, label: "Maintenance mode", description: "Enable platform maintenance", href: "/admin/settings" },
];

export const editorApps = [
  { id: "1", initials: "S", name: "Sarah Marzouq", badge: "Editor", experience: "5 years in journalism", timeAgo: "2 hours ago" },
  { id: "2", initials: "A", name: "Ahmed Hassan", badge: "Editor", experience: "3 years in journalism", timeAgo: "4 hours ago" },
];

export const contentRows = [
  { id: "1", icon: FileTextIcon, category: "Articles", published: 1247, drafts: 23, flagged: 3 },
  { id: "2", icon: FilmIcon, category: "Films", published: 342, drafts: 15, flagged: "—" },
  { id: "3", icon: MusicIcon, category: "Music", published: 567, drafts: 64, flagged: 2 },
  { id: "4", icon: CameraIcon, category: "Photography", published: 892, drafts: 34, flagged: "—" },
  { id: "5", icon: BookIcon, category: "Essays", published: 234, drafts: 17, flagged: 1 },
  { id: "6", icon: MicIcon, category: "Podcasts", published: 156, drafts: 5, flagged: "—" },
];

export const userRoles = [
  { id: "1", icon: UsersIcon, label: "Users", count: "10,234", percentage: 82, change: "+12%" },
  { id: "2", icon: HeartHandshakeIcon, label: "Contributors", count: "1,847", percentage: 35, change: "+8%" },
  { id: "3", icon: PenLineIcon, label: "Authors", count: "423", percentage: 20, change: "+15%" },
  { id: "4", icon: BarChartIcon, label: "Editors", count: "38", percentage: 8, change: "+5%" },
  { id: "5", icon: ShieldIcon, label: "Admins", count: "4", percentage: 3 },
];

export const financeCards = [
  { id: "1", icon: DollarSignIcon, amount: "$1,247", label: "Today's Donations...", sublabel: "23 transactions...", trend: { value: "18%", direction: "up" as const } },
  { id: "2", icon: TrendingUpIcon, amount: "$34,892", label: "This Month...", sublabel: "vs $28,450 last month...", trend: { value: "22%", direction: "up" as const } },
  { id: "3", icon: CreditCardIcon, amount: "$8,234", label: "Pending Payouts...", sublabel: "47 creators..." },
  { id: "4", icon: CreditCardIcon, amount: "$3,489", label: "Platform Fees...", sublabel: "10% of transactions..." },
];

export const recentActivity = [
  { id: "1", icon: PersonIcon, title: "New author joined", description: "Sara Marzouq signed ...", time: "2 minutes ago" },
  { id: "2", icon: FileTextIcon, title: "Article published", description: "The Future of Cinema ...", time: "2 minutes ago" },
  { id: "3", icon: DollarSignIcon, title: "Donation received", description: "$50 donation to Elena ...", time: "2 minutes ago" },
  { id: "4", icon: AlertTriangleIcon, title: "Content flagged", description: "Review required: Communi ...", time: "2 minutes ago" },
  { id: "5", icon: StarIcon, title: "Content featured", description: '"Digital Art Revolution" a ...', time: "2 minutes ago" },
  { id: "6", icon: ShieldIcon, title: "Login from new device", description: "Editor account accessed ...", time: "2 minutes ago" },
];

export const topPerformingArticles = [
  {
    id: "1",
    title: "British Restrict Jewish Immigration to Palestine",
    contributors: 32,
    views: "2,321",
    trend: { value: "+12%", direction: "up" as const },
  },
  {
    id: "2",
    title: "British Restrict Jewish Immigration to Palestine",
    contributors: 28,
    views: "1,956",
    trend: { value: "-8%", direction: "down" as const },
  },
  {
    id: "3",
    title: "British Restrict Jewish Immigration to Palestine",
    contributors: 24,
    views: "1,802",
    trend: { value: "+12%", direction: "up" as const },
  },
  {
    id: "4",
    title: "British Restrict Jewish Immigration to Palestine",
    contributors: 21,
    views: "1,654",
    trend: { value: "-8%", direction: "down" as const },
  },
  {
    id: "5",
    title: "British Restrict Jewish Immigration to Palestine",
    contributors: 18,
    views: "1,423",
    trend: { value: "+12%", direction: "up" as const },
  },
];

export const commandCenterStats = [
  { icon: UsersIcon, value: "12,546", label: "Total Users", trend: { value: "12.5%", direction: "up" as const, comparison: "VS last month" } },
  { icon: FileTextIcon, value: "3,438", label: "Content Published", trend: { value: "8.2%", direction: "up" as const, comparison: "VS last month" } },
  { icon: DollarSignIcon, value: "$34,892", label: "Monthly Donations", trend: { value: "22.4%", direction: "up" as const, comparison: "VS last month" } },
  { icon: EyeIcon, value: "2,847", label: "Active Today", trend: { value: "3.1%", direction: "down" as const, comparison: "VS yesterday" } },
];
