"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mic, MicOff, Edit } from "lucide-react";
import { updateJournalEntry } from "@/lib/data";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "../ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Badge } from "../ui/badge";
import { JournalEntry } from "@/types";

const entrySchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  content: z.string().min(1, { message: "Content is required." }),
  intensity: z.number().min(0).max(10).optional(),
  trigger: z.string().optional(),
  evidenceFor: z.string().optional(),
  evidenceAgainst: z.string().optional(),
  alternativeView: z.string().optional(),
  schemaLink: z.string().optional(),
});

type EntryFormValues = z.infer<typeof entrySchema>;

interface EditJournalEntryDialogProps {
  children: React.ReactNode;
  entry: JournalEntry;
  onEntryUpdated: (updatedEntry: JournalEntry) => void;
}

const triggerChips = ["Health Symptom", "Work Stress", "Relationship Issue", "Intrusive Thought", "Family Memory/Loss"];
const intensityLabels: { [key: number]: string } = {
    1: "Very Low", 4: "Medium", 7: "High", 10: "Very Intense"
};

export function EditJournalEntryDialog({ children, entry, onEntryUpdated }: EditJournalEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: entry.title,
      content: entry.content,
      intensity: entry.intensity || 5,
      trigger: entry.trigger || "",
      evidenceFor: entry.evidenceFor || "",
      evidenceAgainst: entry.evidenceAgainst || "",
      alternativeView: entry.alternativeView || "",
      schemaLink: entry.schemaLink || "",
    },
  });

  const watchedIntensity = form.watch("intensity");

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            const currentContent = form.getValues("content");
            form.setValue("content", (currentContent ? currentContent + ' ' : '') + finalTranscript);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            toast({ variant: "destructive", title: "Voice Error", description: "Speech recognition failed. Please try again." });
            setIsListening(false);
        };
        
        recognition.onend = () => {
             if (isListening) {
                recognition.start();
            }
        };
    }
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };
  }, [isListening, form, toast]);

  const toggleListening = () => {
      if (!recognitionRef.current) {
          toast({ variant: "destructive", title: "Unsupported", description: "Your browser does not support voice recognition." });
          return;
      }
      if (isListening) {
          recognitionRef.current.stop();
          setIsListening(false);
      } else {
          recognitionRef.current.start();
          setIsListening(true);
      }
  };

  const handleChipClick = (chip: string) => {
    const currentTrigger = form.getValues("trigger");
    form.setValue("trigger", currentTrigger ? `${currentTrigger}, ${chip}` : chip);
  };

  const onSubmit = async (data: EntryFormValues) => {
    setLoading(true);
    try {
      const updatedEntry = await updateJournalEntry(entry.id, data);
      toast({ title: "Entry updated!", description: "Your journal entry has been updated successfully." });
      onEntryUpdated(updatedEntry);
      setOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update entry." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="grid-rows-[auto,1fr,auto] p-0" style={{ maxWidth: 'var(--layout-2xl)', maxHeight: '90svh' }}>
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Edit Journal Entry</DialogTitle>
          <DialogDescription>
            Update your reflection and thoughts.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="overflow-y-auto">
            <form onSubmit={form.handleSubmit(onSubmit)} id="edit-journal-form" className="space-y-4 px-6 pb-6">
              <div className="space-y-2">
                  <Label htmlFor="title">Give this entry a title</Label>
                  <Input id="title" {...form.register("title")} placeholder="e.g., That feeling in my chest" />
                  {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                  <div className="flex justify-between items-center">
                      <Label htmlFor="content">Your thoughts and feelings...</Label>
                      <Button type="button" variant="ghost" size="icon" onClick={toggleListening} className="component-xs">
                          {isListening ? <MicOff className="text-destructive" /> : <Mic />}
                          <span className="sr-only">Toggle voice recognition for content</span>
                      </Button>
                  </div>
                  <Textarea id="content" rows={6} placeholder="Describe what's on your mind, the situation, or any feelings that are present." {...form.register("content")} />
                  {form.formState.errors.content && <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>}
              </div>

               <div className="space-y-3 pt-2">
                <Label htmlFor="intensity">How intense is this feeling? ({watchedIntensity})</Label>
                <Controller
                  name="intensity"
                  control={form.control}
                  render={({ field }) => (
                    <Slider
                      id="intensity"
                      min={0}
                      max={10}
                      step={1}
                      defaultValue={[field.value ?? 5]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  )}
                />
                 <div className="flex justify-between text-xs text-muted-foreground px-1">
                    {Object.entries(intensityLabels).map(([key, label]) => (
                        <span key={key}>{label}</span>
                    ))}
                </div>
              </div>
              
              <Accordion type="single" collapsible>
                  <AccordionItem value="cbt-prompts">
                  <AccordionTrigger className="text-sm">Optional Deeper Reflection</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="trigger">What might have triggered this feeling?</Label>
                        <Input id="trigger" placeholder="e.g., A physical sensation, a memory..." {...form.register("trigger")} />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {triggerChips.map(chip => (
                            <Badge key={chip} variant="secondary" className="cursor-pointer" onClick={() => handleChipClick(chip)}>{chip}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="evidenceFor">What's supporting this feeling?</Label>
                        <Textarea id="evidenceFor" rows={2} placeholder="List the facts, thoughts, or memories that make it feel true." {...form.register("evidenceFor")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="evidenceAgainst">Is there another side to the story?</Label>
                        <Textarea id="evidenceAgainst" rows={2} placeholder="What facts, thoughts, or past experiences might challenge this feeling?" {...form.register("evidenceAgainst")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alternativeView">What's a more balanced or helpful way to see this?</Label>
                        <Textarea id="alternativeView" rows={2} placeholder="Considering both sides, what's a more neutral perspective?" {...form.register("alternativeView")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="schemaLink">Does this connect to a recurring pattern?</Label>
                        <Input id="schemaLink" placeholder="e.g., Feeling unsafe, fearing abandonment, self-blame..." {...form.register("schemaLink")} />
                      </div>
                  </AccordionContent>
                  </AccordionItem>
              </Accordion>
            </form>
        </ScrollArea>
        <DialogFooter className="p-6 pt-4 border-t">
            <Button type="submit" form="edit-journal-form" disabled={loading}>
                {loading && <Loader2 className="mr-2 icon-sm animate-spin" />}
                Update Entry
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 