
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mic, MicOff } from "lucide-react";
import { addJournalEntry } from "@/lib/data";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "../ui/scroll-area";
import { IntensitySelector } from "../ui/intensity-selector";
import { Badge } from "../ui/badge";
import { useLogs } from "@/hooks/use-logs";
import { useTextareaAutosize } from "@/hooks/use-textarea-autosize";
import { ConfirmDialog } from "../ui/confirm-dialog";

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

interface NewJournalEntryDialogProps {
  children: React.ReactNode;
  onEntryAdded: () => void;
}

const triggerChips = ["Health Symptom", "Work Stress", "Relationship Issue", "Intrusive Thought", "Family Memory/Loss"];
const intensityLabels: { [key: number]: string } = {
    1: "Very Low", 4: "Medium", 7: "High", 10: "Very Intense"
};

export function NewJournalEntryDialog({ children, onEntryAdded }: NewJournalEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const { toast } = useToast();
  const { addLog: addLogToState } = useLogs();
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      content: "",
      intensity: 5,
      trigger: "",
      evidenceFor: "",
      evidenceAgainst: "",
      alternativeView: "",
      schemaLink: "",
    },
  });

  const watchedIntensity = form.watch("intensity");
  const watchedContent = form.watch("content");
  const watchedTitle = form.watch("title");
  const contentTextareaRef = useTextareaAutosize(watchedContent || "");
  const evidenceForRef = useTextareaAutosize(form.watch("evidenceFor") || "");
  const evidenceAgainstRef = useTextareaAutosize(form.watch("evidenceAgainst") || "");
  const alternativeViewRef = useTextareaAutosize(form.watch("alternativeView") || "");

  // Check if form has content
  const hasContent = watchedTitle || watchedContent || form.getValues("trigger") || form.getValues("evidenceFor") || form.getValues("evidenceAgainst") || form.getValues("alternativeView") || form.getValues("schemaLink");

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && hasContent) {
      setShowConfirmClose(true);
    } else {
      setOpen(newOpen);
      if (!newOpen) {
        form.reset();
      }
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmClose(false);
    setOpen(false);
    form.reset();
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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
      const { newLog } = await addJournalEntry(data);
      if (newLog) {
        addLogToState(newLog); // Update the global log state for dashboard/insights
      }
      toast({ title: "Well done reflecting!", description: "You're building awareness. Your journal entry has been saved." });
      onEntryAdded();
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save entry." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="grid-rows-[auto,1fr,auto] p-0 max-w-[var(--layout-2xl)]">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>New Journal Entry</DialogTitle>
          <DialogDescription>
            A space for deeper reflection. Use the optional prompts to guide your thoughts.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="overflow-y-auto">
            <form onSubmit={form.handleSubmit(onSubmit)} id="journal-form" className="space-y-4 px-6 pb-6">
              <div className="space-y-2">
                  <Label htmlFor="title">Give this entry a title</Label>
                  <Input id="title" {...form.register("title")} placeholder="e.g., That feeling in my chest" />
                  {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                  <div className="flex justify-between items-center">
                      <Label htmlFor="content">Your thoughts and feelings...</Label>
                      <Button type="button" variant="ghost" size="icon" onClick={toggleListening} className="h-6 w-6">
                          {isListening ? <MicOff className="text-destructive" /> : <Mic />}
                          <span className="sr-only">Toggle voice recognition for content</span>
                      </Button>
                  </div>
                  <Controller
                    name="content"
                    control={form.control}
                    render={({ field }) => (
                      <Textarea 
                        id="content" 
                        placeholder="Describe what's on your mind, the situation, or any feelings that are present." 
                        value={field.value || ""}
                        onChange={field.onChange}
                        ref={contentTextareaRef}
                      />
                    )}
                  />
                  {form.formState.errors.content && <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>}
              </div>

               <div className="space-y-3 pt-2">
                <Label htmlFor="intensity">How intense is this feeling?</Label>
                <Controller
                  name="intensity"
                  control={form.control}
                  render={({ field }) => (
                    <IntensitySelector
                      value={field.value ?? 5}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
              </div>
              
              <Accordion type="multiple" className="w-full">
                  <AccordionItem value="cbt-prompts">
                  <AccordionTrigger className="text-sm">Optional Deeper Reflection</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="trigger">What might have triggered this feeling?</Label>
                        <Input id="trigger" placeholder="e.g., A physical sensation, a memory..." {...form.register("trigger")} />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {triggerChips.map(chip => (
                            <Badge key={chip} variant="secondary" className="cursor-pointer px-4 py-2 text-sm" onClick={() => handleChipClick(chip)}>{chip}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="evidenceFor">What's supporting this feeling?</Label>
                        <Controller
                          name="evidenceFor"
                          control={form.control}
                          render={({ field }) => (
                            <Textarea 
                              id="evidenceFor" 
                              placeholder="List the facts, thoughts, or memories that make it feel true." 
                              value={field.value || ""}
                              onChange={field.onChange}
                              ref={evidenceForRef}
                            />
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="evidenceAgainst">Is there another side to the story?</Label>
                        <Controller
                          name="evidenceAgainst"
                          control={form.control}
                          render={({ field }) => (
                            <Textarea 
                              id="evidenceAgainst" 
                              placeholder="What facts, thoughts, or past experiences might challenge this feeling?" 
                              value={field.value || ""}
                              onChange={field.onChange}
                              ref={evidenceAgainstRef}
                            />
                          )}
                        />
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="alternativeView">What's a more balanced or helpful way to see this?</Label>
                        <Controller
                          name="alternativeView"
                          control={form.control}
                          render={({ field }) => (
                            <Textarea 
                              id="alternativeView" 
                              placeholder="Considering both sides, what's a more neutral perspective?" 
                              value={field.value || ""}
                              onChange={field.onChange}
                              ref={alternativeViewRef}
                            />
                          )}
                        />
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
            <Button type="submit" form="journal-form" disabled={loading}>
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Entry
            </Button>
        </DialogFooter>
      </DialogContent>
      <ConfirmDialog
        open={showConfirmClose}
        onOpenChange={setShowConfirmClose}
        onConfirm={handleConfirmClose}
        title="Unsaved Changes"
        description="You have unsaved changes. Are you sure you want to close without saving?"
        confirmText="Close"
        cancelText="Keep Editing"
      />
    </Dialog>
  );
}
