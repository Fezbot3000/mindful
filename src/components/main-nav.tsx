"use client";

import { usePathname } from "next/navigation";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Home, Book, BarChart3, Wrench, Sprout } from "lucide-react";
import Link from 'next/link';

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/journal", label: "Journal", icon: Book },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/tools", label: "Tools", icon: Wrench },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
            <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="w-full justify-start"
                >
                    <item.icon className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
