
"use client";

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Book, BarChart3, Home, Wrench, Settings } from 'lucide-react'

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/journal", label: "Entries", icon: Book },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/tools", label: "Tools", icon: Wrench },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:layout-hidden layout-fixed bottom-0 left-0 right-0 bg-background border-t z-50 layout-flex layout-items-center px-token-2 pb-safe-area-inset-bottom pl-safe-area-inset-left pr-safe-area-inset-right shadow-lg" style={{ height: 'var(--space-16)' }}>
      <nav className="layout-grid grid-cols-5 w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard");
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "layout-flex layout-flex-col layout-items-center gap-token-1 p-token-3 rounded-token-md text-sm font-medium transition-colors",
                isActive 
                  ? "text-primary-foreground bg-primary border-t-4 border-primary font-bold shadow-lg rounded-none" 
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              <item.icon className="icon-lg" />
              <span className={cn("text-xs", isActive && "text-primary-foreground")}>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  );
}
