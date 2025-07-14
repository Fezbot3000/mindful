
"use client";

import { PageHeader } from "@/components/page-header";
import { NewJournalEntryDialog } from "@/components/journal/new-entry-dialog";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JournalList } from "@/components/journal/journal-list";
import { LogList } from "@/components/journal/log-list";
import { useState } from "react";


export default function JournalPage() {
    const [key, setKey] = useState(0);

    const refreshEntries = () => {
        setKey(prevKey => prevKey + 1);
    }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Journal & Logs"
          description="A space for reflection, from quick logs to deep dives."
        />
        <NewJournalEntryDialog onEntryAdded={refreshEntries}>
          <Button>
            <FilePlus className="mr-2" />
            New Journal Entry
          </Button>
        </NewJournalEntryDialog>
      </div>

      <Tabs defaultValue="journal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="logs">Log History</TabsTrigger>
        </TabsList>
        <TabsContent value="journal" className="mt-6">
            <JournalList key={`journal-${key}`} />
        </TabsContent>
        <TabsContent value="logs" className="mt-6">
           <LogList key={`logs-${key}`} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
