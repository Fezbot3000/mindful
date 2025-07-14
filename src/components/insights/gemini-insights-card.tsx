"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLogs } from "@/lib/data";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Log } from "@/types";

interface ExportCardProps {
  visibleLogs: Log[];
}

export function ExportCard({ visibleLogs }: ExportCardProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    toast({ title: "Exporting...", description: "Preparing your data for download." });
    
    try {
      const allLogs = await getLogs();
      if (allLogs.length === 0) {
        toast({ variant: "destructive", title: "No Data", description: "There are no logs to export." });
        setIsExporting(false);
        return;
      }

      const headers = ["ID", "Timestamp", "Category", "Intensity", "Description"];
      const rows = allLogs.map(log => [
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
      
      toast({ title: "Export Complete", description: "Your data has been downloaded successfully." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Export Failed", description: "Unable to export data. Please try again." });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Data Export
        </CardTitle>
        <CardDescription>
          Export all your logs and journal entries to a CSV file for backup or analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <Download className="h-10 w-10 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            Export all your mental health tracking data to a CSV file.
          </p>
          <p className="text-xs text-muted-foreground/80 mt-1">
            Includes all logs with timestamps, categories, intensities, and descriptions.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleExport} disabled={isExporting} className="w-full">
          {isExporting ? (
            <>
              <FileText className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export All Data as CSV
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Keep the old export name for backward compatibility
export const GeminiInsightsCard = ExportCard;
