"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyManagementController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const company_management_service_1 = require("../services/company-management.service");
const company_management_dto_1 = require("../dto/company-management.dto");
let CompanyManagementController = class CompanyManagementController {
    constructor(companyManagementService) {
        this.companyManagementService = companyManagementService;
    }
    getHealth() {
        return {
            status: 'healthy',
            service: 'company-management',
            timestamp: new Date().toISOString()
        };
    }
    createCompany(createCompanyDto) {
        return this.companyManagementService.createCompany(createCompanyDto);
    }
    getAllCompanies() {
        return this.companyManagementService.getAllCompanies();
    }
    getCompanyById(id) {
        return this.companyManagementService.getCompanyById(id);
    }
    updateCompany(id, updateCompanyDto) {
        console.log('Update Company Request:', { id, updateCompanyDto });
        return this.companyManagementService.updateCompany(id, updateCompanyDto);
    }
    deleteCompany(id) {
        return this.companyManagementService.deleteCompany(id);
    }
    getCompanyHierarchy(companyId) {
        return this.companyManagementService.getCompanyHierarchy(companyId);
    }
    createBranch(createBranchDto) {
        return this.companyManagementService.createBranch(createBranchDto);
    }
    getAllBranches() {
        return this.companyManagementService.getAllBranches();
    }
    getBranchById(id) {
        return this.companyManagementService.getBranchById(id);
    }
    updateBranch(id, updateBranchDto) {
        return this.companyManagementService.updateBranch(id, updateBranchDto);
    }
    deleteBranch(id) {
        return this.companyManagementService.deleteBranch(id);
    }
    getBranchesByCompany(companyId) {
        return this.companyManagementService.getBranchesByCompany(companyId);
    }
};
exports.CompanyManagementController = CompanyManagementController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CompanyManagementController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Post)('companies'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new company' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Company created successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_management_dto_1.CreateCompanyDto]),
    __metadata("design:returntype", void 0)
], CompanyManagementController.prototype, "createCompany", null);
__decorate([
    (0, common_1.Get)('companies'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all companies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Companies retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CompanyManagementController.prototype, "getAllCompanies", null);
__decorate([
    (0, common_1.Get)('companies/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get company by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Company retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyManagementController.prototype, "getCompanyById", null);
__decorate([
    (0, common_1.Put)('companies/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update company' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Company updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, company_management_dto_1.UpdateCompanyDto]),
    __metadata("design:returntype", void 0)
], CompanyManagementController.prototype, "updateCompany", null);
__decorate([
    (0, common_1.Delete)('companies/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete company' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Company deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyManagementController.prototype, "deleteCompany", null);
__decorate([
    (0, common_1.Get)('companies/:id/hierarchy'),
    (0, swagger_1.ApiOperation)({ summary: 'Get company hierarchy with branches' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Company hierarchy retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyManagementController.prototype, "getCompanyHierarchy", null);
__decorate([
    (0, common_1.Post)('branches'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new branch' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Branch created successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_management_dto_1.CreateBranchDto]),
    __metadata("design:returntype", void 0)
], CompanyManagementController.prototype, "createBranch", null);
__decorate([
    (0, common_1.Get)('branches'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all branches' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Branches retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CompanyManagementController.prototype, "getAllBranches", null);
__decorate([
    (0, common_1.Get)('branches/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get branch by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Branch retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyManagementController.prototype, "getBranchById", null);
__decorate([
    (0, common_1.Put)('branches/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update branch' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Branch updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, company_management_dto_1.UpdateBranchDto]),
    __metadata("design:returntype", void 0)
], CompanyManagementController.prototype, "updateBranch", null);
__decorate([
    (0, common_1.Delete)('branches/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete branch' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Branch deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyManagementController.prototype, "deleteBranch", null);
__decorate([
    (0, common_1.Get)('companies/:companyId/branches'),
    (0, swagger_1.ApiOperation)({ summary: 'Get branches by company ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Company branches retrieved successfully' }),
    __param(0, (0, common_1.Param)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyManagementController.prototype, "getBranchesByCompany", null);
exports.CompanyManagementController = CompanyManagementController = __decorate([
    (0, swagger_1.ApiTags)('Company Management'),
    (0, common_1.Controller)('company-management'),
    __metadata("design:paramtypes", [company_management_service_1.CompanyManagementService])
], CompanyManagementController);
//# sourceMappingURL=company-management.controller.js.map