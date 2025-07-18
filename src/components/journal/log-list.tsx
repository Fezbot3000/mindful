
"use client";

import { Log, LogCategory } from "@/types";
import { useEffect, useState } from "react";
import { deleteLog } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Trash2 } from "lucide-react";
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


export function LogList() {
  const { logs: allLogs, loading: logsLoading, setLogs } = useLogs();
  
  const handleDelete = async (id: number) => {
    await deleteLog(id);
    setLogs(prevLogs => prevLogs.filter(log => log.id !== id));
  };
  
  if (logsLoading) {
     return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-5 w-full" />
              </CardContent>
              <CardFooter>
                 <Skeleton className="h-8 w-8" />
              </CardFooter>
            </Card>
          ))}
        </div>
      );
  }

  if (allLogs.length === 0) {
      return (
         <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full">
                    <Activity className="icon-2xl text-primary" />
                </div>
                <CardTitle className="mt-4">No Log Entries Yet</CardTitle>
                <CardDescription>
                    Use the '+' button to add your first quick log.
                </CardDescription>
            </CardHeader>
         </Card>
      )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {allLogs.map((log) => {
        return (
            <Card key={log.id} className="flex flex-col">
              <EditLogDialog 
                log={log} 
                onLogUpdated={(updatedLog: Log) => {
                  setLogs(prev => prev.map(l => l.id === log.id ? updatedLog : l));
                }}
              >
                <div className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="truncate text-xl flex flex-col">
                      <span>{log.category}</span>
                      <span className="text-sm font-normal text-muted-foreground">Intensity: {log.intensity}/10</span>
                    </CardTitle>
                    <CardDescription>
                      {format(log.timestamp, "MMMM d, yyyy 'at' h:mm a")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {log.description || "No description provided."}
                    </p>
                  </CardContent>
                </div>
              </EditLogDialog>
              <CardFooter className="flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                              <Trash2 className="icon-sm" />
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
              </CardFooter>
            </Card>
        )
      })}
    </div>
  );
}
