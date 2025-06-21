import { type InsertComplianceEvent, type InsertAuditLog } from '../database';
export declare class ComplianceService {
    createEvent(eventData: InsertComplianceEvent): Promise<{
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
    getEvents(filters?: any): Promise<{
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
    logAuditEvent(auditData: InsertAuditLog): Promise<{
        success: boolean;
        data: {
            id: number;
            userId: number;
            action: string;
            resource: string;
            resourceId: string;
            oldValues: unknown;
            newValues: unknown;
            ipAddress: string;
            userAgent: string;
            sessionId: string;
            success: boolean;
            errorMessage: string;
            timestamp: Date;
        };
        message: string;
    }>;
    getAuditTrail(limit?: number): Promise<{
        success: boolean;
        data: {
            id: number;
            userId: number;
            action: string;
            resource: string;
            resourceId: string;
            oldValues: unknown;
            newValues: unknown;
            ipAddress: string;
            userAgent: string;
            sessionId: string;
            success: boolean;
            errorMessage: string;
            timestamp: Date;
        }[];
        count: number;
    }>;
    getComplianceDashboard(): Promise<{
        success: boolean;
        data: {
            eventsBySeverity: {
                severity: string;
                count: number;
            }[];
            recentEvents: {
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
            generatedAt: string;
        };
    }>;
    recordDataAccess(accessData: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
