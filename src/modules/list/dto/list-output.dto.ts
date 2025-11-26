import { ApiProperty } from '@nestjs/swagger';

export class ListOutputDto {
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
    description: 'IsShared',
    example: true,
  })
  isShared!: boolean;

  @ApiProperty({
    description: 'Position value',
    example: 42,
  })
  position!: number;

  @ApiProperty({
    description: 'Hex color code',
    example: '#FF5733',
  })
  colorHex!: string;

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
