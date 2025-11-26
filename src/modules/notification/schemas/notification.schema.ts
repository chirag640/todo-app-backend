import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = Notification & MongooseDocument;

@Schema({ timestamps: true })
export class Notification {
  @Prop({
    type: String,
    required: true,
    enum: ['Reminder', 'Push', 'System', 'Email'],
  })
  type!: string;

  @Prop({
    type: String,
    required: true,
  })
  title!: string;

  @Prop({
    type: String,
    required: false,
  })
  body!: string;

  @Prop({
    type: Date,
    required: false,
  })
  sentAt!: Date;

  @Prop({
    type: Date,
    required: false,
  })
  deliveredAt!: Date;

  @Prop({
    type: String,
    required: true,
    default: 'Pending',
    enum: ['Pending', 'Sent', 'Delivered', 'Failed'],
  })
  status!: string;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
  })
  payload!: Record<string, any>;

  @Prop({
    type: String,
    required: false,
  })
  fcmMessageId!: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Compound indexes for common query patterns
// Index for sorting by creation date (most common query pattern)
NotificationSchema.index({ createdAt: -1 });

// Text search index for common search queries
NotificationSchema.index({ title: 'text' });
