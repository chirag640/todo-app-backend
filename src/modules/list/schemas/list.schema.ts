import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

export type ListDocument = List & MongooseDocument;

@Schema({ timestamps: true })
export class List {
  @Prop({
    type: String,
    required: true,
  })
  title!: string;

  @Prop({
    type: String,
    required: false,
  })
  description!: string;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isShared!: boolean;

  @Prop({
    type: Number,
    required: false,
  })
  position!: number;

  @Prop({
    type: String,
    required: false,
  })
  colorHex!: string;
}

export const ListSchema = SchemaFactory.createForClass(List);

// Compound indexes for common query patterns
// Index for sorting by creation date (most common query pattern)
ListSchema.index({ createdAt: -1 });

// Text search index for common search queries
ListSchema.index({ title: 'text', description: 'text' });
