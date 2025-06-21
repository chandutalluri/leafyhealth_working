import { IsString, IsOptional, IsEnum, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LabelType, LabelSize } from './create-label.dto';

export enum TemplateCategory {
  STANDARD = 'standard',
  PREMIUM = 'premium',
  ORGANIC = 'organic',
  SALE = 'sale',
  SEASONAL = 'seasonal',
  CUSTOM = 'custom',
}

export class CreateTemplateDto {
  @ApiProperty({ description: 'Template name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Template description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: LabelType, description: 'Label type this template is for' })
  @IsEnum(LabelType)
  labelType: LabelType;

  @ApiProperty({ enum: LabelSize, description: 'Template size' })
  @IsEnum(LabelSize)
  size: LabelSize;

  @ApiProperty({ enum: TemplateCategory, description: 'Template category' })
  @IsEnum(TemplateCategory)
  category: TemplateCategory;

  @ApiProperty({ description: 'Template design data', type: 'object', additionalProperties: true })
  design: Record<string, any>;

  @ApiProperty({ description: 'Variable fields in template', type: [String] })
  @IsArray()
  @IsString({ each: true })
  variableFields: string[];

  @ApiProperty({ description: 'Whether template is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Preview image URL', required: false })
  @IsOptional()
  @IsString()
  previewUrl?: string;
}