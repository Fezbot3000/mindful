
"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import { DayPicker } from "react-day-picker";
import { useLogs } from "@/hooks/use-logs";

export function LogCalendar() {
  const { logs, loading } = useLogs();

  const logDays = logs.map((log) => log.timestamp);

  if (loading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Log Calendar</CardTitle>
            </CardHeader>
            <CardContent>
                <Skeleton className="w-full h-[300px]" />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="multiple"
          selected={logDays}
          showOutsideDays
          className="p-0"
          components={{
            Day: ({ date, displayMonth }) => {
              const isSelected = logDays.some(logDate => 
                logDate.getDate() === date.getDate() &&
                logDate.getMonth() === date.getMonth() &&
                logDate.getFullYear() === date.getFullYear()
              );

              return (
                <div className="relative">
                  <DayPicker.Day date={date} displayMonth={displayMonth} />
                  {isSelected && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  )}
                </div>
              );
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
