
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
    return {
      name: dayNames[getDay(day)],
      total: dayLogs.length,
    };
  });

  if (loading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Weekly Log Count</CardTitle>
                 <CardDescription>Number of logs recorded each day this week.</CardDescription>
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
        <CardTitle>Weekly Log Count</CardTitle>
        <CardDescription>Number of logs recorded each day this week.</CardDescription>
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
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
             <div className="text-center py-12 h-[350px] flex items-center justify-center">
                <p className="text-muted-foreground">No logs recorded for this week.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
