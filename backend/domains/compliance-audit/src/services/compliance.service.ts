import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc, and, sql, count } from 'drizzle-orm';
import { 
  db, 
  complianceEvents, 
  auditLogs, 
  policyViolations, 
  complianceReports, 
  dataProtectionRecords,
  type ComplianceEvent,
  type InsertComplianceEvent,
  type AuditLog,
  type InsertAuditLog
} from '../database';

@Injectable()
export class ComplianceService {

  async createEvent(eventData: InsertComplianceEvent) {
    try {
      const [event] = await db.insert(complianceEvents).values(eventData).returning();

      return {
        success: true,
        data: event,
        message: 'Compliance event created successfully'
      };
    } catch (error) {
      console.error('Error creating compliance event:', error);
      throw new Error('Failed to create compliance event');
    }
  }

  async getEvents(filters: any = {}) {
    try {
      const events = await db.select().from(complianceEvents).orderBy(desc(complianceEvents.detectedAt));

      return {
        success: true,
        data: events,
        count: events.length
      };
    } catch (error) {
      console.error('Error fetching compliance events:', error);
      throw new Error('Failed to fetch compliance events');
    }
  }

  async logAuditEvent(auditData: InsertAuditLog) {
    try {
      const [auditLog] = await db.insert(auditLogs).values(auditData).returning();

      return {
        success: true,
        data: auditLog,
        message: 'Audit event logged successfully'
      };
    } catch (error) {
      console.error('Error logging audit event:', error);
      throw new Error('Failed to log audit event');
    }
  }

  async getAuditTrail(limit = 100) {
    try {
      const auditTrail = await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(limit);

      return {
        success: true,
        data: auditTrail,
        count: auditTrail.length
      };
    } catch (error) {
      console.error('Error fetching audit trail:', error);
      throw new Error('Failed to fetch audit trail');
    }
  }

  async getComplianceDashboard() {
    try {
      const eventsBySeverity = await db
        .select({
          severity: complianceEvents.severity,
          count: sql<number>`COUNT(*)`
        })
        .from(complianceEvents)
        .groupBy(complianceEvents.severity);

      const recentEvents = await db
        .select()
        .from(complianceEvents)
        .orderBy(desc(complianceEvents.detectedAt))
        .limit(10);

      return {
        success: true,
        data: {
          eventsBySeverity,
          recentEvents,
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error generating compliance dashboard:', error);
      throw new Error('Failed to generate compliance dashboard');
    }
  }

  async recordDataAccess(accessData: any) {
    try {
      const auditData: InsertAuditLog = {
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
    } catch (error) {
      console.error('Error recording data access:', error);
      throw new Error('Failed to record data access');
    }
  }
}