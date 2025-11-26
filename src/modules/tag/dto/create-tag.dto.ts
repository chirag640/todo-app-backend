import { IsOptional, IsString, MinLength, MaxLength, Matches, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import sanitizeHtml from 'sanitize-html';

export class CreateTagDto {
  @ApiProperty({
    description: 'Name',
    example: 'Sample Name',
    required: true,
    minLength: 2,
    maxLength: 100,
  })
  @Transform(({ value }) => {
    if (!value) return value;
    const trimmed = value.trim();
    // Sanitize HTML to prevent XSS attacks
    return sanitizeHtml(trimmed, { allowedTags: [], allowedAttributes: {} });
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

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
    // Sanitize HTML to prevent XSS attacks
    return sanitizeHtml(trimmed, { allowedTags: [], allowedAttributes: {} });
  })
  @IsString()
  @MinLength(4)
  @MaxLength(7)
  @Matches(/^#([A-Fa-f0-9]{6})$/)
  colorHex?: string;

  @ApiProperty({
    description: 'IsSystem',
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
  isSystem?: boolean;
}
