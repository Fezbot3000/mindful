
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addLog } from "@/lib/data";
import { LogCategory } from "@/types";
import { Loader2 } from "lucide-react";
import { useLogs } from "@/hooks/use-logs";

const logSchema = z.object({
  category: z.enum(["Intrusive Thought", "Fear", "Compulsion", "Hyper-Fixation"]),
  intensity: z.number().min(1).max(10),
  description: z.string().optional(),
});

type LogFormValues = z.infer<typeof logSchema>;

const categories: LogCategory[] = ["Intrusive Thought", "Fear", "Compulsion", "Hyper-Fixation"];

export function QuickLogDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { addLog: addLogToState } = useLogs();
  
  const form = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      category: "Intrusive Thought",
      intensity: 5,
      description: "",
    },
  });

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
            <Select onValueChange={(value) => form.setValue("category", value as LogCategory)} defaultValue={form.getValues("category")}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Textarea id="description" placeholder="e.g., Worried about a health symptom..." {...form.register("description")} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Log
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
