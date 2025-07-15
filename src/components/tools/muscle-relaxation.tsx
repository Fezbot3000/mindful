'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap, CheckCircle } from 'lucide-react';

const muscleGroups = [
  {
    name: "Feet",
    instruction: "Curl your toes tightly, feeling the tension in your feet",
    release: "Relax your feet, letting your toes uncurl naturally"
  },
  {
    name: "Calves",
    instruction: "Point your toes toward your face, tensing your calf muscles",
    release: "Let your legs rest comfortably, feeling the relaxation in your calves"
  },
  {
    name: "Thighs",
    instruction: "Squeeze your thigh muscles tightly, pressing your knees together",
    release: "Release the tension, allowing your thighs to rest heavily"
  },
  {
    name: "Hands",
    instruction: "Make tight fists with both hands, feeling the tension in your fingers",
    release: "Open your hands slowly, letting your fingers rest naturally"
  },
  {
    name: "Arms",
    instruction: "Bend your arms and tense your biceps, making them as hard as rocks",
    release: "Lower your arms, feeling the heaviness and relaxation"
  },
  {
    name: "Shoulders",
    instruction: "Lift your shoulders up toward your ears, holding the tension",
    release: "Drop your shoulders, feeling the weight melt away"
  },
  {
    name: "Face",
    instruction: "Scrunch up your entire face - eyes, forehead, mouth, and jaw",
    release: "Let your face completely relax, smoothing out all the muscles"
  }
];

const PHASE_DURATIONS = {
  instruction: 3000, // 3 seconds to read instruction
  tense: 5000,       // 5 seconds of tension
  release: 10000,    // 10 seconds of relaxation
  rest: 2000         // 2 seconds of rest
};

export function MuscleRelaxation() {
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [phase, setPhase] = useState<'instruction' | 'tense' | 'release' | 'rest'>('instruction');
  const [timeRemaining, setTimeRemaining] = useState(PHASE_DURATIONS.instruction);
  const [intensityBefore, setIntensityBefore] = useState(5);
  const [intensityAfter, setIntensityAfter] = useState(5);

  const progress = isComplete ? 100 : (currentGroupIndex / muscleGroups.length) * 100;
  const currentGroup = muscleGroups[currentGroupIndex];

  const handleStart = () => {
    setIsActive(true);
    setIsComplete(false);
    setCurrentGroupIndex(0);
    setPhase('instruction');
    setTimeRemaining(PHASE_DURATIONS.instruction);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsComplete(false);
    setCurrentGroupIndex(0);
    setPhase('instruction');
  };

  const moveToNextPhase = useCallback(() => {
    if (phase === 'instruction') {
      setPhase('tense');
      setTimeRemaining(PHASE_DURATIONS.tense);
    } else if (phase === 'tense') {
      setPhase('release');
      setTimeRemaining(PHASE_DURATIONS.release);
    } else if (phase === 'release') {
      setPhase('rest');
      setTimeRemaining(PHASE_DURATIONS.rest);
    } else if (phase === 'rest') {
      if (currentGroupIndex < muscleGroups.length - 1) {
        setCurrentGroupIndex(prev => prev + 1);
        setPhase('instruction');
        setTimeRemaining(PHASE_DURATIONS.instruction);
      } else {
        // Exercise complete
        setIsActive(false);
        setIsComplete(true);
      }
    }
  }, [phase, currentGroupIndex]);

  const handlePhaseComplete = () => {
    if (phase === 'instruction') {
      moveToNextPhase();
    }
  };

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 100) {
          moveToNextPhase();
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isActive, moveToNextPhase]);

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    return `${seconds}s`;
  };

  const getPhaseProgress = () => {
    const totalDuration = PHASE_DURATIONS[phase];
    return ((totalDuration - timeRemaining) / totalDuration) * 100;
  };

  if (isComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center p-token-8">
          <CheckCircle className="w-icon-2xl h-icon-2xl text-secondary mx-auto mb-token-4" />
          <h3 className="text-xl font-semibold mb-token-4">Exercise Complete!</h3>
          <p className="text-muted-foreground mb-token-6">
            How do you feel now compared to when you started?
          </p>
          <div className="space-token-4">
            <div>
              <label className="text-sm font-medium">Tension level after exercise (1-10):</label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensityAfter}
                onChange={(e) => setIntensityAfter(parseInt(e.target.value))}
                className="w-full mt-token-2"
              />
              <span className="text-sm text-muted-foreground">{intensityAfter}/10</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Before: {intensityBefore}/10 → After: {intensityAfter}/10</p>
              {intensityAfter < intensityBefore && (
                <p className="text-secondary mt-token-1">Great! You've reduced your tension level.</p>
              )}
            </div>
          </div>
          <Button onClick={handleStart} className="mt-token-6">
            Practice Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="layout-flex layout-items-center gap-token-2">
          <Zap className="icon-lg" />
          Progressive Muscle Relaxation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-token-6">
        {!isActive && !isComplete && (
          <div className="text-center space-token-4">
            <p className="text-muted-foreground">
              This exercise helps reduce physical tension by systematically tensing and releasing muscle groups.
              Each muscle group will be tensed for 5 seconds, then released.
            </p>
            <div className="space-token-2">
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

        {isActive && (
          <div className="space-token-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-token-2">
                {currentGroup.name} ({currentGroupIndex + 1}/{muscleGroups.length})
              </h3>
              <Progress value={progress} className="h-component-xs" />
              <p className="text-sm text-muted-foreground mt-token-2">
                Overall Progress: {Math.round(progress)}%
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentGroupIndex}-${phase}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center space-token-4"
              >
                <div className="text-lg font-medium mb-token-4">
                  {phase === 'instruction' && currentGroup.instruction}
                  {phase === 'tense' && `Hold the tension... (${formatTime(timeRemaining)})`}
                  {phase === 'release' && currentGroup.release}
                  {phase === 'rest' && 'Take a moment to notice the difference...'}
                </div>

                <div className="space-token-4">
                  {phase === 'instruction' && (
                    <Button onClick={handlePhaseComplete} size="lg" className="w-full">
                      Ready - Start Tensing
                    </Button>
                  )}
                  
                  {phase === 'tense' && (
                    <div className="p-token-4 bg-destructive/10 dark:bg-destructive/20 rounded-token-lg">
                      <p className="text-destructive font-medium">
                        Hold the tension... breathe normally
                      </p>
                    </div>
                  )}
                  
                  {phase === 'release' && (
                    <div className="p-token-4 bg-secondary/10 dark:bg-secondary/20 rounded-token-lg">
                      <p className="text-secondary font-medium">
                        Release and relax... feel the difference
                      </p>
                    </div>
                  )}
                  
                  {phase === 'rest' && (
                    <div className="p-token-4 bg-muted/50 dark:bg-muted/20 rounded-token-lg">
                      <p className="text-muted-foreground font-medium">
                        Notice the contrast between tension and relaxation
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="layout-flex layout-justify-center">
              <Button variant="outline" onClick={handleStop}>
                Stop Exercise
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 