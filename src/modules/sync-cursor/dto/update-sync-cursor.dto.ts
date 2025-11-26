import {
  IsOptional,
  IsISO8601,
  IsNumber,
  Min,
  Max,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import sanitizeHtml from 'sanitize-html';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSyncCursorDto {
  @ApiProperty({
    description: 'lastSyncAt',
    example: 'null',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    // Handle string "null" from frontend forms
    if (value === 'null' || value === 'undefined' || value === '') return undefined;
    if (!value) return value;
    // Handle various date formats
    const date = new Date(value);
    if (isNaN(date.getTime())) return value; // Let validator handle invalid dates
    return date.toISOString(); // Normalize to ISO 8601
  })
  @IsISO8601({ strict: false })
  @Type(() => Date)
  lastSyncAt?: Date;

  @ApiProperty({
    description: 'LastServerVersion value',
    example: 42,
    required: false,
    maximum: 1000000,
  })
  @IsOptional()
  @Transform(({ value }) => {
    // Handle string "null" from frontend forms
    if (value === 'null' || value === 'undefined' || value === '') return undefined;
    if (!value) return value;
    return value;
  })
  @IsNumber()
  @Min(0)
  @Max(1000000)
  lastServerVersion?: number;

  @ApiProperty({
    description: 'DeviceId',
    example: 'Sample text',
    required: false,
    minLength: 1,
    maxLength: 255,
  })
  @IsOptional()
  @Transform(({ value }) => {
    // Handle string "null" from frontend forms
    if (value === 'null' || value === 'undefined' || value === '') return undefined;
    if (!value) return value;
    const trimmed = value.trim();
    return sanitizeHtml(trimmed, { allowedTags: [], allowedAttributes: {} });
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  deviceId?: string;
}
