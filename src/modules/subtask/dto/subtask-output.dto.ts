import { ApiProperty } from '@nestjs/swagger';

export class SubtaskOutputDto {
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
    description: 'IsCompleted',
    example: true,
  })
  isCompleted!: boolean;

  @ApiProperty({
    description: 'completedAt',
    example: 'null',
  })
  completedAt!: Date;

  @ApiProperty({
    description: 'Position value',
    example: 42,
  })
  position!: number;

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
