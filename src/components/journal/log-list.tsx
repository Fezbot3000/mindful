
"use client";

import { Log, LogCategory } from "@/types";
import { deleteLog } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Activity, Trash2, Edit, HeartPulse, Repeat, TrendingUp, Sparkles, BookText } from "lucide-react";
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
import { Skeleton } from "../ui/skeleton";
import { useLogs } from "@/hooks/use-logs";
import { EditLogDialog } from "@/components/edit-log-dialog";

const categoryIcons: Record<LogCategory, React.ElementType> = {
    "Health Fear": HeartPulse,
    "Intrusive Thought": Sparkles,
    "Compulsion": Repeat,
    "Schema Trigger": TrendingUp,
    "Accomplished": Sparkles,
    "Journal Reflection": BookText,
};

const categoryColors: Record<LogCategory, string> = {
    "Health Fear": "text-foreground bg-muted",
    "Intrusive Thought": "text-foreground bg-accent",
    "Compulsion": "text-foreground bg-secondary",
    "Schema Trigger": "text-foreground bg-muted",
    "Accomplished": "text-primary bg-primary/10",
    "Journal Reflection": "text-foreground bg-accent",
};

export function LogList() {
  const { logs: allLogs, loading: logsLoading, setLogs } = useLogs();
  
  const handleDelete = async (id: number) => {
    await deleteLog(id);
    setLogs(prevLogs => prevLogs.filter(log => log.id !== id));
  };
  
  if (logsLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-8" />
                </div>
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (allLogs.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
          <Activity className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Log Entries Yet</h3>
        <p className="text-sm text-muted-foreground">
          Use the '+' button to add your first quick log.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allLogs.map((log) => {
        const Icon = categoryIcons[log.category] || Sparkles;
        const colorClass = categoryColors[log.category] || "text-gray-600 bg-gray-50";
        
        return (
          <div key={log.id} className="bg-card rounded-lg border overflow-hidden group hover:shadow-sm transition-shadow">
            <EditLogDialog 
              log={log} 
              onLogUpdated={(updatedLog: Log) => {
                setLogs(prev => prev.map(l => l.id === log.id ? updatedLog : l));
              }}
            >
              <div className="cursor-pointer hover:bg-accent/30 transition-colors p-4">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-full ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="font-medium text-sm">{log.category}</span>
                      <span className="text-lg font-bold text-primary">{log.intensity}/10</span>
                      {log.emotion && (
                        <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                          {log.emotion}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-muted-foreground truncate flex-1">
                        {log.description || "No description"}
                      </p>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {format(log.timestamp, "MMM d, h:mm a")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-8 px-3">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this log entry.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(log.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </EditLogDialog>
          </div>
        );
      })}
    </div>
  );
}
