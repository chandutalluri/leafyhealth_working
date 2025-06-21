import { IsString, IsBoolean, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLanguageDto {
  @ApiProperty({ example: 'en', description: 'Language code' })
  @IsString()
  @Length(2, 10)
  code: string;

  @ApiProperty({ example: 'English', description: 'Language name' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ example: 'English', description: 'Native name' })
  @IsString()
  @Length(1, 100)
  nativeName: string;

  @ApiProperty({ example: true, description: 'Is language active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: false, description: 'Is default language', required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({ example: 'ltr', description: 'Text direction', required: false })
  @IsOptional()
  @IsString()
  direction?: string;
}