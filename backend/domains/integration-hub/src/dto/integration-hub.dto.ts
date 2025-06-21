import { IsString, IsOptional, IsBoolean, IsObject, IsEnum } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export enum IntegrationType {
  API = 'api',
  WEBHOOK = 'webhook',
  DATABASE = 'database',
  FILE_SYNC = 'file_sync',
  MESSAGING = 'messaging'
}

export class CreateIntegrationDto {
  @ApiProperty({ description: 'Integration name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Integration type', enum: IntegrationType })
  @IsEnum(IntegrationType)
  type: IntegrationType;

  @ApiProperty({ description: 'Integration endpoint URL' })
  @IsString()
  endpoint: string;

  @ApiProperty({ description: 'API key for authentication', required: false })
  @IsOptional()
  @IsString()
  apiKey?: string;

  @ApiProperty({ description: 'Integration configuration', required: false })
  @IsOptional()
  @IsObject()
  configuration?: any;

  @ApiProperty({ description: 'Whether integration is active', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateIntegrationDto extends PartialType(CreateIntegrationDto) {}