
"use client";

import { Log, LogCategory } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { HeartPulse, Repeat, TrendingUp, Sparkles, Activity } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const categoryIcons: Record<LogCategory, React.ElementType> = {
  "Health Fear": HeartPulse,
  "Intrusive Thought": Sparkles,
  "Compulsion": Repeat,
  "Schema Trigger": TrendingUp,
  "Accomplished": Sparkles,
};

interface DailyViewProps {
  logs: Log[];
  loading: boolean;
}

export function DailyView({ logs, loading }: DailyViewProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Log Details</CardTitle>
        <CardDescription>A detailed look at your logs from this day.</CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length > 0 ? (
          <ul className="space-y-4">
            {logs.map(log => {
              const Icon = categoryIcons[log.category] || Activity;
              return (
                <li key={log.id} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-accent/20">
                  <div className="flex items-center gap-4">
                    <Icon className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">{log.category}</p>
                      <p className="text-sm text-muted-foreground">{log.description || "No description provided."}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-lg text-primary">{log.intensity}/10</p>
                    <p className="text-xs text-muted-foreground">{format(log.timestamp, "h:mm a")}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No logs recorded for this day.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
