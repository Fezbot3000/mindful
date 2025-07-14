
"use client";

import React, { Suspense } from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar";
import { MainNav } from "@/components/main-nav";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { LogsProvider } from "@/hooks/use-logs";
import { AuthProvider } from "@/lib/auth";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load heavy components
const QuickLogDialog = dynamic(() => import("@/components/quick-log-dialog").then(mod => ({ default: mod.QuickLogDialog })), {
  loading: () => <Button className="fixed bottom-20 md:bottom-6 right-6 z-20 h-16 w-16 rounded-full shadow-lg" size="icon" disabled><Plus className="h-8 w-8" /></Button>,
});

const AuthButton = dynamic(() => import("@/components/auth-button").then(mod => ({ default: mod.AuthButton })), {
  loading: () => <Skeleton className="h-8 w-8 rounded-full" />,
});

const MobileNav = dynamic(() => import("@/components/mobile-nav").then(mod => ({ default: mod.MobileNav })), {
  loading: () => null,
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LogsProvider>
        <SidebarProvider>
          <div className="group md:flex">
            <Sidebar className="hidden md:flex">
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

            <div className="flex-1 transition-[margin-left] ease-in-out duration-300 md:ml-[3.5rem] group-data-[state=expanded]:md:ml-[16rem]">
              <div className="flex-1">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
                  <div className="flex items-center gap-4 ml-auto">
                    <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
                      <AuthButton />
                    </Suspense>
                    <ThemeToggle />
                  </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 sm:px-6 sm:py-6 md:gap-8 pb-24 md:pb-8">
                  {children}
                </main>
              </div>
            </div>
          </div>
          <Suspense fallback={null}>
            <MobileNav />
          </Suspense>
          <Suspense fallback={<Button className="fixed bottom-20 md:bottom-6 right-6 z-20 h-16 w-16 rounded-full shadow-lg" size="icon" disabled><Plus className="h-8 w-8" /></Button>}>
            <QuickLogDialog>
              <Button
                aria-label="Log Now"
                className="fixed bottom-20 md:bottom-6 right-6 z-20 h-16 w-16 rounded-full shadow-lg"
                size="icon"
              >
                <Plus className="h-8 w-8" />
              </Button>
            </QuickLogDialog>
          </Suspense>
        </SidebarProvider>
      </LogsProvider>
    </AuthProvider>
  );
}
