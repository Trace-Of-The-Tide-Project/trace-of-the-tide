import { DashboardHeader } from "./DashboardHeader";

type PlaceholderPageProps = {
  title: string;
  subtitle?: string;
};

export function PlaceholderPage({ title, subtitle }: PlaceholderPageProps) {
  return (
    <div>
      <DashboardHeader title={title} subtitle={subtitle ?? "This page is under construction."} />
      <div className="flex items-center justify-center p-16">
        <div className="text-center">
          <div className="mb-4 text-5xl text-gray-700">🏗</div>
          <p className="text-lg font-medium text-gray-500">Coming soon</p>
          <p className="mt-1 text-sm text-gray-600">{title} will be available here.</p>
        </div>
      </div>
    </div>
  );
}
