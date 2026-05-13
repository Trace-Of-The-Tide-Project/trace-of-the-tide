import { PageTransition } from "@/components/motion/PageTransition";
import { WithNavAuthGate } from "@/components/layout/WithNavAuthGate";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WithNavAuthGate>
      <PageTransition>{children}</PageTransition>
    </WithNavAuthGate>
  );
}
