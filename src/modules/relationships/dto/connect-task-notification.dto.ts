import { IsMongoId, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectTaskNotificationDto {
  @ApiProperty({
    description: 'ID of the Task record',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  taskId!: string;

  @ApiProperty({
    description: 'Array of Notification IDs to connect',
    example: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  notificationIds!: string[];
}
