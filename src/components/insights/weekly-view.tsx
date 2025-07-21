
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Log } from "@/types";
import { format, eachDayOfInterval, getDay } from "date-fns";

interface WeeklyViewProps {
  logs: Log[];
  dateRange: { start: Date; end: Date };
  loading: boolean;
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeeklyView({ logs, dateRange, loading }: WeeklyViewProps) {
  const data = eachDayOfInterval(dateRange).map(day => {
    const dayLogs = logs.filter(log => log.timestamp.toDateString() === day.toDateString());
    const avgIntensity = dayLogs.length > 0 
      ? Math.round((dayLogs.reduce((sum, log) => sum + log.intensity, 0) / dayLogs.length) * 10) / 10
      : 0;
    
    return {
      name: dayNames[getDay(day)],
      avgIntensity,
      logCount: dayLogs.length, // Keep for tooltip
    };
  });

  if (loading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Weekly Intensity Tracker</CardTitle>
                 <CardDescription>Average intensity levels for each day this week.</CardDescription>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[350px] w-full" />
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Intensity Tracker</CardTitle>
        <CardDescription>Average intensity levels for each day this week.</CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 10]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value: number, name: string, props: any) => [
                  name === 'avgIntensity' ? `${value}/10` : value,
                  name === 'avgIntensity' ? 'Avg Intensity' : 'Log Count'
                ]}
              />
              <Bar dataKey="avgIntensity" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
             <div className="text-center py-12 flex items-center justify-center h-[350px]">
                <p className="text-muted-foreground">No logs recorded for this week.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
