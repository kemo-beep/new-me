/**
 * AI Service for New Me App
 * Handles interactions with Google Gemini AI
 */

interface RoadmapRequest {
    idealSelfVision: string
    priorityAreas: string[]
    financialVision: string
    healthVision: string
    signatureHabits: string
    constraints: string
}

interface GeneratedRoadmap {
    goals: Array<{
        name: string
        description: string
        milestones: Array<{
            name: string
            description: string
            targetDate: string
            tasks: Array<{
                name: string
                description: string
                priority: "high" | "medium" | "low"
                todos: Array<{
                    name: string
                    targetDate: string
                }>
            }>
        }>
    }>
    habits: Array<{
        name: string
        description: string
        recurrence: "daily" | "weekly"
        difficulty: "beginner" | "intermediate" | "advanced"
    }>
    idealSelfProfile: {
        traits: string[]
        skills: string[]
        lifestyle: string[]
    }
}

export async function generateIdealSelfRoadmap(
    answers: RoadmapRequest
): Promise<GeneratedRoadmap> {
    const priorityAreas = answers.priorityAreas.length ? answers.priorityAreas.join(", ") : "None specified"
    const constraints = answers.constraints?.trim() || "None specified"

    const prompt = `You are an AI life coach helping someone transform into their ideal self.

Based on their answers, create a comprehensive, actionable roadmap broken down into manageable pieces.

USER'S ANSWERS:
1. Ideal Self Vision: ${answers.idealSelfVision}
2. Strategic Focus Areas: ${priorityAreas}
3. Financial North Star: ${answers.financialVision}
4. Health & Energy Vision: ${answers.healthVision}
5. Signature Habits (bullets allowed): ${answers.signatureHabits}
6. Constraints & Preferences: ${constraints}

Create a detailed roadmap with:
- 2-3 specific, measurable GOALS (related to their ideal self)
- For each goal, create 2-3 MILESTONES (steps toward the goal)
- For each milestone, create 3-5 specific TASKS (actionable items)
- For each task, create 2-4 specific TODOS (daily/weekly actions)
- 3-5 HABITS that support becoming their ideal self
- An IDEAL SELF PROFILE with key traits, skills, and lifestyle attributes

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "goals": [
    {
      "name": "Goal name",
      "description": "Detailed description",
      "milestones": [
        {
          "name": "Milestone name",
          "description": "Description",
          "targetDate": "YYYY-MM-DD",
          "tasks": [
            {
              "name": "Task name",
              "description": "Description",
              "priority": "high|medium|low",
              "todos": [
                {
                  "name": "Todo name",
                  "targetDate": "YYYY-MM-DD"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "habits": [
    {
      "name": "Habit name",
      "description": "Description",
      "recurrence": "daily|weekly",
      "difficulty": "beginner|intermediate|advanced"
    }
  ],
  "idealSelfProfile": {
    "traits": ["trait1", "trait2"],
    "skills": ["skill1", "skill2"],
    "lifestyle": ["lifestyle1", "lifestyle2"]
  }
}

Make it practical, achievable, and inspiring. Focus on small, consistent actions over time.`

    try {
        const geminiApiKey = process.env.GEMINI_API_KEY
        console.log("[AI Service] Gemini API key present:", !!geminiApiKey)
        console.log("[AI Service] API key length:", geminiApiKey?.length || 0)

        if (!geminiApiKey) {
            throw new Error("Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file.")
        }

        // Call Gemini AI
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                }),
            }
        )

        if (!response.ok) {
            const errorBody = await response.text()
            console.error("[AI Service] Gemini API error response:", errorBody)
            console.error("[AI Service] Response status:", response.status)
            throw new Error(`Gemini API error: ${response.statusText} - ${errorBody}`)
        }

        const data = await response.json()

        // Extract the text response
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!textResponse) {
            throw new Error("No response from Gemini AI")
        }

        // Parse the JSON response (handle markdown code blocks if present)
        const cleanedText = textResponse.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim()
        const roadmap = JSON.parse(cleanedText)

        return roadmap as GeneratedRoadmap
    } catch (error) {
        console.error("Error generating roadmap:", error)
        throw new Error("Failed to generate AI roadmap. Please try again.")
    }
}


