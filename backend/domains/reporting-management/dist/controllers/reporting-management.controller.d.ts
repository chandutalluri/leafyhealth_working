import { ReportingManagementService } from '../services/reporting-management.service';
export declare class ReportingManagementController {
    private readonly reportingManagementService;
    constructor(reportingManagementService: ReportingManagementService);
    getHealth(): {
        status: string;
        service: string;
        domain: string;
        timestamp: string;
    };
    findAll(query: any): Promise<{
        message: string;
        data: any[];
    }>;
    create(body: any): Promise<{
        message: string;
        data: any;
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: {
            id: string;
        };
    }>;
    update(id: string, body: any): Promise<{
        message: string;
        data: any;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
