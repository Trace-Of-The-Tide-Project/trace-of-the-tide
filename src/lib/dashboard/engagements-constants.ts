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
