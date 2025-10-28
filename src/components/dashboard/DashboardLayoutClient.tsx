"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/dashboard/TopBar";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import type { DashboardData } from "@/server/dashboard";

export function DashboardLayoutClient({
  children,
  data,
}: {
  children: React.ReactNode;
  data: DashboardData;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <DashboardProvider value={data}>
      <div className="hidden lg:block">
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </div>
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <TopBar
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
        <main className="flex-1">{children}</main>
      </div>
    </DashboardProvider>
  );
}
