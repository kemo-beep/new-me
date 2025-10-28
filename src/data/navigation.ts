import { NavigationSection } from "../types/navigation";

export const navigationData: NavigationSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: "layoutDashboard", href: "/dashboard" },
      { label: "Habits", icon: "flame", href: "/dashboard/habits" },
      { label: "Tasks", icon: "checkSquare", href: "/dashboard/tasks" },
      { label: "Reflections", icon: "bookOpen", href: "/dashboard/reflections" },
      { label: "Progress", icon: "trendingUp", href: "/dashboard/progress" },
    ],
  },
  {
    title: "AI Coaching",
    items: [
      {
        label: "AI Coach",
        icon: "sparkles",
        href: "/dashboard/coach",
      },
      {
        label: "Ideal Self",
        icon: "target",
        href: "/dashboard/ideal-self",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Profile", icon: "user", href: "/dashboard/profile" },
    ],
  },
];
