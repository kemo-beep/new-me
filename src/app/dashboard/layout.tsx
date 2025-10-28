import { DashboardLayoutClient } from "@/components/dashboard/DashboardLayoutClient";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getDashboardData } from "@/server/dashboard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session) {
      redirect("/sign-in");
    }

    const userId = session.user?.id;

    if (!userId) {
      redirect("/sign-in");
    }

    const dashboardData = await getDashboardData(userId);

    return (
      <div className="flex min-h-screen">
        <DashboardLayoutClient data={dashboardData}>{children}</DashboardLayoutClient>
      </div>
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message !== "NEXT_REDIRECT")
      console.error("Auth error:", error);
    redirect("/sign-in");
  }
}
