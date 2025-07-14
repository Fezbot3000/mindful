"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLogs } from "@/lib/data";
import { generateInsights } from "@/ai/flows/insights-summarizer";
import { Loader2, Sparkles, Terminal, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export function GeminiInsightsCard() {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleGenerateInsights = async () => {
    setLoading(true);
    setError("");
    setInsights("");
    try {
      const logs = await getLogs();
      if (logs.length < 5) {
        setError("You need at least 5 logs to generate insights.");
        setLoading(false);
        return;
      }
      const logsJson = JSON.stringify(logs.map(log => ({ ...log, timestamp: log.timestamp.toDate().toISOString() })));
      const result = await generateInsights({ logs: logsJson });
      setInsights(result.insights);
    } catch (e) {
      console.error(e);
      setError("Failed to generate insights. Please try again later.");
    }
    setLoading(false);
  };

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
      log.timestamp.toDate().toISOString(),
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
          <Sparkles className="h-5 w-5 text-primary" />
          AI-Powered Insights & Export
        </CardTitle>
        <CardDescription>
          Generate a summary of your logs or export them for your records.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {loading && (
          <div className="flex items-center justify-center rounded-md border border-dashed p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Analyzing your logs...</p>
          </div>
        )}
        {insights && (
          <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border bg-accent/20 p-4 whitespace-pre-wrap font-sans">
            <h3 className="font-semibold text-foreground">Summary:</h3>
            {insights}
          </div>
        )}
         {!insights && !loading && (
             <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                <Sparkles className="h-10 w-10 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Click "Generate Insights" to see an AI-powered summary of your logs.</p>
                <p className="text-xs text-muted-foreground/80 mt-1">(Requires at least 5 logs)</p>
            </div>
         )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleGenerateInsights} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Insights"
          )}
        </Button>
        <Button variant="outline" onClick={handleExport}>
            <FileText className="mr-2 h-4 w-4" />
            Export as CSV
        </Button>
      </CardFooter>
    </Card>
  );
}
