"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateLog } from "@/lib/data";
import { LogCategory, Log } from "@/types";
import { Loader2 } from "lucide-react";
import { useLogs } from "@/hooks/use-logs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const logSchema = z.object({
  category: z.enum(["Health Fear", "Intrusive Thought", "Compulsion", "Schema Trigger", "Accomplished", "Journal Reflection"]),
  intensity: z.number().min(1).max(10),
  description: z.string().optional(),
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

const intensityLabels: { [key: number]: string } = {
    1: "Mild", 4: "Moderate", 7: "Intense", 10: "Overwhelming"
};

interface EditLogDialogProps {
  children: React.ReactNode;
  log: Log;
  onLogUpdated: (updatedLog: Log) => void;
}

export function EditLogDialog({ children, log, onLogUpdated }: EditLogDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { setLogs } = useLogs();
  
  const form = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      category: log.category,
      intensity: log.intensity,
      description: log.description || "",
    },
  });

  const watchedCategory = form.watch("category");
  const watchedIntensity = form.watch("intensity");

  const onSubmit = async (data: LogFormValues) => {
    setLoading(true);
    try {
      const updatedLog = await updateLog(log.id, {
        category: data.category as LogCategory,
        intensity: data.intensity,
        description: data.description,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
          
          <div className="space-y-2">
            <Label htmlFor="intensity">Intensity ({watchedIntensity})</Label>
            <Slider
                id="intensity"
                min={1}
                max={10}
                step={1}
                value={[form.getValues("intensity")]}
                onValueChange={(value) => form.setValue("intensity", value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
                {Object.entries(intensityLabels).map(([key, label]) => (
                    <span key={key}>{label}</span>
                ))}
            </div>
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