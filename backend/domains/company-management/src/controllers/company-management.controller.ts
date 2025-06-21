import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  HttpStatus, 
  HttpCode,
  ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CompanyManagementService } from '../services/company-management.service';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  CreateBranchDto,
  UpdateBranchDto,
} from '../dto/company-management.dto';

@ApiTags('Company Management')
// Bearer auth disabled
@Controller('company-management')
export class CompanyManagementController {
  constructor(private readonly companyManagementService: CompanyManagementService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return { 
      status: 'healthy', 
      service: 'company-management',
      timestamp: new Date().toISOString()
    };
  }

  // Company Endpoints
  @Post('companies')
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 201, description: 'Company created successfully' })
  @HttpCode(HttpStatus.CREATED)
  createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyManagementService.createCompany(createCompanyDto);
  }

  @Get('companies')
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({ status: 200, description: 'Companies retrieved successfully' })
  getAllCompanies() {
    return this.companyManagementService.getAllCompanies();
  }

  @Get('companies/:id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiResponse({ status: 200, description: 'Company retrieved successfully' })
  getCompanyById(@Param('id') id: string) {
    return this.companyManagementService.getCompanyById(id);
  }

  @Put('companies/:id')
  @ApiOperation({ summary: 'Update company' })
  @ApiResponse({ status: 200, description: 'Company updated successfully' })
  updateCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto
  ) {
    console.log('Update Company Request:', { id, updateCompanyDto });
    return this.companyManagementService.updateCompany(id, updateCompanyDto);
  }

  @Delete('companies/:id')
  @ApiOperation({ summary: 'Delete company' })
  @ApiResponse({ status: 200, description: 'Company deleted successfully' })
  deleteCompany(@Param('id') id: string) {
    return this.companyManagementService.deleteCompany(id);
  }

  @Get('companies/:id/hierarchy')
  @ApiOperation({ summary: 'Get company hierarchy with branches' })
  @ApiResponse({ status: 200, description: 'Company hierarchy retrieved successfully' })
  getCompanyHierarchy(@Param('id') companyId: string) {
    return this.companyManagementService.getCompanyHierarchy(companyId);
  }

  // Branch Endpoints
  @Post('branches')
  @ApiOperation({ summary: 'Create a new branch' })
  @ApiResponse({ status: 201, description: 'Branch created successfully' })
  @HttpCode(HttpStatus.CREATED)
  createBranch(@Body() createBranchDto: CreateBranchDto) {
    return this.companyManagementService.createBranch(createBranchDto);
  }

  @Get('branches')
  @ApiOperation({ summary: 'Get all branches' })
  @ApiResponse({ status: 200, description: 'Branches retrieved successfully' })
  getAllBranches() {
    return this.companyManagementService.getAllBranches();
  }

  @Get('branches/:id')
  @ApiOperation({ summary: 'Get branch by ID' })
  @ApiResponse({ status: 200, description: 'Branch retrieved successfully' })
  getBranchById(@Param('id') id: string) {
    return this.companyManagementService.getBranchById(id);
  }

  @Put('branches/:id')
  @ApiOperation({ summary: 'Update branch' })
  @ApiResponse({ status: 200, description: 'Branch updated successfully' })
  updateBranch(
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto
  ) {
    return this.companyManagementService.updateBranch(id, updateBranchDto);
  }

  @Delete('branches/:id')
  @ApiOperation({ summary: 'Delete branch' })
  @ApiResponse({ status: 200, description: 'Branch deleted successfully' })
  deleteBranch(@Param('id') id: string) {
    return this.companyManagementService.deleteBranch(id);
  }

  @Get('companies/:companyId/branches')
  @ApiOperation({ summary: 'Get branches by company ID' })
  @ApiResponse({ status: 200, description: 'Company branches retrieved successfully' })
  getBranchesByCompany(@Param('companyId') companyId: string) {
    return this.companyManagementService.getBranchesByCompany(companyId);
  }
}