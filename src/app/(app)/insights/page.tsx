import { PageHeader } from "@/components/page-header";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

// Lazy load the insights page client
const InsightsPageClient = dynamic(() => import("@/components/insights/insights-page-client").then(mod => ({ default: mod.InsightsPageClient })), {
  loading: () => <Skeleton className="h-[600px] w-full" />,
});

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <InsightsPageClient />
      </Suspense>
    </div>
  );
}
