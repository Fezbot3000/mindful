
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
  category: z.enum(["Anxious", "Avoided", "Accomplished", "Ruminating"]),
  intensity: z.number().min(1).max(10),
  description: z.string().optional(),
});

type LogFormValues = z.infer<typeof logSchema>;

const categories: LogCategory[] = ["Anxious", "Avoided", "Accomplished", "Ruminating"];

const categoryPrompts: Record<LogCategory, string> = {
    Anxious: "e.g., Felt worried about the upcoming meeting.",
    Avoided: "e.g., Skipped going to the grocery store.",
    Accomplished: "e.g., Finished a project I was procrastinating on.",
    Ruminating: "e.g., Couldn't stop thinking about a past mistake.",
};

export function QuickLogDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { addLog: addLogToState } = useLogs();
  
  const form = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      category: "Anxious",
      intensity: 5,
      description: "",
    },
  });

  const watchedCategory = form.watch("category");

  const onSubmit = async (data: LogFormValues) => {
    setLoading(true);
    try {
      const newLog = await addLog({
        category: data.category as LogCategory,
        intensity: data.intensity,
        description: data.description,
      });
      addLogToState(newLog);
      toast({ title: "Log Saved", description: "Your entry has been successfully saved." });
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
            <Label htmlFor="category">Category</Label>
            <RadioGroup
              defaultValue={form.getValues("category")}
              onValueChange={(value) => form.setValue("category", value as LogCategory)}
              className="grid grid-cols-2 gap-2"
            >
              {categories.map((cat) => (
                <div key={cat}>
                    <RadioGroupItem value={cat} id={cat} className="sr-only" />
                    <Label
                        htmlFor={cat}
                        className={cn(
                            "flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                            watchedCategory === cat && "border-primary"
                        )}
                    >
                        {cat}
                    </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="intensity">Intensity ({form.watch('intensity')})</Label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">1</span>
                <Slider
                    id="intensity"
                    min={1}
                    max={10}
                    step={1}
                    defaultValue={[form.getValues("intensity")]}
                    onValueChange={(value) => form.setValue("intensity", value[0])}
                />
              <span className="text-sm text-muted-foreground">10</span>
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
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Log
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
