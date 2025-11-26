import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

export type SubtaskDocument = Subtask & MongooseDocument;

@Schema({ timestamps: true })
export class Subtask {
  @Prop({
    type: String,
    required: true,
  })
  title!: string;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isCompleted!: boolean;

  @Prop({
    type: Date,
    required: false,
  })
  completedAt!: Date;

  @Prop({
    type: Number,
    required: false,
  })
  position!: number;
}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);

// Compound indexes for common query patterns
// Index for sorting by creation date (most common query pattern)
SubtaskSchema.index({ createdAt: -1 });

// Text search index for common search queries
SubtaskSchema.index({ title: 'text' });
