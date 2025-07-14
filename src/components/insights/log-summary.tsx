
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Log, LogCategory } from "@/types";
import { TrendingUp, Activity, BarChart, CalendarDays } from "lucide-react";

interface LogSummaryProps {
  logs: Log[];
  loading: boolean;
  view: 'daily' | 'weekly' | 'monthly';
}

export function LogSummary({ logs, loading, view }: LogSummaryProps) {
  const summary = (() => {
    if (logs.length === 0) {
      return {
        totalLogs: 0,
        avgIntensity: "N/A",
        mostFrequent: "N/A",
      };
    }

    const totalLogs = logs.length;
    const avgIntensity = (logs.reduce((acc, log) => acc + log.intensity, 0) / totalLogs).toFixed(1);

    const categoryCounts = logs.reduce((acc, log) => {
      acc[log.category] = (acc[log.category] || 0) + 1;
      return acc;
    }, {} as Record<LogCategory, number>);

    const mostFrequent = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0];

    return { totalLogs, avgIntensity, mostFrequent };
  })();
  
  const viewTitle = view.charAt(0).toUpperCase() + view.slice(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{viewTitle} Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
                <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Total Logs</p>
                {loading ? <Skeleton className="h-6 w-12 mt-1" /> : <p className="text-2xl font-bold">{summary.totalLogs}</p>}
            </div>
        </div>
        <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Avg. Intensity</p>
                {loading ? <Skeleton className="h-6 w-12 mt-1" /> : <p className="text-2xl font-bold">{summary.avgIntensity}</p>}
            </div>
        </div>
        <div className="flex items-start gap-4">
             <div className="p-3 bg-primary/10 rounded-lg">
                <BarChart className="h-6 w-6 text-primary" />
            </div>
            <div className="overflow-hidden">
                <p className="text-sm text-muted-foreground">Top Trigger</p>
                {loading ? <Skeleton className="h-6 w-32 mt-1" /> : <p className="text-2xl font-bold truncate">{summary.mostFrequent}</p>}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
