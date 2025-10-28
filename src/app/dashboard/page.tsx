"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plus,
  Target,
  Flame,
  TrendingUp,
  Calendar,
  Sparkles
} from "lucide-react"
import { useDashboardData } from "@/components/dashboard/dashboard-context"
import type { HabitSummary, TodoSummary } from "@/server/dashboard"
import { IdealSelfQuestionnaire } from "@/components/onboarding/IdealSelfQuestionnaire"

type HabitItem = HabitSummary & { completed: boolean }
type TodoItem = TodoSummary & { completed: boolean }

export default function DashboardPage() {
  const { userId, habits, todos, goals, idealSelf } = useDashboardData()

  const [habitEntries, setHabitEntries] = useState<HabitItem[]>(() =>
    habits.map((habit) => ({ ...habit, completed: habit.completedToday }))
  )
  const [todoEntries, setTodoEntries] = useState<TodoItem[]>(() =>
    todos.map((todo) => ({ ...todo, completed: todo.completed }))
  )
  const [showOnboarding, setShowOnboarding] = useState(false)

  const hasRoadmapData = habits.length > 0 || todos.length > 0 || goals.length > 0 || idealSelf !== null

  useEffect(() => {
    setHabitEntries(habits.map((habit) => ({ ...habit, completed: habit.completedToday })))
  }, [habits])

  useEffect(() => {
    setTodoEntries(todos.map((todo) => ({ ...todo, completed: todo.completed })))
  }, [todos])

  useEffect(() => {
    if (!hasRoadmapData) {
      setShowOnboarding(true)
    }
  }, [hasRoadmapData])

  const completedHabits = useMemo(
    () => habitEntries.filter((habit) => habit.completed).length,
    [habitEntries]
  )
  const habitProgress = habitEntries.length > 0 ? (completedHabits / habitEntries.length) * 100 : 0

  const completedTodos = useMemo(
    () => todoEntries.filter((todo) => todo.completed).length,
    [todoEntries]
  )
  const todoProgress = todoEntries.length > 0 ? (completedTodos / todoEntries.length) * 100 : 0

  const dailyScore = (habitProgress + todoProgress) / 2
  const weeklyStreak = habitEntries.length > 0 ? Math.max(...habitEntries.map((habit) => habit.streak)) : 0
  const xpEarned = completedHabits * 10 + completedTodos * 5

  const showHabitsEmptyState = habitEntries.length === 0
  const showTodosEmptyState = todoEntries.length === 0

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    window.location.reload()
  }

  const toggleHabit = (id: string) => {
    setHabitEntries((prev) =>
      prev.map((habit) => (habit.id === id ? { ...habit, completed: !habit.completed } : habit))
    )
  }

  const toggleTodo = (id: string) => {
    setTodoEntries((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    )
  }

  const weeklyInsight = idealSelf
    ? `Focus on ${idealSelf.priorityAreas.slice(0, 2).join(" and ") || "your top priorities"} this week.`
    : "Your AI roadmap will drop here once you complete onboarding."

  if (showOnboarding) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <IdealSelfQuestionnaire userId={userId} onComplete={handleOnboardingComplete} />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-2 border-indigo-200 dark:border-indigo-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Daily Score</CardTitle>
              <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {Math.round(dailyScore)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Your progress today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{weeklyStreak}</div>
              <p className="text-xs text-muted-foreground mt-1">Days in a row</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">XP Earned</CardTitle>
              <Sparkles className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-500">{xpEarned}</div>
              <p className="text-xs text-muted-foreground mt-1">Total XP today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Level</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{Math.floor(xpEarned / 100) + 1}</div>
              <p className="text-xs text-muted-foreground mt-1">Next: {100 - (xpEarned % 100)} XP</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Today&apos;s Habits</CardTitle>
                  <CardDescription>
                    {completedHabits} of {habitEntries.length} completed
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <Progress value={habitProgress} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              {habitEntries.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <Checkbox checked={habit.completed} onCheckedChange={() => toggleHabit(habit.id)} />
                  <div className="flex-1">
                    <p className="font-medium">{habit.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {habit.streak > 0 && (
                        <>
                          <Flame className="h-3 w-3 text-orange-500" />
                          <span className="text-xs text-orange-500">{habit.streak} day streak</span>
                        </>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {habit.recurrence}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}

              {showHabitsEmptyState && (
                <div className="border-dashed border-2 border-muted-foreground/40 bg-muted/20 text-center py-10 rounded-lg">
                  <div className="space-y-3">
                    <p className="text-lg font-semibold">No habits yet</p>
                    <p className="text-sm text-muted-foreground">
                      Your AI-generated habits will appear here once you complete the onboarding.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Today&apos;s To-Dos</CardTitle>
                  <CardDescription>
                    {completedTodos} of {todoEntries.length} completed
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <Progress value={todoProgress} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              {todoEntries.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
                  <div className="flex-1">
                    <p className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                      {todo.name}
                    </p>
                    <Badge
                      variant={
                        todo.priority === "high"
                          ? "destructive"
                          : todo.priority === "medium"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs mt-1"
                    >
                      {todo.priority}
                    </Badge>
                  </div>
                </div>
              ))}

              {showTodosEmptyState && (
                <div className="border-dashed border-2 border-muted-foreground/40 bg-muted/20 text-center py-10 rounded-lg">
                  <div className="space-y-3">
                    <p className="text-lg font-semibold">No tasks scheduled</p>
                    <p className="text-sm text-muted-foreground">
                      Your AI-generated daily tasks will appear here after onboarding.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Weekly Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Summary</CardTitle>
            <CardDescription>Your progress this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="space-y-2 text-center">
                    <div className="text-sm font-medium">Day {i + 1}</div>
                    <div className="h-24 border rounded-lg flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">AI Insight:</strong> {weeklyInsight}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}
