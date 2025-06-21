import { type Customer, type InsertCustomer } from '../database';
export declare class CustomerService {
    createCustomer(customerData: InsertCustomer): Promise<Customer>;
    findAllCustomers(): Promise<Customer[]>;
    findCustomerById(id: number): Promise<Customer | null>;
    findCustomerByEmail(email: string): Promise<Customer | null>;
    updateCustomer(id: number, updateData: Partial<InsertCustomer>): Promise<Customer | null>;
    deleteCustomer(id: number): Promise<boolean>;
    getCustomerStats(): Promise<{
        totalCustomers: any;
        timestamp: string;
    }>;
}
