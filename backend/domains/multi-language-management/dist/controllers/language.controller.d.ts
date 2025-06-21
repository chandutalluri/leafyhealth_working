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
export declare class LanguageController {
    private readonly languageService;
    constructor(languageService: LanguageService);
    create(createLanguageDto: CreateLanguageDto): Promise<Language>;
    findAll(): Promise<Language[]>;
    findActive(): Promise<Language[]>;
    findDefault(): Promise<Language>;
    findOne(id: number): Promise<Language>;
    findByCode(code: string): Promise<Language>;
    update(id: number, updateLanguageDto: UpdateLanguageDto): Promise<Language>;
    setAsDefault(id: number): Promise<Language>;
    remove(id: number): Promise<void>;
}
export {};
