"use server"

import { db } from "@/db/drizzle"
import { idealSelf, goal, milestone, habit, task, todo } from "@/db/schema"
import { generateIdealSelfRoadmap } from "@/lib/ai-service"
import type { IdealSelfQuestionnaireAnswers } from "@/types/onboarding"

const toList = (input: string) =>
    input
        .split(/\r?\n|•/)
        .map(item => item.replace(/^[\s•\-]+/, "").trim())
        .filter(Boolean)

export async function processOnboarding(userId: string, answers: IdealSelfQuestionnaireAnswers) {
    try {
        console.log("[Onboarding] Starting for user:", userId)
        const sanitizedPriorityAreas = answers.priorityAreas.map(area => area.trim()).filter(Boolean)
        const signatureHabitsList = toList(answers.signatureHabits)
        console.log("[Onboarding] Calling AI to generate roadmap...")
        const roadmap = await generateIdealSelfRoadmap({
            idealSelfVision: answers.idealSelfVision,
            priorityAreas: sanitizedPriorityAreas,
            financialVision: answers.financialVision,
            healthVision: answers.healthVision,
            signatureHabits: signatureHabitsList.join(", "),
            constraints: answers.constraints,
        })
        console.log("[Onboarding] AI roadmap generated successfully")
        console.log("[Onboarding] Roadmap structure:", JSON.stringify(roadmap, null, 2))

        // Save ideal self profile
        console.log("[Onboarding] Saving ideal self profile...")
        const idealSelfId = crypto.randomUUID()
        const idealSelfProfile = roadmap.idealSelfProfile
        const now = new Date()
        const constraintsText = answers.constraints.trim()

        await db.insert(idealSelf).values({
            id: idealSelfId,
            userId,
            description: answers.idealSelfVision,
            traits: idealSelfProfile.traits,
            areasToImprove: sanitizedPriorityAreas,
            priorityAreas: sanitizedPriorityAreas,
            financialVision: answers.financialVision.trim() || null,
            healthVision: answers.healthVision.trim() || null,
            signatureHabits: signatureHabitsList,
            constraints: constraintsText ? constraintsText : null,
            goals: roadmap.goals.map(g => g.name),
            createdAt: now,
            updatedAt: now,
        })
        console.log("[Onboarding] Ideal self profile saved")

        // Save goals and their hierarchies
        console.log(`[Onboarding] Saving ${roadmap.goals.length} goals...`)
        for (const roadmapGoal of roadmap.goals) {
            const goalId = crypto.randomUUID()

            await db.insert(goal).values({
                id: goalId,
                userId,
                idealSelfId,
                name: roadmapGoal.name,
                description: roadmapGoal.description,
                status: "active",
                createdAt: now,
                updatedAt: now,
            })

            // Save milestones
            for (const roadmapMilestone of roadmapGoal.milestones) {
                const milestoneId = crypto.randomUUID()

                await db.insert(milestone).values({
                    id: milestoneId,
                    userId,
                    goalId,
                    name: roadmapMilestone.name,
                    description: roadmapMilestone.description,
                    tasksTotal: roadmapMilestone.tasks.length,
                    tasksCompleted: 0,
                    completionRate: 0,
                    targetDate: new Date(roadmapMilestone.targetDate),
                    createdAt: now,
                    updatedAt: now,
                })

                // Save tasks
                for (const roadmapTask of roadmapMilestone.tasks) {
                    const taskId = crypto.randomUUID()

                    await db.insert(task).values({
                        id: taskId,
                        userId,
                        milestoneId,
                        name: roadmapTask.name,
                        description: roadmapTask.description,
                        priority: roadmapTask.priority,
                        createdAt: now,
                        updatedAt: now,
                    })

                    // Save todos
                    for (const roadmapTodo of roadmapTask.todos) {
                        await db.insert(todo).values({
                            id: crypto.randomUUID(),
                            userId,
                            taskId,
                            name: roadmapTodo.name,
                            targetDate: new Date(roadmapTodo.targetDate),
                            isCompleted: false,
                            createdAt: now,
                            updatedAt: now,
                        })
                    }
                }
            }
        }

        // Save habits
        console.log(`[Onboarding] Saving ${roadmap.habits.length} habits...`)
        for (const roadmapHabit of roadmap.habits) {
            await db.insert(habit).values({
                id: crypto.randomUUID(),
                userId,
                name: roadmapHabit.name,
                description: roadmapHabit.description,
                recurrence: roadmapHabit.recurrence,
                streakCount: 0,
                completionRate: 0,
                createdAt: now,
                updatedAt: now,
            })
        }

        console.log("[Onboarding] All data saved successfully!")
        return { success: true, message: "Onboarding completed successfully!" }
    } catch (error) {
        console.error("Error processing onboarding:", error)
        if (error instanceof Error) {
            console.error("Error message:", error.message)
            console.error("Error stack:", error.stack)
        }
        throw new Error("Failed to process onboarding. Please try again.")
    }
}


