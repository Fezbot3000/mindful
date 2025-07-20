"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogs } from "@/hooks/use-logs";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Hand, Ear, Wind, Smile, CheckCircle } from "lucide-react";

const groundingSteps = [
  {
    count: 5,
    sense: "see",
    icon: Eye,
    prompt: "Name 5 things you can see around you",
    description: "Look around and identify 5 objects in your environment",
    color: "text-primary"
  },
  {
    count: 4,
    sense: "touch",
    icon: Hand,
    prompt: "Name 4 things you can touch",
    description: "Feel 4 different textures or surfaces near you",
    color: "text-secondary"
  },
  {
    count: 3,
    sense: "hear",
    icon: Ear,
    prompt: "Name 3 things you can hear",
    description: "Listen carefully and identify 3 sounds around you",
    color: "text-purple-500"
  },
  {
    count: 2,
    sense: "smell",
    icon: Wind,
    prompt: "Name 2 things you can smell",
    description: "Take a deep breath and notice 2 scents",
    color: "text-accent"
  },
  {
    count: 1,
    sense: "taste",
    icon: Smile,
    prompt: "Name 1 thing you can taste",
    description: "Notice any taste in your mouth right now",
    color: "text-destructive"
  }
];

export function GroundingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [items, setItems] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");

  const { addLog } = useLogs();
  const { toast } = useToast();

  const currentStepData = groundingSteps[currentStep];
  const totalSteps = groundingSteps.reduce((sum, step) => sum + step.count, 0);
  const completedSteps = groundingSteps.slice(0, currentStep).reduce((sum, step) => sum + step.count, 0) + currentItem;
  const progress = (completedSteps / totalSteps) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isComplete && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleNextItem();
    }
    return () => clearInterval(interval);
  }, [isActive, isComplete, timeLeft]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentStep(0);
    setCurrentItem(0);
    setIsComplete(false);
    setItems([]);
    setCurrentInput("");
    setTimeLeft(15);
  };

  const handleNextItem = () => {
    if (currentInput.trim()) {
      setItems(prev => [...prev, currentInput.trim()]);
    }
    setCurrentInput("");

    if (currentItem + 1 < currentStepData.count) {
      setCurrentItem(prev => prev + 1);
      setTimeLeft(15);
    } else {
      // Move to next step
      if (currentStep + 1 < groundingSteps.length) {
        setCurrentStep(prev => prev + 1);
        setCurrentItem(0);
        setTimeLeft(15);
      } else {
        handleComplete();
      }
    }
  };

  const handleComplete = async () => {
    setIsActive(false);
    setIsComplete(true);
    
    try {
      await addLog({
        category: "Accomplished",
        intensity: 3,
        description: "Completed 5-4-3-2-1 grounding exercise to reduce stress and anxiety."
      });
      toast({ 
        title: "Grounding Complete!", 
        description: "Great job staying present. You've successfully grounded yourself." 
      });
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
    setCurrentStep(0);
    setCurrentItem(0);
    setIsComplete(false);
    setItems([]);
    setCurrentInput("");
    setTimeLeft(15);
  };

  const IconComponent = currentStepData?.icon || Eye;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          5-4-3-2-1 Grounding Exercise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isActive && !isComplete && (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              This exercise helps you stay present by engaging all your senses. 
              You'll identify things you can see, touch, hear, smell, and taste.
            </p>
            <Button onClick={handleStart} size="lg" className="w-full">
              Start Grounding Exercise
            </Button>
          </div>
        )}

        {isActive && !isComplete && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedSteps}/{totalSteps} items
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentStep}-${currentItem}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-4"
              >
                <div className="flex flex-col items-center space-y-2">
                  <IconComponent className={`h-12 w-12 ${currentStepData.color}`} />
                  <h3 className="text-xl font-semibold">
                    {currentStepData.prompt}
                  </h3>
                  <p className="text-muted-foreground">
                    {currentStepData.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Item {currentItem + 1} of {currentStepData.count}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl font-mono">{timeLeft}s</span>
                    <span className="text-muted-foreground">remaining</span>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleNextItem()}
                      placeholder={`Something you can ${currentStepData.sense}...`}
                      className="w-full p-3 border rounded-md text-center"
                      autoFocus
                    />
                    <Button onClick={handleNextItem} className="w-full">
                      {currentItem + 1 === currentStepData.count && currentStep + 1 === groundingSteps.length
                        ? "Complete Exercise"
                        : "Next"
                      }
                    </Button>
                  </div>
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

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <CheckCircle className="h-16 w-16 text-secondary mx-auto" />
            <h3 className="text-xl font-semibold">Exercise Complete!</h3>
            <p className="text-muted-foreground">
              You've successfully grounded yourself using all five senses.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Items you identified:</p>
              <div className="text-sm text-muted-foreground space-y-1">
                {items.map((item, index) => (
                  <div key={index}>• {item}</div>
                ))}
              </div>
            </div>
            <Button onClick={handleStart} className="w-full">
              Start Another Session
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
} 