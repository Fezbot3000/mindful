
"use client"

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLogs } from "@/hooks/use-logs";
import { useToast } from "@/hooks/use-toast";

const stages = [
  { name: "Breathe In", duration: 4 },
  { name: "Hold", duration: 7 },
  { name: "Breathe Out", duration: 8 },
];

const TOTAL_DURATION_MINUTES = 5;
const TOTAL_DURATION_SECONDS = TOTAL_DURATION_MINUTES * 60;

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [countdown, setCountdown] = useState(stages[0].duration);
  const [totalTime, setTotalTime] = useState(0);

  const { addLog } = useLogs();
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stage = stages[stageIndex];
  const stageDurationMs = stage.duration * 1000;

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => prev - 1);
        setTotalTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);


  useEffect(() => {
     if (!isActive) return;

    if (totalTime >= TOTAL_DURATION_SECONDS) {
        handleStop(true);
        return;
    }

    if (countdown <= 0) {
      const nextStageIndex = (stageIndex + 1) % stages.length;
      setStageIndex(nextStageIndex);
      setCountdown(stages[nextStageIndex].duration);
    }
  }, [countdown, totalTime, isActive, stageIndex]);


  const handleStart = () => {
    setIsActive(true);
    setStageIndex(0);
    setCountdown(stages[0].duration);
    setTotalTime(0);
  };

  const handleStop = async (completed = false) => {
    setIsActive(false);
    if (completed) {
      try {
        await addLog({
            category: "Accomplished",
            intensity: 5, // Default intensity for an accomplishment
            description: `Completed a ${TOTAL_DURATION_MINUTES}-minute guided breathing exercise.`
        });
        toast({ title: "Exercise Complete!", description: "Great job! A log has been saved." });
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to save completion log." });
      }
    }
  };

  const progress = (totalTime / TOTAL_DURATION_SECONDS) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-8 rounded-lg bg-accent/20 h-96">
      <div className="relative w-48 h-48">
        <div className={`absolute inset-0 rounded-full bg-primary/20`} 
             style={{ 
                transition: `transform ${stageDurationMs}ms linear`, 
                transform: isActive && (stage.name === "Breathe In" || stage.name === "Hold") ? 'scale(1)' : 'scale(0.5)'
             }} 
        />
        <div className="absolute inset-4 rounded-full bg-primary/40 flex items-center justify-center">
            <div className="text-center text-primary-foreground">
                <p className="text-2xl font-bold">
                    {isActive ? stage.name : "Start"}
                </p>
                {isActive && (
                    <p className="text-5xl font-mono mt-2">{countdown}</p>
                )}
            </div>
        </div>
      </div>
      
       <div className="w-full max-w-sm space-y-2">
         <Button onClick={() => (isActive ? handleStop() : handleStart())} size="lg" className="w-full">
            {isActive ? "Stop" : "Start Exercise"}
         </Button>
         <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-1000 ease-linear" style={{ width: `${progress}%`}} />
         </div>
         <p className="text-center text-sm text-muted-foreground">{TOTAL_DURATION_MINUTES} Minute Session</p>
      </div>


      <div className="flex justify-center space-x-4">
        <p className="text-sm text-muted-foreground">In: {stages[0].duration}s</p>
        <p className="text-sm text-muted-foreground">Hold: {stages[1].duration}s</p>
        <p className="text-sm text-muted-foreground">Out: {stages[2].duration}s</p>
      </div>
    </div>
  );
}

