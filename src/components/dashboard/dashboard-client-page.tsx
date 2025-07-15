
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
    "Accomplished": Sparkles, // Using Sparkles for positive as well
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
    <div className="space-y-6 max-w-full overflow-hidden">
      <PageHeader
        title="Welcome Back"
        description={quote}
      />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 max-w-full overflow-hidden">
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate">Logs Today</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats.logsToday}</div>}
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate">Tracking Streak</CardTitle>
            <Repeat className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats.streak} days</div>}
          </CardContent>
        </Card>
         <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate">Total Logs</CardTitle>
            <HeartPulse className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats.totalLogs}</div>}
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate">Avg. Intensity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats.avgIntensity}</div>}
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
          <CardDescription>A quick look at your most recent entries.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-hidden">
          {isLoading ? (
             <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : recentLogs.length > 0 ? (
            <ul className="space-y-4 max-w-full">
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
                    <li className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors min-w-0 max-w-full overflow-hidden">
                      <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                        <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <p className="font-semibold truncate">{log.category}</p>
                          <p className="text-sm text-muted-foreground truncate">{log.description || "No description"}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 min-w-0">
                        <div className="font-bold text-primary whitespace-nowrap">{log.intensity}/10</div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">{formatDistanceToNow(log.timestamp, { addSuffix: true })}</p>
                      </div>
                    </li>
                  </EditLogDialog>
                )
            })}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-8">No recent logs. Use the '+' button to add your first one!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
