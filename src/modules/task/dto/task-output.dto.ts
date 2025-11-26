import { ApiProperty } from '@nestjs/swagger';

export class TaskOutputDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id!: string;

  @ApiProperty({
    description: 'Title or heading',
    example: 'Sample Title',
  })
  title!: string;

  @ApiProperty({
    description: 'Description or content',
    example: 'This is a sample description text',
  })
  description!: string;

  @ApiProperty({
    description: 'status',
    example: 'null',
  })
  status!: string;

  @ApiProperty({
    description: 'priority',
    example: 'null',
  })
  priority!: string;

  @ApiProperty({
    description: 'dueDate',
    example: 'null',
  })
  dueDate!: Date;

  @ApiProperty({
    description: 'startDate',
    example: 'null',
  })
  startDate!: Date;

  @ApiProperty({
    description: 'completedAt',
    example: 'null',
  })
  completedAt!: Date;

  @ApiProperty({
    description: 'CreatedByDeviceId',
    example: 'Sample text',
  })
  createdByDeviceId!: string;

  @ApiProperty({
    description: 'RecurrenceRule',
    example: 'Sample text',
  })
  recurrenceRule!: string;

  @ApiProperty({
    description: 'reminders',
    example: 'null',
  })
  reminders!: Record<string, any>;

  @ApiProperty({
    description: 'reminderPolicy',
    example: 'null',
  })
  reminderPolicy!: Record<string, any>;

  @ApiProperty({
    description: 'tags',
    example: 'null',
  })
  tags!: string[];

  @ApiProperty({
    description: 'attachments',
    example: 'null',
  })
  attachments!: Record<string, any>[];

  @ApiProperty({
    description: 'EstimatedMinutes value',
    example: 42,
  })
  estimatedMinutes!: number;

  @ApiProperty({
    description: 'Position value',
    example: 42,
  })
  position!: number;

  @ApiProperty({
    description: 'IsArchived',
    example: true,
  })
  isArchived!: boolean;

  @ApiProperty({
    description: 'IsDeleted',
    example: true,
  })
  isDeleted!: boolean;

  @ApiProperty({
    description: 'SyncVersion value',
    example: 42,
  })
  syncVersion!: number;

  @ApiProperty({
    description: 'LastModifiedDeviceId',
    example: 'Sample text',
  })
  lastModifiedDeviceId!: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;
}
