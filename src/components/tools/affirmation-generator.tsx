"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogs } from "@/hooks/use-logs";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, RefreshCw, Volume2, Star, Plus } from "lucide-react";

const affirmationCategories = {
  safety: [
    "I am safe in this moment",
    "My body knows how to heal and protect itself",
    "I am surrounded by love and support",
    "This feeling will pass, and I will be okay",
    "I choose to trust in my body's wisdom"
  ],
  selfWorth: [
    "I am worthy of love and respect",
    "I am enough, exactly as I am",
    "My worth is not determined by my productivity",
    "I deserve kindness, especially from myself",
    "I am valuable and my feelings matter"
  ],
  control: [
    "I have the power to choose my response",
    "I can handle whatever comes my way",
    "I am in control of my thoughts and actions",
    "I trust my ability to navigate challenges",
    "I am resilient and adaptable"
  ],
  presence: [
    "I am fully present in this moment",
    "I breathe deeply and let go of worry",
    "Right now, I am exactly where I need to be",
    "I release what I cannot control",
    "Peace flows through me with each breath"
  ],
  healing: [
    "My mind and body are healing",
    "I am patient with my healing process",
    "Each day brings new opportunities for growth",
    "I honor my journey and progress",
    "I am becoming stronger and more peaceful"
  ]
};

export function AffirmationGenerator() {
  const [currentAffirmation, setCurrentAffirmation] = useState("");
  const [category, setCategory] = useState<keyof typeof affirmationCategories>("safety");
  const [rating, setRating] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAffirmation, setCustomAffirmation] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const { addLog } = useLogs();
  const { toast } = useToast();

  useEffect(() => {
    generateAffirmation();
  }, []);

  const generateAffirmation = () => {
    const categoryAffirmations = affirmationCategories[category];
    const randomIndex = Math.floor(Math.random() * categoryAffirmations.length);
    setCurrentAffirmation(categoryAffirmations[randomIndex]);
    setRating(0);
    setIsPlaying(false);
  };

  const speakAffirmation = () => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      if (!isPlaying) {
        const utterance = new SpeechSynthesisUtterance(currentAffirmation);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => {
          setIsPlaying(false);
          toast({
            variant: "destructive",
            title: "Speech Error",
            description: "Could not play audio. Please try again."
          });
        };
        
        window.speechSynthesis.speak(utterance);
      } else {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Speech synthesis is not supported in this browser."
      });
    }
  };

  const addToFavorites = () => {
    if (!favorites.includes(currentAffirmation)) {
      setFavorites(prev => [...prev, currentAffirmation]);
      toast({
        title: "Added to Favorites",
        description: "This affirmation has been saved to your favorites."
      });
    }
  };

  const rateAffirmation = async (newRating: number) => {
    setRating(newRating);
    
    if (newRating >= 4) {
      try {
        await addLog({
          category: "Accomplished",
          intensity: Math.max(1, 5 - newRating),
          description: `Used positive affirmation: "${currentAffirmation}" (rated ${newRating}/5)`
        });
        toast({
          title: "Affirmation Logged",
          description: "Your positive affirmation session has been recorded."
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save affirmation log."
        });
      }
    }
  };

  const addCustomAffirmation = () => {
    if (customAffirmation.trim()) {
      // Add to the current category
      affirmationCategories[category].push(customAffirmation.trim());
      setCustomAffirmation("");
      setShowCustomInput(false);
      toast({
        title: "Custom Affirmation Added",
        description: "Your personal affirmation has been added to this category."
      });
    }
  };

  const getCategoryColor = () => {
    const colors = {
      safety: "text-primary",
      selfWorth: "text-secondary",
      control: "text-purple-500",
      presence: "text-accent",
      healing: "text-destructive"
    };
    return colors[category];
  };

  const getCategoryDescription = () => {
    const descriptions = {
      safety: "Affirmations for feeling secure and protected",
      selfWorth: "Affirmations for building self-esteem and confidence",
      control: "Affirmations for empowerment and agency",
      presence: "Affirmations for mindfulness and grounding",
      healing: "Affirmations for recovery and growth"
    };
    return descriptions[category];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Positive Affirmation Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Affirmation Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as keyof typeof affirmationCategories)}
              className="w-full p-2 border rounded-md"
            >
              <option value="safety">Safety & Security</option>
              <option value="selfWorth">Self-Worth & Confidence</option>
              <option value="control">Control & Empowerment</option>
              <option value="presence">Presence & Mindfulness</option>
              <option value="healing">Healing & Growth</option>
            </select>
            <p className="text-sm text-muted-foreground">
              {getCategoryDescription()}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentAffirmation}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4"
            >
              <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-lg">
                <p className={`text-xl font-medium ${getCategoryColor()}`}>
                  "{currentAffirmation}"
                </p>
              </div>

              <div className="flex justify-center space-x-2">
                <Button
                  onClick={speakAffirmation}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Volume2 className="h-4 w-4" />
                  {isPlaying ? "Stop" : "Listen"}
                </Button>
                <Button
                  onClick={addToFavorites}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={favorites.includes(currentAffirmation)}
                >
                  <Star className="h-4 w-4" />
                  {favorites.includes(currentAffirmation) ? "Favorited" : "Favorite"}
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">How much does this resonate with you?</p>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => rateAffirmation(star)}
                      className={`text-2xl transition-colors ${
                        star <= rating ? "text-secondary" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Rated {rating}/5 stars
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center space-x-2">
            <Button onClick={generateAffirmation} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              New Affirmation
            </Button>
            <Button
              onClick={() => setShowCustomInput(!showCustomInput)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Custom
            </Button>
          </div>

          {showCustomInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <input
                type="text"
                value={customAffirmation}
                onChange={(e) => setCustomAffirmation(e.target.value)}
                placeholder="Enter your personal affirmation..."
                className="w-full p-3 border rounded-md"
                onKeyPress={(e) => e.key === 'Enter' && addCustomAffirmation()}
              />
              <div className="flex space-x-2">
                <Button onClick={addCustomAffirmation} size="sm">
                  Add Affirmation
                </Button>
                <Button onClick={() => setShowCustomInput(false)} variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {favorites.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Your Favorite Affirmations:</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {favorites.map((fav, index) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    "{fav}"
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 