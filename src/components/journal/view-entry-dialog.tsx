
"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { JournalEntry } from "@/types";
import { format } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

interface ViewJournalEntryDialogProps {
    children: React.ReactNode;
    entry: JournalEntry;
}

function CbtField({ label, value }: { label: string, value?: string }) {
    if (!value) return null;
    return (
        <div>
            <h4 className="font-semibold text-xs uppercase text-muted-foreground">{label}</h4>
            <p className="text-sm text-foreground whitespace-pre-wrap">{value}</p>
        </div>
    );
}

export function ViewJournalEntryDialog({ children, entry }: ViewJournalEntryDialogProps) {
  const hasCbtFields = entry.trigger || entry.evidenceFor || entry.evidenceAgainst || entry.alternativeView || entry.schemaLink;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col" style={{ maxWidth: 'var(--layout-2xl)', maxHeight: '90svh' }}>
        <DialogHeader>
          <DialogTitle>{entry.title}</DialogTitle>
          <DialogDescription className="flex justify-between items-center">
            <span>{format(entry.timestamp, "MMMM d, yyyy 'at' h:mm a")}</span>
            {entry.intensity !== undefined && (
                <span className="font-bold text-sm text-primary">Intensity: {entry.intensity}/10</span>
            )}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-6">
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-sans space-y-4">
                <p>{entry.content}</p>

                {hasCbtFields && (
                    <>
                        <Separator />
                        <div className="space-y-4 not-prose">
                           <CbtField label="Trigger" value={entry.trigger} />
                           <CbtField label="Evidence For" value={entry.evidenceFor} />
                           <CbtField label="Evidence Against" value={entry.evidenceAgainst} />
                           <CbtField label="Alternative/Balanced View" value={entry.alternativeView} />
                           <CbtField label="Schema Link" value={entry.schemaLink} />
                        </div>
                    </>
                )}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
