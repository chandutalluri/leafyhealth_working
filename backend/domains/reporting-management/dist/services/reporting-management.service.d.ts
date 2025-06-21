export declare class ReportingManagementService {
    getHealth(): {
        status: string;
        service: string;
        domain: string;
        timestamp: string;
    };
    findAll(): Promise<{
        message: string;
        data: any[];
    }>;
    create(data: any): Promise<{
        message: string;
        data: any;
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: {
            id: string;
        };
    }>;
    update(id: string, data: any): Promise<{
        message: string;
        data: any;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
