
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LogCalendar } from "./log-calendar";

interface MonthlyViewProps {
  onDateSelect: (date: Date) => void;
  currentDate: Date;
}

export function MonthlyView({ onDateSelect, currentDate }: MonthlyViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Log Calendar</CardTitle>
        <CardDescription>Days with logs are marked. Click a day to see details.</CardDescription>
      </CardHeader>
      <CardContent>
        <LogCalendar onDateSelect={onDateSelect} selectedDate={currentDate} month={currentDate} />
      </CardContent>
    </Card>
  );
}
