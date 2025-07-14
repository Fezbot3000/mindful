import { PageHeader } from "@/components/page-header";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { InsightsPageClient } from "@/components/insights/insights-page-client";

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <InsightsPageClient />
      </Suspense>
    </div>
  );
}
