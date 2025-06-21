import { IsString, IsOptional, IsEnum, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum LabelType {
  PRICE_TAG = 'price_tag',
  NUTRITION_LABEL = 'nutrition_label',
  BARCODE_LABEL = 'barcode_label',
  PRODUCT_LABEL = 'product_label',
  COMPLIANCE_LABEL = 'compliance_label',
  PROMOTIONAL = 'promotional',
  SHELF_TALKER = 'shelf_talker',
}

export enum LabelSize {
  SMALL = '2x1',
  MEDIUM = '4x2',
  LARGE = '4x6',
  CUSTOM = 'custom',
}

export class CreateLabelDto {
  @ApiProperty({ description: 'Label name' })
  @IsString()
  name: string;

  @ApiProperty({ enum: LabelType, description: 'Type of label' })
  @IsEnum(LabelType)
  type: LabelType;

  @ApiProperty({ enum: LabelSize, description: 'Label size' })
  @IsEnum(LabelSize)
  size: LabelSize;

  @ApiProperty({ description: 'Product ID this label is for', required: false })
  @IsOptional()
  @IsNumber()
  productId?: number;

  @ApiProperty({ description: 'Template ID to use', required: false })
  @IsOptional()
  @IsNumber()
  templateId?: number;

  @ApiProperty({ description: 'Label content data', type: 'object', additionalProperties: true })
  @IsOptional()
  content?: Record<string, any>;

  @ApiProperty({ description: 'Language for multi-language labels', required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ description: 'Whether label requires compliance review', required: false })
  @IsOptional()
  @IsBoolean()
  requiresCompliance?: boolean;
}