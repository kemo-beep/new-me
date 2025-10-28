"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useSession } from "@/hooks/useAuth";
import { IdealSelfQuestionnaire } from "@/components/onboarding/IdealSelfQuestionnaire";

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session, loading } = useSession();
    const userId = session?.user?.id ?? "";

    useEffect(() => {
        if (!loading && !session?.user) {
            router.push("/sign-in");
        }
    }, [loading, session?.user, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <Card className="p-8">
                    <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                    </div>
                </Card>
            </div>
        );
    }

    if (!session?.user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <IdealSelfQuestionnaire
                userId={userId}
                onComplete={() => router.push("/dashboard")}
                variant="standalone"
            />
        </div>
    );
}
