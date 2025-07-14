"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MainNav } from "@/components/main-nav";
import { AuthButton } from "@/components/auth-button";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { QuickLogDialog } from "@/components/quick-log-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null; 
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full">
        <Sidebar>
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
        <SidebarInset>
          <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6 sticky top-0 z-30">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <ThemeToggle />
              <AuthButton />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
