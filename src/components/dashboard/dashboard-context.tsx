"use client";

import { createContext, useContext } from "react";
import type { DashboardData } from "@/server/dashboard";

const DashboardContext = createContext<DashboardData | null>(null);

export function DashboardProvider({
  value,
  children,
}: {
  value: DashboardData;
  children: React.ReactNode;
}) {
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardData(): DashboardData {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardData must be used within a DashboardProvider");
  }
  return context;
}
