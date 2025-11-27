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

// Compound indexes for common query patterns
// Index for sorting by creation date (most common query pattern)
TaskSchema.index({ createdAt: -1 });

// Text search index for common search queries
TaskSchema.index({ title: 'text', description: 'text' });
