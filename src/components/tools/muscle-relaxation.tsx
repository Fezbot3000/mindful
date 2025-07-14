"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogs } from "@/hooks/use-logs";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Zap, Play, Pause, RotateCcw, CheckCircle } from "lucide-react";

const muscleGroups = [
  {
    name: "Hands and Forearms",
    instruction: "Make tight fists with both hands",
    release: "Let your hands open and relax completely",
    duration: 5,
    color: "text-blue-500"
  },
  {
    name: "Upper Arms",
    instruction: "Bend your elbows and tense your biceps",
    release: "Lower your arms and let them hang loosely",
    duration: 5,
    color: "text-green-500"
  },
  {
    name: "Shoulders",
    instruction: "Raise your shoulders up toward your ears",
    release: "Drop your shoulders down and back",
    duration: 5,
    color: "text-purple-500"
  },
  {
    name: "Face and Jaw",
    instruction: "Scrunch your face and clench your jaw",
    release: "Let your face go completely slack",
    duration: 5,
    color: "text-orange-500"
  },
  {
    name: "Neck",
    instruction: "Gently press your head back",
    release: "Bring your head to a neutral position",
    duration: 5,
    color: "text-red-500"
  },
  {
    name: "Chest",
    instruction: "Take a deep breath and hold it",
    release: "Exhale slowly and breathe naturally",
    duration: 5,
    color: "text-cyan-500"
  },
  {
    name: "Abdomen",
    instruction: "Tighten your stomach muscles",
    release: "Let your belly be soft and relaxed",
    duration: 5,
    color: "text-yellow-500"
  },
  {
    name: "Upper Legs",
    instruction: "Tense your thigh muscles",
    release: "Let your thighs rest heavily",
    duration: 5,
    color: "text-pink-500"
  },
  {
    name: "Lower Legs",
    instruction: "Point your toes and tense your calves",
    release: "Let your feet rest naturally",
    duration: 5,
    color: "text-indigo-500"
  }
];

type Phase = 'instruction' | 'tense' | 'release' | 'rest';

export function MuscleRelaxation() {
  const [isActive, setIsActive] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(0);
  const [phase, setPhase] = useState<Phase>('instruction');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [intensityBefore, setIntensityBefore] = useState(5);
  const [intensityAfter, setIntensityAfter] = useState(5);
  const [showRating, setShowRating] = useState(false);

  const { addLog } = useLogs();
  const { toast } = useToast();

  const currentMuscleGroup = muscleGroups[currentGroup];
  const progress = ((currentGroup + (phase === 'rest' ? 1 : 0)) / muscleGroups.length) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handlePhaseComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentGroup(0);
    setPhase('instruction');
    setIsComplete(false);
    setTimeLeft(0);
    setShowRating(false);
  };

  const handlePhaseComplete = () => {
    switch (phase) {
      case 'instruction':
        setPhase('tense');
        setTimeLeft(currentMuscleGroup.duration);
        break;
      case 'tense':
        setPhase('release');
        setTimeLeft(currentMuscleGroup.duration);
        break;
      case 'release':
        setPhase('rest');
        setTimeLeft(3); // 3 seconds rest
        break;
      case 'rest':
        if (currentGroup + 1 < muscleGroups.length) {
          setCurrentGroup(prev => prev + 1);
          setPhase('instruction');
          setTimeLeft(0);
        } else {
          handleComplete();
        }
        break;
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    setIsComplete(true);
    setShowRating(true);
  };

  const handleRatingSubmit = async () => {
    try {
      const improvement = intensityBefore - intensityAfter;
      await addLog({
        category: "Accomplished",
        intensity: Math.max(1, intensityAfter),
        description: `Completed Progressive Muscle Relaxation. Tension reduced from ${intensityBefore}/10 to ${intensityAfter}/10.`
      });
      toast({ 
        title: "Relaxation Complete!", 
        description: `Great job! Your tension level ${improvement > 0 ? 'decreased' : 'was recorded'}.` 
      });
      setShowRating(false);
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Failed to save completion log." 
      });
    }
  };

  const handleStop = () => {
    setIsActive(false);
    setCurrentGroup(0);
    setPhase('instruction');
    setIsComplete(false);
    setTimeLeft(0);
    setShowRating(false);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'instruction':
        return `Get ready to tense your ${currentMuscleGroup.name.toLowerCase()}`;
      case 'tense':
        return currentMuscleGroup.instruction;
      case 'release':
        return currentMuscleGroup.release;
      case 'rest':
        return "Rest and notice the difference";
      default:
        return "";
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'instruction':
        return "text-blue-500";
      case 'tense':
        return "text-red-500";
      case 'release':
        return "text-green-500";
      case 'rest':
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Progressive Muscle Relaxation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isActive && !isComplete && (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              This exercise helps reduce physical tension by systematically tensing and releasing muscle groups.
              Each muscle group will be tensed for 5 seconds, then released.
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Current tension level (1-10):</label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensityBefore}
                onChange={(e) => setIntensityBefore(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-muted-foreground">{intensityBefore}/10</span>
            </div>
            <Button onClick={handleStart} size="lg" className="w-full">
              Start Relaxation Exercise
            </Button>
          </div>
        )}

        {isActive && !isComplete && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {currentGroup + 1}/{muscleGroups.length} muscle groups
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentGroup}-${phase}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-6"
              >
                <div className="space-y-2">
                  <h3 className={`text-2xl font-semibold ${currentMuscleGroup.color}`}>
                    {currentMuscleGroup.name}
                  </h3>
                  <p className={`text-lg ${getPhaseColor()}`}>
                    {getPhaseInstruction()}
                  </p>
                  {phase !== 'instruction' && (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-3xl font-mono">{timeLeft}s</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {phase === 'instruction' && (
                    <Button onClick={handlePhaseComplete} size="lg" className="w-full">
                      Ready - Start Tensing
                    </Button>
                  )}
                  
                  {phase === 'tense' && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-red-600 dark:text-red-400 font-medium">
                        Hold the tension... breathe normally
                      </p>
                    </div>
                  )}
                  
                  {phase === 'release' && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-green-600 dark:text-green-400 font-medium">
                        Release and relax... feel the difference
                      </p>
                    </div>
                  )}
                  
                  {phase === 'rest' && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Notice the contrast between tension and relaxation
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center">
              <Button variant="outline" onClick={handleStop}>
                Stop Exercise
              </Button>
            </div>
          </div>
        )}

        {isComplete && showRating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold">Exercise Complete!</h3>
            <p className="text-muted-foreground">
              You've completed the full Progressive Muscle Relaxation sequence.
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Current tension level (1-10):</label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensityAfter}
                onChange={(e) => setIntensityAfter(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-muted-foreground">{intensityAfter}/10</span>
            </div>
            <Button onClick={handleRatingSubmit} className="w-full">
              Save Results
            </Button>
          </motion.div>
        )}

        {isComplete && !showRating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold">Results Saved!</h3>
            <p className="text-muted-foreground">
              Your relaxation session has been logged.
            </p>
            <Button onClick={handleStart} className="w-full">
              Start Another Session
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
} 