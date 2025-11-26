import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

export type SyncCursorDocument = SyncCursor & MongooseDocument;

@Schema({ timestamps: true })
export class SyncCursor {
  @Prop({
    type: Date,
    required: true,
  })
  lastSyncAt!: Date;

  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  lastServerVersion!: number;

  @Prop({
    type: String,
    required: false,
  })
  deviceId!: string;
}

export const SyncCursorSchema = SchemaFactory.createForClass(SyncCursor);

// Compound indexes for common query patterns
// Index for sorting by creation date (most common query pattern)
SyncCursorSchema.index({ createdAt: -1 });
