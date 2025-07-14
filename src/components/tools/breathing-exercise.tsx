"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const stages = [
  { name: "Breathe In", duration: 4000 },
  { name: "Hold", duration: 7000 },
  { name: "Breathe Out", duration: 8000 },
];

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setTimeout(() => {
        setStageIndex((prevIndex) => (prevIndex + 1) % stages.length);
      }, stages[stageIndex].duration);
    }
    return () => clearTimeout(timer);
  }, [isActive, stageIndex]);

  const handleToggle = () => {
    if (!isActive) {
      setStageIndex(0);
    }
    setIsActive(!isActive);
  };
  
  const stage = stages[stageIndex];

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-8 rounded-lg bg-accent/20 h-80">
      <div className="relative w-48 h-48">
        <div className={`absolute inset-0 rounded-full bg-primary/20 transition-transform duration-[${stage.duration}ms] ease-in-out ${isActive ? 'scale-100' : 'scale-50'}`} 
             style={{ transitionDuration: `${stage.duration}ms`, transform: isActive && (stage.name === "Breathe In" || stage.name === "Hold") ? 'scale(1)' : 'scale(0.5)' }} />
        <div className="absolute inset-4 rounded-full bg-primary/40" />
        <div className="absolute inset-8 flex items-center justify-center">
            <p className="text-2xl font-bold text-primary-foreground">
                {isActive ? stage.name : "Start"}
            </p>
        </div>
      </div>
      <Button onClick={handleToggle} size="lg">
        {isActive ? "Stop" : "Start Exercise"}
      </Button>
      <div className="flex justify-center space-x-4">
        <p className="text-sm text-muted-foreground">Breathe In: 4s</p>
        <p className="text-sm text-muted-foreground">Hold: 7s</p>
        <p className="text-sm text-muted-foreground">Breathe Out: 8s</p>
      </div>
    </div>
  );
}
