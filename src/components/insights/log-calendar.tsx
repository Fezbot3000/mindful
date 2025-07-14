"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLogs } from "@/lib/data";
import { Log } from "@/types";
import { Skeleton } from "../ui/skeleton";
import { DayPicker } from "react-day-picker";

export function LogCalendar() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const logsData = await getLogs();
      setLogs(logsData);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  const logDays = logs.map((log) => log.timestamp.toDate());

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
