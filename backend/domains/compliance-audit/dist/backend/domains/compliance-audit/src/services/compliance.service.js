"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../database");
let ComplianceService = class ComplianceService {
    async createEvent(eventData) {
        try {
            const [event] = await database_1.db.insert(database_1.complianceEvents).values(eventData).returning();
            return {
                success: true,
                data: event,
                message: 'Compliance event created successfully'
            };
        }
        catch (error) {
            console.error('Error creating compliance event:', error);
            throw new Error('Failed to create compliance event');
        }
    }
    async getEvents(filters = {}) {
        try {
            const events = await database_1.db.select().from(database_1.complianceEvents).orderBy((0, drizzle_orm_1.desc)(database_1.complianceEvents.detectedAt));
            return {
                success: true,
                data: events,
                count: events.length
            };
        }
        catch (error) {
            console.error('Error fetching compliance events:', error);
            throw new Error('Failed to fetch compliance events');
        }
    }
    async logAuditEvent(auditData) {
        try {
            const [auditLog] = await database_1.db.insert(database_1.auditLogs).values(auditData).returning();
            return {
                success: true,
                data: auditLog,
                message: 'Audit event logged successfully'
            };
        }
        catch (error) {
            console.error('Error logging audit event:', error);
            throw new Error('Failed to log audit event');
        }
    }
    async getAuditTrail(limit = 100) {
        try {
            const auditTrail = await database_1.db.select().from(database_1.auditLogs).orderBy((0, drizzle_orm_1.desc)(database_1.auditLogs.timestamp)).limit(limit);
            return {
                success: true,
                data: auditTrail,
                count: auditTrail.length
            };
        }
        catch (error) {
            console.error('Error fetching audit trail:', error);
            throw new Error('Failed to fetch audit trail');
        }
    }
    async getComplianceDashboard() {
        try {
            const eventsBySeverity = await database_1.db
                .select({
                severity: database_1.complianceEvents.severity,
                count: (0, drizzle_orm_1.sql) `COUNT(*)`
            })
                .from(database_1.complianceEvents)
                .groupBy(database_1.complianceEvents.severity);
            const recentEvents = await database_1.db
                .select()
                .from(database_1.complianceEvents)
                .orderBy((0, drizzle_orm_1.desc)(database_1.complianceEvents.detectedAt))
                .limit(10);
            return {
                success: true,
                data: {
                    eventsBySeverity,
                    recentEvents,
                    generatedAt: new Date().toISOString()
                }
            };
        }
        catch (error) {
            console.error('Error generating compliance dashboard:', error);
            throw new Error('Failed to generate compliance dashboard');
        }
    }
    async recordDataAccess(accessData) {
        try {
            const auditData = {
                userId: accessData.userId,
                action: 'data_access',
                resource: accessData.dataType,
                resourceId: accessData.recordId,
                ipAddress: accessData.ipAddress,
                userAgent: accessData.userAgent,
                success: true
            };
            await this.logAuditEvent(auditData);
            return {
                success: true,
                message: 'Data access recorded successfully'
            };
        }
        catch (error) {
            console.error('Error recording data access:', error);
            throw new Error('Failed to record data access');
        }
    }
};
exports.ComplianceService = ComplianceService;
exports.ComplianceService = ComplianceService = __decorate([
    (0, common_1.Injectable)()
], ComplianceService);
//# sourceMappingURL=compliance.service.js.map