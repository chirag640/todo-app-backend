import { ApiProperty } from '@nestjs/swagger';

export class DeviceOutputDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id!: string;

  @ApiProperty({
    description: 'PushToken',
    example: 'Sample text',
  })
  pushToken!: string;

  @ApiProperty({
    description: 'platform',
    example: 'null',
  })
  platform!: string;

  @ApiProperty({
    description: 'lastActiveAt',
    example: 'null',
  })
  lastActiveAt!: Date;

  @ApiProperty({
    description: 'deviceInfo',
    example: 'null',
  })
  deviceInfo!: Record<string, any>;

  @ApiProperty({
    description: 'IsActive',
    example: true,
  })
  isActive!: boolean;

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
