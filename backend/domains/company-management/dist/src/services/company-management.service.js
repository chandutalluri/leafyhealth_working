"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyManagementService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const company_management_entity_1 = require("../entities/company-management.entity");
let CompanyManagementService = class CompanyManagementService {
    async createCompany(createCompanyDto) {
        try {
            const [company] = await connection_1.db
                .insert(company_management_entity_1.companies)
                .values({
                name: createCompanyDto.name,
                description: createCompanyDto.description,
                website: createCompanyDto.website,
                email: createCompanyDto.email,
                phone: createCompanyDto.phone,
                address: createCompanyDto.address,
                logoUrl: createCompanyDto.logoUrl,
                primaryColor: createCompanyDto.primaryColor || '#6366f1',
                secondaryColor: createCompanyDto.secondaryColor || '#8b5cf6',
                accentColor: createCompanyDto.accentColor || '#06b6d4',
                isActive: createCompanyDto.isActive ?? true,
            })
                .returning();
            return company;
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create company');
        }
    }
    async getAllCompanies() {
        return await connection_1.db.select().from(company_management_entity_1.companies).where((0, drizzle_orm_1.eq)(company_management_entity_1.companies.isActive, true));
    }
    async getCompanyById(id) {
        const company = await connection_1.db
            .select()
            .from(company_management_entity_1.companies)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(company_management_entity_1.companies.id, id), (0, drizzle_orm_1.eq)(company_management_entity_1.companies.isActive, true)))
            .limit(1);
        if (!company.length) {
            throw new common_1.NotFoundException('Company not found');
        }
        return company[0];
    }
    async updateCompany(id, updateCompanyDto) {
        try {
            const updateData = {};
            if (updateCompanyDto.name !== undefined)
                updateData.name = updateCompanyDto.name;
            if (updateCompanyDto.description !== undefined)
                updateData.description = updateCompanyDto.description;
            if (updateCompanyDto.website !== undefined)
                updateData.website = updateCompanyDto.website;
            if (updateCompanyDto.email !== undefined)
                updateData.email = updateCompanyDto.email;
            if (updateCompanyDto.phone !== undefined)
                updateData.phone = updateCompanyDto.phone;
            if (updateCompanyDto.address !== undefined)
                updateData.address = updateCompanyDto.address;
            if (updateCompanyDto.logoUrl !== undefined)
                updateData.logoUrl = updateCompanyDto.logoUrl;
            if (updateCompanyDto.primaryColor !== undefined)
                updateData.primaryColor = updateCompanyDto.primaryColor;
            if (updateCompanyDto.secondaryColor !== undefined)
                updateData.secondaryColor = updateCompanyDto.secondaryColor;
            if (updateCompanyDto.accentColor !== undefined)
                updateData.accentColor = updateCompanyDto.accentColor;
            if (updateCompanyDto.gstNumber !== undefined)
                updateData.gstNumber = updateCompanyDto.gstNumber;
            if (updateCompanyDto.fssaiLicense !== undefined)
                updateData.fssaiLicense = updateCompanyDto.fssaiLicense;
            if (updateCompanyDto.panNumber !== undefined)
                updateData.panNumber = updateCompanyDto.panNumber;
            if (updateCompanyDto.cinNumber !== undefined)
                updateData.cinNumber = updateCompanyDto.cinNumber;
            if (updateCompanyDto.msmeRegistration !== undefined)
                updateData.msmeRegistration = updateCompanyDto.msmeRegistration;
            if (updateCompanyDto.tradeLicense !== undefined)
                updateData.tradeLicense = updateCompanyDto.tradeLicense;
            if (updateCompanyDto.establishmentYear !== undefined)
                updateData.establishmentYear = updateCompanyDto.establishmentYear;
            if (updateCompanyDto.businessCategory !== undefined)
                updateData.businessCategory = updateCompanyDto.businessCategory;
            if (updateCompanyDto.isActive !== undefined)
                updateData.isActive = updateCompanyDto.isActive;
            updateData.updatedAt = new Date();
            const [updatedCompany] = await connection_1.db
                .update(company_management_entity_1.companies)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(company_management_entity_1.companies.id, id))
                .returning();
            if (!updatedCompany) {
                throw new common_1.NotFoundException('Company not found');
            }
            return updatedCompany;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to update company');
        }
    }
    async deleteCompany(id) {
        try {
            const [deletedCompany] = await connection_1.db
                .update(company_management_entity_1.companies)
                .set({ isActive: false, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(company_management_entity_1.companies.id, id))
                .returning();
            if (!deletedCompany) {
                throw new common_1.NotFoundException('Company not found');
            }
            return { message: 'Company deleted successfully' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to delete company');
        }
    }
    async createBranch(createBranchDto) {
        try {
            await this.getCompanyById(createBranchDto.companyId);
            const [branch] = await connection_1.db
                .insert(company_management_entity_1.enhancedBranches)
                .values({
                companyId: createBranchDto.companyId,
                name: createBranchDto.name,
                address: createBranchDto.address,
                latitude: createBranchDto.latitude?.toString(),
                longitude: createBranchDto.longitude?.toString(),
                language: createBranchDto.language || 'en',
                phone: createBranchDto.phone,
                whatsappNumber: createBranchDto.whatsappNumber,
                email: createBranchDto.email,
                managerName: createBranchDto.managerName,
                operatingHours: createBranchDto.operatingHours,
                isActive: createBranchDto.isActive ?? true,
            })
                .returning();
            return branch;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to create branch');
        }
    }
    async getAllBranches() {
        return await connection_1.db.select().from(company_management_entity_1.enhancedBranches).where((0, drizzle_orm_1.eq)(company_management_entity_1.enhancedBranches.isActive, true));
    }
    async getBranchesByCompany(companyId) {
        return await connection_1.db
            .select()
            .from(company_management_entity_1.enhancedBranches)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(company_management_entity_1.enhancedBranches.companyId, companyId), (0, drizzle_orm_1.eq)(company_management_entity_1.enhancedBranches.isActive, true)));
    }
    async getBranchById(id) {
        const branch = await connection_1.db
            .select()
            .from(company_management_entity_1.enhancedBranches)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(company_management_entity_1.enhancedBranches.id, id), (0, drizzle_orm_1.eq)(company_management_entity_1.enhancedBranches.isActive, true)))
            .limit(1);
        if (!branch.length) {
            throw new common_1.NotFoundException('Branch not found');
        }
        return branch[0];
    }
    async updateBranch(id, updateBranchDto) {
        try {
            const updateData = {};
            if (updateBranchDto.name !== undefined)
                updateData.name = updateBranchDto.name;
            if (updateBranchDto.address !== undefined)
                updateData.address = updateBranchDto.address;
            if (updateBranchDto.latitude !== undefined)
                updateData.latitude = updateBranchDto.latitude?.toString();
            if (updateBranchDto.longitude !== undefined)
                updateData.longitude = updateBranchDto.longitude?.toString();
            if (updateBranchDto.language !== undefined)
                updateData.language = updateBranchDto.language;
            if (updateBranchDto.phone !== undefined)
                updateData.phone = updateBranchDto.phone;
            if (updateBranchDto.whatsappNumber !== undefined)
                updateData.whatsappNumber = updateBranchDto.whatsappNumber;
            if (updateBranchDto.email !== undefined)
                updateData.email = updateBranchDto.email;
            if (updateBranchDto.managerName !== undefined)
                updateData.managerName = updateBranchDto.managerName;
            if (updateBranchDto.operatingHours !== undefined)
                updateData.operatingHours = updateBranchDto.operatingHours;
            if (updateBranchDto.isActive !== undefined)
                updateData.isActive = updateBranchDto.isActive;
            updateData.updatedAt = new Date();
            const [updatedBranch] = await connection_1.db
                .update(company_management_entity_1.enhancedBranches)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(company_management_entity_1.enhancedBranches.id, id))
                .returning();
            if (!updatedBranch) {
                throw new common_1.NotFoundException('Branch not found');
            }
            return updatedBranch;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to update branch');
        }
    }
    async deleteBranch(id) {
        try {
            const [deletedBranch] = await connection_1.db
                .update(company_management_entity_1.enhancedBranches)
                .set({ isActive: false, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(company_management_entity_1.enhancedBranches.id, id))
                .returning();
            if (!deletedBranch) {
                throw new common_1.NotFoundException('Branch not found');
            }
            return { message: 'Branch deleted successfully' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to delete branch');
        }
    }
    async getCompanyHierarchy(companyId) {
        const company = await this.getCompanyById(companyId);
        const branches = await this.getBranchesByCompany(companyId);
        return {
            company,
            branches,
            totalBranches: branches.length,
        };
    }
};
exports.CompanyManagementService = CompanyManagementService;
exports.CompanyManagementService = CompanyManagementService = __decorate([
    (0, common_1.Injectable)()
], CompanyManagementService);
//# sourceMappingURL=company-management.service.js.map