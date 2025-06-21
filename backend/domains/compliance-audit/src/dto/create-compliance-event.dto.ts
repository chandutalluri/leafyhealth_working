import { IsString, IsInt, IsOptional, IsIn, IsObject } from 'class-validator';

export class CreateComplianceEventDto {
  @IsString()
  eventType: string;

  @IsString()
  entityType: string;

  @IsInt()
  entityId: number;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'critical'])
  severity?: string;

  @IsOptional()
  @IsObject()
  metadata?: any;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}