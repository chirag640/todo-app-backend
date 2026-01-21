import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument, Schema as MongooseSchema } from 'mongoose';

export type TaskDocument = Task & MongooseDocument;

@Schema({ timestamps: true })
export class Task {
  @Prop({
    type: String,
    required: true,
    index: true,
  })
  title!: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  userId!: string;

  @Prop({
    type: String,
    required: false,
    index: true,
  })
  description!: string;

  @Prop({
    type: String,
    required: true,
    index: true,
    default: 'Pending',
    enum: ['Pending', 'InProgress', 'Completed', 'Cancelled', 'Archived', 'Snoozed'],
  })
  status!: string;

  @Prop({
    type: String,
    required: true,
    index: true,
    default: 'Medium',
    enum: ['Low', 'Medium', 'High', 'Urgent'],
  })
  priority!: string;

  @Prop({
    type: String,
    required: false,
    index: true,
  })
  category!: string;

  @Prop({
    type: Date,
    required: false,
    index: true,
  })
  dueDate!: Date;

  @Prop({
    type: Date,
    required: false,
  })
  startDate!: Date;

  @Prop({
    type: Date,
    required: false,
  })
  completedAt!: Date;

  @Prop({
    type: String,
    required: false,
  })
  createdByDeviceId!: string;

  @Prop({
    type: String,
    required: false,
  })
  recurrenceRule!: string;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
  })
  reminders!: Record<string, any>;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
  })
  reminderPolicy!: Record<string, any>;

  @Prop({
    type: [String],
    required: false,
    index: true,
  })
  tags!: string[];

  @Prop({
    type: [MongooseSchema.Types.Mixed],
    required: false,
  })
  attachments!: Record<string, any>[];

  @Prop({
    type: Number,
    required: false,
  })
  estimatedMinutes!: number;

  @Prop({
    type: Number,
    required: false,
  })
  position!: number;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isArchived!: boolean;

  @Prop({
    type: Boolean,
    required: false,
    index: true,
    default: false,
  })
  isDeleted!: boolean;

  @Prop({
    type: Number,
    required: false,
    default: 1,
  })
  syncVersion!: number;

  @Prop({
    type: String,
    required: false,
  })
  lastModifiedDeviceId!: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

// =====================================================
// COMPOUND INDEXES FOR OPTIMIZED QUERY PERFORMANCE
// =====================================================

// Primary query pattern: Get user's tasks filtered by status and priority
// Covers: findAll with status/priority filters, sorted by createdAt
TaskSchema.index({ userId: 1, status: 1, priority: 1, createdAt: -1 });

// Date-based queries: Get user's tasks filtered by dueDate range
// Covers: today, week, overdue date filters
TaskSchema.index({ userId: 1, dueDate: 1, status: 1 });

// Default listing: Get user's non-deleted tasks, newest first
// Covers: basic list view with isDeleted filter
TaskSchema.index({ userId: 1, isDeleted: 1, createdAt: -1 });

// Priority sorting: Sort user's tasks by priority level
TaskSchema.index({ userId: 1, priority: 1, createdAt: -1 });

// Due date sorting: Sort user's tasks by due date
TaskSchema.index({ userId: 1, dueDate: -1 });

// Text search index for title/description search
TaskSchema.index({ title: 'text', description: 'text' });

