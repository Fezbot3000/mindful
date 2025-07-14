
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
import { addLog } from "@/lib/data";
import { LogCategory } from "@/types";
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
    { name: "Intrusive Thought", colorClass: "border-orange-500 focus-visible:ring-orange-500" },
    { name: "Compulsion", colorClass: "border-yellow-500 focus-visible:ring-yellow-500" },
    { name: "Schema Trigger", colorClass: "border-purple-500 focus-visible:ring-purple-500" },
    { name: "Accomplished", colorClass: "border-green-500 focus-visible:ring-green-500" },
    { name: "Journal Reflection", colorClass: "border-blue-500 focus-visible:ring-blue-500" },
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

export function QuickLogDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { addLog: addLogToState } = useLogs();
  
  const form = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      category: "Health Fear",
      intensity: 5,
      description: "",
    },
  });

  const watchedCategory = form.watch("category");
  const watchedIntensity = form.watch("intensity");

  const onSubmit = async (data: LogFormValues) => {
    setLoading(true);
    try {
      const newLog = await addLog({
        category: data.category as LogCategory,
        intensity: data.intensity,
        description: data.description,
      });
      addLogToState(newLog);
      toast({ title: "Log Saved!", description: "Great tracking! You're building resilience." });
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save log. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Now</DialogTitle>
          <DialogDescription>
            Quickly capture what you're experiencing. It's okay to be brief.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <RadioGroup
              defaultValue={form.getValues("category")}
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
          <div className="space-y-3">
            <Label htmlFor="intensity">Intensity ({watchedIntensity})</Label>
            <Slider
                id="intensity"
                min={1}
                max={10}
                step={1}
                defaultValue={[form.getValues("intensity")]}
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
              Save Log
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
