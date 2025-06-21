"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationService = void 0;
const common_1 = require("@nestjs/common");
let TranslationService = class TranslationService {
    constructor() {
        this.translations = [
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
        this.nextId = 3;
    }
    async create(createTranslationDto) {
        const existingTranslation = this.translations.find(t => t.key === createTranslationDto.key && t.languageId === createTranslationDto.languageId);
        if (existingTranslation) {
            throw new common_1.ConflictException('Translation for this key and language already exists');
        }
        const translation = {
            id: this.nextId++,
            ...createTranslationDto,
            namespace: createTranslationDto.namespace || 'general',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.translations.push(translation);
        return translation;
    }
    async findAll() {
        return this.translations.sort((a, b) => a.key.localeCompare(b.key));
    }
    async findByLanguage(languageId) {
        return this.translations
            .filter(t => t.languageId === languageId)
            .sort((a, b) => a.key.localeCompare(b.key));
    }
    async findByLanguageCode(languageCode) {
        return this.translations
            .filter(t => t.languageId === 1 || t.languageId === 2)
            .sort((a, b) => a.key.localeCompare(b.key));
    }
    async findByNamespace(namespace, languageId) {
        return this.translations
            .filter(t => {
            if (languageId) {
                return t.namespace === namespace && t.languageId === languageId;
            }
            return t.namespace === namespace;
        })
            .sort((a, b) => a.key.localeCompare(b.key));
    }
    async findOne(id) {
        const translation = this.translations.find(t => t.id === id);
        if (!translation) {
            throw new common_1.NotFoundException('Translation not found');
        }
        return translation;
    }
    async findByKey(key, languageId) {
        const translation = this.translations.find(t => t.key === key && t.languageId === languageId);
        if (!translation) {
            throw new common_1.NotFoundException('Translation not found');
        }
        return translation;
    }
    async update(id, updateTranslationDto) {
        const translation = await this.findOne(id);
        if (updateTranslationDto.key || updateTranslationDto.languageId) {
            const key = updateTranslationDto.key || translation.key;
            const languageId = updateTranslationDto.languageId || translation.languageId;
            if (key !== translation.key || languageId !== translation.languageId) {
                const existingTranslation = this.translations.find(t => t.key === key && t.languageId === languageId);
                if (existingTranslation && existingTranslation.id !== id) {
                    throw new common_1.ConflictException('Translation for this key and language already exists');
                }
            }
        }
        Object.assign(translation, updateTranslationDto, { updatedAt: new Date() });
        return translation;
    }
    async remove(id) {
        const translation = await this.findOne(id);
        const index = this.translations.findIndex(t => t.id === id);
        if (index > -1) {
            this.translations.splice(index, 1);
        }
    }
    async bulkCreate(translations) {
        const createdTranslations = [];
        for (const translationDto of translations) {
            try {
                const translation = await this.create(translationDto);
                createdTranslations.push(translation);
            }
            catch (error) {
                continue;
            }
        }
        return createdTranslations;
    }
    async getTranslationsAsKeyValue(languageCode, namespace) {
        const translations = this.translations.filter(t => {
            const languageMatch = (languageCode === 'en' && t.languageId === 1) ||
                (languageCode === 'es' && t.languageId === 2);
            if (namespace) {
                return languageMatch && t.namespace === namespace;
            }
            return languageMatch;
        });
        const result = {};
        translations.forEach(translation => {
            result[translation.key] = translation.value;
        });
        return result;
    }
};
exports.TranslationService = TranslationService;
exports.TranslationService = TranslationService = __decorate([
    (0, common_1.Injectable)()
], TranslationService);
//# sourceMappingURL=translation.service.js.map