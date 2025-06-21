import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { LanguageService } from '../services/language.service';
import { CreateLanguageDto } from '../dto/create-language.dto';
import { UpdateLanguageDto } from '../dto/update-language.dto';
interface Language {
  id: number;
  code: string;
  name: string;
  nativeName: string;
  isActive: boolean;
  isDefault: boolean;
  direction: string;
  createdAt: Date;
  updatedAt: Date;
}

@ApiTags('languages')
@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new language' })
  @ApiResponse({ status: 201, description: 'Language created successfully' })
  @ApiResponse({ status: 409, description: 'Language with this code already exists' })
  create(@Body() createLanguageDto: CreateLanguageDto): Promise<Language> {
    return this.languageService.create(createLanguageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all languages' })
  @ApiResponse({ status: 200, description: 'List of all languages' })
  findAll(): Promise<Language[]> {
    return this.languageService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active languages' })
  @ApiResponse({ status: 200, description: 'List of active languages' })
  findActive(): Promise<Language[]> {
    return this.languageService.findActive();
  }

  @Get('default')
  @ApiOperation({ summary: 'Get default language' })
  @ApiResponse({ status: 200, description: 'Default language' })
  @ApiResponse({ status: 404, description: 'No default language set' })
  findDefault(): Promise<Language> {
    return this.languageService.findDefault();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get language by ID' })
  @ApiParam({ name: 'id', description: 'Language ID' })
  @ApiResponse({ status: 200, description: 'Language found' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Language> {
    return this.languageService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get language by code' })
  @ApiParam({ name: 'code', description: 'Language code' })
  @ApiResponse({ status: 200, description: 'Language found' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  findByCode(@Param('code') code: string): Promise<Language> {
    return this.languageService.findByCode(code);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update language' })
  @ApiParam({ name: 'id', description: 'Language ID' })
  @ApiResponse({ status: 200, description: 'Language updated successfully' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  @ApiResponse({ status: 409, description: 'Language with this code already exists' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ): Promise<Language> {
    return this.languageService.update(id, updateLanguageDto);
  }

  @Patch(':id/set-default')
  @ApiOperation({ summary: 'Set language as default' })
  @ApiParam({ name: 'id', description: 'Language ID' })
  @ApiResponse({ status: 200, description: 'Language set as default' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  setAsDefault(@Param('id', ParseIntPipe) id: number): Promise<Language> {
    return this.languageService.setAsDefault(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete language' })
  @ApiParam({ name: 'id', description: 'Language ID' })
  @ApiResponse({ status: 204, description: 'Language deleted successfully' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.languageService.remove(id);
  }
}