"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, BookOpen, TrendingUp, Calendar, Smile, Frown, Meh } from "lucide-react"

// Mock data
const reflections = [
    {
        id: "1",
        content: "Today was a great day! I completed all my habits and felt very productive. The morning meditation really set a positive tone for the day.",
        sentimentScore: 0.85,
        mood: "happy",
        date: new Date(),
        keywords: ["productive", "meditation", "positive"],
    },
    {
        id: "2",
        content: "Struggled with motivation today. Didn't complete my workout but managed to get other tasks done. Need to refocus tomorrow.",
        sentimentScore: 0.2,
        mood: "neutral",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        keywords: ["motivation", "workout", "focus"],
    },
    {
        id: "3",
        content: "Feeling overwhelmed with all my goals. Taking a moment to reflect and prioritize what really matters to my ideal self.",
        sentimentScore: -0.1,
        mood: "sad",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        keywords: ["goals", "prioritize", "overwhelmed"],
    },
]

const moodIcons = {
    happy: <Smile className="h-5 w-5 text-green-500" />,
    neutral: <Meh className="h-5 w-5 text-yellow-500" />,
    sad: <Frown className="h-5 w-5 text-blue-500" />,
}

export default function ReflectionsPage() {
    const [showNewReflection, setShowNewReflection] = useState(false)
    const [newReflection, setNewReflection] = useState("")

    const avgSentiment = reflections.reduce((sum, r) => sum + r.sentimentScore, 0) / reflections.length

    const handleSubmit = () => {
        // TODO: Save reflection to database
        console.log("New reflection:", newReflection)
        setNewReflection("")
        setShowNewReflection(false)
    }

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            {/* Header Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Reflections</CardTitle>
                        <BookOpen className="h-5 w-5 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{reflections.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Journal entries
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg Sentiment</CardTitle>
                        <TrendingUp className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {avgSentiment > 0.5 ? "😊" : avgSentiment > 0 ? "😐" : "😔"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Emotional well-being
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">This Week</CardTitle>
                        <Calendar className="h-5 w-5 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {reflections.filter(r => r.date.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Recent entries
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* New Reflection Card */}
            {showNewReflection ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Write Your Reflection</CardTitle>
                        <CardDescription>
                            Take a moment to reflect on your journey
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            value={newReflection}
                            onChange={(e) => setNewReflection(e.target.value)}
                            placeholder="How are you feeling today? What went well? What did you learn?"
                            className="min-h-32"
                        />
                        <div className="flex gap-2">
                            <Button onClick={handleSubmit}>Save Reflection</Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowNewReflection(false)
                                    setNewReflection("")
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Button
                    className="w-full"
                    onClick={() => setShowNewReflection(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Reflection
                </Button>
            )}

            {/* Reflections List */}
            <div className="space-y-4">
                {reflections.map((reflection) => (
                    <Card key={reflection.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    {moodIcons[reflection.mood as keyof typeof moodIcons]}
                                    <div>
                                        <CardTitle className="text-lg capitalize">{reflection.mood}</CardTitle>
                                        <CardDescription>
                                            {reflection.date.toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Badge
                                    variant={reflection.sentimentScore > 0.5 ? "default" : reflection.sentimentScore > 0 ? "secondary" : "destructive"}
                                >
                                    Sentiment: {Math.round(reflection.sentimentScore * 100)}%
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-foreground whitespace-pre-wrap mb-4">
                                {reflection.content}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {reflection.keywords.map((keyword, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                        {keyword}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

