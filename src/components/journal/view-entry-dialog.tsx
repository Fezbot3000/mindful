
"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { JournalEntry } from "@/types";
import { format } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";

interface ViewJournalEntryDialogProps {
    children: React.ReactNode;
    entry: JournalEntry;
}

export function ViewJournalEntryDialog({ children, entry }: ViewJournalEntryDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{entry.title}</DialogTitle>
          <DialogDescription>
            {format(entry.timestamp, "MMMM d, yyyy 'at' h:mm a")}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 pr-6">
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-sans">
                {entry.content}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
