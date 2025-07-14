
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLogs } from "@/lib/data";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ExportCard() {
  const { toast } = useToast();

  const handleExport = async () => {
    toast({ title: "Exporting...", description: "Preparing your data for download." });
    const logs = await getLogs();
    if (logs.length === 0) {
      toast({ variant: "destructive", title: "No Data", description: "There are no logs to export." });
      return;
    }

    const headers = ["ID", "Timestamp", "Category", "Intensity", "Description"];
    const rows = logs.map(log => [
      log.id,
      log.timestamp.toISOString(),
      log.category,
      log.intensity,
      `"${log.description?.replace(/"/g, '""') || ""}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "mindful_track_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="icon-md text-primary" />
          Export Data
        </CardTitle>
        <CardDescription>
          Export your log data as a CSV file for your personal records.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
         <FileText className="h-10 w-10 text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Download all your logs to a local CSV file.</p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={handleExport}>
            <FileText className="mr-2 h-4 w-4" />
            Export as CSV
        </Button>
      </CardFooter>
    </Card>
  );
}
