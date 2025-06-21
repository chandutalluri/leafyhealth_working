"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageService = void 0;
const common_1 = require("@nestjs/common");
let LanguageService = class LanguageService {
    constructor() {
        this.languages = [
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
        this.nextId = 3;
    }
    async create(createLanguageDto) {
        const existingLanguage = this.languages.find(lang => lang.code === createLanguageDto.code);
        if (existingLanguage) {
            throw new common_1.ConflictException('Language with this code already exists');
        }
        const language = {
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
    async findAll() {
        return this.languages.sort((a, b) => a.name.localeCompare(b.name));
    }
    async findActive() {
        return this.languages
            .filter(lang => lang.isActive)
            .sort((a, b) => a.name.localeCompare(b.name));
    }
    async findOne(id) {
        const language = this.languages.find(lang => lang.id === id);
        if (!language) {
            throw new common_1.NotFoundException('Language not found');
        }
        return language;
    }
    async findByCode(code) {
        const language = this.languages.find(lang => lang.code === code);
        if (!language) {
            throw new common_1.NotFoundException('Language not found');
        }
        return language;
    }
    async findDefault() {
        const language = this.languages.find(lang => lang.isDefault);
        if (!language) {
            throw new common_1.NotFoundException('No default language set');
        }
        return language;
    }
    async update(id, updateLanguageDto) {
        const language = await this.findOne(id);
        if (updateLanguageDto.code && updateLanguageDto.code !== language.code) {
            const existingLanguage = this.languages.find(lang => lang.code === updateLanguageDto.code);
            if (existingLanguage) {
                throw new common_1.ConflictException('Language with this code already exists');
            }
        }
        Object.assign(language, updateLanguageDto, { updatedAt: new Date() });
        return language;
    }
    async remove(id) {
        const language = await this.findOne(id);
        const index = this.languages.findIndex(lang => lang.id === id);
        if (index > -1) {
            this.languages.splice(index, 1);
        }
    }
    async setAsDefault(id) {
        this.languages.forEach(lang => lang.isDefault = false);
        const language = await this.findOne(id);
        language.isDefault = true;
        language.updatedAt = new Date();
        return language;
    }
};
exports.LanguageService = LanguageService;
exports.LanguageService = LanguageService = __decorate([
    (0, common_1.Injectable)()
], LanguageService);
//# sourceMappingURL=language.service.js.map