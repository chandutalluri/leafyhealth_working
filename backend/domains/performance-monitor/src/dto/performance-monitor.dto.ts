import { IsString, IsOptional, IsNumber, IsDate, IsObject } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMetricDto {
  @ApiProperty({ description: 'Service name' })
  @IsString()
  serviceName: string;

  @ApiProperty({ description: 'Metric name' })
  @IsString()
  metricName: string;

  @ApiProperty({ description: 'Metric value' })
  @IsNumber()
  value: number;

  @ApiProperty({ description: 'Metric unit', required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ description: 'Metric timestamp', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  timestamp?: Date;

  @ApiProperty({ description: 'Additional tags', required: false })
  @IsOptional()
  @IsObject()
  tags?: any;
}

export class UpdateMetricDto extends PartialType(CreateMetricDto) {}