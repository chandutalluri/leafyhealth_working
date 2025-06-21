import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BarcodeType {
  UPC_A = 'upc_a',
  EAN_13 = 'ean_13',
  CODE_128 = 'code_128',
  QR_CODE = 'qr_code',
  DATA_MATRIX = 'data_matrix',
  PDF417 = 'pdf417',
}

export enum BarcodeFormat {
  PNG = 'png',
  SVG = 'svg',
  PDF = 'pdf',
}

export class CreateBarcodeDto {
  @ApiProperty({ description: 'Barcode data/content' })
  @IsString()
  data: string;

  @ApiProperty({ enum: BarcodeType, description: 'Type of barcode' })
  @IsEnum(BarcodeType)
  type: BarcodeType;

  @ApiProperty({ enum: BarcodeFormat, description: 'Output format' })
  @IsEnum(BarcodeFormat)
  format: BarcodeFormat;

  @ApiProperty({ description: 'Product ID this barcode is for', required: false })
  @IsOptional()
  @IsNumber()
  productId?: number;

  @ApiProperty({ description: 'Barcode width in pixels', required: false })
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiProperty({ description: 'Barcode height in pixels', required: false })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiProperty({ description: 'Display text below barcode', required: false })
  @IsOptional()
  @IsString()
  displayText?: string;
}