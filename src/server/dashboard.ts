"use server";

import { db } from "@/db/drizzle";
import { goal, habit, idealSelf, task, todo } from "@/db/schema";
import { eq } from "drizzle-orm";

export type HabitSummary = {
  id: string;
  name: string;
  description: string | null;
  recurrence: string;
  streak: number;
  completionRate: number;
  lastCompleted: string | null;
  completedToday: boolean;
};

export type TodoSummary = {
  id: string;
  name: string;
  description: string | null;
  completed: boolean;
  priority: "high" | "medium" | "low";
  targetDate: string | null;
};

export type GoalSummary = {
  id: string;
  name: string;
  description: string | null;
};

export type DashboardData = {
  userId: string;
  habits: HabitSummary[];
  todos: TodoSummary[];
  goals: GoalSummary[];
  idealSelf: {
    id: string;
    description: string;
    priorityAreas: string[];
  } | null;
};

export async function getDashboardData(userId: string): Promise<DashboardData> {
  if (!userId) {
    throw new Error("User ID is required to load dashboard data.");
  }

  const today = new Date().toDateString();

  const [habitRows, todoRows, goalRows, idealSelfRows] = await Promise.all([
    db.select().from(habit).where(eq(habit.userId, userId)),
    db
      .select({
        todo,
        task,
      })
      .from(todo)
      .leftJoin(task, eq(todo.taskId, task.id))
      .where(eq(todo.userId, userId)),
    db.select().from(goal).where(eq(goal.userId, userId)),
    db.select().from(idealSelf).where(eq(idealSelf.userId, userId)).limit(1),
  ]);

  const habits: HabitSummary[] = habitRows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? null,
    recurrence: row.recurrence,
    streak: row.streakCount ?? 0,
    completionRate: row.completionRate ?? 0,
    lastCompleted: row.lastCompleted ? row.lastCompleted.toISOString() : null,
    completedToday:
      row.lastCompleted !== null && row.lastCompleted.toDateString() === today,
  }));

  const todos: TodoSummary[] = todoRows.map(({ todo: todoRow, task: taskRow }) => ({
    id: todoRow.id,
    name: todoRow.name,
    description: todoRow.description ?? taskRow?.description ?? null,
    completed: Boolean(todoRow.isCompleted),
    priority: (taskRow?.priority as TodoSummary["priority"]) ?? "medium",
    targetDate: todoRow.targetDate ? todoRow.targetDate.toISOString() : null,
  }));

  const goals: GoalSummary[] = goalRows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? null,
  }));

  const idealSelfProfile = idealSelfRows[0]
    ? {
        id: idealSelfRows[0].id,
        description: idealSelfRows[0].description,
        priorityAreas: Array.isArray(idealSelfRows[0].priorityAreas)
          ? (idealSelfRows[0].priorityAreas as string[])
          : [],
      }
    : null;

  return {
    userId,
    habits,
    todos,
    goals,
    idealSelf: idealSelfProfile,
  };
}
