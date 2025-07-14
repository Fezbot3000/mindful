
"use client"

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLogs } from "@/hooks/use-logs";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Music, VolumeX } from "lucide-react";

const stages = [
  { name: "Breathe In", duration: 4 },
  { name: "Hold", duration: 7 },
  { name: "Breathe Out", duration: 8 },
];

const minutePrompts = [
    "This simple exercise helps calm your nervous system.",
    "You are training your focus, one breath at a time.",
    "Let each exhale release a little more tension.",
    "You are in control. This feeling is temporary.",
    "Finishing strong. Carry this calm with you."
];

const TOTAL_DURATION_MINUTES = 5;
const TOTAL_DURATION_SECONDS = TOTAL_DURATION_MINUTES * 60;
const MUSIC_URL = "https://storage.googleapis.com/assets.mindful-track.com/ambient-music.mp3";

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [countdown, setCountdown] = useState(stages[0].duration);
  const [totalTime, setTotalTime] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const { addLog } = useLogs();
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const stage = stages[stageIndex];

  useEffect(() => {
    // Initialize audio only on the client
    if (typeof window !== 'undefined' && !audioRef.current) {
        audioRef.current = new Audio(MUSIC_URL);
        audioRef.current.loop = true;
    }
  }, []);

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
    
    // Update prompt every minute
    const minute = Math.floor(totalTime / 60);
    if (totalTime % 60 === 0 && minute < minutePrompts.length) {
        setCurrentPrompt(minutePrompts[minute]);
    }

    if (countdown <= 0) {
      const nextStageIndex = (stageIndex + 1) % stages.length;
      setStageIndex(nextStageIndex);
      setCountdown(stages[nextStageIndex].duration);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown, totalTime, isActive, stageIndex]);


  const handleStart = () => {
    setIsActive(true);
    setStageIndex(0);
    setCountdown(stages[0].duration);
    setTotalTime(0);
    setCurrentPrompt(minutePrompts[0]);
  };

  const handleStop = async (completed = false) => {
    setIsActive(false);
    setCurrentPrompt("");
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    setIsMusicPlaying(false);

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

  const toggleMusic = async () => {
    if (!audioRef.current) return;
  
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      try {
        audioRef.current.load(); // Ensure the audio is loaded before playing
        await audioRef.current.play();
      } catch (e) {
         console.error("Audio play failed:", e);
         toast({ variant: "destructive", title: "Audio Error", description: "Could not play audio. Please try again." });
         setIsMusicPlaying(false); // Make sure state is correct on failure
         return; // Exit if play fails
      }
    }
    setIsMusicPlaying(!isMusicPlaying);
  };


  const progress = (totalTime / TOTAL_DURATION_SECONDS) * 100;
  const stageProgress = ((stage.duration - countdown + 1) / stage.duration) * 100;
  
  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-8 rounded-lg bg-accent/20 h-96 relative overflow-hidden">
       <div className="absolute top-4 right-4 z-20">
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleMusic}
                aria-label="Toggle Music"
                className="text-muted-foreground"
            >
                {isMusicPlaying ? <Music /> : <VolumeX />}
            </Button>
        </div>
        
       <AnimatePresence>
        {isActive && currentPrompt && (
            <motion.div
                key={currentPrompt}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ ease: "easeInOut", duration: 0.5 }}
                className="absolute top-8 p-2 text-center text-sm bg-background/80 backdrop-blur-sm rounded-lg shadow-md border z-20 max-w-[90%]"
            >
                {currentPrompt}
            </motion.div>
        )}
       </AnimatePresence>

      <div className="relative w-48 h-48 flex items-center justify-center">
        <div 
             className="absolute inset-0 rounded-full bg-primary/20 transition-transform duration-1000 ease-linear"
             style={{
                transform: `scale(${isActive ? 1 : 0.5})`,
             }}
        />
        <div 
             className={`absolute inset-0 rounded-full bg-primary/30 origin-bottom`}
             style={{ 
                clipPath: 'circle(50% at 50% 50%)',
                transition: 'transform 1s linear',
                transform: `scaleY(${isActive ? stageProgress / 100 : 0})`
             }} 
        />
        <div className="relative rounded-full bg-primary/60 flex items-center justify-center w-40 h-40">
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
      
       <div className="w-full max-w-sm space-y-2 z-10">
         <Button onClick={() => (isActive ? handleStop() : handleStart())} size="lg" className="w-full">
            {isActive ? "Stop" : "Start Exercise"}
         </Button>
         <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-1000 ease-linear" style={{ width: `${progress}%`}} />
         </div>
         <p className="text-center text-sm text-muted-foreground">{TOTAL_DURATION_MINUTES} Minute Session</p>
      </div>

      <div className="flex justify-center space-x-4 z-10">
        <p className="text-sm text-muted-foreground">In: {stages[0].duration}s</p>
        <p className="text-sm text-muted-foreground">Hold: {stages[1].duration}s</p>
        <p className="text-sm text-muted-foreground">Out: {stages[2].duration}s</p>
      </div>
    </div>
  );
}
