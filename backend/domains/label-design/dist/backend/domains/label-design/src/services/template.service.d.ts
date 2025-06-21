import { CreateTemplateDto, TemplateCategory } from '../dto/create-template.dto';
import { LabelType } from '../dto/create-label.dto';
export declare class TemplateService {
    createTemplate(createTemplateDto: CreateTemplateDto): Promise<{
        id: number;
        name: string;
        description: string;
        labelType: LabelType;
        size: import("../dto/create-label.dto").LabelSize;
        category: TemplateCategory;
        design: Record<string, any>;
        variableFields: string[];
        isActive: boolean;
        previewUrl: string;
        createdAt: string;
        updatedAt: string;
        usageCount: number;
    }>;
    getTemplates(filters: {
        category?: TemplateCategory;
        labelType?: LabelType;
    }): Promise<{
        id: number;
        name: string;
        description: string;
        labelType: LabelType;
        size: string;
        category: TemplateCategory;
        isActive: boolean;
        usageCount: number;
        previewUrl: string;
        createdAt: string;
    }[]>;
    getTemplateById(id: number): Promise<{
        id: number;
        name: string;
        description: string;
        labelType: LabelType;
        size: string;
        category: TemplateCategory;
        design: {
            backgroundColor: string;
            borderColor: string;
            fontFamily: string;
            fontSize: number;
            layout: string;
            elements: ({
                type: string;
                field: string;
                x: number;
                y: number;
                fontSize?: undefined;
                fontWeight?: undefined;
            } | {
                type: string;
                field: string;
                x: number;
                y: number;
                fontSize: number;
                fontWeight: string;
            } | {
                type: string;
                field: string;
                x: number;
                y: number;
                fontSize: number;
                fontWeight?: undefined;
            })[];
        };
        variableFields: string[];
        isActive: boolean;
        previewUrl: string;
        createdAt: string;
        updatedAt: string;
        usageCount: number;
    }>;
    generatePreview(id: number): Promise<{
        templateId: number;
        previewUrl: string;
        sampleData: {
            productName: string;
            price: string;
            unit: string;
            organic: boolean;
        };
        dimensions: {
            width: number;
            height: number;
        };
        generatedAt: string;
    }>;
    getTemplateStats(): Promise<{
        totalTemplates: number;
        activeTemplates: number;
        inactiveTemplates: number;
        byCategory: {
            standard: number;
            premium: number;
            organic: number;
            sale: number;
            seasonal: number;
        };
        byLabelType: {
            priceTag: number;
            nutritionLabel: number;
            productLabel: number;
            complianceLabel: number;
            promotional: number;
        };
        usage: {
            mostUsed: string;
            totalUsage: number;
            averageUsage: number;
        };
    }>;
}
