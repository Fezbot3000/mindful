import { PageHeader } from "@/components/page-header";
import { BreathingExercise } from "@/components/tools/breathing-exercise";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
          <BreathingExercise />
        </CardContent>
      </Card>
    </div>
  );
}
