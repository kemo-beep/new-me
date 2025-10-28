import { boolean, pgTable, text, timestamp, integer, real, jsonb } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    isAnonymous: boolean('is_anonymous').default(false),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at')
});

// New Me App Tables
export const idealSelf = pgTable("ideal_self", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    description: text("description").notNull(),
    traits: jsonb("traits"), // Array of traits
    areasToImprove: jsonb("areas_to_improve"), // Array of life areas
    priorityAreas: jsonb("priority_areas"),
    financialVision: text("financial_vision"),
    healthVision: text("health_vision"),
    signatureHabits: jsonb("signature_habits"),
    constraints: text("constraints"),
    goals: jsonb("goals"), // Array of goals
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const goal = pgTable("goal", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    idealSelfId: text("ideal_self_id").references(() => idealSelf.id, { onDelete: 'cascade' }),
    name: text("name").notNull(),
    description: text("description"),
    status: text("status").default("active"), // active, completed, paused
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const milestone = pgTable("milestone", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    goalId: text("goal_id").references(() => goal.id, { onDelete: 'cascade' }),
    name: text("name").notNull(),
    description: text("description"),
    tasksTotal: integer("tasks_total").default(0),
    tasksCompleted: integer("tasks_completed").default(0),
    completionRate: real("completion_rate").default(0),
    targetDate: timestamp("target_date"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const habit = pgTable("habit", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    milestoneId: text("milestone_id").references(() => milestone.id, { onDelete: 'set null' }),
    name: text("name").notNull(),
    description: text("description"),
    recurrence: text("recurrence").notNull(), // daily, weekly
    streakCount: integer("streak_count").default(0),
    lastCompleted: timestamp("last_completed"),
    completionRate: real("completion_rate").default(0),
    completionHistory: jsonb("completion_history"), // Array of completion dates
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const task = pgTable("task", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    milestoneId: text("milestone_id").references(() => milestone.id, { onDelete: 'set null' }),
    name: text("name").notNull(),
    description: text("description"),
    priority: text("priority").default("medium"), // high, medium, low
    completedAt: timestamp("completed_at"),
    targetDate: timestamp("target_date"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const todo = pgTable("todo", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    taskId: text("task_id").references(() => task.id, { onDelete: 'set null' }),
    name: text("name").notNull(),
    description: text("description"),
    isCompleted: boolean("is_completed").default(false),
    targetDate: timestamp("target_date").notNull(),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const reflection = pgTable("reflection", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    content: text("content").notNull(),
    sentimentScore: real("sentiment_score"), // -1 to 1
    keywords: jsonb("keywords"), // Array of extracted keywords
    mood: text("mood"), // happy, sad, neutral, etc
    analyzedAt: timestamp("analyzed_at"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const progress = pgTable("progress", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    dailyScore: real("daily_score").default(0),
    weeklySummary: text("weekly_summary"),
    idealSelfAlignment: real("ideal_self_alignment").default(0), // 0 to 100
    metrics: jsonb("metrics"), // Various progress metrics
    date: timestamp("date").notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const schema = {
    user,
    session,
    account,
    verification,
    idealSelf,
    goal,
    milestone,
    habit,
    task,
    todo,
    reflection,
    progress
};