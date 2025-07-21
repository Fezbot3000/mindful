
"use client";

import { JournalEntry } from "@/types";
import { useEffect, useState } from "react";
import { deleteJournalEntry, getJournalEntries } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trash2, Edit } from "lucide-react";
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
import { Skeleton } from "../ui/skeleton";
import { EditJournalEntryDialog } from "./edit-entry-dialog";

export function JournalList() {
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

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-16 w-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Journal Entries Yet</h3>
        <p className="text-sm text-muted-foreground">
          Click "New Journal Entry" to start your journal.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-card rounded-lg border overflow-hidden group hover:shadow-sm transition-shadow">
          <div className="p-6">
            <div className="flex items-start justify-between gap-6 mb-4">
              <EditJournalEntryDialog 
                entry={entry} 
                onEntryUpdated={(updatedEntry: JournalEntry) => {
                  setEntries(prev => prev.map(e => e.id === entry.id ? updatedEntry : e));
                }}
              >
                <div className="cursor-pointer hover:bg-accent/30 transition-colors p-2 -m-2 rounded flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg truncate">{entry.title}</h3>
                    {entry.intensity && (
                      <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium flex-shrink-0">
                        {entry.intensity}/10
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {format(entry.timestamp, "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {entry.content}
                  </p>
                </div>
              </EditJournalEntryDialog>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <ViewJournalEntryDialog entry={entry}>
                <Button variant="ghost" size="sm" className="h-9 px-3 flex-1 sm:flex-none">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read
                </Button>
              </ViewJournalEntryDialog>
              
              <EditJournalEntryDialog 
                entry={entry} 
                onEntryUpdated={(updatedEntry: JournalEntry) => {
                  setEntries(prev => prev.map(e => e.id === entry.id ? updatedEntry : e));
                }}
              >
                <Button variant="ghost" size="sm" className="h-9 px-3 flex-1 sm:flex-none">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </EditJournalEntryDialog>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive flex-shrink-0">
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
