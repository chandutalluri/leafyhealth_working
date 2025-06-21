import { LabeldesignService } from '../services/labeldesign.service';
export declare class LabeldesignController {
    private readonly labeldesignService;
    constructor(labeldesignService: LabeldesignService);
    getHealth(): Promise<{
        status: string;
        service: string;
        timestamp: string;
        version: string;
    }>;
    getAll(): Promise<{
        message: string;
        data: any[];
        total: number;
    }>;
    getById(id: string): Promise<{
        id: number;
        message: string;
        exists: boolean;
    }>;
    create(data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<{
        id: number;
        deleted: boolean;
        message: string;
    }>;
}
