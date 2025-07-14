import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

// Lazy load the dashboard client page
const DashboardClientPage = dynamic(() => import("@/components/dashboard/dashboard-client-page").then(mod => ({ default: mod.DashboardClientPage })), {
  loading: () => <Skeleton className="h-[600px] w-full" />,
});

export default function DashboardPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
      <DashboardClientPage />
    </Suspense>
  );
}
