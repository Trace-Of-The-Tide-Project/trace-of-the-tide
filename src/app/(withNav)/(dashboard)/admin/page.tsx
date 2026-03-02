"use client";

import { AlertsList } from "@/components/dashboard/admin/mainDashboard/AlertsList";
import { QuickActions } from "@/components/dashboard/admin/mainDashboard/QuickActions";
import { EditorApplications } from "@/components/dashboard/admin/mainDashboard/EditorApplications";
import { ContentOverview } from "@/components/dashboard/admin/mainDashboard/ContentOverview";
import { UsersByRole } from "@/components/dashboard/admin/mainDashboard/UsersByRole";
import { FinanceSnapshot } from "@/components/dashboard/admin/mainDashboard/FinanceSnapshot";
import { RecentActivity } from "@/components/dashboard/admin/mainDashboard/RecentActivity";
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
} from "@/components/ui/icons";

const alerts = [
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
      badge: { label: "Warning", color: "#f59e0b" },
      items: [
        { id: "l1", title: "Editor: Sarah Marzouq", subtitle: "New location: Cairo, Egypt · 30 min ago", actionLabel: "Review" },
        { id: "l2", title: "Editor: Ahmed Hassan", subtitle: "New location: Amman, Jordan · 1h ago", actionLabel: "Review" },
        { id: "l3", title: "Editor: Layla Khalil", subtitle: "New location: Beirut, Lebanon · 2h ago", actionLabel: "Review" },
      ],
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
        { id: "a1", title: "Nour Al-Din", subtitle: "Journalist · 3 years experience · Applied 2d ago", actionLabel: "Review" },
        { id: "a2", title: "Fatima Zahra", subtitle: "Photographer · 5 years experience · Applied 1d ago", actionLabel: "Review" },
        { id: "a3", title: "Omar Farouq", subtitle: "Writer · 2 years experience · Applied 1d ago", actionLabel: "Review" },
      ],
      viewAllHref: "/admin/users",
    },
  },
];

const quickActions = [
  {
    id: "1",
    icon: SendIcon,
    label: "Send Broadcast",
    description: "Message all users or specific roles",
    href: "/admin/messaging",
  },
  {
    id: "2",
    icon: PersonPlusIcon,
    label: "Approve editor",
    description: "5 pending applications",
    href: "/admin/users",
  },
  {
    id: "3",
    icon: StarIcon,
    label: "Feature content",
    description: "Highlight on homepage",
    href: "/admin/content",
  },
  {
    id: "4",
    icon: SettingsIcon,
    label: "Maintenance mode",
    description: "Enable platform maintenance",
    href: "/admin/settings",
  },
];

const editorApps = [
  {
    id: "1",
    initials: "S",
    name: "Sarah Marzouq",
    badge: "Editor",
    experience: "5 years in journalism",
    timeAgo: "2 hours ago",
  },
  {
    id: "2",
    initials: "A",
    name: "Ahmed Hassan",
    badge: "Editor",
    experience: "3 years in journalism",
    timeAgo: "4 hours ago",
  },
];

const contentRows = [
  { id: "1", icon: FileTextIcon, category: "Articles", published: 1247, drafts: 23, flagged: 3 },
  { id: "2", icon: FilmIcon, category: "Films", published: 342, drafts: 15, flagged: "—" },
  { id: "3", icon: MusicIcon, category: "Music", published: 567, drafts: 64, flagged: 2 },
  { id: "4", icon: CameraIcon, category: "Photography", published: 892, drafts: 34, flagged: "—" },
  { id: "5", icon: BookIcon, category: "Essays", published: 234, drafts: 17, flagged: 1 },
  { id: "6", icon: MicIcon, category: "Podcasts", published: 156, drafts: 5, flagged: "—" },
];

const userRoles = [
  { id: "1", icon: UsersIcon, label: "Users", count: "10,234", percentage: 82, change: "+12%" },
  { id: "2", icon: HeartHandshakeIcon, label: "Contributors", count: "1,847", percentage: 35, change: "+8%" },
  { id: "3", icon: PenLineIcon, label: "Authors", count: "423", percentage: 20, change: "+15%" },
  { id: "4", icon: BarChartIcon, label: "Editors", count: "38", percentage: 8, change: "+5%" },
  { id: "5", icon: ShieldIcon, label: "Admins", count: "4", percentage: 3 },
];

const financeCards = [
  { id: "1", icon: DollarSignIcon, amount: "$1,247", label: "Today's Donations...", sublabel: "23 transactions...", trend: { value: "18%", direction: "up" as const } },
  { id: "2", icon: TrendingUpIcon, amount: "$34,892", label: "This Month...", sublabel: "vs $28,450 last month...", trend: { value: "22%", direction: "up" as const } },
  { id: "3", icon: CreditCardIcon, amount: "$8,234", label: "Pending Payouts...", sublabel: "47 creators..." },
  { id: "4", icon: CreditCardIcon, amount: "$3,489", label: "Platform Fees...", sublabel: "10% of transactions..." },
];

const recentActivity = [
  { id: "1", icon: PersonIcon, title: "New author joined", description: "Sara Marzouq signed ...", time: "2 minutes ago" },
  { id: "2", icon: FileTextIcon, title: "Article published", description: "The Future of Cinema ...", time: "2 minutes ago" },
  { id: "3", icon: DollarSignIcon, title: "Donation received", description: "$50 donation to Elena ...", time: "2 minutes ago" },
  { id: "4", icon: AlertTriangleIcon, title: "Content flagged", description: "Review required: Communi ...", time: "2 minutes ago" },
  { id: "5", icon: StarIcon, title: "Content featured", description: '"Digital Art Revolution" a ...', time: "2 minutes ago" },
  { id: "6", icon: ShieldIcon, title: "Login from new device", description: "Editor account accessed ...", time: "2 minutes ago" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 p-4">
      {/* Alerts */}
      <AlertsList items={alerts} onDismissAll={() => {}} />

      {/* Quick Actions + Editor Applications */}
      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActions items={quickActions} />
        <EditorApplications items={editorApps} viewAllHref="/admin/users" />
      </div>

      {/* Content Overview */}
      <ContentOverview
        rows={contentRows}
        totalLabel="Total content pieces"
        totalValue="3,438"
        manageHref="/admin/content"
      />

      {/* Users by Role */}
      <UsersByRole
        roles={userRoles}
        totalLabel="Total users"
        totalValue="12,546"
        viewAllHref="/admin/users"
      />

      {/* Finance + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <FinanceSnapshot cards={financeCards} detailsHref="/admin/analytics" />
        <RecentActivity items={recentActivity} />
      </div>
    </div>
  );
}
