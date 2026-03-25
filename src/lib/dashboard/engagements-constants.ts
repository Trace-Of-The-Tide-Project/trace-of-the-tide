export type Comment = {
  id: string;
  author: string;
  contentTitle: string;
  content: string;
  likes: number;
  replies: number;
  timeAgo: string;
  flagged: boolean;
};

export const sampleComments: Comment[] = [
  {
    id: "1",
    author: "Ahmed Sameer",
    contentTitle: "The Art of Visual Storytelling",
    content: "This is an incredible piece of work! The attention to detail is remarkable....",
    likes: 18,
    replies: 2,
    timeAgo: "2 hours ago",
    flagged: false,
  },
  {
    id: "2",
    author: "Ahmed Sameer",
    contentTitle: "The Art of Visual Storytelling",
    content: "This is an incredible piece of work! The attention to detail is remarkable....",
    likes: 18,
    replies: 2,
    timeAgo: "2 hours ago",
    flagged: false,
  },
  {
    id: "3",
    author: "Ahmed Sameer",
    contentTitle: "The Art of Visual Storytelling",
    content: "This is an incredible piece of work! The attention to detail is remarkable....",
    likes: 18,
    replies: 2,
    timeAgo: "2 hours ago",
    flagged: false,
  },
  {
    id: "4",
    author: "Ahmed Sameer",
    contentTitle: "The Art of Visual Storytelling",
    content: "This is an incredible piece of work! The attention to detail is remarkable....",
    likes: 18,
    replies: 2,
    timeAgo: "2 hours ago",
    flagged: true,
  },
  {
    id: "5",
    author: "Ahmed Sameer",
    contentTitle: "The Art of Visual Storytelling",
    content: "This is an incredible piece of work! The attention to detail is remarkable....",
    likes: 18,
    replies: 2,
    timeAgo: "2 hours ago",
    flagged: false,
  },
];

export type TrendingDiscussion = {
  id: string;
  title: string;
  comments: number;
  participants: number;
  locked: boolean;
};

export const sampleTrendingDiscussions: TrendingDiscussion[] = [
  {
    id: "t1",
    title: "Best practices for documentary filmmaking",
    comments: 156,
    participants: 45,
    locked: false,
  },
  {
    id: "t2",
    title: "Best practices for documentary filmmaking",
    comments: 132,
    participants: 39,
    locked: true,
  },
  {
    id: "t3",
    title: "Best practices for documentary filmmaking",
    comments: 104,
    participants: 31,
    locked: false,
  },
  {
    id: "t4",
    title: "Best practices for documentary filmmaking",
    comments: 87,
    participants: 28,
    locked: false,
  },
];

export type Badge = {
  id: string;
  name: string;
  recipients: number;
  description: string;
  icon: "award" | "star" | "heart" | "check" | "spark";
};

export const sampleBadges: Badge[] = [
  {
    id: "b1",
    name: "Top Contributor",
    recipients: 45,
    description: "Awarded to users with 100+ contributions",
    icon: "award",
  },
  {
    id: "b2",
    name: "Rising Star",
    recipients: 120,
    description: "New creators with exceptional content",
    icon: "star",
  },
  {
    id: "b3",
    name: "Community Helper",
    recipients: 78,
    description: "Active in helping others in community",
    icon: "heart",
  },
  {
    id: "b4",
    name: "Verified Creator",
    recipients: 234,
    description: "Verified creative professional",
    icon: "check",
  },
  {
    id: "b5",
    name: "Pioneer",
    recipients: 15,
    description: "Early platform adopters",
    icon: "spark",
  },
];
