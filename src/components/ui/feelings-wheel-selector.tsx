"use client";

import { useState } from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import { feelingsWheel, EmotionNode, findEmotionPath } from "@/lib/feelings-wheel";
import { ChevronLeft, ArrowRight } from "lucide-react";

interface FeelingsWheelSelectorProps {
  onEmotionSelect: (emotion: EmotionNode, path: EmotionNode[]) => void;
  className?: string;
}

export function FeelingsWheelSelector({ onEmotionSelect, className }: FeelingsWheelSelectorProps) {
  const [currentLevel, setCurrentLevel] = useState<EmotionNode[]>(feelingsWheel);
  const [breadcrumbs, setBreadcrumbs] = useState<EmotionNode[]>([]);

  const handleEmotionClick = (emotion: EmotionNode) => {
    if (emotion.children && emotion.children.length > 0) {
      // Navigate deeper
      setBreadcrumbs([...breadcrumbs, emotion]);
      setCurrentLevel(emotion.children);
    } else {
      // Final selection - this is a leaf emotion
      const fullPath = [...breadcrumbs, emotion];
      onEmotionSelect(emotion, fullPath);
    }
  };

  const handleBackClick = () => {
    if (breadcrumbs.length === 0) return;
    
    const newBreadcrumbs = breadcrumbs.slice(0, -1);
    setBreadcrumbs(newBreadcrumbs);
    
    if (newBreadcrumbs.length === 0) {
      setCurrentLevel(feelingsWheel);
    } else {
      const parent = newBreadcrumbs[newBreadcrumbs.length - 1];
      setCurrentLevel(parent.children || []);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      // Root level
      setBreadcrumbs([]);
      setCurrentLevel(feelingsWheel);
    } else {
      const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
      setBreadcrumbs(newBreadcrumbs);
      const parent = newBreadcrumbs[newBreadcrumbs.length - 1];
      setCurrentLevel(parent.children || []);
    }
  };

  const getLevelTitle = () => {
    if (breadcrumbs.length === 0) return "How are you feeling?";
    if (breadcrumbs.length === 1) return `You selected "${breadcrumbs[0].name}" - be more specific:`;
    return `You selected "${breadcrumbs[breadcrumbs.length - 1].name}" - what exactly?`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleBreadcrumbClick(-1)}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Start
          </Button>
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id} className="flex items-center gap-2">
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBreadcrumbClick(index)}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                {crumb.name}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Back button */}
      {breadcrumbs.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackClick}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      )}

      {/* Level title */}
      <h3 className="text-sm font-medium text-foreground">
        {getLevelTitle()}
      </h3>

      {/* Current level emotions */}
      <div className="grid grid-cols-2 gap-2">
        {currentLevel.map((emotion) => (
          <Button
            key={emotion.id}
            variant="outline"
            className={cn(
              "p-3 h-auto text-left justify-start transition-all hover:scale-102",
              emotion.color,
              emotion.children && emotion.children.length > 0 
                ? "border-dashed" 
                : "border-solid hover:bg-primary hover:text-primary-foreground"
            )}
            onClick={() => handleEmotionClick(emotion)}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-medium">{emotion.name}</span>
              {emotion.children && emotion.children.length > 0 && (
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs px-1">
                    {emotion.children.length}
                  </Badge>
                  <ArrowRight className="h-3 w-3" />
                </div>
              )}
            </div>
          </Button>
        ))}
      </div>

      {/* Help text */}
      <p className="text-xs text-muted-foreground">
        {breadcrumbs.length === 0 
          ? "Tap an emotion to explore more specific feelings" 
          : "Tap an emotion to select it, or continue drilling down for more specific options"
        }
      </p>
    </div>
  );
} 