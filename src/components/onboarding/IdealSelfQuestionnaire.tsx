"use client";

import { useMemo, useState } from "react";
import { processOnboarding } from "@/server/onboarding";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, Loader2, Sparkles, Target } from "lucide-react";
import { IdealSelfQuestionnaireAnswers as QuestionnaireAnswers } from "@/types/onboarding";
import { useSession } from "@/hooks/useAuth";

const FOCUS_AREAS: { label: string; value: string; helper: string }[] = [
  { label: "Financial Empowerment", value: "finance", helper: "Money habits, savings, investing" },
  { label: "Peak Health", value: "health", helper: "Movement, nutrition, rest" },
  { label: "Career Growth", value: "career", helper: "Impact, leadership, mastery" },
  { label: "Learning & Creativity", value: "learning", helper: "Skills, study, creative projects" },
  { label: "Relationships", value: "relationships", helper: "Family, friends, community" },
  { label: "Emotional Wellbeing", value: "wellbeing", helper: "Mindfulness, joy, balance" },
  { label: "Environment & Lifestyle", value: "environment", helper: "Home, routines, lifestyle" },
  { label: "Other (custom)", value: "other", helper: "Anything else that matters now" },
];

type StepDefinition =
  | {
      id: keyof QuestionnaireAnswers;
      type: "textarea";
      title: string;
      prompt: string;
      placeholder: string;
      coachTip?: string;
      minLength?: number;
      optional?: boolean;
    }
  | {
      id: "priorityAreas";
      type: "multiselect";
      title: string;
      prompt: string;
      coachTip?: string;
    };

const QUESTION_STEPS: StepDefinition[] = [
  {
    id: "idealSelfVision",
    type: "textarea",
    title: "Vision Statement",
    prompt: "Describe your ideal self in one vivid sentence.",
    placeholder:
      "In 12 months, I am a calm, confident founder who balances thriving finances with energising health routines...",
    coachTip: "Paint a picture of future-you that excites you. Mention how you feel, act, and what you regularly accomplish.",
    minLength: 30,
  },
  {
    id: "priorityAreas",
    type: "multiselect",
    title: "Top Focus Areas",
    prompt: "Which areas of life deserve focused attention right now?",
    coachTip: "Choose up to three so your plan stays laser-focused and achievable.",
  },
  {
    id: "financialVision",
    type: "textarea",
    title: "Financial Future",
    prompt: "Financially, what would success look like 12 months from now?",
    placeholder:
      "E.g. I consistently invest $500/month, maintain a 3-month emergency fund, and feel calm reviewing my finances weekly...",
    coachTip: "Quantify outcomes where possible. Think income, savings, debt, investing, or money mindset.",
    minLength: 25,
  },
  {
    id: "healthVision",
    type: "textarea",
    title: "Health & Energy",
    prompt: "Health-wise, how does future-you feel and what routines keep you energised?",
    placeholder:
      "E.g. I maintain strong energy with 5x strength workouts, meal-prepped whole foods, and 7.5 hours of sleep most nights...",
    coachTip: "Include movement, nutrition, recovery, or mental wellbeing routines that matter to you.",
    minLength: 25,
  },
  {
    id: "signatureHabits",
    type: "textarea",
    title: "Signature Habits",
    prompt: "List 3-5 weekly habits future-you is proud of.",
    placeholder:
      "• Review finances every Friday\n• Meal prep on Sundays\n• Deep work blocks 3 mornings/week\n• Evening reflection journal...",
    coachTip: "Bullet points work great. Think habits that reinforce your identity and priorities.",
    minLength: 40,
  },
  {
    id: "constraints",
    type: "textarea",
    title: "Constraints & Preferences",
    prompt: "Any constraints, preferences, or non-negotiables the plan should respect?",
    placeholder:
      "E.g. No workouts longer than 30 minutes, budget capped at $200/month, travel every other week, mornings are most focused...",
    coachTip: "Mention time limits, energy patterns, responsibilities, or resources so plans are realistic.",
    optional: true,
  },
];

interface IdealSelfQuestionnaireProps {
  onComplete?: () => void;
  variant?: "standalone" | "embedded";
  userId?: string;
}

export function IdealSelfQuestionnaire({
  onComplete,
  variant = "embedded",
  userId: propUserId,
}: IdealSelfQuestionnaireProps) {
  const { data: session, loading } = useSession();
  const userId = propUserId || session?.user?.id;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    idealSelfVision: "",
    priorityAreas: [],
    financialVision: "",
    healthVision: "",
    signatureHabits: "",
    constraints: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState("Aligning your roadmap...");
  const [error, setError] = useState<string | null>(null);

  const totalSteps = QUESTION_STEPS.length;
  const currentStep = QUESTION_STEPS[currentStepIndex];
  const progress = useMemo(
    () => Math.round(((currentStepIndex + 1) / totalSteps) * 100),
    [currentStepIndex, totalSteps]
  );

  const canProceed = useMemo(() => {
    if (currentStep.type === "multiselect") {
      return answers.priorityAreas.length > 0;
    }

    const value = answers[currentStep.id];
    const minLength = "minLength" in currentStep ? currentStep.minLength ?? 0 : 0;

    if (currentStep.optional) {
      return true;
    }

    if (typeof value === 'string') {
      return value.trim().length >= Math.max(minLength, 20);
    }
    return false;
  }, [answers, currentStep]);

  const goNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const toggleArea = (value: string) => {
    setAnswers((prev) => {
      const isSelected = prev.priorityAreas.includes(value);
      if (isSelected) {
        return {
          ...prev,
          priorityAreas: prev.priorityAreas.filter((area) => area !== value),
        };
      }

      if (prev.priorityAreas.length >= 3) {
        const [, ...rest] = prev.priorityAreas;
        return {
          ...prev,
          priorityAreas: [...rest, value],
        };
      }

      return {
        ...prev,
        priorityAreas: [...prev.priorityAreas, value],
      };
    });
  };

  const handleSubmit = async () => {
    if (!userId) {
      setError("You must be logged in to complete onboarding.");
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const trimmedAnswers: QuestionnaireAnswers = {
        idealSelfVision: answers.idealSelfVision.trim(),
        priorityAreas: answers.priorityAreas,
        financialVision: answers.financialVision.trim(),
        healthVision: answers.healthVision.trim(),
        signatureHabits: answers.signatureHabits.trim(),
        constraints: answers.constraints.trim(),
      };

      setProcessingStage("Generating goals, habits, and milestones with AI...");
      await processOnboarding(userId, trimmedAnswers);

      setProcessingStage("Saving your personalised roadmap...");
      await new Promise((resolve) => setTimeout(resolve, 600));

      await onComplete?.();
    } catch (submissionError) {
      console.error("Questionnaire submission error", submissionError);
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We couldn't create your roadmap. Please try again."
      );
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </CardContent>
      </Card>
    );
  }

  if (!userId) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Please sign in to continue with onboarding.</p>
        </CardContent>
      </Card>
    );
  }

  if (isProcessing) {
    return (
      <Card className="w-full max-w-2xl p-10 text-center">
        <div className="flex justify-center">
          <div className="relative">
            <Loader2 className="h-14 w-14 animate-spin text-indigo-600 dark:text-indigo-400" />
            <Sparkles className="absolute -top-2 -right-2 h-7 w-7 text-purple-500 animate-pulse" />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Crafting Your Personal Roadmap
          </h2>
          <p className="text-lg text-muted-foreground">{processingStage}</p>
          <Progress value={75} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Hang tight while we translate your answers into focused habits, goals, and daily moves.
          </p>
        </div>

        <div className="mt-8 space-y-3 border-t pt-6 text-left text-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-muted-foreground">Profile aligned with your ideal self</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-muted-foreground">Roadmap structure generated</span>
          </div>
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            <span className="font-medium text-foreground">Deploying daily habits & tasks</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-3">
            <Target className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Let&apos;s design your next chapter
        </CardTitle>
        <CardDescription className="text-base">
          Answer a few focused questions and we&apos;ll craft habits, goals, and daily moves tailored to you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="font-medium">
              {`Question ${currentStepIndex + 1} of ${totalSteps}`}
            </span>
            <span className="font-semibold text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex gap-2">
            {QUESTION_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all",
                  index === currentStepIndex
                    ? "bg-indigo-600 dark:bg-indigo-400"
                    : index < currentStepIndex
                    ? "bg-green-500"
                    : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">{QUESTION_STEPS[currentStepIndex].title}</span>
            </div>
            <h2 className="text-xl font-semibold leading-tight">{currentStep.prompt}</h2>
            {currentStep.coachTip && (
              <p className="text-sm text-muted-foreground">Coach tip: {currentStep.coachTip}</p>
            )}
          </div>

          {currentStep.type === "multiselect" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {FOCUS_AREAS.map((area) => {
                const isActive = answers.priorityAreas.includes(area.value);
                return (
                  <button
                    key={area.value}
                    type="button"
                    onClick={() => toggleArea(area.value)}
                    className={cn(
                      "rounded-lg border p-4 text-left transition",
                      isActive
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950/40 dark:text-indigo-300"
                        : "border-muted bg-card text-muted-foreground hover:border-indigo-300 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{area.label}</span>
                      {isActive && <Badge variant="secondary">Selected</Badge>}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{area.helper}</p>
                  </button>
                );
              })}
            </div>
          ) : (
            <Textarea
              key={currentStep.id}
              value={answers[currentStep.id]}
              onChange={(event) =>
                setAnswers((prev) => ({
                  ...prev,
                  [currentStep.id]: event.target.value,
                }))
              }
              placeholder={currentStep.placeholder}
              className="min-h-40 text-base"
              autoFocus
            />
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>Your answers guide Gemini to build a focused, doable transformation plan.</span>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="flex gap-4 pt-2">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={currentStepIndex === 0}
            className="flex-1"
          >
            Back
          </Button>
          {currentStepIndex === totalSteps - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed || isProcessing}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
            >
              Create My Roadmap
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={goNext}
              disabled={!canProceed}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
            >
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

