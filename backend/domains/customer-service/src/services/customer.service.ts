import { Injectable } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { db } from '../database';
import { customers, type Customer, type InsertCustomer } from '../database';

@Injectable()
export class CustomerService {
  async createCustomer(customerData: InsertCustomer): Promise<Customer> {
    const [customer] = await db
      .insert(customers)
      .values({
        ...customerData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return customer;
  }

  async findAllCustomers(): Promise<Customer[]> {
    return await db
      .select()
      .from(customers)
      .orderBy(desc(customers.createdAt));
  }

  async findCustomerById(id: number): Promise<Customer | null> {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id));
    
    return customer || null;
  }

  async findCustomerByEmail(email: string): Promise<Customer | null> {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email));
    
    return customer || null;
  }

  async updateCustomer(id: number, updateData: Partial<InsertCustomer>): Promise<Customer | null> {
    const [customer] = await db
      .update(customers)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(customers.id, id))
      .returning();
    
    return customer || null;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    const result = await db
      .delete(customers)
      .where(eq(customers.id, id));
    
    return result.rowCount > 0;
  }

  async getCustomerStats() {
    const totalCustomers = await db
      .select({ count: 'count(*)' })
      .from(customers);

    return {
      totalCustomers: totalCustomers[0]?.count || 0,
      timestamp: new Date().toISOString()
    };
  }
}