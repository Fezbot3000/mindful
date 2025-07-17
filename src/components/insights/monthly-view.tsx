
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Log } from "@/types";
import { eachDayOfInterval, format, getDate } from "date-fns";

interface MonthlyViewProps {
  logs: Log[];
  dateRange: { start: Date; end: Date };
  loading: boolean;
}

export function MonthlyView({ logs, dateRange, loading }: MonthlyViewProps) {
  const data = eachDayOfInterval(dateRange).map(day => {
    const dayLogs = logs.filter(log => log.timestamp.toDateString() === day.toDateString());
    const avgIntensity = dayLogs.length > 0 
      ? Math.round((dayLogs.reduce((sum, log) => sum + log.intensity, 0) / dayLogs.length) * 10) / 10
      : 0;
    
    return {
      name: format(day, "d"), // Just the day number
      avgIntensity,
      logCount: dayLogs.length, // Keep for tooltip
    };
  });

  if (loading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Intensity Tracker</CardTitle>
                 <CardDescription>Average intensity levels for each day this month.</CardDescription>
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
        <CardTitle>Monthly Intensity Tracker</CardTitle>
        <CardDescription>Average intensity levels for each day this month.</CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelFormatter={(label) => `Day ${label}`}
                formatter={(value: number, name: string, props: any) => [
                  name === 'avgIntensity' ? `${value}/10` : value,
                  name === 'avgIntensity' ? 'Avg Intensity' : 'Log Count'
                ]}
              />
              <Bar dataKey="avgIntensity" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
             <div className="text-center py-12 flex items-center justify-center" style={{ height: '350px' }}>
                <p className="text-muted-foreground">No logs recorded for this month.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
