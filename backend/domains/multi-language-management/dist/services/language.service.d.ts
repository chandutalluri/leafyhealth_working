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
export declare class LanguageService {
    private languages;
    private nextId;
    create(createLanguageDto: CreateLanguageDto): Promise<Language>;
    findAll(): Promise<Language[]>;
    findActive(): Promise<Language[]>;
    findOne(id: number): Promise<Language>;
    findByCode(code: string): Promise<Language>;
    findDefault(): Promise<Language>;
    update(id: number, updateLanguageDto: UpdateLanguageDto): Promise<Language>;
    remove(id: number): Promise<void>;
    setAsDefault(id: number): Promise<Language>;
}
export {};
