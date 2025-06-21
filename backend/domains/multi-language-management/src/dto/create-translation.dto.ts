import { IsString, IsNumber, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTranslationDto {
  @ApiProperty({ example: 'welcome_message', description: 'Translation key' })
  @IsString()
  @Length(1, 255)
  key: string;

  @ApiProperty({ example: 'Welcome to our platform', description: 'Translation value' })
  @IsString()
  value: string;

  @ApiProperty({ example: 'general', description: 'Translation namespace', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  namespace?: string;

  @ApiProperty({ example: 1, description: 'Language ID' })
  @IsNumber()
  languageId: number;
}