"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { FilePlus, BookOpen, Activity, ChevronDown } from "lucide-react";
import { useState, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Lazy load heavy components
const NewJournalEntryDialog = dynamic(() => import("@/components/journal/new-entry-dialog").then(mod => ({ default: mod.NewJournalEntryDialog })), {
  loading: () => <Button disabled><FilePlus className="mr-2 h-4 w-4" />Loading...</Button>,
});

const JournalList = dynamic(() => import("@/components/journal/journal-list").then(mod => ({ default: mod.JournalList })), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

const LogList = dynamic(() => import("@/components/journal/log-list").then(mod => ({ default: mod.LogList })), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

export function JournalPageClient() {
  const [key, setKey] = useState(0);
  const [activeView, setActiveView] = useState<'journal' | 'logs'>('journal');

  const refreshEntries = () => {
    setKey(prevKey => prevKey + 1);
  }

  return (
    <div className="space-y-6 w-full journal-page-content">
      {/* Header with action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between w-full">
        <PageHeader
          title="Journal & Logs"
          description="A space for reflection, from quick logs to deep dives."
        />
        <div className="flex gap-2 flex-shrink-0">
          <Suspense fallback={<Button disabled><FilePlus className="mr-2 h-4 w-4" />Loading...</Button>}>
            <NewJournalEntryDialog onEntryAdded={refreshEntries}>
              <Button className="w-full sm:w-auto">
                <FilePlus className="mr-2 h-4 w-4" />
                New Journal Entry
              </Button>
            </NewJournalEntryDialog>
          </Suspense>
        </div>
      </div>

      {/* Navigation - Dropdown on mobile, tabs on desktop */}
      <div className="bg-card rounded-lg border p-2">
                {/* Mobile dropdown */}
        <div className="block sm:hidden">
          <Select value={activeView} onValueChange={(value) => setActiveView(value as 'journal' | 'logs')}>
            <SelectTrigger className="w-full h-12">
              <div className="flex items-center gap-3 w-full">
                {activeView === 'journal' ? (
                  <>
                    <BookOpen className="h-4 w-4" />
                    <span>Journal Entries</span>
                    <Badge variant="secondary" className="text-xs">Deep reflection</Badge>
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4" />
                    <span>Quick Logs</span>
                    <Badge variant="secondary" className="text-xs">Daily tracking</Badge>
                  </>
                )}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="journal">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4" />
                  <span>Journal Entries</span>
                  <Badge variant="secondary" className="text-xs">Deep reflection</Badge>
                </div>
              </SelectItem>
              <SelectItem value="logs">
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4" />
                  <span>Quick Logs</span>
                  <Badge variant="secondary" className="text-xs">Daily tracking</Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop tabs */}
        <div className="hidden sm:flex gap-2">
          <Button
            variant={activeView === 'journal' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('journal')}
            className="flex-1 justify-start h-12 px-4"
          >
            <BookOpen className="mr-3 h-4 w-4" />
            Journal Entries
            <Badge variant="secondary" className="ml-auto text-xs px-2 py-1">
              Deep reflection
            </Badge>
          </Button>
          <Button
            variant={activeView === 'logs' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('logs')}
            className="flex-1 justify-start h-12 px-4"
          >
            <Activity className="mr-3 h-4 w-4" />
            Quick Logs
            <Badge variant="secondary" className="ml-auto text-xs px-2 py-1">
              Daily tracking
            </Badge>
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div className="w-full">
        {activeView === 'journal' ? (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="text-lg font-semibold">Your Journal Entries</h3>
              <p className="text-sm text-muted-foreground">
                Detailed reflections and deeper thoughts
              </p>
            </div>
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <JournalList key={`journal-${key}`} />
            </Suspense>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="text-lg font-semibold">Your Quick Logs</h3>
              <p className="text-sm text-muted-foreground">
                Daily mood and activity tracking
              </p>
            </div>
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <LogList key={`logs-${key}`} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
} 