import { LabelType, LabelSize } from './create-label.dto';
export declare enum TemplateCategory {
    STANDARD = "standard",
    PREMIUM = "premium",
    ORGANIC = "organic",
    SALE = "sale",
    SEASONAL = "seasonal",
    CUSTOM = "custom"
}
export declare class CreateTemplateDto {
    name: string;
    description?: string;
    labelType: LabelType;
    size: LabelSize;
    category: TemplateCategory;
    design: Record<string, any>;
    variableFields: string[];
    isActive?: boolean;
    previewUrl?: string;
}
