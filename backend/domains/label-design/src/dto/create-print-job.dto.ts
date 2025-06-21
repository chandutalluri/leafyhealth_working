import { IsString, IsOptional, IsEnum, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PrintPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum PrintQuality {
  DRAFT = 'draft',
  NORMAL = 'normal',
  HIGH = 'high',
  BEST = 'best',
}

export enum PaperType {
  STANDARD = 'standard',
  GLOSSY = 'glossy',
  MATTE = 'matte',
  WATERPROOF = 'waterproof',
  ADHESIVE = 'adhesive',
}

export class CreatePrintJobDto {
  @ApiProperty({ description: 'Print job name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Label IDs to print', type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  labelIds: number[];

  @ApiProperty({ description: 'Printer ID to use', required: false })
  @IsOptional()
  @IsString()
  printerId?: string;

  @ApiProperty({ description: 'Number of copies per label', required: false })
  @IsOptional()
  @IsNumber()
  copies?: number;

  @ApiProperty({ enum: PrintPriority, description: 'Print job priority', required: false })
  @IsOptional()
  @IsEnum(PrintPriority)
  priority?: PrintPriority;

  @ApiProperty({ enum: PrintQuality, description: 'Print quality', required: false })
  @IsOptional()
  @IsEnum(PrintQuality)
  quality?: PrintQuality;

  @ApiProperty({ enum: PaperType, description: 'Paper type', required: false })
  @IsOptional()
  @IsEnum(PaperType)
  paperType?: PaperType;

  @ApiProperty({ description: 'Print immediately', required: false })
  @IsOptional()
  @IsBoolean()
  printImmediately?: boolean;

  @ApiProperty({ description: 'Schedule print for later', required: false })
  @IsOptional()
  scheduledFor?: Date;
}