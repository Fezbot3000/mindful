
"use client";

import { usePathname } from "next/navigation";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Book, BarChart3, Home, Wrench } from 'lucide-react'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Journal & Logs',
    href: '/journal',
    icon: Book,
  },
  {
    title: 'Insights',
    href: '/insights',
    icon: BarChart3,
  },
  {
    title: 'Tools',
    href: '/tools',
    icon: Wrench,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <ul className="layout-flex w-full min-w-0 layout-flex-col gap-token-1 p-token-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href} className="layout-flex layout-items-center gap-token-3 px-token-3 py-token-2 text-sm font-medium rounded-md transition-colors">
                      <item.icon className="icon-lg layout-flex-shrink-0" />
                      <span className={cn("truncate", isActive && "text-sidebar-primary-foreground")}>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </ul>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
