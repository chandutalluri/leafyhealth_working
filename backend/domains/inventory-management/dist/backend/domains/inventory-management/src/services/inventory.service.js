"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../database");
const drizzle_orm_1 = require("drizzle-orm");
let InventoryService = class InventoryService {
    async getProductStock(productId) {
        const [stockData] = await database_1.db
            .select({
            productId: database_1.inventory.productId,
            quantity: database_1.inventory.quantity,
            reservedQuantity: database_1.inventory.reservedQuantity,
            location: database_1.inventory.location,
            batchNumber: database_1.inventory.batchNumber,
            expiryDate: database_1.inventory.expiryDate,
            product: {
                id: database_1.products.id,
                name: database_1.products.name,
                sku: database_1.products.sku
            }
        })
            .from(database_1.inventory)
            .innerJoin(database_1.products, (0, drizzle_orm_1.eq)(database_1.inventory.productId, database_1.products.id))
            .where((0, drizzle_orm_1.eq)(database_1.inventory.productId, productId));
        if (!stockData) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found in inventory`);
        }
        return {
            success: true,
            message: 'Product stock retrieved successfully',
            data: stockData
        };
    }
    async getAllStock() {
        const stockData = await database_1.db
            .select({
            productId: database_1.inventory.productId,
            quantity: database_1.inventory.quantity,
            reservedQuantity: database_1.inventory.reservedQuantity,
            location: database_1.inventory.location,
            batchNumber: database_1.inventory.batchNumber,
            expiryDate: database_1.inventory.expiryDate,
            product: {
                id: database_1.products.id,
                name: database_1.products.name,
                sku: database_1.products.sku,
                price: database_1.products.price
            }
        })
            .from(database_1.inventory)
            .innerJoin(database_1.products, (0, drizzle_orm_1.eq)(database_1.inventory.productId, database_1.products.id))
            .orderBy(database_1.products.name);
        return {
            success: true,
            message: 'All stock levels retrieved successfully',
            data: stockData
        };
    }
    async getLowStockItems() {
        const lowStockItems = await database_1.db
            .select({
            productId: database_1.inventory.productId,
            quantity: database_1.inventory.quantity,
            reservedQuantity: database_1.inventory.reservedQuantity,
            product: {
                id: database_1.products.id,
                name: database_1.products.name,
                sku: database_1.products.sku
            }
        })
            .from(database_1.inventory)
            .innerJoin(database_1.products, (0, drizzle_orm_1.eq)(database_1.inventory.productId, database_1.products.id))
            .where((0, drizzle_orm_1.sql) `${database_1.inventory.quantity} <= 10`)
            .orderBy(database_1.inventory.quantity);
        return {
            success: true,
            message: 'Low stock items retrieved successfully',
            data: lowStockItems
        };
    }
    async recordTransaction(transactionDto, performedBy) {
        const { productId, transactionType, quantity, unitCost, reference, notes } = transactionDto;
        const [product] = await database_1.db.select().from(database_1.products).where((0, drizzle_orm_1.eq)(database_1.products.id, productId));
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found`);
        }
        let [currentInventory] = await database_1.db.select().from(database_1.inventory).where((0, drizzle_orm_1.eq)(database_1.inventory.productId, productId));
        if (!currentInventory) {
            [currentInventory] = await database_1.db.insert(database_1.inventory).values({
                productId: productId,
                quantity: 0,
                reservedQuantity: 0,
                location: 'Main Warehouse'
            }).returning();
        }
        let newQuantity = currentInventory.quantity;
        if (transactionType === 'IN') {
            newQuantity += quantity;
        }
        else if (transactionType === 'OUT') {
            newQuantity -= quantity;
            if (newQuantity < 0) {
                throw new common_1.BadRequestException('Insufficient stock for this transaction');
            }
        }
        else if (transactionType === 'ADJUSTMENT') {
            newQuantity = quantity;
        }
        const [transaction] = await database_1.db.insert(database_1.inventoryTransactions).values({
            productId,
            transactionType,
            quantity: transactionType === 'ADJUSTMENT' ? (quantity - currentInventory.stockQuantity) : quantity,
            unitCost,
            reference,
            notes,
            performedBy
        }).returning();
        await database_1.db.update(database_1.inventory)
            .set({
            quantity: newQuantity,
            lastUpdated: new Date(),
            updatedBy: performedBy
        })
            .where((0, drizzle_orm_1.eq)(database_1.inventory.productId, productId));
        await this.checkStockAlerts(productId, newQuantity, 10);
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
    async adjustInventory(adjustmentDto, performedBy, approvedBy) {
        const { productId, newQuantity, adjustmentReason, notes } = adjustmentDto;
        const [currentInventory] = await database_1.db.select().from(database_1.inventory).where((0, drizzle_orm_1.eq)(database_1.inventory.productId, productId));
        if (!currentInventory) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found in inventory`);
        }
        const [adjustment] = await database_1.db.insert(database_1.inventoryAdjustments).values({
            productId,
            oldQuantity: currentInventory.quantity,
            newQuantity,
            adjustmentReason,
            notes,
            approvedBy,
            performedBy
        }).returning();
        await database_1.db.update(database_1.inventory)
            .set({
            quantity: newQuantity,
            lastUpdated: new Date(),
            updatedBy: performedBy
        })
            .where((0, drizzle_orm_1.eq)(database_1.inventory.productId, productId));
        await database_1.db.insert(database_1.inventoryTransactions).values({
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
    async getTransactionHistory(productId) {
        let query = database_1.db
            .select({
            id: database_1.inventoryTransactions.id,
            transactionType: database_1.inventoryTransactions.transactionType,
            quantity: database_1.inventoryTransactions.quantity,
            unitCost: database_1.inventoryTransactions.unitCost,
            reference: database_1.inventoryTransactions.reference,
            notes: database_1.inventoryTransactions.notes,
            createdAt: database_1.inventoryTransactions.createdAt,
            product: {
                id: database_1.products.id,
                name: database_1.products.name,
                sku: database_1.products.sku
            }
        })
            .from(database_1.inventoryTransactions)
            .innerJoin(database_1.products, (0, drizzle_orm_1.eq)(database_1.inventoryTransactions.productId, database_1.products.id));
        if (productId) {
            query = query.where((0, drizzle_orm_1.eq)(database_1.inventoryTransactions.productId, productId));
        }
        const transactions = await query.orderBy((0, drizzle_orm_1.desc)(database_1.inventoryTransactions.createdAt));
        return {
            success: true,
            message: 'Transaction history retrieved successfully',
            data: transactions
        };
    }
    async getActiveStockAlerts() {
        const alerts = await database_1.db
            .select({
            id: database_1.stockAlerts.id,
            alertType: database_1.stockAlerts.alertType,
            threshold: database_1.stockAlerts.threshold,
            currentStock: database_1.stockAlerts.currentStock,
            createdAt: database_1.stockAlerts.createdAt,
            product: {
                id: database_1.products.id,
                name: database_1.products.name,
                sku: database_1.products.sku
            }
        })
            .from(database_1.stockAlerts)
            .innerJoin(database_1.products, (0, drizzle_orm_1.eq)(database_1.stockAlerts.productId, database_1.products.id))
            .where((0, drizzle_orm_1.eq)(database_1.stockAlerts.isActive, true))
            .orderBy((0, drizzle_orm_1.desc)(database_1.stockAlerts.createdAt));
        return {
            success: true,
            message: 'Active stock alerts retrieved successfully',
            data: alerts
        };
    }
    async checkStockAlerts(productId, currentStock, threshold) {
        if (currentStock <= threshold) {
            const [existingAlert] = await database_1.db
                .select()
                .from(database_1.stockAlerts)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(database_1.stockAlerts.productId, productId), (0, drizzle_orm_1.eq)(database_1.stockAlerts.alertType, currentStock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK'), (0, drizzle_orm_1.eq)(database_1.stockAlerts.isActive, true)));
            if (!existingAlert) {
                await database_1.db.insert(database_1.stockAlerts).values({
                    productId,
                    alertType: currentStock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
                    threshold: threshold,
                    currentStock,
                    isActive: true
                });
            }
        }
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)()
], InventoryService);
//# sourceMappingURL=inventory.service.js.map