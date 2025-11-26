import { IsMongoId, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DisconnectUserTagDto {
  @ApiProperty({
    description: 'ID of the User record',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  userId!: string;

  @ApiProperty({
    description: 'Array of Tag IDs to disconnect',
    example: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  tagIds!: string[];
}
