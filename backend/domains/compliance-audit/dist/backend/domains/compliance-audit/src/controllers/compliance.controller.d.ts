import { ComplianceService } from '../services/compliance.service';
import { CreateComplianceEventDto } from '../dto/create-compliance-event.dto';
export declare class ComplianceController {
    private readonly complianceService;
    constructor(complianceService: ComplianceService);
    createEvent(createEventDto: CreateComplianceEventDto): Promise<{
        success: boolean;
        data: {
            id: number;
            eventType: string;
            entityType: string;
            entityId: number;
            description: string;
            severity: string;
            status: string;
            detectedAt: Date;
            resolvedAt: Date;
            assignedTo: number;
            metadata: unknown;
            actionTaken: string;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    getEvents(severity?: string, status?: string, entityType?: string): Promise<{
        success: boolean;
        data: {
            id: number;
            eventType: string;
            entityType: string;
            entityId: number;
            description: string;
            severity: string;
            status: string;
            detectedAt: Date;
            resolvedAt: Date;
            assignedTo: number;
            metadata: unknown;
            actionTaken: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        count: number;
    }>;
    getAuditTrail(entityType: string, entityId: string): Promise<{
        success: boolean;
        data: {
            id: number;
            eventType: string;
            entityType: string;
            entityId: number;
            description: string;
            severity: string;
            status: string;
            detectedAt: Date;
            resolvedAt: Date;
            assignedTo: number;
            metadata: unknown;
            actionTaken: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        count: number;
    }>;
    getComplianceStats(): Promise<{
        success: boolean;
        data: {
            id: number;
            eventType: string;
            entityType: string;
            entityId: number;
            description: string;
            severity: string;
            status: string;
            detectedAt: Date;
            resolvedAt: Date;
            assignedTo: number;
            metadata: unknown;
            actionTaken: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        count: number;
    }>;
    generateReport(reportData: {
        reportType: string;
        startDate: string;
        endDate: string;
    }): Promise<{
        success: boolean;
        data: {
            id: number;
            eventType: string;
            entityType: string;
            entityId: number;
            description: string;
            severity: string;
            status: string;
            detectedAt: Date;
            resolvedAt: Date;
            assignedTo: number;
            metadata: unknown;
            actionTaken: string;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
}
