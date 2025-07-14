
"use client";

import { Calendar } from "@/components/ui/calendar";
import { useLogs } from "@/hooks/use-logs";
import { DayProps } from "react-day-picker";

export function LogCalendar({ 
  onDateSelect, 
  selectedDate, 
  month,
  onMonthChange
}: { 
  onDateSelect: (date: Date) => void, 
  selectedDate: Date, 
  month: Date,
  onMonthChange: (month: Date) => void
}) {
  const { logs, loading } = useLogs();

  const logDays = logs.map((log) => log.timestamp);

  const CustomDay = (props: DayProps) => {
    const isLogged = logDays.some(logDate => 
      logDate.getDate() === props.date.getDate() &&
      logDate.getMonth() === props.date.getMonth() &&
      logDate.getFullYear() === props.date.getFullYear()
    );

    return (
      <div className="relative">
        {props.children}
        {isLogged && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary"></div>
        )}
      </div>
    );
  };


  return (
    <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(day) => day && onDateSelect(day)}
          month={month}
          onMonthChange={onMonthChange}
          showOutsideDays
          className="p-0"
          components={{
            Day: CustomDay,
          }}
          disabled={loading}
        />
    </div>
  );
}
