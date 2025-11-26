import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument, Schema as MongooseSchema } from 'mongoose';

export type AuditLogDocument = AuditLog & MongooseDocument;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({
    type: String,
    required: true,
  })
  entityType!: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  entityId!: string;

  @Prop({
    type: String,
    required: true,
  })
  action!: string;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
  })
  delta!: Record<string, any>;

  @Prop({
    type: String,
    required: false,
  })
  ip!: string;

  @Prop({
    type: String,
    required: false,
  })
  userAgent!: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

// Compound indexes for common query patterns
// Index for sorting by creation date (most common query pattern)
AuditLogSchema.index({ createdAt: -1 });
