import { LabelService } from '../services/label.service';
import { CreateLabelDto, LabelType } from '../dto/create-label.dto';
export declare class LabelController {
    private readonly labelService;
    constructor(labelService: LabelService);
    createLabel(createLabelDto: CreateLabelDto): Promise<{
        id: number;
        name: string;
        templateType: string;
        content: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getLabels(type?: LabelType, productId?: number): Promise<{
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
