import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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

@Injectable()
export class TranslationService {
  private translations: Translation[] = [
    {
      id: 1,
      key: 'welcome_message',
      value: 'Welcome to LeafyHealth',
      namespace: 'general',
      languageId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      key: 'welcome_message',
      value: 'Bienvenido a LeafyHealth',
      namespace: 'general',
      languageId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  private nextId = 3;

  async create(createTranslationDto: CreateTranslationDto): Promise<Translation> {
    const existingTranslation = this.translations.find(t => 
      t.key === createTranslationDto.key && t.languageId === createTranslationDto.languageId
    );

    if (existingTranslation) {
      throw new ConflictException('Translation for this key and language already exists');
    }

    const translation: Translation = {
      id: this.nextId++,
      ...createTranslationDto,
      namespace: createTranslationDto.namespace || 'general',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.translations.push(translation);
    return translation;
  }

  async findAll(): Promise<Translation[]> {
    return this.translations.sort((a, b) => a.key.localeCompare(b.key));
  }

  async findByLanguage(languageId: number): Promise<Translation[]> {
    return this.translations
      .filter(t => t.languageId === languageId)
      .sort((a, b) => a.key.localeCompare(b.key));
  }

  async findByLanguageCode(languageCode: string): Promise<Translation[]> {
    return this.translations
      .filter(t => t.languageId === 1 || t.languageId === 2) // English or Spanish
      .sort((a, b) => a.key.localeCompare(b.key));
  }

  async findByNamespace(namespace: string, languageId?: number): Promise<Translation[]> {
    return this.translations
      .filter(t => {
        if (languageId) {
          return t.namespace === namespace && t.languageId === languageId;
        }
        return t.namespace === namespace;
      })
      .sort((a, b) => a.key.localeCompare(b.key));
  }

  async findOne(id: number): Promise<Translation> {
    const translation = this.translations.find(t => t.id === id);

    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    return translation;
  }

  async findByKey(key: string, languageId: number): Promise<Translation> {
    const translation = this.translations.find(t => t.key === key && t.languageId === languageId);

    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    return translation;
  }

  async update(id: number, updateTranslationDto: UpdateTranslationDto): Promise<Translation> {
    const translation = await this.findOne(id);
    
    if (updateTranslationDto.key || updateTranslationDto.languageId) {
      const key = updateTranslationDto.key || translation.key;
      const languageId = updateTranslationDto.languageId || translation.languageId;
      
      if (key !== translation.key || languageId !== translation.languageId) {
        const existingTranslation = this.translations.find(t => 
          t.key === key && t.languageId === languageId
        );

        if (existingTranslation && existingTranslation.id !== id) {
          throw new ConflictException('Translation for this key and language already exists');
        }
      }
    }

    Object.assign(translation, updateTranslationDto, { updatedAt: new Date() });
    return translation;
  }

  async remove(id: number): Promise<void> {
    const translation = await this.findOne(id);
    const index = this.translations.findIndex(t => t.id === id);
    if (index > -1) {
      this.translations.splice(index, 1);
    }
  }

  async bulkCreate(translations: CreateTranslationDto[]): Promise<Translation[]> {
    const createdTranslations = [];
    
    for (const translationDto of translations) {
      try {
        const translation = await this.create(translationDto);
        createdTranslations.push(translation);
      } catch (error) {
        // Continue with other translations if one fails
        continue;
      }
    }
    
    return createdTranslations;
  }

  async getTranslationsAsKeyValue(languageCode: string, namespace?: string): Promise<Record<string, string>> {
    const translations = this.translations.filter(t => {
      const languageMatch = (languageCode === 'en' && t.languageId === 1) || 
                           (languageCode === 'es' && t.languageId === 2);
      if (namespace) {
        return languageMatch && t.namespace === namespace;
      }
      return languageMatch;
    });

    const result: Record<string, string> = {};
    translations.forEach(translation => {
      result[translation.key] = translation.value;
    });

    return result;
  }
}