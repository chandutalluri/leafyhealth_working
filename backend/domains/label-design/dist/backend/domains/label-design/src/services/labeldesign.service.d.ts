export declare class LabeldesignService {
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
    getById(id: number): Promise<{
        id: number;
        message: string;
        exists: boolean;
    }>;
    create(data: any): Promise<any>;
    update(id: number, data: any): Promise<any>;
    delete(id: number): Promise<{
        id: number;
        deleted: boolean;
        message: string;
    }>;
}
