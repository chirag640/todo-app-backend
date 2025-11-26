import { ApiProperty } from '@nestjs/swagger';

export class SyncCursorOutputDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id!: string;

  @ApiProperty({
    description: 'lastSyncAt',
    example: 'null',
  })
  lastSyncAt!: Date;

  @ApiProperty({
    description: 'LastServerVersion value',
    example: 42,
  })
  lastServerVersion!: number;

  @ApiProperty({
    description: 'DeviceId',
    example: 'Sample text',
  })
  deviceId!: string;

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
