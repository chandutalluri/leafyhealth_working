import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IntegrationHubService } from '../services/integration-hub.service';
import { CreateIntegrationDto, UpdateIntegrationDto } from '../dto/integration-hub.dto';

@ApiTags('Integration Hub')
@Controller('integration-hub')
// Auth disabled for development
// Bearer auth disabled
export class IntegrationHubController {
  constructor(private readonly integrationHubService: IntegrationHubService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'integration-hub'
    };
  }

  @Post('integrations')
  @ApiOperation({ summary: 'Create new integration' })
  @ApiResponse({ status: 201, description: 'Integration created successfully' })
  async createIntegration(@Body() createIntegrationDto: CreateIntegrationDto) {
    return this.integrationHubService.createIntegration(createIntegrationDto);
  }

  @Get('integrations')
  @ApiOperation({ summary: 'Get all integrations' })
  @ApiResponse({ status: 200, description: 'List of integrations' })
  async getIntegrations() {
    return this.integrationHubService.getAllIntegrations();
  }

  @Get('integrations/:id')
  @ApiOperation({ summary: 'Get integration by ID' })
  @ApiResponse({ status: 200, description: 'Integration details' })
  async getIntegration(@Param('id') id: string) {
    return this.integrationHubService.getIntegrationById(parseInt(id));
  }

  @Put('integrations/:id')
  @ApiOperation({ summary: 'Update integration' })
  @ApiResponse({ status: 200, description: 'Integration updated successfully' })
  async updateIntegration(
    @Param('id') id: string,
    @Body() updateIntegrationDto: UpdateIntegrationDto
  ) {
    return this.integrationHubService.updateIntegration(parseInt(id), updateIntegrationDto);
  }

  @Delete('integrations/:id')
  @ApiOperation({ summary: 'Delete integration' })
  @ApiResponse({ status: 200, description: 'Integration deleted successfully' })
  async deleteIntegration(@Param('id') id: string) {
    return this.integrationHubService.deleteIntegration(parseInt(id));
  }

  @Get('integrations/:id/status')
  @ApiOperation({ summary: 'Get integration status' })
  @ApiResponse({ status: 200, description: 'Integration status' })
  async getIntegrationStatus(@Param('id') id: string) {
    return this.integrationHubService.getIntegrationStatus(parseInt(id));
  }

  @Post('integrations/:id/sync')
  @ApiOperation({ summary: 'Sync integration data' })
  @ApiResponse({ status: 200, description: 'Integration sync initiated' })
  async syncIntegration(@Param('id') id: string) {
    return this.integrationHubService.syncIntegration(parseInt(id));
  }
}