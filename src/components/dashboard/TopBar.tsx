"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { MobileSidebar } from "./MobileSidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";

export const TopBar = ({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <header className="h-16 px-6 py-3 flex items-center justify-between border-b bg-background/95 backdrop-blur-sm sticky top-0 w-full z-10">
      <div className="flex items-center flex-1 max-w-xl gap-4">
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
        <button
          className="p-2 block lg:hidden text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all"
          onClick={() => setIsMobileSidebarOpen(true)}
          aria-label="Open Mobile Menu"
        >
          ☰
        </button>
        <button
          className="p-2 hidden lg:block text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          ☰
        </button>
        <div className="relative flex-1 ml-4 lg:ml-0 group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-foreground" />
          <input
            type="text"
            placeholder="Search anything here..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all hover:border-primary/50"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2 px-2 py-1 hover:bg-accent cursor-pointer border border-border rounded-lg focus:outline-none transition-all hover:border-primary/50 group">
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <Image
                  src={session?.user?.image || "/placeholder.png"}
                  alt={session?.user?.name || "Username"}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full relative z-10 ring-2 ring-transparent group-hover:ring-primary/30 transition-all"
                />
              </div>
            )}
            <span className="text-sm font-medium text-foreground hidden sm:block">
              {isPending ? "Loading..." : session?.user?.name || "Guest"}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")} className="cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive cursor-pointer"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
