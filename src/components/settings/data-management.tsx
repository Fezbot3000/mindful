
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLogs, getJournalEntries, importData } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, AlertTriangle } from "lucide-react";
import JSZip from "jszip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useRouter } from "next/navigation";

export function DataManagement() {
  const { toast } = useToast();
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [fileToImport, setFileToImport] = useState<File | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    toast({ title: "Exporting Data...", description: "Gathering your logs and journal entries." });

    try {
      const logs = await getLogs();
      const journalEntries = await getJournalEntries();

      if (logs.length === 0 && journalEntries.length === 0) {
        toast({ variant: "destructive", title: "No Data", description: "There is nothing to export." });
        setIsExporting(false);
        return;
      }

      const zip = new JSZip();
      zip.file("logs.json", JSON.stringify(logs, null, 2));
      zip.file("journal.json", JSON.stringify(journalEntries, null, 2));

      const zipBlob = await zip.generateAsync({ type: "blob" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipBlob);
      link.download = `mindful-track-backup-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast({ title: "Export Successful", description: "Your data has been downloaded as a zip file." });
    } catch (error) {
      console.error("Export failed:", error);
      toast({ variant: "destructive", title: "Export Failed", description: "Could not export your data. Please try again." });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type === "application/zip" || file.name.endsWith('.zip')) {
        setFileToImport(file);
      } else {
        toast({ variant: "destructive", title: "Invalid File", description: "Please select a .zip file." });
      }
    }
  };

  const handleImport = async () => {
    if (!fileToImport) return;

    setIsImporting(true);
    toast({ title: "Importing Data...", description: "Please wait while we process your backup file." });

    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(fileToImport);
      
      const logsFile = content.file("logs.json");
      const journalFile = content.file("journal.json");

      if (!logsFile && !journalFile) {
        throw new Error("Backup file is invalid. It must contain logs.json or journal.json.");
      }

      const logs = logsFile ? JSON.parse(await logsFile.async("string")) : [];
      const journal = journalFile ? JSON.parse(await journalFile.async("string")) : [];

      await importData({ logs, journal });

      toast({ title: "Import Successful!", description: "Your data has been restored. The app will now reload." });
      
      // Reload the page to ensure all components refetch the new data
      setTimeout(() => {
        router.refresh();
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      console.error("Import failed:", error);
      toast({ variant: "destructive", title: "Import Failed", description: error.message || "Could not import data from the selected file." });
    } finally {
      setIsImporting(false);
      setFileToImport(null);
    }
  };


  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>
            Download a zip file containing all your logs and journal entries. Keep it safe as a backup.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                <Download className="icon-2xl text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Creates a `mindful-track-backup.zip` file.</p>
            </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleExport} disabled={isExporting} className="w-full">
            <Download className="mr-2" />
            {isExporting ? "Exporting..." : "Export All Data"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import Data</CardTitle>
          <CardDescription>
            Import data from a backup zip file. This will merge the data with your existing entries.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                <Upload className="icon-2xl text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Select a `mindful-track-backup.zip` file.</p>
            </div>
        </CardContent>
        <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full" disabled={!fileToImport || isImporting} onClick={() => document.getElementById('file-upload')?.click()}>
                  <Upload className="mr-2" />
                  {fileToImport ? fileToImport.name : "Select File..."}
                </Button>
              </AlertDialogTrigger>
                {fileToImport && (
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive" />Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will import and merge all entries from the file <span className="font-bold">{fileToImport.name}</span>. 
                                This action cannot be undone. It is recommended to take a fresh backup before importing.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setFileToImport(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleImport} disabled={isImporting}>
                                {isImporting ? "Importing..." : "Yes, Import Data"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                )}
            </AlertDialog>
            <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".zip,application/zip"
                onChange={handleFileChange}
                onClick={(e) => (e.currentTarget.value = '')} // Allow re-selecting the same file
            />
        </CardFooter>
      </Card>
    </div>
  );
}
