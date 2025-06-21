import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    createCustomer(createCustomerDto: CreateCustomerDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            email: string;
            phone: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            firstName: string;
            lastName: string;
            dateOfBirth: Date;
            gender: string;
            profilePicture: string;
            preferredLanguage: string;
            timezone: string;
        };
    }>;
    getAllCustomers(): Promise<{
        success: boolean;
        data: {
            id: number;
            email: string;
            phone: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            firstName: string;
            lastName: string;
            dateOfBirth: Date;
            gender: string;
            profilePicture: string;
            preferredLanguage: string;
            timezone: string;
        }[];
        count: number;
    }>;
    getCustomerStats(): Promise<{
        success: boolean;
        data: {
            totalCustomers: any;
            timestamp: string;
        };
    }>;
    getCustomerById(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            email: string;
            phone: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            firstName: string;
            lastName: string;
            dateOfBirth: Date;
            gender: string;
            profilePicture: string;
            preferredLanguage: string;
            timezone: string;
        };
    }>;
    updateCustomer(id: number, updateCustomerDto: UpdateCustomerDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            email: string;
            phone: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            firstName: string;
            lastName: string;
            dateOfBirth: Date;
            gender: string;
            profilePicture: string;
            preferredLanguage: string;
            timezone: string;
        };
    }>;
    deleteCustomer(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
