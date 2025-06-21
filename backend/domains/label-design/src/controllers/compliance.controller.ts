import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ComplianceService } from '../services/compliance.service';

@ApiTags('compliance')
// Bearer auth disabled
// Auth disabled for development
@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post('validate/:labelId')
  @ApiOperation({ summary: 'Validate label compliance' })
  @ApiResponse({ status: 200, description: 'Compliance validation result' })
  async validateLabelCompliance(@Param('labelId') labelId: number) {
    return this.complianceService.validateLabelCompliance(labelId);
  }

  @Get('requirements')
  @ApiOperation({ summary: 'Get compliance requirements' })
  @ApiResponse({ status: 200, description: 'List of compliance requirements' })
  async getComplianceRequirements() {
    return this.complianceService.getComplianceRequirements();
  }

  @Get('nutrition/template')
  @ApiOperation({ summary: 'Get nutrition label template' })
  @ApiResponse({ status: 200, description: 'Nutrition label template' })
  async getNutritionTemplate() {
    return this.complianceService.getNutritionTemplate();
  }

  @Post('allergen/check')
  @ApiOperation({ summary: 'Check allergen compliance' })
  @ApiResponse({ status: 200, description: 'Allergen compliance check result' })
  async checkAllergenCompliance(@Body() data: { productId: number; allergens: string[] }) {
    return this.complianceService.checkAllergenCompliance(data.productId, data.allergens);
  }

  @Get('certifications')
  @ApiOperation({ summary: 'Get available certifications' })
  @ApiResponse({ status: 200, description: 'List of certifications' })
  async getCertifications() {
    return this.complianceService.getCertifications();
  }

  @Get('stats/compliance')
  @ApiOperation({ summary: 'Get compliance statistics' })
  @ApiResponse({ status: 200, description: 'Compliance statistics' })
  async getComplianceStats() {
    return this.complianceService.getComplianceStats();
  }
}