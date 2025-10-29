"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, Target, Calendar, TrendingUp } from "lucide-react"

// Mock data
const milestones = [
    {
        id: "1",
        name: "Health & Wellness",
        description: "Build a consistent wellness routine",
        tasksTotal: 5,
        tasksCompleted: 3,
        completionRate: 0.6,
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
        id: "2",
        name: "Career Growth",
        description: "Advance professional skills",
        tasksTotal: 8,
        tasksCompleted: 2,
        completionRate: 0.25,
        targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
]

const tasks = [
    { id: "1", milestoneId: "1", name: "Set up meditation space", priority: "high", completed: false, targetDate: new Date() },
    { id: "2", milestoneId: "1", name: "Create workout schedule", priority: "medium", completed: true, targetDate: new Date() },
    { id: "3", milestoneId: "1", name: "Plan meal prep", priority: "medium", completed: false, targetDate: new Date() },
    { id: "4", milestoneId: "2", name: "Complete online course", priority: "high", completed: false, targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
]

export default function TasksPage() {
    const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null)

    const selectedTasks = selectedMilestone
        ? tasks.filter(t => t.milestoneId === selectedMilestone)
        : tasks

    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.completed).length
    const overallProgress = (completedTasks / totalTasks) * 100

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
            {/* Header Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-lg transition-all duration-300 hover:border-indigo-500/30 group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                        <div className="p-2 bg-indigo-500/10 dark:bg-indigo-900/20 rounded-lg group-hover:bg-indigo-500/20 dark:group-hover:bg-indigo-900/30 transition-colors">
                            <Target className="h-5 w-5 text-indigo-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold mb-1">{totalTasks}</div>
                        <p className="text-xs text-muted-foreground">
                            {completedTasks} completed
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:border-purple-500/30 group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Milestones</CardTitle>
                        <div className="p-2 bg-purple-500/10 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-500/20 dark:group-hover:bg-purple-900/30 transition-colors">
                            <Calendar className="h-5 w-5 text-purple-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold mb-1">{milestones.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Active milestones
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:border-green-500/30 group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Progress</CardTitle>
                        <div className="p-2 bg-green-500/10 dark:bg-green-900/20 rounded-lg group-hover:bg-green-500/20 dark:group-hover:bg-green-900/30 transition-colors">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold mb-1">{Math.round(overallProgress)}%</div>
                        <p className="text-xs text-muted-foreground">
                            Overall completion
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Milestones */}
            <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Milestones
                    </CardTitle>
                    <CardDescription>
                        Track your progress toward your goals
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {milestones.map((milestone) => {
                        const milestoneTasks = tasks.filter(t => t.milestoneId === milestone.id)
                        const completed = milestoneTasks.filter(t => t.completed).length
                        const rate = milestoneTasks.length > 0 ? (completed / milestoneTasks.length) * 100 : 0

                        return (
                            <Card
                                key={milestone.id}
                                className={`cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-md ${selectedMilestone === milestone.id
                                        ? "border-primary border-2 shadow-lg bg-gradient-to-br from-primary/5 to-transparent"
                                        : "hover:border-primary/50"
                                    }`}
                                onClick={() => setSelectedMilestone(
                                    selectedMilestone === milestone.id ? null : milestone.id
                                )}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle>{milestone.name}</CardTitle>
                                            <CardDescription>{milestone.description}</CardDescription>
                                        </div>
                                        <Badge variant="outline">
                                            {completed}/{milestoneTasks.length}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-medium">{Math.round(rate)}%</span>
                                        </div>
                                        <div className="w-full bg-secondary rounded-full h-2">
                                            <div
                                                className="bg-primary h-2 rounded-full transition-all"
                                                style={{ width: `${rate}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Target: {milestone.targetDate.toLocaleDateString()}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </CardContent>
            </Card>

            {/* Tasks List */}
            <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                Tasks
                            </CardTitle>
                            <CardDescription>
                                {selectedMilestone ? "Filtered tasks" : "All tasks"}
                            </CardDescription>
                        </div>
                        <Button size="sm" className="hover:scale-105 transition-transform">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Task
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {selectedTasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-all duration-200 hover:scale-[1.01] hover:shadow-sm cursor-pointer group"
                            >
                                <Checkbox
                                    checked={task.completed}
                                    className="group-hover:ring-2 group-hover:ring-primary/50 transition-all"
                                />
                                <div className="flex-1">
                                    <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                                        {task.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge
                                            variant={
                                                task.priority === "high" ? "destructive" :
                                                    task.priority === "medium" ? "default" :
                                                        "secondary"
                                            }
                                            className="text-xs"
                                        >
                                            {task.priority}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {task.targetDate.toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {selectedTasks.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No tasks found
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

