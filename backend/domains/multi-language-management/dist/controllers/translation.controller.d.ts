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
export declare class TranslationController {
    private readonly translationService;
    constructor(translationService: TranslationService);
    create(createTranslationDto: CreateTranslationDto): Promise<Translation>;
    bulkCreate(translations: CreateTranslationDto[]): Promise<Translation[]>;
    findAll(languageId?: string, namespace?: string): Promise<Translation[]>;
    findByLanguageCode(languageCode: string): Promise<Translation[]>;
    getKeyValuePairs(languageCode: string, namespace?: string): Promise<Record<string, string>>;
    findOne(id: number): Promise<Translation>;
    findByKey(key: string, languageId: number): Promise<Translation>;
    update(id: number, updateTranslationDto: UpdateTranslationDto): Promise<Translation>;
    remove(id: number): Promise<void>;
}
export {};
