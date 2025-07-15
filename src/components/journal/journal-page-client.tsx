"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

// Lazy load heavy components
const NewJournalEntryDialog = dynamic(() => import("@/components/journal/new-entry-dialog").then(mod => ({ default: mod.NewJournalEntryDialog })), {
  loading: () => <Button disabled><FilePlus className="mr-2" />Loading...</Button>,
});

const JournalList = dynamic(() => import("@/components/journal/journal-list").then(mod => ({ default: mod.JournalList })), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

const LogList = dynamic(() => import("@/components/journal/log-list").then(mod => ({ default: mod.LogList })), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

export function JournalPageClient() {
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
        <Suspense fallback={<Button disabled><FilePlus className="mr-2" />Loading...</Button>}>
          <NewJournalEntryDialog onEntryAdded={refreshEntries}>
            <Button>
              <FilePlus className="mr-2" />
              New Journal Entry
            </Button>
          </NewJournalEntryDialog>
        </Suspense>
      </div>

      <Tabs defaultValue="journal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="logs">Log History</TabsTrigger>
        </TabsList>
        <TabsContent value="journal" className="mt-6">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <JournalList key={`journal-${key}`} />
          </Suspense>
        </TabsContent>
        <TabsContent value="logs" className="mt-6">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <LogList key={`logs-${key}`} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
} 