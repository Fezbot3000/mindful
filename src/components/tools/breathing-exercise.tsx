
"use client"

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLogs } from "@/hooks/use-logs";
import { addLog } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Music, VolumeX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [stageStartTime, setStageStartTime] = useState(Date.now());
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const { addLog: addLogToState } = useLogs();
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);
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

  // Smooth animation loop using requestAnimationFrame
  useEffect(() => {
    if (isActive) {
      const animate = () => {
        const now = Date.now();
        const elapsed = (now - stageStartTime) / 1000; // seconds elapsed in current stage
        const progress = Math.min(elapsed / stage.duration, 1); // 0 to 1 progress
        setSmoothProgress(progress);
        
        if (isActive) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, stageStartTime, stage.duration]);

  // Discrete countdown timer (1 second intervals)
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
      setStageStartTime(Date.now()); // Reset animation start time for new stage
      setSmoothProgress(0); // Reset smooth progress
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown, totalTime, isActive, stageIndex]);


  const handleStart = () => {
    const now = Date.now();
    setIsActive(true);
    setStageIndex(0);
    setCountdown(stages[0].duration);
    setTotalTime(0);
    setStageStartTime(now);
    setSmoothProgress(0);
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
        const newLog = await addLog({
            category: "Accomplished",
            intensity: 5, // Default intensity for an accomplishment
            description: `Completed a ${TOTAL_DURATION_MINUTES}-minute guided breathing exercise.`
        });
        addLogToState(newLog);
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
  
  // Calculate water fill percentage based on stage and smooth progress
  const getWaterFillPercentage = () => {
    if (!isActive) {
      return 0;
    }
    
    // Use smooth progress (0 to 1) for fluid animation
    const progressPercent = smoothProgress * 100;
    
    let fillPercentage = 0;
    if (stage.name === "Breathe In") {
      // Fill from 0% to 100% during inhale
      fillPercentage = progressPercent;
    } else if (stage.name === "Hold") {
      // Stay at 100% during hold
      fillPercentage = 100;
    } else { // Breathe Out
      // Empty from 100% to 0% during exhale
      fillPercentage = 100 - progressPercent;
    }
    
    return fillPercentage;
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>5-Minute Guided Breathing</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMusic}
            aria-label="Toggle Music"
            className="text-muted-foreground hover:text-primary"
          >
            {isMusicPlaying ? <Music className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Prompt Display */}
        <AnimatePresence>
          {isActive && currentPrompt && (
            <motion.div
              key={currentPrompt}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
              className="text-center p-4 bg-accent/20 rounded-lg border"
            >
              <p className="text-sm text-muted-foreground">{currentPrompt}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breathing Circle - Water Fill Animation */}
        <div className="flex justify-center py-12">
          <div className="relative">
            {/* Outer circle container */}
            <div 
              className="rounded-full border-4 relative overflow-hidden shadow-lg"
              style={{
                width: '256px',
                height: '256px',
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--primary) / 0.3)',
              }}
            >
                            {(() => {
                const fillPercentage = getWaterFillPercentage();
                return (
                  /* Water fill element */
                  <div 
                    style={{ 
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      height: `${fillPercentage}%`,
                      background: 'linear-gradient(to top, hsl(var(--primary)), hsl(var(--primary)))',
                    }}
                  />
                );
              })()}
              
              {/* Content overlay - stage name and timer */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground z-10">
                <div className="text-center">
                  <p className="font-semibold text-xl md:text-2xl mb-2">
                    {isActive ? stage.name : "Ready"}
                  </p>
                  {isActive && (
                    <p className="font-mono text-4xl md:text-6xl font-bold">
                      {countdown}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <Button 
            onClick={() => (isActive ? handleStop() : handleStart())} 
            size="lg" 
            className="w-full"
          >
            {isActive ? "Stop Exercise" : "Start Exercise"}
          </Button>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-linear" 
                style={{ width: `${progress}%`}} 
              />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {TOTAL_DURATION_MINUTES} Minute Session
            </p>
          </div>
        </div>

        {/* Breathing Pattern Info */}
        <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
          <span>In: {stages[0].duration}s</span>
          <span>Hold: {stages[1].duration}s</span>
          <span>Out: {stages[2].duration}s</span>
        </div>
      </CardContent>
    </Card>
  );
}
