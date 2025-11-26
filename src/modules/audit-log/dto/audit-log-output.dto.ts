import { ApiProperty } from '@nestjs/swagger';

export class AuditLogOutputDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id!: string;

  @ApiProperty({
    description: 'EntityType',
    example: 'Sample text',
  })
  entityType!: string;

  @ApiProperty({
    description: 'EntityId',
    example: 'Sample text',
  })
  entityId!: string;

  @ApiProperty({
    description: 'Action',
    example: 'Sample text',
  })
  action!: string;

  @ApiProperty({
    description: 'delta',
    example: 'null',
  })
  delta!: Record<string, any>;

  @ApiProperty({
    description: 'Ip',
    example: 'Sample text',
  })
  ip!: string;

  @ApiProperty({
    description: 'UserAgent',
    example: 'Sample text',
  })
  userAgent!: string;

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
