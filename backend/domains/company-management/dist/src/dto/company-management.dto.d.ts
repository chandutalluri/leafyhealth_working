export declare class CreateCompanyDto {
    name: string;
    description?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    isActive?: boolean;
}
export declare class UpdateCompanyDto {
    name?: string;
    description?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    gstNumber?: string;
    fssaiLicense?: string;
    panNumber?: string;
    cinNumber?: string;
    msmeRegistration?: string;
    tradeLicense?: string;
    establishmentYear?: number;
    businessCategory?: string;
    isActive?: boolean;
}
export declare class CreateBranchDto {
    name: string;
    companyId: string;
    address: string;
    latitude?: number;
    longitude?: number;
    language?: string;
    phone?: string;
    whatsappNumber?: string;
    email?: string;
    managerName?: string;
    operatingHours?: Record<string, any>;
    isActive?: boolean;
}
export declare class UpdateBranchDto {
    name?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    language?: string;
    phone?: string;
    whatsappNumber?: string;
    email?: string;
    managerName?: string;
    operatingHours?: Record<string, any>;
    isActive?: boolean;
}
