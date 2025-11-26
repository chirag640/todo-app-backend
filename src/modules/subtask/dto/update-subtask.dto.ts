import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsBoolean,
  IsISO8601,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import sanitizeHtml from 'sanitize-html';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubtaskDto {
  @ApiProperty({
    description: 'Title or heading',
    example: 'Sample Title',
    required: false,
    minLength: 3,
    maxLength: 300,
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
  @MinLength(3)
  @MaxLength(300)
  title?: string;

  @ApiProperty({
    description: 'IsCompleted',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    // Handle string "null" from frontend forms
    if (value === 'null' || value === 'undefined' || value === '') return undefined;
    if (!value) return value;
    return value;
  })
  @IsBoolean()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiProperty({
    description: 'completedAt',
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
  completedAt?: Date;

  @ApiProperty({
    description: 'Position value',
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
  position?: number;
}
