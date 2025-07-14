
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

export function ViewJournalEntryDialog({ children, entry }: ViewJournalEntryDialogProps) {
  const hasCbtFields = entry.trigger || entry.evidenceFor || entry.evidenceAgainst || entry.schemaLink;

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
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-sans space-y-4">
                <p>{entry.content}</p>

                {hasCbtFields && (
                    <>
                        <Separator />
                        <div className="space-y-4 not-prose">
                            {entry.trigger && (
                                <div>
                                    <h4 className="font-semibold text-xs uppercase text-muted-foreground">Trigger</h4>
                                    <p className="text-sm text-foreground">{entry.trigger}</p>
                                </div>
                            )}
                            {entry.evidenceFor && (
                                <div>
                                    <h4 className="font-semibold text-xs uppercase text-muted-foreground">Evidence For</h4>
                                    <p className="text-sm text-foreground whitespace-pre-wrap">{entry.evidenceFor}</p>
                                </div>
                            )}
                            {entry.evidenceAgainst && (
                                <div>
                                    <h4 className="font-semibold text-xs uppercase text-muted-foreground">Evidence Against / Alternative View</h4>
                                    <p className="text-sm text-foreground whitespace-pre-wrap">{entry.evidenceAgainst}</p>
                                </div>
                            )}
                             {entry.schemaLink && (
                                <div>
                                    <h4 className="font-semibold text-xs uppercase text-muted-foreground">Schema Link</h4>
                                    <p className="text-sm text-foreground">{entry.schemaLink}</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
