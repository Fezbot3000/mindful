
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
  loading: () => <Button className="layout-fixed bottom-20 md:bottom-6 right-6 z-20 h-component-xl w-component-xl rounded-token-full shadow-lg" size="icon" disabled><Plus className="icon-xl" /></Button>,
});

const AuthButton = dynamic(() => import("@/components/auth-button").then(mod => ({ default: mod.AuthButton })), {
  loading: () => <Skeleton className="h-component-sm w-component-sm rounded-token-full" />,
});

const MobileNav = dynamic(() => import("@/components/mobile-nav").then(mod => ({ default: mod.MobileNav })), {
  loading: () => null,
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LogsProvider>
        <SidebarProvider>
                     <div className="group md:layout-flex">
             <Sidebar className="layout-hidden md:layout-flex" role="navigation" aria-label="Main navigation">
               <SidebarHeader className="p-token-4">
                 <Link href="/dashboard" className="layout-flex layout-items-center gap-token-2 font-semibold" aria-label="Mindful Track - Go to dashboard">
                   <Image src="/logo.svg" alt="Mindful Track Logo" width={24} height={24} />
                   <span className="group-data-[collapsible=icon]:layout-hidden">Mindful Track</span>
                 </Link>
               </SidebarHeader>
               <SidebarContent>
                 <MainNav />
               </SidebarContent>
               <SidebarFooter className="group-data-[collapsible=icon]:layout-hidden">
                 <div className="text-xs text-muted-foreground p-token-4">
                   © {new Date().getFullYear()} Mindful Track
                 </div>
               </SidebarFooter>
             </Sidebar>

             <div className="layout-flex-1 transition-[margin-left] ease-in-out duration-300 md:ml-[3.5rem] group-data-[state=expanded]:md:ml-[16rem] md:max-w-[calc(100vw-3.5rem)] group-data-[state=expanded]:md:max-w-[calc(100vw-16rem)] layout-overflow-x-hidden">
               <div className="layout-flex-1 max-w-full layout-overflow-x-hidden">
                 <header className="layout-sticky top-0 z-30 layout-flex h-14 layout-items-center gap-token-4 border-b bg-background px-token-4 sm:px-token-6 pt-safe-area-inset-top pl-safe-area-inset-left pr-safe-area-inset-right" role="banner">
                   <div className="layout-flex layout-items-center gap-token-4 ml-auto">
                     <Suspense fallback={<Skeleton className="h-component-sm w-component-sm rounded-token-full" />}>
                       <AuthButton />
                     </Suspense>
                     <ThemeToggle />
                   </div>
                 </header>
                 <main className="layout-flex-1 layout-overflow-y-auto layout-overflow-x-hidden px-token-4 py-token-6 sm:px-token-6 sm:py-token-6 md:gap-token-8 pb-32 md:pb-8 max-w-full" role="main" id="main-content">
                   {children}
                 </main>
               </div>
             </div>
           </div>
          <Suspense fallback={null}>
            <MobileNav />
          </Suspense>
          <Suspense fallback={<Button className="layout-fixed bottom-20 md:bottom-6 right-6 z-20 h-component-xl w-component-xl rounded-token-full shadow-lg" size="icon" disabled><Plus className="icon-xl" /></Button>}>
            <QuickLogDialog>
              <Button
                aria-label="Log Now"
                className="layout-fixed bottom-20 md:bottom-6 right-6 z-20 h-component-xl w-component-xl rounded-token-full shadow-lg"
                size="icon"
              >
                <Plus className="icon-xl" />
              </Button>
            </QuickLogDialog>
          </Suspense>
        </SidebarProvider>
      </LogsProvider>
    </AuthProvider>
  );
}
