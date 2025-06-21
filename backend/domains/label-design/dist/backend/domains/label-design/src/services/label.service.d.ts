export declare class LabelService {
    createLabel(createLabelDto: any): Promise<{
        id: number;
        name: string;
        templateType: string;
        content: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getLabels(filters?: any): Promise<{
        id: number;
        name: string;
        templateType: string;
        content: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getLabelById(id: number): Promise<{
        id: number;
        name: string;
        templateType: string;
        content: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    generatePreview(id: number): Promise<{
        id: number;
        preview: string;
        type: string;
    }>;
    getLabelStats(): Promise<{
        totalTemplates: number;
        totalGenerated: number;
        activeTemplates: number;
    }>;
}
