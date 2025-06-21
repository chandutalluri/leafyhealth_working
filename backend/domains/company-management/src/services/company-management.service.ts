import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from '../database/connection';
import { companies, enhancedBranches } from '../entities/company-management.entity';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  CreateBranchDto,
  UpdateBranchDto,
} from '../dto/company-management.dto';

@Injectable()
export class CompanyManagementService {
  // Company Operations
  async createCompany(createCompanyDto: CreateCompanyDto) {
    try {
      const [company] = await db
        .insert(companies)
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
    } catch (error) {
      throw new BadRequestException('Failed to create company');
    }
  }

  async getAllCompanies() {
    return await db.select().from(companies).where(eq(companies.isActive, true));
  }

  async getCompanyById(id: string) {
    const company = await db
      .select()
      .from(companies)
      .where(and(eq(companies.id, id), eq(companies.isActive, true)))
      .limit(1);

    if (!company.length) {
      throw new NotFoundException('Company not found');
    }

    return company[0];
  }

  async updateCompany(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      const updateData: any = {};
      
      if (updateCompanyDto.name !== undefined) updateData.name = updateCompanyDto.name;
      if (updateCompanyDto.description !== undefined) updateData.description = updateCompanyDto.description;
      if (updateCompanyDto.website !== undefined) updateData.website = updateCompanyDto.website;
      if (updateCompanyDto.email !== undefined) updateData.email = updateCompanyDto.email;
      if (updateCompanyDto.phone !== undefined) updateData.phone = updateCompanyDto.phone;
      if (updateCompanyDto.address !== undefined) updateData.address = updateCompanyDto.address;
      if (updateCompanyDto.logoUrl !== undefined) updateData.logoUrl = updateCompanyDto.logoUrl;
      if (updateCompanyDto.primaryColor !== undefined) updateData.primaryColor = updateCompanyDto.primaryColor;
      if (updateCompanyDto.secondaryColor !== undefined) updateData.secondaryColor = updateCompanyDto.secondaryColor;
      if (updateCompanyDto.accentColor !== undefined) updateData.accentColor = updateCompanyDto.accentColor;
      if (updateCompanyDto.gstNumber !== undefined) updateData.gstNumber = updateCompanyDto.gstNumber;
      if (updateCompanyDto.fssaiLicense !== undefined) updateData.fssaiLicense = updateCompanyDto.fssaiLicense;
      if (updateCompanyDto.panNumber !== undefined) updateData.panNumber = updateCompanyDto.panNumber;
      if (updateCompanyDto.cinNumber !== undefined) updateData.cinNumber = updateCompanyDto.cinNumber;
      if (updateCompanyDto.msmeRegistration !== undefined) updateData.msmeRegistration = updateCompanyDto.msmeRegistration;
      if (updateCompanyDto.tradeLicense !== undefined) updateData.tradeLicense = updateCompanyDto.tradeLicense;
      if (updateCompanyDto.establishmentYear !== undefined) updateData.establishmentYear = updateCompanyDto.establishmentYear;
      if (updateCompanyDto.businessCategory !== undefined) updateData.businessCategory = updateCompanyDto.businessCategory;
      if (updateCompanyDto.isActive !== undefined) updateData.isActive = updateCompanyDto.isActive;
      
      updateData.updatedAt = new Date();

      const [updatedCompany] = await db
        .update(companies)
        .set(updateData)
        .where(eq(companies.id, id))
        .returning();

      if (!updatedCompany) {
        throw new NotFoundException('Company not found');
      }

      return updatedCompany;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update company');
    }
  }

  async deleteCompany(id: string) {
    try {
      const [deletedCompany] = await db
        .update(companies)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(companies.id, id))
        .returning();

      if (!deletedCompany) {
        throw new NotFoundException('Company not found');
      }

      return { message: 'Company deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete company');
    }
  }

  // Branch Operations
  async createBranch(createBranchDto: CreateBranchDto) {
    try {
      // Verify company exists
      await this.getCompanyById(createBranchDto.companyId);

      const [branch] = await db
        .insert(enhancedBranches)
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
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create branch');
    }
  }

  async getAllBranches() {
    return await db.select().from(enhancedBranches).where(eq(enhancedBranches.isActive, true));
  }

  async getBranchesByCompany(companyId: string) {
    return await db
      .select()
      .from(enhancedBranches)
      .where(and(eq(enhancedBranches.companyId, companyId), eq(enhancedBranches.isActive, true)));
  }

  async getBranchById(id: string) {
    const branch = await db
      .select()
      .from(enhancedBranches)
      .where(and(eq(enhancedBranches.id, id), eq(enhancedBranches.isActive, true)))
      .limit(1);

    if (!branch.length) {
      throw new NotFoundException('Branch not found');
    }

    return branch[0];
  }

  async updateBranch(id: string, updateBranchDto: UpdateBranchDto) {
    try {
      const updateData: any = {};
      
      if (updateBranchDto.name !== undefined) updateData.name = updateBranchDto.name;
      if (updateBranchDto.address !== undefined) updateData.address = updateBranchDto.address;
      if (updateBranchDto.latitude !== undefined) updateData.latitude = updateBranchDto.latitude?.toString();
      if (updateBranchDto.longitude !== undefined) updateData.longitude = updateBranchDto.longitude?.toString();
      if (updateBranchDto.language !== undefined) updateData.language = updateBranchDto.language;
      if (updateBranchDto.phone !== undefined) updateData.phone = updateBranchDto.phone;
      if (updateBranchDto.whatsappNumber !== undefined) updateData.whatsappNumber = updateBranchDto.whatsappNumber;
      if (updateBranchDto.email !== undefined) updateData.email = updateBranchDto.email;
      if (updateBranchDto.managerName !== undefined) updateData.managerName = updateBranchDto.managerName;
      if (updateBranchDto.operatingHours !== undefined) updateData.operatingHours = updateBranchDto.operatingHours;
      if (updateBranchDto.isActive !== undefined) updateData.isActive = updateBranchDto.isActive;
      
      updateData.updatedAt = new Date();

      const [updatedBranch] = await db
        .update(enhancedBranches)
        .set(updateData)
        .where(eq(enhancedBranches.id, id))
        .returning();

      if (!updatedBranch) {
        throw new NotFoundException('Branch not found');
      }

      return updatedBranch;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update branch');
    }
  }

  async deleteBranch(id: string) {
    try {
      const [deletedBranch] = await db
        .update(enhancedBranches)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(enhancedBranches.id, id))
        .returning();

      if (!deletedBranch) {
        throw new NotFoundException('Branch not found');
      }

      return { message: 'Branch deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete branch');
    }
  }

  // Company Hierarchy
  async getCompanyHierarchy(companyId: string) {
    const company = await this.getCompanyById(companyId);
    const branches = await this.getBranchesByCompany(companyId);

    return {
      company,
      branches,
      totalBranches: branches.length,
    };
  }
}