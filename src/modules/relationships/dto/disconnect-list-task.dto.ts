import { IsMongoId, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DisconnectListTaskDto {
  @ApiProperty({
    description: 'ID of the List record',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  listId!: string;

  @ApiProperty({
    description: 'Array of Task IDs to disconnect',
    example: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  taskIds!: string[];
}
