import React from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { MainNav } from "@/components/main-nav";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { QuickLogDialog } from "@/components/quick-log-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { LogsProvider } from "@/hooks/use-logs";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LogsProvider>
      <SidebarProvider>
        <Sidebar className="fixed inset-y-0 left-0 z-40 hidden flex-col md:flex">
          <SidebarHeader className="p-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Image src="/logo.svg" alt="Mindful Track Logo" width={24} height={24} />
              <span className="group-data-[collapsible=icon]:hidden">Mindful Track</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <MainNav />
          </SidebarContent>
          <SidebarFooter className="group-data-[collapsible=icon]:hidden">
             <div className="text-xs text-muted-foreground p-4">
              © {new Date().getFullYear()} Mindful Track
             </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col md:pl-[var(--sidebar-width-icon)] group-data-[state=expanded]:md:pl-[var(--sidebar-width)] transition-[padding-left] duration-200 ease-in-out">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
              <SidebarTrigger />
              <div className="flex items-center gap-4 ml-auto">
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-1 overflow-y-auto grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              {children}
              <QuickLogDialog>
                <Button
                  aria-label="Log Now"
                  className="fixed bottom-6 right-6 z-20 h-16 w-16 rounded-full shadow-lg"
                  size="icon"
                >
                  <Plus className="h-8 w-8" />
                </Button>
              </QuickLogDialog>
            </main>
        </div>
      </SidebarProvider>
    </LogsProvider>
  );
}
