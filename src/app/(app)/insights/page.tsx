import { PageHeader } from "@/components/page-header";
import { LogCalendar } from "@/components/insights/log-calendar";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ExportCard } from "@/components/insights/export-card";

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tracking & Insights"
        description="Visualize your journey and discover patterns over time."
      />
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <LogCalendar />
      </Suspense>
      <ExportCard />
    </div>
  );
}
