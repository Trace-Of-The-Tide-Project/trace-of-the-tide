export type UserRole = "Editor" | "Author" | "Contributor" | "User";
export type UserStatus = "Active" | "Pending" | "Inactive" | "Suspended";

export type UserEntry = {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
  lastActive: string;
  contributions: number;
};

export const sampleUsers: UserEntry[] = [
  {
    id: "1",
    name: "Fadi Barghouti",
    email: "fadi.b@example.com",
    initials: "FB",
    role: "Editor",
    status: "Active",
    joined: "Jan 15, 2024",
    lastActive: "2 hours ago",
    contributions: 127,
  },
  {
    id: "2",
    name: "Sara Al-Hassan",
    email: "sara.h@example.com",
    initials: "SH",
    role: "Author",
    status: "Pending",
    joined: "Feb 2, 2024",
    lastActive: "1 day ago",
    contributions: 45,
  },
  {
    id: "3",
    name: "Khalid Mahmoud",
    email: "khalid.m@example.com",
    initials: "KM",
    role: "Contributor",
    status: "Inactive",
    joined: "Dec 10, 2023",
    lastActive: "2 weeks ago",
    contributions: 32,
  },
  {
    id: "4",
    name: "Noor Ibrahim",
    email: "noor.i@example.com",
    initials: "NI",
    role: "User",
    status: "Active",
    joined: "Jan 28, 2024",
    lastActive: "Just now",
    contributions: 89,
  },
  {
    id: "5",
    name: "Omar Rashid",
    email: "omar.r@example.com",
    initials: "OR",
    role: "Contributor",
    status: "Suspended",
    joined: "Nov 5, 2023",
    lastActive: "1 month ago",
    contributions: 5,
  },
  {
    id: "6",
    name: "Lina Farah",
    email: "lina.f@example.com",
    initials: "LF",
    role: "Editor",
    status: "Active",
    joined: "Mar 1, 2024",
    lastActive: "2 hours ago",
    contributions: 234,
  },
];

export const TOTAL_USERS_COUNT = 12_546;
