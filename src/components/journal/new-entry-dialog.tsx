
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
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

const entrySchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  content: z.string().min(1, { message: "Content is required." }),
  trigger: z.string().optional(),
  evidenceFor: z.string().optional(),
  evidenceAgainst: z.string().optional(),
  schemaLink: z.string().optional(),
});

type EntryFormValues = z.infer<typeof entrySchema>;

interface NewJournalEntryDialogProps {
  children: React.ReactNode;
  onEntryAdded: () => void;
}

export function NewJournalEntryDialog({ children, onEntryAdded }: NewJournalEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      content: "",
      trigger: "",
      evidenceFor: "",
      evidenceAgainst: "",
      schemaLink: "",
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            const currentContent = form.getValues("content");
            form.setValue("content", currentContent + finalTranscript);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            toast({ variant: "destructive", title: "Voice Error", description: "Speech recognition failed. Please try again." });
            setIsListening(false);
        };
        
        recognition.onend = () => {
             if (isListening) {
                // If it stops but we still want it to listen, restart it
                 // But check a flag to avoid infinite loops if it's meant to be off
                recognition.start();
            }
        };

    }
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);


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


  const onSubmit = async (data: EntryFormValues) => {
    setLoading(true);
    try {
      await addJournalEntry(data);
      toast({ title: "Entry Saved", description: "Your journal entry has been saved." });
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] grid-rows-[auto_1fr_auto] max-h-[90svh] flex flex-col">
        <DialogHeader>
          <DialogTitle>New Journal Entry</DialogTitle>
          <DialogDescription>
            A space for deeper reflection. Use the optional prompts to guide your thoughts.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea>
            <form onSubmit={form.handleSubmit(onSubmit)} id="journal-form" className="space-y-4 pt-4 pr-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...form.register("title")} />
                {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="content">Content</Label>
                    <Button type="button" variant="ghost" size="icon" onClick={toggleListening} className="h-7 w-7">
                        {isListening ? <MicOff className="text-destructive" /> : <Mic />}
                        <span className="sr-only">Toggle voice recognition</span>
                    </Button>
                </div>
                <Textarea id="content" rows={8} {...form.register("content")} />
                {form.formState.errors.content && <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>}
            </div>
            
            <Accordion type="multiple" className="w-full">
                <AccordionItem value="cbt-prompts">
                <AccordionTrigger className="text-sm">Optional CBT Prompts</AccordionTrigger>
                <AccordionContent className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="trigger">What triggered this?</Label>
                    <Input id="trigger" placeholder="e.g., A physical sensation, a memory, a conversation..." {...form.register("trigger")} />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="evidenceFor">Evidence FOR this thought/fear?</Label>
                    <Textarea id="evidenceFor" rows={2} {...form.register("evidenceFor")} />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="evidenceAgainst">Evidence AGAINST it / Alternative view?</Label>
                    <Textarea id="evidenceAgainst" rows={2} {...form.register("evidenceAgainst")} />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="schemaLink">How does this connect to a core feeling?</Label>
                    <Input id="schemaLink" placeholder="e.g., Feeling unsafe, feeling like a failure, feeling unlovable..." {...form.register("schemaLink")} />
                    </div>
                </AccordionContent>
                </AccordionItem>
            </Accordion>
            </form>
        </ScrollArea>
        <DialogFooter className="mt-auto pt-4">
            <Button type="submit" form="journal-form" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Entry
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
