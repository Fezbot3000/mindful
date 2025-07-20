
"use client";

import { usePathname } from "next/navigation";
import Link from 'next/link';

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Book, BarChart3, Home, Wrench, Settings } from 'lucide-react'

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
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <ul className="flex w-full min-w-0 flex-col gap-1 p-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors">
                      <item.icon className="h-6 w-6 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
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
