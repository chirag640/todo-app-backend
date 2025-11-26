import { ApiProperty } from '@nestjs/swagger';

export class UserOutputDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id!: string;

  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'DisplayName',
    example: 'Sample Name',
  })
  displayName!: string;

  @ApiProperty({
    description: 'PasswordHash',
    example: 'Sample text',
  })
  passwordHash!: string;

  @ApiProperty({
    description: 'roles',
    example: 'null',
  })
  roles!: string[];

  @ApiProperty({
    description: 'createdVia',
    example: 'null',
  })
  createdVia!: string;

  @ApiProperty({
    description: 'preferences',
    example: 'null',
  })
  preferences!: Record<string, any>;

  @ApiProperty({
    description: 'Timezone',
    example: 'Sample text',
  })
  timezone!: string;

  @ApiProperty({
    description: 'IsActive',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'lastSeenAt',
    example: 'null',
  })
  lastSeenAt!: Date;

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
