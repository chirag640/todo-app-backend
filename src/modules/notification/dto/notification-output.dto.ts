import { ApiProperty } from '@nestjs/swagger';

export class NotificationOutputDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id!: string;

  @ApiProperty({
    description: 'type',
    example: 'null',
  })
  type!: string;

  @ApiProperty({
    description: 'Title or heading',
    example: 'Sample Title',
  })
  title!: string;

  @ApiProperty({
    description: 'Description or content',
    example: 'This is a sample description text',
  })
  body!: string;

  @ApiProperty({
    description: 'sentAt',
    example: 'null',
  })
  sentAt!: Date;

  @ApiProperty({
    description: 'deliveredAt',
    example: 'null',
  })
  deliveredAt!: Date;

  @ApiProperty({
    description: 'status',
    example: 'null',
  })
  status!: string;

  @ApiProperty({
    description: 'payload',
    example: 'null',
  })
  payload!: Record<string, any>;

  @ApiProperty({
    description: 'FcmMessageId',
    example: 'Sample text',
  })
  fcmMessageId!: string;

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
