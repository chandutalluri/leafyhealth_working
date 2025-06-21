import { Injectable } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { db } from '../database';
import { customerAddresses, type CustomerAddress, type InsertCustomerAddress } from '../database';

@Injectable()
export class CustomerAddressService {
  async createAddress(addressData: InsertCustomerAddress): Promise<CustomerAddress> {
    const [address] = await db
      .insert(customerAddresses)
      .values({
        ...addressData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return address;
  }

  async findAddressesByCustomerId(customerId: number): Promise<CustomerAddress[]> {
    return await db
      .select()
      .from(customerAddresses)
      .where(eq(customerAddresses.userId, customerId))
      .orderBy(desc(customerAddresses.createdAt));
  }

  async findAddressById(id: number): Promise<CustomerAddress | null> {
    const [address] = await db
      .select()
      .from(customerAddresses)
      .where(eq(customerAddresses.id, id));
    
    return address || null;
  }

  async updateAddress(id: number, updateData: Partial<InsertCustomerAddress>): Promise<CustomerAddress | null> {
    const [address] = await db
      .update(customerAddresses)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(customerAddresses.id, id))
      .returning();
    
    return address || null;
  }

  async deleteAddress(id: number): Promise<boolean> {
    const result = await db
      .delete(customerAddresses)
      .where(eq(customerAddresses.id, id));
    
    return result.rowCount > 0;
  }

  async setDefaultAddress(customerId: number, addressId: number): Promise<void> {
    // First, remove default from all addresses for this customer
    await db
      .update(customerAddresses)
      .set({ isDefault: false })
      .where(eq(customerAddresses.userId, customerId));

    // Set the specified address as default
    await db
      .update(customerAddresses)
      .set({ isDefault: true })
      .where(eq(customerAddresses.id, addressId));
  }
}