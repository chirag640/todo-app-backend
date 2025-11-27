import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateFcmTokenDto {
  @ApiProperty({
    description: 'FCM device token for push notifications',
    example: 'dGhpcyBpcyBh...',
  })
  @IsString()
  @IsNotEmpty()
  fcmToken!: string;
}
