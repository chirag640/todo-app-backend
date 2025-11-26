import { ApiProperty } from '@nestjs/swagger';

export class TagOutputDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id!: string;

  @ApiProperty({
    description: 'Name',
    example: 'Sample Name',
  })
  name!: string;

  @ApiProperty({
    description: 'Hex color code',
    example: '#FF5733',
  })
  colorHex!: string;

  @ApiProperty({
    description: 'IsSystem',
    example: true,
  })
  isSystem!: boolean;

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
