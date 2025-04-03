"use client";
import {
  Users,
  FileText,
  BarChart3,
  GamepadIcon,
  Shield,
  ChevronUp,
  User2,
  Home,
  Settings,
  LogOut,
  Wallet,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { User } from "@/lib/features/users/UsersSlice";

const resourceIcons: Record<string, any> = {
  home: Home,
  users: Users,
  games: GamepadIcon,
  roles: Shield,
  wallets: Wallet,
  requests: FileText,
  transactions: BarChart3,
  banners: FileText,
};

export function AppSidebar({ user }: { user: User }) {
  const menuItems = user?.permissions
    ?.filter((p) => p.permission.includes("r"))
    .map((p) => {
      const title = p.resource.charAt(0).toUpperCase() + p.resource.slice(1);
      return {
        title,
        url: `/${p.resource}`,
        icon: resourceIcons[p.resource],
      };
    });

  return (
    <Sidebar>
      <SidebarContent className=" flex justify-between">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <Home />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {menuItems?.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="focus:outline-none">
                  <SidebarMenuButton>
                    <User2 /> {user.name}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width] "
                >
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ThemeToggle />
                  </DropdownMenuItem>
                  <Link href={"/logout"}>
                    <DropdownMenuItem>
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
