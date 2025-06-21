import { Controller, Get, Post, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ComplianceService } from '../services/compliance.service';
import { CreateComplianceEventDto } from '../dto/create-compliance-event.dto';

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post('events')
  async createEvent(@Body() createEventDto: CreateComplianceEventDto) {
    return this.complianceService.createEvent(createEventDto);
  }

  @Get('events')
  async getEvents(
    @Query('severity') severity?: string,
    @Query('status') status?: string,
    @Query('entityType') entityType?: string,
  ) {
    const filters = { severity, status, entityType };
    return this.complianceService.getEvents(filters);
  }

  @Get('audit-trail/:entityType/:entityId')
  async getAuditTrail(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.complianceService.getEvents({ entityType });
  }

  @Get('stats')
  async getComplianceStats() {
    return this.complianceService.getEvents({});
  }

  @Post('reports/generate')
  async generateReport(
    @Body() reportData: {
      reportType: string;
      startDate: string;
      endDate: string;
    },
  ) {
    return this.complianceService.createEvent({
      eventType: 'report',
      entityType: reportData.reportType,
      entityId: parseInt('1'),
      description: 'report_generated',
      severity: 'info',
      metadata: JSON.stringify(reportData)
    });
  }
}