import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  Matches,
} from 'class-validator';
import sanitizeHtml from 'sanitize-html';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateListDto {
  @ApiProperty({
    description: 'Title or heading',
    example: 'Sample Title',
    required: false,
    minLength: 3,
    maxLength: 200,
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
  @MaxLength(200)
  title?: string;

  @ApiProperty({
    description: 'Description or content',
    example: 'This is a sample description text',
    required: false,
    minLength: 10,
    maxLength: 1000,
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
  @MinLength(10)
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'IsShared',
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
  isShared?: boolean;

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

  @ApiProperty({
    description: 'Hex color code',
    example: '#FF5733',
    required: false,
    minLength: 4,
    maxLength: 7,
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
  @MinLength(4)
  @MaxLength(7)
  @Matches(/^#([A-Fa-f0-9]{6})$/)
  colorHex?: string;
}
