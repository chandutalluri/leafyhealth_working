import { type CustomerAddress, type InsertCustomerAddress } from '../database';
export declare class CustomerAddressService {
    createAddress(addressData: InsertCustomerAddress): Promise<CustomerAddress>;
    findAddressesByCustomerId(customerId: number): Promise<CustomerAddress[]>;
    findAddressById(id: number): Promise<CustomerAddress | null>;
    updateAddress(id: number, updateData: Partial<InsertCustomerAddress>): Promise<CustomerAddress | null>;
    deleteAddress(id: number): Promise<boolean>;
    setDefaultAddress(customerId: number, addressId: number): Promise<void>;
}
