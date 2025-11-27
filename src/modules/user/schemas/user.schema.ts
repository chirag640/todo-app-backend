import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & MongooseDocument;

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  email!: string;

  @Prop({
    type: String,
    required: false,
  })
  displayName!: string;

  @Prop({
    type: String,
    required: false,
  })
  passwordHash!: string;

  @Prop({
    type: [String],
    required: true,
  })
  roles!: string[];

  @Prop({
    type: String,
    required: true,
    default: 'email',
    enum: ['email', 'google'],
  })
  createdVia!: string;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
  })
  preferences!: Record<string, any>;

  @Prop({
    type: String,
    required: false,
    default: 'UTC',
  })
  timezone!: string;

  @Prop({
    type: Boolean,
    required: false,
    default: true,
  })
  isActive!: boolean;

  @Prop({
    type: Date,
    required: false,
  })
  lastSeenAt!: Date;

  @Prop({
    type: String,
    required: false,
  })
  fcmToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Compound indexes for common query patterns
// Index for sorting by creation date (most common query pattern)
UserSchema.index({ createdAt: -1 });

// Compound index for unique field lookups with timestamps
UserSchema.index({ email: 1, createdAt: -1 });
