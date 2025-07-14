
"use client";

import { PageHeader } from "@/components/page-header";
import { JournalEntry } from "@/types";
import { useEffect, useState } from "react";
import { deleteJournalEntry, getJournalEntries } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { NewJournalEntryDialog } from "@/components/journal/new-entry-dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FilePlus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ViewJournalEntryDialog } from "@/components/journal/view-entry-dialog";

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    setLoading(true);
    const fetchedEntries = await getJournalEntries();
    setEntries(fetchedEntries);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteJournalEntry(id);
    fetchEntries(); // Refresh list
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Journal"
          description="A space for deeper reflection and timed worry sessions."
        />
        <NewJournalEntryDialog onEntryAdded={fetchEntries}>
          <Button>
            <FilePlus className="mr-2" />
            New Entry
          </Button>
        </NewJournalEntryDialog>
      </div>

      {loading ? (
        <p>Loading entries...</p>
      ) : entries.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <Card key={entry.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="truncate">{entry.title}</CardTitle>
                <CardDescription>
                  {format(entry.timestamp, "MMMM d, yyyy 'at' h:mm a")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {entry.content}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <ViewJournalEntryDialog entry={entry}>
                  <Button variant="outline" size="sm">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Read More
                  </Button>
                </ViewJournalEntryDialog>
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your journal entry.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(entry.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
         <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full">
                    <BookOpen className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="mt-4">No Journal Entries Yet</CardTitle>
                <CardDescription>
                    Click "New Entry" to start your journal.
                </CardDescription>
            </CardHeader>
         </Card>
      )}
    </div>
  );
}
