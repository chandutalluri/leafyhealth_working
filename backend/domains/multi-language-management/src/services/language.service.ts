import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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

@Injectable()
export class LanguageService {
  private languages: Language[] = [
    {
      id: 1,
      code: 'en',
      name: 'English',
      nativeName: 'English',
      isActive: true,
      isDefault: true,
      direction: 'ltr',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      isActive: true,
      isDefault: false,
      direction: 'ltr',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  private nextId = 3;

  async create(createLanguageDto: CreateLanguageDto): Promise<Language> {
    const existingLanguage = this.languages.find(lang => lang.code === createLanguageDto.code);

    if (existingLanguage) {
      throw new ConflictException('Language with this code already exists');
    }

    const language: Language = {
      id: this.nextId++,
      ...createLanguageDto,
      isActive: createLanguageDto.isActive ?? true,
      isDefault: createLanguageDto.isDefault ?? false,
      direction: createLanguageDto.direction ?? 'ltr',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.languages.push(language);
    return language;
  }

  async findAll(): Promise<Language[]> {
    return this.languages.sort((a, b) => a.name.localeCompare(b.name));
  }

  async findActive(): Promise<Language[]> {
    return this.languages
      .filter(lang => lang.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async findOne(id: number): Promise<Language> {
    const language = this.languages.find(lang => lang.id === id);

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    return language;
  }

  async findByCode(code: string): Promise<Language> {
    const language = this.languages.find(lang => lang.code === code);

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    return language;
  }

  async findDefault(): Promise<Language> {
    const language = this.languages.find(lang => lang.isDefault);

    if (!language) {
      throw new NotFoundException('No default language set');
    }

    return language;
  }

  async update(id: number, updateLanguageDto: UpdateLanguageDto): Promise<Language> {
    const language = await this.findOne(id);
    
    if (updateLanguageDto.code && updateLanguageDto.code !== language.code) {
      const existingLanguage = this.languages.find(lang => lang.code === updateLanguageDto.code);

      if (existingLanguage) {
        throw new ConflictException('Language with this code already exists');
      }
    }

    Object.assign(language, updateLanguageDto, { updatedAt: new Date() });
    return language;
  }

  async remove(id: number): Promise<void> {
    const language = await this.findOne(id);
    const index = this.languages.findIndex(lang => lang.id === id);
    if (index > -1) {
      this.languages.splice(index, 1);
    }
  }

  async setAsDefault(id: number): Promise<Language> {
    this.languages.forEach(lang => lang.isDefault = false);
    const language = await this.findOne(id);
    language.isDefault = true;
    language.updatedAt = new Date();
    return language;
  }
}