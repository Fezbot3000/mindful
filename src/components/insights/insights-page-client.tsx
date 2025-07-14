
"use client";

import { useState, useMemo } from "react";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfToday, endOfDay, subDays, addDays, subWeeks, addWeeks, subMonths, addMonths, format } from "date-fns";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Log } from "@/types";
import { useLogs } from "@/hooks/use-logs";
import { LogSummary } from "./log-summary";
import { DailyView } from "./daily-view";
import { WeeklyView } from "./weekly-view";
import { MonthlyView } from "./monthly-view";
import { PageHeader } from "../page-header";

type View = "daily" | "weekly" | "monthly";

export function InsightsPageClient() {
  const [view, setView] = useState<View>("monthly");
  const [currentDate, setCurrentDate] = useState(startOfToday());
  const { logs, loading } = useLogs();

  const { dateRange, visibleLogs, title } = useMemo(() => {
    let start, end, title;
    if (view === "daily") {
      start = startOfToday();
      end = endOfDay(currentDate);
      title = format(currentDate, "MMMM d, yyyy");
    } else if (view === "weekly") {
      start = startOfWeek(currentDate);
      end = endOfWeek(currentDate);
      const startFormat = format(start, "MMM d");
      const endFormat = format(end, "MMM d, yyyy");
      title = `${startFormat} - ${endFormat}`;
    } else { // monthly
      start = startOfMonth(currentDate);
      end = endOfMonth(currentDate);
      title = format(currentDate, "MMMM yyyy");
    }

    const visibleLogs = logs.filter(log => {
      const logDate = log.timestamp;
      const logTime = logDate.getTime();
      return logTime >= start.getTime() && logTime <= end.getTime();
    });

    return { dateRange: { start, end }, visibleLogs, title };
  }, [view, currentDate, logs]);

  const handlePrev = () => {
    if (view === 'daily') setCurrentDate(prev => subDays(prev, 1));
    if (view === 'weekly') setCurrentDate(prev => subWeeks(prev, 1));
    if (view === 'monthly') setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNext = () => {
    if (view === 'daily') setCurrentDate(prev => addDays(prev, 1));
    if (view === 'weekly') setCurrentDate(prev => addWeeks(prev, 1));
    if (view === 'monthly') setCurrentDate(prev => addMonths(prev, 1));
  };
  
  const handleViewChange = (newView: View | null) => {
    if (newView) {
      setView(newView);
      // When switching views, reset date to today to avoid confusion
      setCurrentDate(startOfToday());
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tracking & Insights"
        description="Visualize your journey and discover patterns over time."
      />

      <LogSummary logs={visibleLogs} loading={loading} view={view} />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <ToggleGroup type="single" value={view} onValueChange={handleViewChange}>
          <ToggleGroupItem value="daily" aria-label="Daily view">Daily</ToggleGroupItem>
          <ToggleGroupItem value="weekly" aria-label="Weekly view">Weekly</ToggleGroupItem>
          <ToggleGroupItem value="monthly" aria-label="Monthly view">Monthly</ToggleGroupItem>
        </ToggleGroup>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold w-48 text-center">{title}</span>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        {view === 'daily' && <DailyView logs={visibleLogs} loading={loading} />}
        {view === 'weekly' && <WeeklyView logs={visibleLogs} dateRange={dateRange} loading={loading} />}
        {view === 'monthly' && <MonthlyView logs={visibleLogs} dateRange={dateRange} loading={loading} />}
      </div>
    </div>
  );
}
