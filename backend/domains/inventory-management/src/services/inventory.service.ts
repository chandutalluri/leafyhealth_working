import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { db, products, inventory, inventoryTransactions, stockAlerts, inventoryAdjustments } from '../database';
import { eq, and, desc, sql } from 'drizzle-orm';
import { CreateInventoryTransactionDto } from '../dto/create-inventory-transaction.dto';
import { CreateAdjustmentDto } from '../dto/create-adjustment.dto';

@Injectable()
export class InventoryService {
  
  async getProductStock(productId: number) {
    const [stockData] = await db
      .select({
        productId: inventory.productId,
        quantity: inventory.quantity,
        reservedQuantity: inventory.reservedQuantity,
        location: inventory.location,
        batchNumber: inventory.batchNumber,
        expiryDate: inventory.expiryDate,
        product: {
          id: products.id,
          name: products.name,
          sku: products.sku
        }
      })
      .from(inventory)
      .innerJoin(products, eq(inventory.productId, products.id))
      .where(eq(inventory.productId, productId));

    if (!stockData) {
      throw new NotFoundException(`Product with ID ${productId} not found in inventory`);
    }

    return {
      success: true,
      message: 'Product stock retrieved successfully',
      data: stockData
    };
  }

  async getAllStock() {
    const stockData = await db
      .select({
        productId: inventory.productId,
        quantity: inventory.quantity,
        reservedQuantity: inventory.reservedQuantity,
        location: inventory.location,
        batchNumber: inventory.batchNumber,
        expiryDate: inventory.expiryDate,
        product: {
          id: products.id,
          name: products.name,
          sku: products.sku,
          price: products.price
        }
      })
      .from(inventory)
      .innerJoin(products, eq(inventory.productId, products.id))
      .orderBy(products.name);

    return {
      success: true,
      message: 'All stock levels retrieved successfully',
      data: stockData
    };
  }

  async getLowStockItems() {
    // For now, let's consider items with quantity <= 10 as low stock
    const lowStockItems = await db
      .select({
        productId: inventory.productId,
        quantity: inventory.quantity,
        reservedQuantity: inventory.reservedQuantity,
        product: {
          id: products.id,
          name: products.name,
          sku: products.sku
        }
      })
      .from(inventory)
      .innerJoin(products, eq(inventory.productId, products.id))
      .where(sql`${inventory.quantity} <= 10`)
      .orderBy(inventory.quantity);

    return {
      success: true,
      message: 'Low stock items retrieved successfully',
      data: lowStockItems
    };
  }

  async recordTransaction(transactionDto: CreateInventoryTransactionDto, performedBy: number) {
    const { productId, transactionType, quantity, unitCost, reference, notes } = transactionDto;

    // Check if product exists
    const [product] = await db.select().from(products).where(eq(products.id, productId));
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Get current inventory
    let [currentInventory] = await db.select().from(inventory).where(eq(inventory.productId, productId));
    
    // If no inventory record exists, create one
    if (!currentInventory) {
      [currentInventory] = await db.insert(inventory).values({
        productId: productId,
        quantity: 0,
        reservedQuantity: 0,
        location: 'Main Warehouse'
      }).returning();
    }

    let newQuantity = currentInventory.quantity;

    // Calculate new quantity based on transaction type
    if (transactionType === 'IN') {
      newQuantity += quantity;
    } else if (transactionType === 'OUT') {
      newQuantity -= quantity;
      if (newQuantity < 0) {
        throw new BadRequestException('Insufficient stock for this transaction');
      }
    } else if (transactionType === 'ADJUSTMENT') {
      newQuantity = quantity; // For adjustments, quantity is the new absolute value
    }

    // Record the transaction
    const [transaction] = await db.insert(inventoryTransactions).values({
      productId,
      transactionType,
      quantity: transactionType === 'ADJUSTMENT' ? (quantity - currentInventory.stockQuantity) : quantity,
      unitCost,
      reference,
      notes,
      performedBy
    }).returning();

    // Update inventory
    await db.update(inventory)
      .set({ 
        quantity: newQuantity,
        lastUpdated: new Date(),
        updatedBy: performedBy
      })
      .where(eq(inventory.productId, productId));

    // Check for stock alerts (simplified for now)
    await this.checkStockAlerts(productId, newQuantity, 10); // Default threshold of 10

    return {
      success: true,
      message: 'Inventory transaction recorded successfully',
      data: {
        transaction,
        newStockLevel: newQuantity,
        previousStockLevel: currentInventory.quantity
      }
    };
  }

  async adjustInventory(adjustmentDto: CreateAdjustmentDto, performedBy: number, approvedBy?: number) {
    const { productId, newQuantity, adjustmentReason, notes } = adjustmentDto;

    // Get current stock
    const [currentInventory] = await db.select().from(inventory).where(eq(inventory.productId, productId));
    if (!currentInventory) {
      throw new NotFoundException(`Product with ID ${productId} not found in inventory`);
    }

    // Record the adjustment
    const [adjustment] = await db.insert(inventoryAdjustments).values({
      productId,
      oldQuantity: currentInventory.quantity,
      newQuantity,
      adjustmentReason,
      notes,
      approvedBy,
      performedBy
    }).returning();

    // Update inventory
    await db.update(inventory)
      .set({ 
        quantity: newQuantity,
        lastUpdated: new Date(),
        updatedBy: performedBy
      })
      .where(eq(inventory.productId, productId));

    // Record as adjustment transaction
    await db.insert(inventoryTransactions).values({
      productId,
      transactionType: 'ADJUSTMENT',
      quantity: newQuantity - currentInventory.quantity,
      reference: `ADJ-${adjustment.id}`,
      notes: `Adjustment: ${adjustmentReason}`,
      performedBy
    });

    return {
      success: true,
      message: 'Inventory adjustment completed successfully',
      data: {
        adjustment,
        oldQuantity: currentInventory.quantity,
        newQuantity
      }
    };
  }

  async getTransactionHistory(productId?: number) {
    let query = db
      .select({
        id: inventoryTransactions.id,
        transactionType: inventoryTransactions.transactionType,
        quantity: inventoryTransactions.quantity,
        unitCost: inventoryTransactions.unitCost,
        reference: inventoryTransactions.reference,
        notes: inventoryTransactions.notes,
        createdAt: inventoryTransactions.createdAt,
        product: {
          id: products.id,
          name: products.name,
          sku: products.sku
        }
      })
      .from(inventoryTransactions)
      .innerJoin(products, eq(inventoryTransactions.productId, products.id));

    if (productId) {
      query = query.where(eq(inventoryTransactions.productId, productId));
    }

    const transactions = await query.orderBy(desc(inventoryTransactions.createdAt));

    return {
      success: true,
      message: 'Transaction history retrieved successfully',
      data: transactions
    };
  }

  async getActiveStockAlerts() {
    const alerts = await db
      .select({
        id: stockAlerts.id,
        alertType: stockAlerts.alertType,
        threshold: stockAlerts.threshold,
        currentStock: stockAlerts.currentStock,
        createdAt: stockAlerts.createdAt,
        product: {
          id: products.id,
          name: products.name,
          sku: products.sku
        }
      })
      .from(stockAlerts)
      .innerJoin(products, eq(stockAlerts.productId, products.id))
      .where(eq(stockAlerts.isActive, true))
      .orderBy(desc(stockAlerts.createdAt));

    return {
      success: true,
      message: 'Active stock alerts retrieved successfully',
      data: alerts
    };
  }

  private async checkStockAlerts(productId: number, currentStock: number, threshold: number) {
    if (currentStock <= threshold) {
      // Check if alert already exists and is active
      const [existingAlert] = await db
        .select()
        .from(stockAlerts)
        .where(and(
          eq(stockAlerts.productId, productId),
          eq(stockAlerts.alertType, currentStock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK'),
          eq(stockAlerts.isActive, true)
        ));

      if (!existingAlert) {
        await db.insert(stockAlerts).values({
          productId,
          alertType: currentStock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
          threshold: threshold,
          currentStock,
          isActive: true
        });
      }
    }
  }
}