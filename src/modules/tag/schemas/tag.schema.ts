import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

export type TagDocument = Tag & MongooseDocument;

@Schema({ timestamps: true })
export class Tag {
  @Prop({
    type: String,
    required: true,
  })
  name!: string;

  @Prop({
    type: String,
    required: false,
  })
  colorHex!: string;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isSystem!: boolean;
}

export const TagSchema = SchemaFactory.createForClass(Tag);

// Compound indexes for common query patterns
// Index for sorting by creation date (most common query pattern)
TagSchema.index({ createdAt: -1 });

// Text search index for common search queries
TagSchema.index({ name: 'text' });
