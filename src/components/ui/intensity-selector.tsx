"use client";

import { cn } from "@/lib/utils";
import { Button } from "./button";

interface IntensitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const intensityLabels: { [key: number]: string } = {
  1: "Mild",
  4: "Moderate", 
  7: "Intense",
  10: "Overwhelming"
};

export function IntensitySelector({ value, onChange, className }: IntensitySelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((intensity) => (
          <Button
            key={intensity}
            variant={value === intensity ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-10 w-full font-medium transition-all",
              value === intensity 
                ? "bg-primary text-primary-foreground shadow-md scale-105" 
                : "hover:bg-accent hover:text-accent-foreground hover:scale-102"
            )}
            onClick={() => onChange(intensity)}
            type="button"
          >
            {intensity}
          </Button>
        ))}
      </div>
      
      {/* Show label for current selection */}
      <div className="text-center">
        <span className="text-sm font-medium text-foreground">
          {value}/10 - {intensityLabels[value] || 
            (value <= 2 ? "Mild" : 
             value <= 5 ? "Moderate" : 
             value <= 8 ? "Intense" : "Overwhelming")}
        </span>
      </div>
      
      {/* Legend for reference */}
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        {Object.entries(intensityLabels).map(([key, label]) => (
          <span key={key} className="text-center">
            {label}
            <br />
            <span className="font-mono">({key})</span>
          </span>
        ))}
      </div>
    </div>
  );
} 