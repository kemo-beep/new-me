import React from "react";
import MenuItem from "@/components/dashboard/MenuItem";
import { navigationData } from "@/data/navigation";
import { NavigationSection } from "@/types/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";

export const Sidebar = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <aside
      className={`bg-sidebar-primary h-screen border-r transition-all duration-300 fixed left-0 top-0 z-10 backdrop-blur-sm ${isCollapsed ? "w-16" : "w-64"
        }`}
    >
      <div className="p-4 py-4 border-b h-16 sticky top-0 bg-sidebar-primary/95 backdrop-blur-sm">
        <div className="flex items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#44cc00]/20 to-transparent blur-xl opacity-50" />
            <Image
              src={isDark ? "/images/LogoDark.png" : "/images/LogoLight.png"}
              alt="Logo"
              className="w-9 h-9 mr-2 relative z-10"
              width={36}
              height={36}
            />
          </div>
          {!isCollapsed && (
            <span className="text-2xl text-[#7A7A7A] font-extralight ml-3 tracking-tight">
              Orchestra<span className="font-extralight text-[#44cc00]">9</span>
            </span>
          )}
        </div>
      </div>
      <nav className="mt-4 px-2 space-y-6 overflow-y-auto h-[calc(100vh-4rem)] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
        {navigationData.map((section) => (
          <div key={section.title} className="space-y-2">
            {!isCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-2">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item: NavigationSection["items"][0]) => (
                <MenuItem
                  key={item.label}
                  item={item}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};
