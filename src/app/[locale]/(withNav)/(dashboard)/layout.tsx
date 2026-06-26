import { PageTransition } from "@/components/motion/PageTransition";
import { DashboardRoleGate } from "@/components/layout/DashboardRoleGate";
import { WithNavAuthGate } from "@/components/layout/WithNavAuthGate";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WithNavAuthGate>
      <DashboardRoleGate>
        <PageTransition>{children}</PageTransition>
      </DashboardRoleGate>
    </WithNavAuthGate>
  );
}
