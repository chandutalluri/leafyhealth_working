export declare class CreateComplianceEventDto {
    eventType: string;
    entityType: string;
    entityId: number;
    userId?: number;
    description: string;
    severity?: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
}
