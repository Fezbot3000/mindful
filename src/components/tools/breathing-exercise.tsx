
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

// Generate a calming melody using Web Audio API
const createCalmingMelody = async () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Resume audio context if it's suspended (required by many browsers)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    // Create oscillator and gain node for melody
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Use a soft sine wave
    oscillator.type = 'sine';
    
    // Set volume
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    
    // Define a simple, calming melody (frequencies in Hz)
    // Based on C major pentatonic scale for a peaceful sound
    const melody = [
      261.63, // C4
      293.66, // D4
      329.63, // E4
      392.00, // G4
      440.00, // A4
      392.00, // G4
      329.63, // E4
      293.66, // D4
    ];
    
    // Note duration (in seconds)
    const noteDuration = 1.5;
    const totalMelodyDuration = melody.length * noteDuration;
    
    // Schedule the melody to play and repeat
    const scheduleNote = (frequency: number, startTime: number) => {
      oscillator.frequency.setValueAtTime(frequency, startTime);
      
      // Add a gentle fade in/out for each note
      gainNode.gain.setValueAtTime(0.1, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0.1, startTime + noteDuration - 0.1);
    };
    
    // Schedule the initial melody
    let currentTime = audioContext.currentTime;
    melody.forEach((frequency, index) => {
      scheduleNote(frequency, currentTime + (index * noteDuration));
    });
    
    // Create a function to reschedule the melody for looping
    const rescheduleInterval = setInterval(() => {
      currentTime += totalMelodyDuration;
      melody.forEach((frequency, index) => {
        scheduleNote(frequency, currentTime + (index * noteDuration));
      });
    }, totalMelodyDuration * 1000);
    
    return { 
      audioContext, 
      oscillators: [oscillator], 
      gainNode,
      rescheduleInterval
    };
  } catch (error) {
    console.error('Error creating audio context:', error);
    return null;
  }
};

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
  const audioContextRef = useRef<{
    audioContext: AudioContext;
    oscillators: OscillatorNode[];
    gainNode: GainNode;
    rescheduleInterval?: NodeJS.Timeout;
  } | null>(null);
  
  const stage = stages[stageIndex];

  useEffect(() => {
    // Cleanup audio context on unmount
    return () => {
      if (audioContextRef.current) {
        try {
          if (audioContextRef.current.rescheduleInterval) {
            clearInterval(audioContextRef.current.rescheduleInterval);
          }
          audioContextRef.current.oscillators.forEach((osc: OscillatorNode) => osc.stop());
          audioContextRef.current.audioContext.close();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
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
    
    // Stop audio if playing
    if (audioContextRef.current) {
      try {
        if (audioContextRef.current.rescheduleInterval) {
          clearInterval(audioContextRef.current.rescheduleInterval);
        }
        audioContextRef.current.oscillators.forEach((osc: OscillatorNode) => osc.stop());
        audioContextRef.current.audioContext.close();
        audioContextRef.current = null;
      } catch (e) {
        console.error("Error stopping audio:", e);
      }
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
    if (isMusicPlaying) {
      // Stop the current audio
      if (audioContextRef.current) {
        try {
          if (audioContextRef.current.rescheduleInterval) {
            clearInterval(audioContextRef.current.rescheduleInterval);
          }
          audioContextRef.current.oscillators.forEach((osc: OscillatorNode) => osc.stop());
          audioContextRef.current.audioContext.close();
          audioContextRef.current = null;
        } catch (e) {
          console.error("Error stopping audio:", e);
        }
      }
      setIsMusicPlaying(false);
    } else {
      // Start new audio
      try {
        const audioSetup = await createCalmingMelody();
        if (audioSetup) {
          audioContextRef.current = audioSetup;
          audioSetup.oscillators.forEach((osc: OscillatorNode) => osc.start());
          setIsMusicPlaying(true);
          toast({ 
            title: "Calming Melody Started", 
            description: "A peaceful melody is now playing. Adjust your device volume if needed." 
          });
        } else {
          throw new Error("Could not create audio context");
        }
      } catch (e: any) {
        console.error("Audio play failed:", e);
        toast({ 
          variant: "destructive", 
          title: "Audio Error", 
          description: "Could not play calming melody. This may be due to browser restrictions." 
        });
        setIsMusicPlaying(false);
      }
    }
  };


  const progress = (totalTime / TOTAL_DURATION_SECONDS) * 100;
  const stageProgress = ((stage.duration - countdown + 1) / stage.duration) * 100;
  
  return (
    <div className="layout-flex layout-flex-col layout-items-center layout-justify-center p-token-4 space-token-6 md:space-token-8 rounded-token-lg bg-accent/20 layout-relative layout-overflow-hidden min-h-[400px] max-h-[80vh]">
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
                className="layout-absolute p-token-2 text-center text-xs md:text-sm bg-background/80 backdrop-blur-sm rounded-token-lg shadow-md border z-20 max-w-[90%] top-4 md:top-8"
            >
                {currentPrompt}
            </motion.div>
        )}
       </AnimatePresence>

      <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 max-w-[min(80vw,80vh)] max-h-[min(80vw,80vh)]">
        <div 
             className="layout-absolute inset-0 rounded-token-full bg-primary/20 transition-transform duration-1000 ease-linear"
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
        <div className="layout-relative rounded-token-full bg-primary/60 layout-flex layout-items-center layout-justify-center w-full h-full">
            <div className="text-center text-primary-foreground">
                <p className="font-bold text-lg md:text-2xl">
                    {isActive ? stage.name : "Start"}
                </p>
                {isActive && (
                    <p className="font-mono mt-2 text-4xl md:text-5xl">{countdown}</p>
                )}
            </div>
        </div>
      </div>
      
       <div className="w-full max-w-sm space-y-2 z-10">
         <Button onClick={() => (isActive ? handleStop() : handleStart())} size="lg" className="w-full">
            {isActive ? "Stop" : "Start Exercise"}
         </Button>
         <div className="h-component-xs w-full bg-muted rounded-token-full layout-overflow-hidden">
            <div className="h-full bg-primary transition-all duration-1000 ease-linear" style={{ width: `${progress}%`}} />
         </div>
         <p className="text-center text-sm text-muted-foreground">{TOTAL_DURATION_MINUTES} Minute Session</p>
      </div>

      <div className="flex justify-center space-x-2 md:space-x-4 z-10">
        <p className="text-xs md:text-sm text-muted-foreground">In: {stages[0].duration}s</p>
        <p className="text-xs md:text-sm text-muted-foreground">Hold: {stages[1].duration}s</p>
        <p className="text-xs md:text-sm text-muted-foreground">Out: {stages[2].duration}s</p>
      </div>
    </div>
  );
}
