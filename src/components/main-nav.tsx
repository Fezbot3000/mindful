
"use client";

import { usePathname } from "next/navigation";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { Home, Book, BarChart3, Wrench, Sprout } from "lucide-react";
import Link from 'next/link';

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/journal", label: "Entries", icon: Book },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/tools", label: "Tools", icon: Wrench },
];

export function MainNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
                className="w-full justify-start"
                onClick={handleLinkClick}
            >
                <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
