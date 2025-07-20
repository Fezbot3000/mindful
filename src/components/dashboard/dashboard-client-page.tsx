
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useEffect, useState, useMemo } from "react";
import { getRecentLogs } from "@/lib/data";
import { Log, LogCategory } from "@/types";
import { differenceInCalendarDays, startOfToday } from "date-fns";
import { HeartPulse, Repeat, TrendingUp, Sparkles, BookText } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useLogs } from "@/hooks/use-logs";
import { EditLogDialog } from "@/components/edit-log-dialog";

const quotes = [
  "Tracking builds strength – you're in control.",
  "One step at a time. That's all you have to do.",
  "Your feelings are valid, but they are not facts.",
  "This feeling is temporary. It will pass.",
  "Breathe. You are safe right now."
];

const categoryIcons: Record<LogCategory, React.ElementType> = {
    "Health Fear": HeartPulse,
    "Intrusive Thought": Sparkles,
    "Compulsion": Repeat,
    "Schema Trigger": TrendingUp,
    "Accomplished": Sparkles,
    "Journal Reflection": BookText,
};

export function DashboardClientPage() {
  const { logs, loading } = useLogs();
  const [recentLogs, setRecentLogs] = useState<Log[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  useEffect(() => {
    const fetchRecent = async () => {
      setRecentLoading(true);
      const recentLogsData = await getRecentLogs(5);
      setRecentLogs(recentLogsData);
      setRecentLoading(false);
    }
    fetchRecent();
  }, [logs]);

  const stats = useMemo(() => {
    const today = startOfToday();
    const logsToday = logs.filter(log => differenceInCalendarDays(log.timestamp, today) === 0).length;

    let streak = 0;
    if (logs.length > 0) {
      const uniqueLogDays = [...new Set(logs.map(log => new Date(log.timestamp).toDateString()))]
        .map(dateStr => new Date(dateStr))
        .sort((a, b) => b.getTime() - a.getTime());

      if (uniqueLogDays.length > 0 && differenceInCalendarDays(today, uniqueLogDays[0]) <= 1) {
        streak = 1;
        for (let i = 0; i < uniqueLogDays.length - 1; i++) {
          if (differenceInCalendarDays(uniqueLogDays[i], uniqueLogDays[i+1]) === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    const totalLogs = logs.length;
    const avgIntensity = totalLogs > 0 
      ? (logs.reduce((acc, log) => acc + log.intensity, 0) / totalLogs).toFixed(1) 
      : 'N/A';

    return { logsToday, streak, totalLogs, avgIntensity };
  }, [logs]);

  const isLoading = loading || recentLoading;

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      <PageHeader
        title="Welcome Back"
        description={quote}
      />

      {/* Compact Stats Section */}
      <div className="bg-card rounded-lg border p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Your Progress</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Today</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-8" />
            ) : (
              <div className="text-xl font-bold">{stats.logsToday}</div>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Repeat className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Streak</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <div className="text-xl font-bold">{stats.streak} days</div>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-8" />
            ) : (
              <div className="text-xl font-bold">{stats.totalLogs}</div>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Avg. Intensity</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-8" />
            ) : (
              <div className="text-xl font-bold">{stats.avgIntensity}</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Logs Section */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="p-4 pb-0">
          <h3 className="font-semibold">Recent Logs</h3>
          <p className="text-sm text-muted-foreground">Your most recent entries</p>
        </div>
        
        <div className="p-4 pt-3">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : recentLogs.length > 0 ? (
            <div className="space-y-2">
              {recentLogs.map(log => {
                const Icon = categoryIcons[log.category] || Sparkles;
                return (
                  <EditLogDialog 
                    key={log.id} 
                    log={log} 
                    onLogUpdated={(updatedLog) => {
                      setRecentLogs(prev => prev.map(l => l.id === log.id ? updatedLog : l));
                    }}
                  >
                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 cursor-pointer transition-colors group">
                      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-sm truncate">{log.category}</span>
                          <span className="text-lg font-bold text-primary flex-shrink-0">{log.intensity}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground truncate">
                            {log.description || "No description"}
                          </span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </EditLogDialog>
                )
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-6 text-sm">
              No recent logs. Use the '+' button to add your first one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
