import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument, Schema as MongooseSchema } from 'mongoose';

export type DeviceDocument = Device & MongooseDocument;

@Schema({ timestamps: true })
export class Device {
  @Prop({
    type: String,
    required: true,
    index: true,
  })
  pushToken!: string;

  @Prop({
    type: String,
    required: true,
    enum: ['ios', 'android', 'web'],
  })
  platform!: string;

  @Prop({
    type: Date,
    required: false,
  })
  lastActiveAt!: Date;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
  })
  deviceInfo!: Record<string, any>;

  @Prop({
    type: Boolean,
    required: false,
    default: true,
  })
  isActive!: boolean;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

// Compound indexes for common query patterns
// Index for sorting by creation date (most common query pattern)
DeviceSchema.index({ createdAt: -1 });
