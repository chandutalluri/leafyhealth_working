import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TranslationService } from '../services/translation.service';
import { CreateTranslationDto } from '../dto/create-translation.dto';
import { UpdateTranslationDto } from '../dto/update-translation.dto';
interface Translation {
  id: number;
  key: string;
  value: string;
  namespace: string;
  languageId: number;
  createdAt: Date;
  updatedAt: Date;
}

@ApiTags('translations')
@Controller('translations')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new translation' })
  @ApiResponse({ status: 201, description: 'Translation created successfully' })
  @ApiResponse({ status: 409, description: 'Translation for this key and language already exists' })
  create(@Body() createTranslationDto: CreateTranslationDto): Promise<Translation> {
    return this.translationService.create(createTranslationDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple translations' })
  @ApiResponse({ status: 201, description: 'Translations created successfully' })
  bulkCreate(@Body() translations: CreateTranslationDto[]): Promise<Translation[]> {
    return this.translationService.bulkCreate(translations);
  }

  @Get()
  @ApiOperation({ summary: 'Get all translations' })
  @ApiQuery({ name: 'languageId', required: false, description: 'Filter by language ID' })
  @ApiQuery({ name: 'namespace', required: false, description: 'Filter by namespace' })
  @ApiResponse({ status: 200, description: 'List of translations' })
  findAll(
    @Query('languageId') languageId?: string,
    @Query('namespace') namespace?: string,
  ): Promise<Translation[]> {
    if (languageId && namespace) {
      return this.translationService.findByNamespace(namespace, parseInt(languageId));
    }
    if (languageId) {
      return this.translationService.findByLanguage(parseInt(languageId));
    }
    if (namespace) {
      return this.translationService.findByNamespace(namespace);
    }
    return this.translationService.findAll();
  }

  @Get('language/:languageCode')
  @ApiOperation({ summary: 'Get translations by language code' })
  @ApiParam({ name: 'languageCode', description: 'Language code' })
  @ApiResponse({ status: 200, description: 'Translations for the language' })
  findByLanguageCode(@Param('languageCode') languageCode: string): Promise<Translation[]> {
    return this.translationService.findByLanguageCode(languageCode);
  }

  @Get('language/:languageCode/keyvalue')
  @ApiOperation({ summary: 'Get translations as key-value pairs' })
  @ApiParam({ name: 'languageCode', description: 'Language code' })
  @ApiQuery({ name: 'namespace', required: false, description: 'Filter by namespace' })
  @ApiResponse({ status: 200, description: 'Translations as key-value pairs' })
  getKeyValuePairs(
    @Param('languageCode') languageCode: string,
    @Query('namespace') namespace?: string,
  ): Promise<Record<string, string>> {
    return this.translationService.getTranslationsAsKeyValue(languageCode, namespace);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get translation by ID' })
  @ApiParam({ name: 'id', description: 'Translation ID' })
  @ApiResponse({ status: 200, description: 'Translation found' })
  @ApiResponse({ status: 404, description: 'Translation not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Translation> {
    return this.translationService.findOne(id);
  }

  @Get('key/:key/language/:languageId')
  @ApiOperation({ summary: 'Get translation by key and language' })
  @ApiParam({ name: 'key', description: 'Translation key' })
  @ApiParam({ name: 'languageId', description: 'Language ID' })
  @ApiResponse({ status: 200, description: 'Translation found' })
  @ApiResponse({ status: 404, description: 'Translation not found' })
  findByKey(
    @Param('key') key: string,
    @Param('languageId', ParseIntPipe) languageId: number,
  ): Promise<Translation> {
    return this.translationService.findByKey(key, languageId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update translation' })
  @ApiParam({ name: 'id', description: 'Translation ID' })
  @ApiResponse({ status: 200, description: 'Translation updated successfully' })
  @ApiResponse({ status: 404, description: 'Translation not found' })
  @ApiResponse({ status: 409, description: 'Translation for this key and language already exists' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTranslationDto: UpdateTranslationDto,
  ): Promise<Translation> {
    return this.translationService.update(id, updateTranslationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete translation' })
  @ApiParam({ name: 'id', description: 'Translation ID' })
  @ApiResponse({ status: 204, description: 'Translation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Translation not found' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.translationService.remove(id);
  }
}