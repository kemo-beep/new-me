"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, Flame, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"

// Mock data
const habits = [
    {
        id: "1",
        name: "Morning Meditation",
        description: "10 minutes of mindfulness",
        recurrence: "daily",
        streak: 5,
        lastCompleted: new Date(),
        completionRate: 0.83,
        weeklyCompletions: 7,
        isActive: true
    },
    {
        id: "2",
        name: "Exercise",
        description: "At least 30 minutes of physical activity",
        recurrence: "daily",
        streak: 0,
        lastCompleted: null,
        completionRate: 0.4,
        weeklyCompletions: 3,
        isActive: true
    },
    {
        id: "3",
        name: "Read 30min",
        description: "Expand your knowledge daily",
        recurrence: "daily",
        streak: 12,
        lastCompleted: new Date(),
        completionRate: 0.95,
        weeklyCompletions: 7,
        isActive: true
    },
]

export default function HabitsPage() {
    const [activeTab, setActiveTab] = useState<"active" | "all">("active")

    const activeHabits = habits.filter(h => h.isActive)
    const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0)
    const avgCompletionRate = habits.reduce((sum, h) => sum + h.completionRate, 0) / habits.length

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
            {/* Header Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-lg transition-all duration-300 hover:border-orange-500/30 group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Streaks</CardTitle>
                        <div className="p-2 bg-orange-500/10 dark:bg-orange-900/20 rounded-lg group-hover:bg-orange-500/20 dark:group-hover:bg-orange-900/30 transition-colors">
                            <Flame className="h-5 w-5 text-orange-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold mb-1">{totalStreak}</div>
                        <p className="text-xs text-muted-foreground">
                            Combined fire power
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:border-indigo-500/30 group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
                        <div className="p-2 bg-indigo-500/10 dark:bg-indigo-900/20 rounded-lg group-hover:bg-indigo-500/20 dark:group-hover:bg-indigo-900/30 transition-colors">
                            <Calendar className="h-5 w-5 text-indigo-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold mb-1">{activeHabits.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {habits.length} total habits
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:border-green-500/30 group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
                        <div className="p-2 bg-green-500/10 dark:bg-green-900/20 rounded-lg group-hover:bg-green-500/20 dark:group-hover:bg-green-900/30 transition-colors">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold mb-1">{Math.round(avgCompletionRate * 100)}%</div>
                        <p className="text-xs text-muted-foreground">
                            This week
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="flex gap-2 border-b pb-4">
                <Button
                    variant={activeTab === "active" ? "default" : "ghost"}
                    onClick={() => setActiveTab("active")}
                    className="hover:scale-105 transition-transform"
                >
                    Active ({activeHabits.length})
                </Button>
                <Button
                    variant={activeTab === "all" ? "default" : "ghost"}
                    onClick={() => setActiveTab("all")}
                    className="hover:scale-105 transition-transform"
                >
                    All Habits ({habits.length})
                </Button>
            </div>

            {/* Habits List */}
            <div className="space-y-4">
                {habits.map((habit) => (
                    <Card key={habit.id} className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer group">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                        {habit.name}
                                    </CardTitle>
                                    {habit.description && (
                                        <CardDescription>{habit.description}</CardDescription>
                                    )}
                                </div>
                                <Badge variant={habit.isActive ? "default" : "secondary"} className="hover:scale-105 transition-transform">
                                    {habit.recurrence}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Streak Info */}
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <Flame className="h-5 w-5 text-orange-500" />
                                        <div>
                                            <p className="text-sm font-medium">{habit.streak} day streak</p>
                                            <p className="text-xs text-muted-foreground">Keep it going!</p>
                                        </div>
                                    </div>
                                    {habit.lastCompleted && (
                                        <div>
                                            <p className="text-sm font-medium">
                                                Last: {habit.lastCompleted.toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Completed today</p>
                                        </div>
                                    )}
                                </div>

                                {/* Completion Progress */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Weekly Progress</span>
                                        <span className="font-medium">
                                            {habit.weeklyCompletions}/{habit.recurrence === "daily" ? "7" : "1"}
                                        </span>
                                    </div>
                                    <Progress value={habit.completionRate * 100} className="h-2" />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="default"
                                        className="flex-1 hover:scale-105 transition-transform"
                                        asChild
                                    >
                                        <Link href={`/dashboard/habits/${habit.id}`}>
                                            View Details
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="icon" className="hover:scale-105 transition-transform">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {habits.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Flame className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-semibold mb-2">No habits yet</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Start your transformation by creating your first habit
                        </p>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Habit
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

