import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function JournalPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Journal"
        description="A space for deeper reflection and timed worry sessions."
      />
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/20 p-4 rounded-full">
            <Construction className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="mt-4">Feature Coming Soon</CardTitle>
          <CardDescription>
            The dedicated journal and timed 'worry session' feature is currently under construction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We're working hard to bring you a dedicated space for more in-depth entries. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
