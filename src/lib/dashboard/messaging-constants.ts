export type Message = {
  id: string;
  senderInitials: string;
  body: string;
  timestamp: string;
  align: "left" | "right";
};

export type Thread = {
  id: string;
  senderName: string;
  priority?: "HIGH" | "MED" | "LOW";
  subject: string;
  preview: string;
  timestamp: string;
  category: "Support" | "Payment" | "Moderation" | "Feedback";
  status: "Inbox" | "Archived";
  messages: Message[];
};

export const sampleThreads: Thread[] = [
  {
    id: "t1",
    senderName: "Fadi Barghouti",
    priority: "HIGH",
    subject: "Question about payment processing",
    preview: "Hi, I'm having trouble receiving my latest payout...",
    timestamp: "Mar 15, 2024 · 10:30 AM",
    category: "Payment",
    status: "Inbox",
    messages: [
      {
        id: "m1",
        senderInitials: "FB",
        align: "left",
        body:
          "Hi, I'm having trouble receiving my latest payout. The status shows pending...",
        timestamp: "Mar 15, 2024 · 10:30 AM",
      },
      {
        id: "m2",
        senderInitials: "AD",
        align: "right",
        body:
          "Thank you for reaching out. I see that your latest payout is currently marked as pending. Payouts sometimes take a little time to process depending on banking or payment provider schedules.\n\nCould you please wait 24–48 hours for the status to update? If it's still pending after that, let us know, and we'll investigate it further to ensure you receive your payment promptly.\n\nWe appreciate your patience!",
        timestamp: "Mar 15, 2024 · 2:15 PM",
      },
    ],
  },
  {
    id: "t2",
    senderName: "Fadi Barghouti",
    subject: "British Restrict Jewish Immigration...",
    preview: "I just reviewed your edits - they're re...",
    timestamp: "Mar 14, 2024 · 9:02 AM",
    category: "Feedback",
    status: "Inbox",
    messages: [
      {
        id: "m1",
        senderInitials: "FB",
        align: "left",
        body: "I just reviewed your edits — they're really helpful. One question though...",
        timestamp: "Mar 14, 2024 · 9:02 AM",
      },
    ],
  },
  {
    id: "t3",
    senderName: "Fadi Barghouti",
    subject: "Account verification help",
    preview: "Could you help me verify my creator profile?",
    timestamp: "Mar 13, 2024 · 4:44 PM",
    category: "Support",
    status: "Inbox",
    messages: [
      {
        id: "m1",
        senderInitials: "FB",
        align: "left",
        body: "Could you help me verify my creator profile? I can't find the required steps.",
        timestamp: "Mar 13, 2024 · 4:44 PM",
      },
    ],
  },
  {
    id: "t4",
    senderName: "Fadi Barghouti",
    subject: "General inquiry",
    preview: "Just checking on a few things...",
    timestamp: "Mar 12, 2024 · 11:20 AM",
    category: "Moderation",
    status: "Archived",
    messages: [
      {
        id: "m1",
        senderInitials: "FB",
        align: "left",
        body: "Just checking on a few things — thanks!",
        timestamp: "Mar 12, 2024 · 11:20 AM",
      },
    ],
  },
];

