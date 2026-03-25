export type DonationRow = {
  id: string;
  donor: string;
  recipient: string;
  amount: string;
  date: string;
  status: "Completed" | "Pending";
};

export const sampleDonations: DonationRow[] = [
  {
    id: "d1",
    donor: "Fadi Barghouti",
    recipient: "Sara Tamimi",
    amount: "$50",
    date: "Jan 15, 2024",
    status: "Completed",
  },
  {
    id: "d2",
    donor: "Fadi Barghouti",
    recipient: "Sara Tamimi",
    amount: "$50",
    date: "Jan 15, 2024",
    status: "Completed",
  },
  {
    id: "d3",
    donor: "Fadi Barghouti",
    recipient: "Sara Tamimi",
    amount: "$50",
    date: "Jan 15, 2024",
    status: "Pending",
  },
  {
    id: "d4",
    donor: "Fadi Barghouti",
    recipient: "Sara Tamimi",
    amount: "$50",
    date: "Jan 15, 2024",
    status: "Completed",
  },
  {
    id: "d5",
    donor: "Fadi Barghouti",
    recipient: "Sara Tamimi",
    amount: "$50",
    date: "Jan 15, 2024",
    status: "Completed",
  },
  {
    id: "d6",
    donor: "Fadi Barghouti",
    recipient: "Sara Tamimi",
    amount: "$50",
    date: "Jan 15, 2024",
    status: "Completed",
  },
];

export type PayoutRow = {
  id: string;
  creator: string;
  amount: string;
  requested: string;
  status: "Pending" | "Under Review";
};

export const samplePayouts: PayoutRow[] = [
  {
    id: "p1",
    creator: "Fadi Barghouti",
    amount: "$1250",
    requested: "Jan 15, 2024",
    status: "Pending",
  },
  {
    id: "p2",
    creator: "Fadi Barghouti",
    amount: "$1250",
    requested: "Jan 15, 2024",
    status: "Pending",
  },
  {
    id: "p3",
    creator: "Fadi Barghouti",
    amount: "$1250",
    requested: "Jan 15, 2024",
    status: "Under Review",
  },
];

export type SuspiciousActivityItem = {
  id: string;
  title: string;
  meta: string;
};

export const sampleSuspiciousActivity: SuspiciousActivityItem[] = [
  {
    id: "s1",
    title: "Multiple failed payments",
    meta: "Unknown User • $500 • 1 hour ago",
  },
  {
    id: "s2",
    title: "Multiple failed payments",
    meta: "Unknown User • $500 • 1 hour ago",
  },
];

