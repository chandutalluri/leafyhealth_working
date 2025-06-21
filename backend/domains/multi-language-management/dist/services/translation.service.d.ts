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
export declare class TranslationService {
    private translations;
    private nextId;
    create(createTranslationDto: CreateTranslationDto): Promise<Translation>;
    findAll(): Promise<Translation[]>;
    findByLanguage(languageId: number): Promise<Translation[]>;
    findByLanguageCode(languageCode: string): Promise<Translation[]>;
    findByNamespace(namespace: string, languageId?: number): Promise<Translation[]>;
    findOne(id: number): Promise<Translation>;
    findByKey(key: string, languageId: number): Promise<Translation>;
    update(id: number, updateTranslationDto: UpdateTranslationDto): Promise<Translation>;
    remove(id: number): Promise<void>;
    bulkCreate(translations: CreateTranslationDto[]): Promise<Translation[]>;
    getTranslationsAsKeyValue(languageCode: string, namespace?: string): Promise<Record<string, string>>;
}
export {};
