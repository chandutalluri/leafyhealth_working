import { CustomerAddressService } from '../services/customer-address.service';
import { CreateCustomerAddressDto } from '../dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from '../dto/update-customer-address.dto';
export declare class CustomerAddressController {
    private readonly customerAddressService;
    constructor(customerAddressService: CustomerAddressService);
    createAddress(customerId: number, createAddressDto: CreateCustomerAddressDto): Promise<{
        success: boolean;
        message: string;
        data: {
            type: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            latitude: string;
            longitude: string;
            isDefault: boolean;
            addressLine1: string;
            addressLine2: string;
            city: string;
            state: string;
            pincode: string;
            landmark: string;
        };
    }>;
    getCustomerAddresses(customerId: number): Promise<{
        success: boolean;
        data: {
            type: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            latitude: string;
            longitude: string;
            isDefault: boolean;
            addressLine1: string;
            addressLine2: string;
            city: string;
            state: string;
            pincode: string;
            landmark: string;
        }[];
        count: number;
    }>;
    getAddressById(addressId: number): Promise<{
        success: boolean;
        data: {
            type: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            latitude: string;
            longitude: string;
            isDefault: boolean;
            addressLine1: string;
            addressLine2: string;
            city: string;
            state: string;
            pincode: string;
            landmark: string;
        };
    }>;
    updateAddress(addressId: number, updateAddressDto: UpdateCustomerAddressDto): Promise<{
        success: boolean;
        message: string;
        data: {
            type: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            latitude: string;
            longitude: string;
            isDefault: boolean;
            addressLine1: string;
            addressLine2: string;
            city: string;
            state: string;
            pincode: string;
            landmark: string;
        };
    }>;
    setDefaultAddress(customerId: number, addressId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteAddress(addressId: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
