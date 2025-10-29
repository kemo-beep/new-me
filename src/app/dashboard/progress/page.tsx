"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, Calendar, Award, Flame } from "lucide-react"

// Mock data
const weeklyData = [
    { day: "Mon", tasks: 8, habits: 3, total: 11 },
    { day: "Tue", tasks: 6, habits: 3, total: 9 },
    { day: "Wed", tasks: 5, habits: 2, total: 7 },
    { day: "Thu", tasks: 7, habits: 3, total: 10 },
    { day: "Fri", tasks: 9, habits: 3, total: 12 },
    { day: "Sat", tasks: 3, habits: 2, total: 5 },
    { day: "Sun", tasks: 4, habits: 3, total: 7 },
]

const lifeAreas = [
    { name: "Health", score: 85, color: "bg-green-500" },
    { name: "Career", score: 70, color: "bg-blue-500" },
    { name: "Relationships", score: 60, color: "bg-pink-500" },
    { name: "Personal Growth", score: 75, color: "bg-purple-500" },
    { name: "Financial", score: 55, color: "bg-yellow-500" },
    { name: "Spiritual", score: 45, color: "bg-indigo-500" },
]

export default function ProgressPage() {
    const idealSelfAlignment = 72
    const currentStreak = 5
    const totalXP = 2840
    const level = Math.floor(totalXP / 1000) + 1
    const xpForNextLevel = (level * 1000) - totalXP

    const avgWeeklyScore = weeklyData.reduce((sum, d) => sum + d.total, 0) / weeklyData.length
    const avgLifeAreasScore = lifeAreas.reduce((sum, area) => sum + area.score, 0) / lifeAreas.length

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
            {/* Main Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-2 border-indigo-200/50 dark:border-indigo-900/50 hover:border-indigo-300/50 dark:hover:border-indigo-700/50 transition-all duration-300 hover:shadow-lg group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Ideal Self Alignment</CardTitle>
                        <div className="p-2 bg-indigo-500/10 dark:bg-indigo-900/20 rounded-lg group-hover:bg-indigo-500/20 dark:group-hover:bg-indigo-900/30 transition-colors">
                            <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                            {idealSelfAlignment}%
                        </div>
                        <Progress value={idealSelfAlignment} className="h-2" />
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:border-orange-500/30 group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                        <div className="p-2 bg-orange-500/10 dark:bg-orange-900/20 rounded-lg group-hover:bg-orange-500/20 dark:group-hover:bg-orange-900/30 transition-colors">
                            <Flame className="h-5 w-5 text-orange-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-orange-500 mb-1">{currentStreak}</div>
                        <p className="text-xs text-muted-foreground">Days on fire</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:border-yellow-500/30 group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Level</CardTitle>
                        <div className="p-2 bg-yellow-500/10 dark:bg-yellow-900/20 rounded-lg group-hover:bg-yellow-500/20 dark:group-hover:bg-yellow-900/30 transition-colors">
                            <Award className="h-5 w-5 text-yellow-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-yellow-500 mb-1">{level}</div>
                        <p className="text-xs text-muted-foreground">
                            {xpForNextLevel} XP to Level {level + 1}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:border-purple-500/30 group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total XP</CardTitle>
                        <div className="p-2 bg-purple-500/10 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-500/20 dark:group-hover:bg-purple-900/30 transition-colors">
                            <TrendingUp className="h-5 w-5 text-purple-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-purple-500 mb-1">{totalXP}</div>
                        <p className="text-xs text-muted-foreground">All time earned</p>
                    </CardContent>
                </Card>
            </div>

            {/* Life Areas Radar */}
            <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Life Areas Progress
                    </CardTitle>
                    <CardDescription>
                        Your alignment across different life areas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {lifeAreas.map((area) => (
                            <div key={area.name} className="space-y-2 group">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{area.name}</span>
                                    <span className="text-muted-foreground">{area.score}%</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                                    <div
                                        className={`${area.color} h-3 rounded-full transition-all duration-500 group-hover:scale-y-110`}
                                        style={{ width: `${area.score}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="pt-4 border-t">
                            <div className="flex justify-between text-sm">
                                <span className="font-semibold">Overall Average</span>
                                <span className="font-semibold">{Math.round(avgLifeAreasScore)}%</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Weekly Activity */}
            <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Weekly Activity
                    </CardTitle>
                    <CardDescription>
                        Your performance over the past 7 days
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between mb-4">
                            <div>
                                <p className="text-2xl font-bold">{Math.round(avgWeeklyScore)}</p>
                                <p className="text-sm text-muted-foreground">Avg daily completions</p>
                            </div>
                            <Badge variant="secondary" className="text-sm">
                                {weeklyData.reduce((sum, d) => sum + d.total, 0)} total this week
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            {weeklyData.map((day) => (
                                <div key={day.day} className="flex items-center gap-4 group cursor-pointer hover:translate-x-2 transition-transform">
                                    <div className="w-12 text-sm font-medium">{day.day}</div>
                                    <div className="flex-1 bg-secondary rounded-full h-6 relative overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-primary to-primary/80 h-6 rounded-full transition-all duration-300"
                                            style={{ width: `${(day.total / 15) * 100}%` }}
                                        />
                                    </div>
                                    <div className="text-sm font-medium w-16 text-right">
                                        {day.total} items
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/20">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-indigo-500" />
                        </div>
                        <CardTitle>AI Weekly Summary</CardTitle>
                    </div>
                    <CardDescription>
                        Insights and recommendations from your AI coach
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-lg p-4">
                            <h4 className="font-semibold mb-2 text-indigo-900 dark:text-indigo-100">
                                📈 Strength: Health & Wellness
                            </h4>
                            <p className="text-sm text-indigo-800 dark:text-indigo-200">
                                You've maintained excellent consistency in your health habits this week.
                                Your meditation and exercise routines are creating positive momentum.
                            </p>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4">
                            <h4 className="font-semibold mb-2 text-yellow-900 dark:text-yellow-100">
                                💡 Growth Opportunity: Career Development
                            </h4>
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                Consider dedicating more time to your career goals. Your current progress
                                is good, but there's potential to accelerate your professional growth.
                            </p>
                        </div>

                        <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
                            <h4 className="font-semibold mb-2 text-green-900 dark:text-green-100">
                                🎯 Recommendation
                            </h4>
                            <p className="text-sm text-green-800 dark:text-green-200">
                                Focus on completing the &apos;Complete online course&apos; task.
                                This aligns with your career goals and will help push your Ideal Self
                                alignment score higher.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

