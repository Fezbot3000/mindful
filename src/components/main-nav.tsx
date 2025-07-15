
"use client";

import { usePathname } from "next/navigation";
import { Home, Book, BarChart3, Wrench, Settings } from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/journal", label: "Entries", icon: Book },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/tools", label: "Tools", icon: Wrench },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MainNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  if (isMobile) {
    return (
        <nav className="grid grid-cols-5 w-full">
            {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard");
                return (
                    <Link 
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 p-3 rounded-md text-sm font-medium transition-colors",
                            isActive 
                                ? "text-white bg-primary border-t-2 border-primary font-bold shadow-md" 
                                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                        )}
                    >
                        <item.icon className="icon-lg" />
                        <span className="text-xs">{item.label}</span>
                    </Link>
                )
            })}
        </nav>
    );
  }

  return (
    <ul className="flex w-full min-w-0 flex-col gap-1 p-2">
      {navItems.map((item) => (
        <li key={item.href} className="group/menu-item relative">
            <Link 
                href={item.href}
                className={cn(
                    "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-ring transition-[width,height,padding] hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 active:bg-accent active:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 h-8",
                    (pathname === item.href || (pathname === "/" && item.href === "/dashboard")) && "bg-accent font-medium text-accent-foreground",
                    "group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
                )}
            >
                <item.icon className="icon-md" />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
            </Link>
        </li>
      ))}
    </ul>
  );
}
