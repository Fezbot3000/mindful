"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateLog } from "@/lib/data";
import { LogCategory, Log } from "@/types";
import { Loader2 } from "lucide-react";
import { useLogs } from "@/hooks/use-logs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { IntensitySelector } from "@/components/ui/intensity-selector";
import { FeelingsWheelSelector } from "@/components/ui/feelings-wheel-selector";
import { EmotionNode } from "@/lib/feelings-wheel";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const logSchema = z.object({
  category: z.enum(["Health Fear", "Intrusive Thought", "Compulsion", "Schema Trigger", "Accomplished", "Journal Reflection"]),
  intensity: z.number().min(1).max(10),
  description: z.string().optional(),
  emotion: z.string().optional(),
  emotionPath: z.string().optional(),
});

type LogFormValues = z.infer<typeof logSchema>;

const categories: { name: LogCategory, colorClass: string }[] = [
    { name: "Health Fear", colorClass: "border-destructive focus-visible:ring-destructive" },
    { name: "Intrusive Thought", colorClass: "border-accent focus-visible:ring-accent" },
    { name: "Compulsion", colorClass: "border-secondary focus-visible:ring-secondary" },
    { name: "Schema Trigger", colorClass: "border-purple-500 focus-visible:ring-purple-500" },
    { name: "Accomplished", colorClass: "border-primary focus-visible:ring-primary" },
    { name: "Journal Reflection", colorClass: "border-primary focus-visible:ring-primary" },
];

const categoryPrompts: Record<LogCategory, string> = {
    "Health Fear": "e.g., Worried about a headache, thinking it's something serious.",
    "Intrusive Thought": "e.g., Had an unwanted, distressing thought about harming someone.",
    "Compulsion": "e.g., Felt the need to check the locks multiple times.",
    "Schema Trigger": "e.g., A comment from my boss made me feel like a complete failure.",
    "Accomplished": "e.g., Resisted a compulsion or went to an appointment I was anxious about.",
    "Journal Reflection": "A summary of a deeper reflection you just wrote.",
};

interface EditLogDialogProps {
  children: React.ReactNode;
  log: Log;
  onLogUpdated: (updatedLog: Log) => void;
}

export function EditLogDialog({ children, log, onLogUpdated }: EditLogDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionNode | null>(null);
  const [emotionPath, setEmotionPath] = useState<EmotionNode[]>([]);
  const [showFeelingsWheel, setShowFeelingsWheel] = useState(false);
  const { toast } = useToast();
  const { setLogs } = useLogs();
  
  const form = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      category: log.category,
      intensity: log.intensity,
      description: log.description || "",
      emotion: log.emotion || "",
      emotionPath: log.emotionPath || "",
    },
  });

  const watchedCategory = form.watch("category");

  // Initialize emotion state if log has emotion data
  useState(() => {
    if (log.emotion && log.emotionPath) {
      // Create a mock emotion node for display
      const mockEmotion: EmotionNode = {
        id: log.emotion.toLowerCase().replace(/\s+/g, '-'),
        name: log.emotion
      };
      setSelectedEmotion(mockEmotion);
      
      // Parse emotion path back into array
      const pathNames = log.emotionPath.split(' → ');
      const mockPath: EmotionNode[] = pathNames.map(name => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name
      }));
      setEmotionPath(mockPath);
    }
  });

  const handleEmotionSelect = (emotion: EmotionNode, path: EmotionNode[]) => {
    setSelectedEmotion(emotion);
    setEmotionPath(path);
    form.setValue("emotion", emotion.name);
    form.setValue("emotionPath", path.map(e => e.name).join(" → "));
    setShowFeelingsWheel(false);
  };

  const clearEmotion = () => {
    setSelectedEmotion(null);
    setEmotionPath([]);
    form.setValue("emotion", "");
    form.setValue("emotionPath", "");
  };

  const onSubmit = async (data: LogFormValues) => {
    setLoading(true);
    try {
      const updatedLog = await updateLog(log.id, {
        category: data.category as LogCategory,
        intensity: data.intensity,
        description: data.description,
        emotion: data.emotion,
        emotionPath: data.emotionPath,
      });
      
      // Update the logs in the global state
      setLogs(prevLogs => 
        prevLogs.map(l => l.id === log.id ? updatedLog : l)
      );
      
      onLogUpdated(updatedLog);
      toast({ title: "Log Updated!", description: "Your log entry has been successfully updated." });
      setOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update log. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    // Reset to original log data
    form.reset({
      category: log.category,
      intensity: log.intensity,
      description: log.description || "",
      emotion: log.emotion || "",
      emotionPath: log.emotionPath || "",
    });
    
    setShowFeelingsWheel(false);
    
    // Reset emotion state
    if (log.emotion && log.emotionPath) {
      const mockEmotion: EmotionNode = {
        id: log.emotion.toLowerCase().replace(/\s+/g, '-'),
        name: log.emotion
      };
      setSelectedEmotion(mockEmotion);
      
      const pathNames = log.emotionPath.split(' → ');
      const mockPath: EmotionNode[] = pathNames.map(name => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name
      }));
      setEmotionPath(mockPath);
    } else {
      setSelectedEmotion(null);
      setEmotionPath([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      setOpen(open);
      if (!open) resetDialog();
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle>Edit Log Entry</DialogTitle>
          <DialogDescription>
            Update your log entry. The original timestamp will be preserved.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <RadioGroup
              value={form.getValues("category")}
              onValueChange={(value) => form.setValue("category", value as LogCategory)}
              className="grid grid-cols-2 gap-2"
            >
              {categories.map((cat) => (
                <div key={cat.name}>
                    <RadioGroupItem value={cat.name} id={cat.name} className="sr-only" />
                    <Label
                        htmlFor={cat.name}
                        className={cn(
                            "flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm font-medium",
                            watchedCategory === cat.name && cat.colorClass
                        )}
                    >
                        {cat.name}
                    </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <Separator />

          {/* Feelings Wheel Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>How are you feeling? (Optional)</Label>
              {selectedEmotion && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearEmotion}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              )}
            </div>
            
            {selectedEmotion ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {emotionPath.map((emotion, index) => (
                    <div key={emotion.id} className="flex items-center gap-1">
                      {index > 0 && <span className="text-muted-foreground">→</span>}
                      <Badge variant={index === emotionPath.length - 1 ? "default" : "secondary"}>
                        {emotion.name}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFeelingsWheel(true)}
                >
                  Change Emotion
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFeelingsWheel(true)}
                className="w-full"
              >
                Select an Emotion
              </Button>
            )}

            {showFeelingsWheel && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <FeelingsWheelSelector onEmotionSelect={handleEmotionSelect} />
              </div>
            )}
          </div>

          <Separator />

          {/* Intensity Section */}
          <div className="space-y-2">
            <Label htmlFor="intensity">Intensity</Label>
            <IntensitySelector
              value={form.watch("intensity")}
              onChange={(value) => form.setValue("intensity", value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Optional Description</Label>
            <Textarea 
                id="description" 
                placeholder={categoryPrompts[watchedCategory]} 
                {...form.register("description")} 
            />
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 icon-sm animate-spin" />}
              Update Log
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 