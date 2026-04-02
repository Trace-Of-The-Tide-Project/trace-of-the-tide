import type { MessageTemplate } from "@/components/dashboard/modals/CreateMessageTemplateModal";

export type EmailTemplateListItem = MessageTemplate & {
  /** ISO string used for "Last edited: ..." display */
  lastEditedAt: string;
};

export const sampleEmailTemplates: EmailTemplateListItem[] = [
  {
    id: "email_welcome",
    name: "Welcome Email",
    category: "onboarding",
    subject: "Welcome to Trace of the Tides",
    body: "Hi {{name}},\n\nWelcome to Trace of the Tides.\n\n— Team",
    lastEditedAt: "2024-02-01T00:00:00.000Z",
  },
  {
    id: "email_password_reset",
    name: "Password Reset",
    category: "support",
    subject: "Reset your password",
    body: "Hi {{name}},\n\nClick the link below to reset your password.\n\n{{reset_link}}",
    lastEditedAt: "2024-01-28T00:00:00.000Z",
  },
  {
    id: "email_content_approved",
    name: "Content Approved",
    category: "moderation",
    subject: "Your content has been approved",
    body: "Hi {{name}},\n\nYour submission has been approved.\n\n— Team",
    lastEditedAt: "2024-01-25T00:00:00.000Z",
  },
  {
    id: "email_payout_confirmation",
    name: "Payout Confirmation",
    category: "payment",
    subject: "Your payout is on the way",
    body: "Hi {{name}},\n\nYour payout has been initiated.\n\n— Team",
    lastEditedAt: "2024-01-20T00:00:00.000Z",
  },
  {
    id: "email_account_warning",
    name: "Account Warning",
    category: "moderation",
    subject: "Important notice about your account",
    body: "Hi {{name}},\n\nWe noticed activity that may violate our guidelines.\n\n— Team",
    lastEditedAt: "2024-01-15T00:00:00.000Z",
  },
];

