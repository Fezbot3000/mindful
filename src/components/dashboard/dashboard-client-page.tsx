
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useEffect, useState, useMemo, useCallback } from "react";
import { getLogs, getRecentLogs } from "@/lib/data";
import { Log } from "@/types";
import { differenceInCalendarDays, startOfToday } from "date-fns";
import { BarChart, BookOpen, Repeat, TrendingUp } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useLogs } from "@/hooks/use-logs";

const quotes = [
  "Tracking builds strength – you're in control.",
  "One step at a time. That's all you have to do.",
  "Your feelings are valid, but they are not facts.",
  "This feeling is temporary. It will pass.",
  "Breathe. You are safe right now."
];

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

    return { logsToday, streak };
  }, [logs]);

  const isLoading = loading || recentLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome Back"
        description={quote}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logs Today</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats.logsToday}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tracking Streak</CardTitle>
            <Repeat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats.streak} days</div>}
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{logs.length}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Intensity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{logs.length > 0 ? (logs.reduce((acc, log) => acc + log.intensity, 0) / logs.length).toFixed(1) : 'N/A'}</div>}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
          <CardDescription>A quick look at your most recent entries.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : recentLogs.length > 0 ? (
            <ul className="space-y-4">
              {recentLogs.map(log => (
                <li key={log.id} className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-accent/50">
                  <div className="flex-1">
                    <p className="font-semibold">{log.category}</p>
                    <p className="text-sm text-muted-foreground truncate">{log.description || "No description"}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{log.intensity}/10</div>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(log.timestamp, { addSuffix: true })}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-8">No recent logs. Use the '+' button to add your first one!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
