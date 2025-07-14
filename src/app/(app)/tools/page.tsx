import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

// Lazy load the breathing exercise component
const BreathingExercise = dynamic(() => import("@/components/tools/breathing-exercise").then(mod => ({ default: mod.BreathingExercise })), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mindfulness Toolkit"
        description="Simple tools to help you stay grounded."
      />
      <Card>
        <CardHeader>
          <CardTitle>5-Minute Guided Breathing</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <BreathingExercise />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
