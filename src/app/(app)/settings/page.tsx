import { PageHeader } from "@/components/page-header";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

// Lazy load the data management component
const DataManagement = dynamic(() => import("@/components/settings/data-management").then(mod => ({ default: mod.DataManagement })), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your application data and preferences."
      />
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <DataManagement />
      </Suspense>
    </div>
  );
}
