
"use client";

import { Log, LogCategory } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { HeartPulse, Repeat, TrendingUp, Sparkles, Activity, BookText } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";

const categoryIcons: Record<LogCategory, React.ElementType> = {
  "Health Fear": HeartPulse,
  "Intrusive Thought": Sparkles,
  "Compulsion": Repeat,
  "Schema Trigger": TrendingUp,
  "Accomplished": Sparkles,
  "Journal Reflection": BookText,
};

interface DailyViewProps {
  logs: Log[];
  loading: boolean;
}

export function DailyView({ logs, loading }: DailyViewProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>24-Hour Intensity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily Log Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create 24-hour timeline data
  const timelineData = Array.from({ length: 24 }, (_, hour) => {
    const hourLogs = logs.filter(log => {
      const logHour = log.timestamp.getHours();
      return logHour === hour;
    });
    
    const avgIntensity = hourLogs.length > 0 
      ? Math.round((hourLogs.reduce((sum, log) => sum + log.intensity, 0) / hourLogs.length) * 10) / 10
      : null;
    
    return {
      hour: hour,
      time: format(new Date().setHours(hour, 0, 0, 0), 'HH:mm'),
      avgIntensity,
      logCount: hourLogs.length,
    };
  });

  // Filter out hours with no data for cleaner visualization
  const chartData = timelineData.filter(data => data.avgIntensity !== null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>24-Hour Intensity Timeline</CardTitle>
          <CardDescription>Track how your intensity levels changed throughout the day.</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={[0, 10]}
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  labelFormatter={(label) => `Time: ${label}`}
                  formatter={(value: number, name: string) => [
                    name === 'avgIntensity' ? `${value}/10` : value,
                    name === 'avgIntensity' ? 'Intensity' : 'Log Count'
                  ]}
                />
                <ReferenceLine y={5} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" opacity={0.5} />
                <Line 
                  type="monotone" 
                  dataKey="avgIntensity" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 flex items-center justify-center" style={{ height: '300px' }}>
              <p className="text-muted-foreground">No logs recorded for this day.</p>
            </div>
          )}
        </CardContent>
      </Card>

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
    </div>
  );
}
